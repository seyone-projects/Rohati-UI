import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function GoalCard({ goal }) {
  const navigate = useNavigate();
  const goalId = goal._id || goal.id;
  const progress = goal.progressPercent || 0;
  const milestones = goal.milestones || [];
  const doneCount = milestones.filter((m) => m.done).length;
  const totalCount = milestones.length;

  const statusColor = goal.status === 'active' ? 'olive'
    : goal.status === 'paused' ? 'amber'
    : 'muted';

  return (
    <div className="goal-card" onClick={() => navigate(`/goals/${goalId}`)}>
      <div className="goal-card-header">
        <div>
          <div className="goal-card-title">{goal.title}</div>
          {goal.why && <div className="goal-card-why">{goal.why}</div>}
        </div>
      </div>
      {totalCount > 0 && (
        <div className="goal-card-progress">
          <div className="progress-bar">
            <div
              className={`progress-bar-fill ${statusColor}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="progress-label">
            <span>{doneCount}/{totalCount} milestones</span>
            <span>{progress}%</span>
          </div>
        </div>
      )}
      <div className="goal-card-footer">
        <span className={`goal-card-status tag tag-${statusColor}`}>
          {goal.status === 'active' ? 'Active' : goal.status === 'paused' ? 'Paused' : goal.status}
        </span>
        {goal.nextMilestone && (
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
            Next: {goal.nextMilestone.title}
          </span>
        )}
      </div>
    </div>
  );
}
