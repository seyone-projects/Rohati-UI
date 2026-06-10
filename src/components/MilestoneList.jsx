import React from 'react';

export default function MilestoneList({ milestones, goalId, onToggle }) {
  if (!milestones || milestones.length === 0) {
    return <p className="text-muted" style={{ fontSize: '0.875rem' }}>No milestones yet.</p>;
  }

  return (
    <div>
      {milestones.map((ms) => {
        const msId = ms._id || ms.id;
        return (
          <div key={msId} className="milestone-item">
            <div
              className={`milestone-checkbox ${ms.done ? 'checked' : ''}`}
              onClick={() => onToggle(goalId, msId)}
            />
            <span className={`milestone-text ${ms.done ? 'done' : ''}`}>{ms.title}</span>
            {ms.dueDate && (
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)', flexShrink: 0 }}>
                {new Date(ms.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
