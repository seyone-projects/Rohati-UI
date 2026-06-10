import { useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export function useCoach() {
  const {
    chatMessages,
    setChatMessages,
    isTyping,
    pendingDraft,
    connected,
    sendMessage,
    fetchHistory,
    clearHistory,
    dismissDraft,
  } = useSocket();
  const { activeMemberId } = useAuth();

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

  return {
    messages: chatMessages,
    isTyping,
    pendingDraft,
    connected,
    sendMessage: send,
    loadHistory,
    clearChat: clear,
    dismissDraft: dismiss,
  };
}
