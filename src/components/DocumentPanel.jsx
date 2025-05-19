import React from 'react';
import styled, { css } from 'styled-components';

const PanelWrapper = styled.div`
  flex: 1;
  background-color: #f9f9f9;
  padding: 1.5rem;
  overflow-y: auto;
`;

const Title = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const ChunkContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  cursor: pointer;
  border-radius: 6px;
  padding: 0.5rem;

  ${(props) =>
    props.selected &&
    css`
      background-color: #d9eafc;
      border-left: 4px solid #007bff;
      font-weight: bold;
    `}

  &:hover {
    background-color: #e3f0ff;
  }
`;

const ChunkNumber = styled.div`
  min-width: 32px;
  height: 32px;
  background-color: #f6e9d8;
  color: #555;
  font-weight: bold;
  text-align: center;
  line-height: 32px;
  margin-right: 1rem;
  border-radius: 4px;
`;

const ChunkText = styled.div`
  flex: 1;
  white-space: pre-wrap;
`;

const DocumentPanel = ({ title, chunks, selectedChunkId, onSelectChunk }) => {
  return (
    <PanelWrapper>
      <Title>{title}</Title>
      {chunks.length === 0 ? (
        <p>No chunks available. Please upload a markdown file.</p>
      ) : (
        chunks.map((chunk, index) => (
          <ChunkContainer
            key={chunk.id}
            selected={chunk.id === selectedChunkId}
            onClick={() => onSelectChunk(chunk.id)}
          >
            <ChunkNumber>{index + 1}</ChunkNumber>
            <ChunkText dangerouslySetInnerHTML={{ __html: formatChunk(chunk.content) }} />
          </ChunkContainer>
        ))
      )}
    </PanelWrapper>
  );
};


const formatChunk = (text) => {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

export default DocumentPanel;
