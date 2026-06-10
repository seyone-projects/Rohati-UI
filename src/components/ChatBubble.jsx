import React from 'react';

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user';
  const time = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={`chat-bubble ${isUser ? 'user' : 'coach'} fade-in`}>
      <div>{message.content}</div>
      {time && <div className="chat-bubble-time">{time}</div>}
    </div>
  );
}
