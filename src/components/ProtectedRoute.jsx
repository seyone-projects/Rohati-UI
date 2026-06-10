import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />
        <p>Rohati</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If onboarding not complete and not already on onboarding page
  if (location.pathname !== '/onboarding' && profile && !profile.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
