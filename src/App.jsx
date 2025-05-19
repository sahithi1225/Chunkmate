import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DocumentPanel from './components/DocumentPanel';
import './App.css';

const App = () => {
  const [documents, setDocuments] = useState([
    {
      title: 'Document 1',
      chunks: [
        {
          id: 1,
          content:
            "Welcome to Placeholderland, where the buttons are fake and the scrollbars don’t work. This is dummy text pretending to be useful. Swipe left, swipe right, or just stare blankly – we won’t judge.",
        },
        {
          id: 2,
          content:
            "This is the part where we say something profound and life-changing. But instead, here’s some premium-grade nonsense just vibing in your design. Please pretend this text is meaningful while we get our act together.",
        },
      ],
    },
  ]);

  const [activeDocumentIndex, setActiveDocumentIndex] = useState(0);

  // Handler for file upload
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;

      // Split content by blank lines (paragraphs)
      const splitChunks = text
        .split(/\n\s*\n/g) // split by one or more blank lines
        .map((chunk, index) => ({
          id: index + 1,
          content: chunk.trim(),
        }));

      const newDocument = {
        title: file.name,
        chunks: splitChunks.length > 0 ? splitChunks : [{ id: 1, content: text }],
      };

      setDocuments((prevDocs) => {
        const updatedDocs = [...prevDocs, newDocument];
        setActiveDocumentIndex(updatedDocs.length - 1); // Set newly added document active
        return updatedDocs;
      });
    };

    reader.readAsText(file);
  };

  return (
    <div className="app">
      <Sidebar
        documents={documents}
        onSelect={setActiveDocumentIndex}
        selected={activeDocumentIndex}
        onUpload={handleFileUpload}
      />
      <div className="main-panel">
        <DocumentPanel
          title={documents[activeDocumentIndex].title}
          chunks={documents[activeDocumentIndex].chunks}
        />
      </div>
    </div>
  );
};

export default App;
