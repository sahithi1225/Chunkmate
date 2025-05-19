const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('../db');

const router = express.Router();


const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) === '.md') {
      cb(null, true);
    } else {
      cb(new Error('Only .md files are allowed'));
    }
  },
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const content = fs.readFileSync(file.path, 'utf-8');
    const lines = content.split('\n');

    const headings = [];
    const chunks = [];

    for (let line of lines) {
      if (line.startsWith('#')) {
        headings.push(line);
      } else if (line.trim().startsWith('|')) {
        
        continue;
      } else if (line.trim()) {
        const context = headings.join('\n');
        chunks.push(`${context}\n${line}`);
      }
    }

    // Handle table parsing
    const tableChunks = [];
    const tableLines = lines.filter(line => line.trim().startsWith('|'));
    if (tableLines.length >= 2) {
      const headers = tableLines[0].split('|').map(h => h.trim()).filter(Boolean);
      for (let i = 2; i < tableLines.length; i++) {
        const cells = tableLines[i].split('|').map(c => c.trim()).filter(Boolean);
        let chunk = '';
        for (let j = 0; j < headers.length; j++) {
          chunk += `${headers[j]}: ${cells[j]}\n`;
        }
        tableChunks.push(chunk.trim());
      }
    }

    // Insert into database
    const docResult = await db.query(
      'INSERT INTO documents(name) VALUES($1) RETURNING id',
      [file.originalname]
    );
    const docId = docResult.rows[0].id;

    for (let c of [...chunks, ...tableChunks]) {
      await db.query(
        'INSERT INTO chunks(document_id, content) VALUES($1, $2)',
        [docId, c]
      );
    }

    res.status(200).json({ message: 'File processed and chunks stored successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
