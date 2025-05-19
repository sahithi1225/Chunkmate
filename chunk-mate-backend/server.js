// server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('./db'); // DB connection
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ✅ Test route to confirm backend is running
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// File Upload Setup
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file || path.extname(file.originalname) !== '.md') {
    return res.status(400).json({ error: 'Only .md files are supported' });
  }

  try {
    const content = fs.readFileSync(file.path, 'utf-8');
    const { rows } = await pool.query(
      'INSERT INTO documents (name) VALUES ($1) RETURNING id',
      [file.originalname]
    );
    const docId = rows[0].id;

    const chunks = splitMarkdownIntoChunks(content);

    for (const chunk of chunks) {
      await pool.query(
        'INSERT INTO chunks (document_id, content) VALUES ($1, $2)',
        [docId, chunk]
      );
    }

    res.json({ message: 'File uploaded and processed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Split markdown into chunks (basic logic)
function splitMarkdownIntoChunks(md) {
  const lines = md.split('\n');
  let currentHeadings = [];
  const chunks = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('#')) {
      currentHeadings = currentHeadings.filter(h => h.startsWith('#'.repeat(line.match(/^#+/)[0].length - 1)));
      currentHeadings.push(line);
    } else if (line.length > 0) {
      chunks.push([...currentHeadings, line].join('\n'));
    }
  }

  return chunks;
}

// Get list of documents
app.get('/documents', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM documents ORDER BY uploaded_at DESC');
  res.json(rows);
});

// Get chunks for a document
app.get('/documents/:id/chunks', async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query('SELECT * FROM chunks WHERE document_id = $1', [id]);
  res.json(rows);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
