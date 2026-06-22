import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export default function NavBar() {
  const { user, logout } = useAuth();
  const { unreadNudgeCount } = useApp();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <span className="navbar-brand-icon">✦</span>
        Rohati
      </NavLink>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
          <span>🏠</span>
          <span>Home</span>
        </NavLink>
        <NavLink to="/coach" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
          <span>💬</span>
          <span>Coach</span>
        </NavLink>
        <NavLink to="/goals" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
          <span>🎯</span>
          <span>Goals</span>
        </NavLink>
        <NavLink to="/family" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
          <span>👨‍👩‍👧‍👦</span>
          <span>Family</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
          <span>⚙️</span>
          <span>Settings</span>
        </NavLink>
      </div>
      <div className="navbar-right">
        <NavLink to="/notifications" className="navbar-bell-link">
          <span className="navbar-bell">🔔</span>
          {unreadNudgeCount > 0 && (
            <span className="navbar-bell-badge">{unreadNudgeCount > 9 ? '9+' : unreadNudgeCount}</span>
          )}
        </NavLink>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </nav>
  );
}
