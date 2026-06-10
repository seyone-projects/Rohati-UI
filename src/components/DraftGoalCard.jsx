import React, { useState } from 'react';
import { useGoals } from '../hooks/useGoals';
import { useSocket } from '../context/SocketContext';

export default function DraftGoalCard({ draft, onPlant, onDismiss }) {
  const [planting, setPlanting] = useState(false);
  const { createGoal } = useGoals();
  const { dismissDraft } = useSocket();

  const handlePlant = async () => {
    if (!draft || !draft.title) return;
    setPlanting(true);
    try {
      await createGoal(draft.title, draft.why || '', draft.milestones || []);
      if (onPlant) onPlant();
      dismissDraft();
    } catch (err) {
      console.error('Failed to plant goal:', err);
    } finally {
      setPlanting(false);
    }
  };

  const handleDismiss = () => {
    if (onDismiss) onDismiss();
    dismissDraft();
  };

  if (!draft || !draft.title) return null;

  return (
    <div className="draft-card">
      <div className="draft-card-title">{draft.title}</div>
      {draft.why && <div className="draft-card-why">{draft.why}</div>}
      {draft.milestones && draft.milestones.length > 0 && (
        <ul className="draft-card-milestones">
          {draft.milestones.map((ms, i) => (
            <li key={i}>{ms}</li>
          ))}
        </ul>
      )}
      <div className="draft-card-actions">
        <button className="btn btn-primary btn-sm" onClick={handlePlant} disabled={planting}>
          {planting ? 'Planting...' : 'Plant this goal'}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={handleDismiss}>
          Dismiss
        </button>
      </div>
    </div>
  );
}
