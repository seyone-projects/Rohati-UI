import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGoals } from '../hooks/useGoals';
import MilestoneList from '../components/MilestoneList';

export default function GoalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getGoalById, deleteGoal, toggleMilestone, addMilestone, pauseGoal, resumeGoal } = useGoals();
  const [newMs, setNewMs] = useState('');
  const [deleting, setDeleting] = useState(false);

  const goal = getGoalById(id);

  if (!goal) {
    return (
      <div className="goal-detail-page">
        <p className="text-muted">Goal not found.</p>
        <button className="btn btn-ghost" onClick={() => navigate('/goals')}>← Back to goals</button>
      </div>
    );
  }

  const handleToggle = async (goalId, milestoneId) => {
    try {
      await toggleMilestone(goalId, milestoneId);
    } catch (err) {
      console.error('Failed to toggle milestone:', err);
    }
  };

  const handleAddMilestone = async () => {
    const title = newMs.trim();
    if (!title) return;
    try {
      await addMilestone(goal._id || goal.id, title);
      setNewMs('');
    } catch (err) {
      console.error('Failed to add milestone:', err);
    }
  };

  const handlePause = async () => {
    try {
      await pauseGoal(goal._id || goal.id, null);
    } catch (err) {
      console.error('Failed to pause goal:', err);
    }
  };

  const handleResume = async () => {
    try {
      await resumeGoal(goal._id || goal.id);
    } catch (err) {
      console.error('Failed to resume goal:', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this goal permanently?')) return;
    setDeleting(true);
    try {
      await deleteGoal(goal._id || goal.id);
      navigate('/goals');
    } catch (err) {
      console.error('Failed to delete goal:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="goal-detail-page">
      <button className="goal-detail-back" onClick={() => navigate('/goals')}>
        ← Back to goals
      </button>

      <div className="goal-detail-header">
        <h1 className="goal-detail-title">{goal.title}</h1>
        {goal.why && <p className="goal-detail-why">{goal.why}</p>}
        <span className={`tag tag-${goal.status === 'active' ? 'olive' : goal.status === 'paused' ? 'amber' : 'muted'}`}>
          {goal.status === 'active' ? 'Active' : goal.status === 'paused' ? 'Paused' : goal.status}
        </span>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Milestones ({goal.milestones?.length || 0})</h3>
        </div>
        <MilestoneList
          milestones={goal.milestones || []}
          goalId={goal._id || goal.id}
          onToggle={handleToggle}
        />
      </div>

      {goal.status === 'active' && (
        <div className="card mt-2">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Add milestone</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="New milestone title"
                value={newMs}
                onChange={(e) => setNewMs(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMilestone()}
              />
              <button className="btn btn-secondary" onClick={handleAddMilestone}>Add</button>
            </div>
          </div>
        </div>
      )}

      <div className="goal-detail-actions">
        {goal.status === 'active' ? (
          <button className="btn btn-secondary" onClick={handlePause}>
            Pause goal
          </button>
        ) : goal.status === 'paused' ? (
          <button className="btn btn-primary" onClick={handleResume}>
            Resume goal
          </button>
        ) : null}
        <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete goal'}
        </button>
      </div>
    </div>
  );
}
