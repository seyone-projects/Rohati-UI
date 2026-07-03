import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export default function CalendarSuggestionCard({ suggestion, onConfirm, onDismiss }) {
  const [loading, setLoading] = useState(false);
  const { API, getAuthHeader } = useAuth();

  const handleConfirm = async () => {
    if (!suggestion || !suggestion.id) return;
    setLoading(true);
    try {
      await API.patch(`/api/calendar/${suggestion.id}/confirm`, {}, { headers: getAuthHeader() });
      if (onConfirm) onConfirm();
    } catch (err) {
      console.error('Failed to confirm event:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async () => {
    if (!suggestion || !suggestion.id) return;
    setLoading(true);
    try {
      await API.patch(`/api/calendar/${suggestion.id}/decline`, {}, { headers: getAuthHeader() });
      if (onDismiss) onDismiss();
    } catch (err) {
      console.error('Failed to decline event:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!suggestion) return null;

  return (
    <div className="draft-card">
      <div className="draft-card-title">{suggestion.title}</div>
      {suggestion.notes && <div className="draft-card-why">{suggestion.notes}</div>}
      <div style={{ fontSize: '0.875rem', color: 'var(--charcoal-light)', marginBottom: '0.75rem' }}>
        <div>{formatDate(suggestion.start)} · {formatTime(suggestion.start)}</div>
        <div>{formatDuration((new Date(suggestion.end) - new Date(suggestion.start)) / 60000)}</div>
      </div>
      {suggestion.linkedGoalId && (
        <div style={{ fontSize: '0.75rem', color: 'var(--olive)', marginBottom: '0.75rem' }}>
          Linked to goal
        </div>
      )}
      <div className="draft-card-actions">
        <button className="btn btn-primary btn-sm" onClick={handleConfirm} disabled={loading}>
          {loading ? 'Adding...' : 'Add to calendar'}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={handleDismiss} disabled={loading}>
          Dismiss
        </button>
      </div>
    </div>
  );
}
