import React from 'react';

const KIND_LABELS = {
  milestone_celebrate: '🎉 Milestone Complete',
  goal_complete: '🏆 Goal Complete',
  check_in: '🌿 Check-in',
  coach_message: '✦ Coach Message',
  milestone_reminder: '📋 Reminder',
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function NudgeList({ nudges, onMarkRead, onDismiss }) {
  if (!nudges || nudges.length === 0) {
    return null;
  }

  return (
    <div className="nudge-list">
      {nudges.map((nudge) => {
        const nid = nudge._id || nudge.id;
        const isUnread = !nudge.read && !nudge.dismissed;
        return (
          <div
            key={nid}
            className={`nudge-card ${isUnread ? 'unread' : ''}`}
            onClick={() => isUnread && onMarkRead && onMarkRead(nid)}
          >
            <div className="nudge-card-kind">
              {KIND_LABELS[nudge.kind] || nudge.kind}
            </div>
            <div className="nudge-card-header">
              <div className="nudge-card-title">{nudge.title}</div>
              <div className="nudge-card-time">{timeAgo(nudge.createdAt)}</div>
            </div>
            <p className="nudge-card-body">{nudge.body}</p>
            {onDismiss && (
              <div className="nudge-card-actions">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={(e) => { e.stopPropagation(); onDismiss(nid); }}
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}