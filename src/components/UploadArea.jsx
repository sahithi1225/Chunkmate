import React, { useState } from 'react';

export default function UploadArea() {
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.name.endsWith('.md')) {
      const formData = new FormData();
      formData.append('file', file);

      fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => setMessage(data.message))
        .catch(() => setMessage('Upload failed.'));
    } else {
      setMessage('Only .md files are supported!');
    }
  };

  return (
    <div>
      <input
        type="file"
        id="upload-file"
        className="upload-input"
        accept=".md"
        onChange={handleFileChange}
      />
      <label htmlFor="upload-file" className="upload-label">
        Upload Markdown File
      </label>
      {message && <p className="upload-message">{message}</p>}
    </div>
  );
}
