import React, { useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import NudgeList from '../components/NudgeList';

export default function NotificationsPage() {
  const {
    nudges,
    fetchNudges,
    fetchUnreadNudgeCount,
    markNudgeRead,
    markAllNudgesRead,
    dismissNudge,
  } = useApp();

  useEffect(() => {
    fetchNudges();
  }, [fetchNudges]);

  const handleMarkRead = useCallback((nudgeId) => {
    markNudgeRead(nudgeId);
  }, [markNudgeRead]);

  const handleDismiss = useCallback((nudgeId) => {
    dismissNudge(nudgeId);
  }, [dismissNudge]);

  const handleMarkAllRead = useCallback(async () => {
    await markAllNudgesRead();
    fetchUnreadNudgeCount();
  }, [markAllNudgesRead, fetchUnreadNudgeCount]);

  const hasUnread = nudges.some((n) => !n.read && !n.dismissed);

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>Notifications</h1>
        {hasUnread && (
          <button className="btn btn-ghost btn-sm" onClick={handleMarkAllRead}>
            Mark all read
          </button>
        )}
      </div>

      {nudges.length === 0 ? (
        <div className="notifications-empty">
          <div className="notifications-empty-icon">🔔</div>
          <h3>All caught up</h3>
          <p className="text-muted">You'll see nudges, celebrations, and reminders here.</p>
        </div>
      ) : (
        <NudgeList
          nudges={nudges}
          onMarkRead={handleMarkRead}
          onDismiss={handleDismiss}
        />
      )}
    </div>
  );
}