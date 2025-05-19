import React from 'react';
 

const Sidebar = ({ documents, onSelect, selected, onUpload }) => {
  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    
    if (!file.name.endsWith('.md')) {
      alert('Please upload a Markdown (.md) file.');
      return;
    }

    onUpload(file); 
    event.target.value = ''; 
  };

  return (
    <div className="sidebar">
      <h3>CHUNK MATE</h3>
      <ul>
        {documents.map((doc, index) => (
          <li
            key={index}
            className={selected === index ? 'active' : ''}
            onClick={() => onSelect(index)}
          >
            {doc.title}
          </li>
        ))}
      </ul>

      <input
        type="file"
        accept=".md"
        onChange={handleUpload}
        style={{ display: 'none' }}
        id="upload-input"
      />
      <label htmlFor="upload-input" className="upload-button">
        Upload
      </label>
    </div>
  );
};

export default Sidebar;
