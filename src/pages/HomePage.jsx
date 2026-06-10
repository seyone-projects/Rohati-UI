import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useGoals } from '../hooks/useGoals';
import MoodPicker from '../components/MoodPicker';
import GoalCard from '../components/GoalCard';

export default function HomePage() {
  const { user, profile } = useAuth();
  const { greeting, fetchGreeting } = useApp();
  const { goals } = useGoals();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGreeting();
  }, [fetchGreeting]);

  const activeGoals = goals.filter((g) => g.status === 'active').slice(0, 3);
  const name = profile?.displayName || user?.familyName || 'friend';

  return (
    <div className="home-page">
      <div className="greeting-card">
        <h2>{greeting || `Good ${getTimeOfDay()}, ${name}.`}</h2>
        <p>I have been thinking about your week. How is the energy today?</p>
      </div>

      <section className="home-section">
        <h3 className="mb-2">How are you feeling?</h3>
        <MoodPicker />
      </section>

      <section className="home-section">
        <div className="home-section-title">
          <h3>Active goals</h3>
          <Link to="/goals" className="btn btn-ghost btn-sm">View all</Link>
        </div>
        {activeGoals.length > 0 ? (
          <div className="grid grid-2 gap-2">
            {activeGoals.map((goal) => (
              <GoalCard key={goal._id || goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          <div className="card text-center" style={{ padding: '2rem' }}>
            <p className="text-muted">No active goals yet.</p>
            <button className="btn btn-primary mt-2" onClick={() => navigate('/goals/new')}>
              Create your first goal
            </button>
          </div>
        )}
      </section>

      <section className="home-section" style={{ textAlign: 'center' }}>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/coach')}
        >
          💬 Talk to Malar
        </button>
      </section>
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 22) return 'evening';
  return 'night';
}
