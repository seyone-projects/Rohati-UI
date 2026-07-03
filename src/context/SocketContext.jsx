import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export function SocketProvider({ children }) {
  const { user, getAuthHeader } = useAuth();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [pendingDraft, setPendingDraft] = useState(null);
  const [pendingCalendarSuggestion, setPendingCalendarSuggestion] = useState(null);
  const [currentTurnId, setCurrentTurnId] = useState(null);
  const [crisisAlert, setCrisisAlert] = useState(false);

  // Connect / disconnect on auth state
  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setConnected(false);
      return;
    }

    const token = localStorage.getItem('rohati_access_token');
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
      setConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
      setConnected(false);
    });

    socket.on('coach_reply', (data) => {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.content, id: data.messageId, turnId: data.turnId, timestamp: new Date().toISOString() },
      ]);
      setIsTyping(false);
      setCurrentTurnId(data.turnId);
    });

    socket.on('coach_draft', (data) => {
      setPendingDraft(data);
    });

    socket.on('coach_calendar_suggestion', (data) => {
      setPendingCalendarSuggestion(data);
    });

    socket.on('coach_calendar_note', (data) => {
      // Lightweight notification — conflict noted, will retry on next turn
    });

    socket.on('coach_typing', (data) => {
      setIsTyping(data.isTyping);
    });

    socket.on('crisis_alert', () => {
      setCrisisAlert(true);
    });

    socket.on('error', (data) => {
      console.error('[Socket] Error:', data.message);
    });

    socket.on('chat:history_reply', (data) => {
      setChatMessages(data.messages || []);
    });

    socket.on('chat:cleared', () => {
      setChatMessages([]);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [user]);

  const sendMessage = useCallback((content, memberId) => {
    if (!socketRef.current || !content.trim() || !memberId) return;
    setChatMessages((prev) => [
      ...prev,
      { role: 'user', content: content.trim(), id: Date.now().toString(), timestamp: new Date().toISOString() },
    ]);
    setPendingDraft(null);
    setPendingCalendarSuggestion(null);
    socketRef.current.emit('user_message', { content: content.trim(), memberId });
  }, []);

  const fetchHistory = useCallback((memberId) => {
    if (!socketRef.current || !memberId) return;
    socketRef.current.emit('chat:history', { memberId });
  }, []);

  const clearHistory = useCallback((memberId) => {
    if (!socketRef.current || !memberId) return;
    socketRef.current.emit('chat:clear', { memberId });
  }, []);

  const dismissDraft = useCallback(() => {
    setPendingDraft(null);
  }, []);

  const dismissCrisis = useCallback(() => {
    setCrisisAlert(false);
  }, []);

  const dismissCalendarSuggestion = useCallback(() => {
    setPendingCalendarSuggestion(null);
  }, []);

  const value = {
    socketRef,
    connected,
    chatMessages,
    setChatMessages,
    isTyping,
    pendingDraft,
    pendingCalendarSuggestion,
    setPendingCalendarSuggestion,
    currentTurnId,
    crisisAlert,
    sendMessage,
    fetchHistory,
    clearHistory,
    dismissDraft,
    dismissCrisis,
    dismissCalendarSuggestion,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within SocketProvider');
  return ctx;
}
