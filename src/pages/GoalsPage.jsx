import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoals } from '../hooks/useGoals';
import GoalCard from '../components/GoalCard';

export default function GoalsPage() {
  const { goals, loading } = useGoals();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="goals-page">
        <p className="text-muted">Loading goals...</p>
      </div>
    );
  }

  return (
    <div className="goals-page">
      <div className="goals-header">
        <h1>Goals</h1>
        <button className="btn btn-primary" onClick={() => navigate('/goals/new')}>
          + New goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="goals-empty">
          <div className="goals-empty-icon">🎯</div>
          <h3>No goals yet</h3>
          <p className="text-muted">Create your first goal or chat with Malar to draft one together.</p>
          <button className="btn btn-primary mt-2" onClick={() => navigate('/goals/new')}>
            Create a goal
          </button>
        </div>
      ) : (
        <div className="goals-grid">
          {goals.map((goal) => (
            <GoalCard key={goal._id || goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
}
