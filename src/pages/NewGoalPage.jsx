import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoals } from '../hooks/useGoals';
import { useAuth } from '../context/AuthContext';
import ChatBubble from '../components/ChatBubble';

export default function NewGoalPage() {
  const navigate = useNavigate();
  const { createGoal } = useGoals();
  const { activeMemberId } = useAuth();

  // Simple form for creating a goal directly
  const [title, setTitle] = useState('');
  const [why, setWhy] = useState('');
  const [milestoneInput, setMilestoneInput] = useState('');
  const [milestones, setMilestones] = useState([]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const handleAddMilestone = () => {
    const text = milestoneInput.trim();
    if (!text) return;
    setMilestones((prev) => [...prev, text]);
    setMilestoneInput('');
  };

  const handleRemoveMilestone = (i) => {
    setMilestones((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('Please enter a goal title');
      return;
    }
    setCreating(true);
    setError('');
    try {
      await createGoal(title.trim(), why.trim(), milestones);
      navigate('/goals');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create goal');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="new-goal-page">
      <div className="new-goal-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/goals')}>←</button>
        <h2>New goal</h2>
      </div>

      <div className="goal-drafter-messages">
        <div className="card">
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Goal title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Run a 5K as a family"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Why does this matter?</label>
            <textarea
              className="form-input"
              placeholder="The reason behind the goal..."
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Milestones (small steps along the way)</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Walk 20 mins, 3x this week"
                value={milestoneInput}
                onChange={(e) => setMilestoneInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMilestone()}
              />
              <button className="btn btn-secondary" onClick={handleAddMilestone}>Add</button>
            </div>
            {milestones.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {milestones.map((ms, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--olive)' }}>→</span>
                    <span style={{ flex: 1 }}>{ms}</span>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleRemoveMilestone(i)}
                      style={{ color: 'var(--danger)', padding: '0.25rem' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            onClick={handleCreate}
            disabled={creating || !title.trim()}
          >
            {creating ? 'Creating goal...' : 'Create goal'}
          </button>
        </div>
      </div>
    </div>
  );
}
