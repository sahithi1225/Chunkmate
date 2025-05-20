// server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');

const app = express();
const PORT = 5000;

// PostgreSQL connection setup
const pool = new Pool({
  user: 'postgres',          
  host: 'localhost',
  database: 'chunkmate',    
  password: 'Priya@123',     
  port: 5432,
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

//  Test route to confirm backend is running
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
      'INSERT INTO documents (title) VALUES ($1) RETURNING id',
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
  try {
    const { rows } = await pool.query('SELECT * FROM documents ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get chunks for a document - validate id as integer
app.get('/documents/:id/chunks', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid document id' });
  }

  try {
    const { rows } = await pool.query('SELECT * FROM chunks WHERE document_id = $1', [id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload a document (POST)
app.post('/documents', async (req, res) => {
  const { title } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO documents (title) VALUES ($1) RETURNING *',
      [title]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload a chunk (POST) - validate document_id as integer
app.post('/chunks', async (req, res) => {
  const document_id = parseInt(req.body.document_id, 10);
  const { content } = req.body;

  if (isNaN(document_id)) {
    return res.status(400).json({ error: 'Invalid document_id' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO chunks (document_id, content) VALUES ($1, $2) RETURNING *',
      [document_id, content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add hyperlink to chunk (POST) - validate chunk_id as integer
app.post('/hyperlinks', async (req, res) => {
  const chunk_id = parseInt(req.body.chunk_id, 10);
  const { url, display_text } = req.body;

  if (isNaN(chunk_id)) {
    return res.status(400).json({ error: 'Invalid chunk_id' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO hyperlinks (chunk_id, url, display_text) VALUES ($1, $2, $3) RETURNING *',
      [chunk_id, url, display_text]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
