import React from 'react';

const ChunkItem = ({ number, content }) => {
  return (
    <div className="chunk-item">
      <div className="chunk-content">{content}</div>
      <div className="chunk-number">{number}</div>
    </div>
  );
};

export default ChunkItem;
