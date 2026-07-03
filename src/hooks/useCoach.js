import { useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export function useCoach() {
  const {
    chatMessages,
    setChatMessages,
    isTyping,
    pendingDraft,
    pendingCalendarSuggestion,
    connected,
    sendMessage,
    fetchHistory,
    clearHistory,
    dismissDraft,
    dismissCalendarSuggestion,
  } = useSocket();
  const { activeMemberId, API, getAuthHeader } = useAuth();

  const send = useCallback((content) => {
    sendMessage(content, activeMemberId);
  }, [sendMessage, activeMemberId]);

  const loadHistory = useCallback(() => {
    fetchHistory(activeMemberId);
  }, [fetchHistory, activeMemberId]);

  const clear = useCallback(() => {
    clearHistory(activeMemberId);
    setChatMessages([]);
  }, [clearHistory, activeMemberId, setChatMessages]);

  const dismiss = useCallback(() => {
    dismissDraft();
  }, [dismissDraft]);

  const confirmCalendarEvent = useCallback(async (eventId) => {
    try {
      await API.patch(`/api/calendar/${eventId}/confirm`, {}, { headers: getAuthHeader() });
      dismissCalendarSuggestion();
    } catch (err) {
      console.error('Failed to confirm calendar event:', err);
    }
  }, [API, getAuthHeader, dismissCalendarSuggestion]);

  const declineCalendarEvent = useCallback(async (eventId) => {
    try {
      await API.patch(`/api/calendar/${eventId}/decline`, {}, { headers: getAuthHeader() });
      dismissCalendarSuggestion();
    } catch (err) {
      console.error('Failed to decline calendar event:', err);
    }
  }, [API, getAuthHeader, dismissCalendarSuggestion]);

  return {
    messages: chatMessages,
    isTyping,
    pendingDraft,
    pendingCalendarSuggestion,
    connected,
    sendMessage: send,
    loadHistory,
    clearChat: clear,
    dismissDraft: dismiss,
    confirmCalendarEvent,
    declineCalendarEvent,
    dismissCalendarSuggestion,
  };
}
