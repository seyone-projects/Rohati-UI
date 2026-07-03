import React, { useEffect, useRef, useState } from 'react';
import { useCoach } from '../hooks/useCoach';
import ChatBubble from '../components/ChatBubble';
import TypingIndicator from '../components/TypingIndicator';
import DraftGoalCard from '../components/DraftGoalCard';
import CalendarSuggestionCard from '../components/CalendarSuggestionCard';
import { useAuth } from '../context/AuthContext';

export default function CoachPage() {
  const { messages, isTyping, pendingDraft, pendingCalendarSuggestion, connected, sendMessage, loadHistory, clearChat, dismissDraft, confirmCalendarEvent, declineCalendarEvent } = useCoach();
  const { activeMemberId } = useAuth();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (activeMemberId) {
      loadHistory();
    }
  }, [activeMemberId, loadHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    sendMessage(text);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="coach-page">
      <div className="coach-header">
        <div className="coach-avatar">✦</div>
        <div>
          <div className="coach-name">Malar</div>
          <div className="coach-status">
            <span className="coach-status-dot" />
            {connected ? 'Online' : 'Reconnecting...'}
          </div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn btn-ghost btn-sm" onClick={clearChat}>
            Clear chat
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && !isTyping ? (
          <div className="chat-empty">
            <div className="chat-empty-icon">✦</div>
            <h3>Talk to Malar</h3>
            <p>
              Share what is on your mind — your goals, how your week is going, or something you want to work toward.
            </p>
          </div>
        ) : (
          <div className="chat-messages-inner">
            {messages.map((msg, i) => (
              <ChatBubble key={msg.id || i} message={msg} />
            ))}

            {/* Show draft card after the message that triggered it */}
            {pendingDraft && (
              <DraftGoalCard
                draft={pendingDraft}
                onPlant={() => {
                  // Goal planted successfully
                }}
                onDismiss={() => dismissDraft()}
              />
            )}

            {/* Show calendar suggestion card */}
            {pendingCalendarSuggestion && (
              <CalendarSuggestionCard
                suggestion={pendingCalendarSuggestion}
                onConfirm={() => confirmCalendarEvent(pendingCalendarSuggestion.id)}
                onDismiss={() => declineCalendarEvent(pendingCalendarSuggestion.id)}
              />
            )}

            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="chat-input-area">
        {!connected && (
          <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '0.5rem', textAlign: 'center' }}>
            Connecting to server...
          </p>
        )}
        <div className="chat-input-row">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Tell Malar what is on your mind..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={!connected}
          />
          <button
            className="chat-send-btn"
            onClick={handleSend}
            disabled={!input.trim() || !connected}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
