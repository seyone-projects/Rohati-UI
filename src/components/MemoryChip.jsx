import React from 'react';

export default function MemoryChip({ memory, onDelete }) {
  const memoryId = memory._id || memory.id;
  const kindColor = memory.kind || 'context';

  return (
    <div className="memory-chip">
      <span className={`memory-chip-tag ${kindColor}`}>{memory.kind}</span>
      <span className="memory-chip-text">{memory.text}</span>
      {onDelete && (
        <button
          className="memory-chip-delete"
          onClick={() => onDelete(memoryId)}
          title="Delete memory"
        >
          ✕
        </button>
      )}
    </div>
  );
}
