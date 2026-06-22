import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { API, getAuthHeader, activeMemberId } = useAuth();
  const [goals, setGoals] = useState([]);
  const [moodHistory, setMoodHistory] = useState([]);
  const [memories, setMemories] = useState([]);
  const [tokenLedger, setTokenLedger] = useState({ tokensIn: 0, tokensOut: 0, turnCount: 0, tokensSavedEstimate: 0 });
  const [greeting, setGreeting] = useState('');
  const [nudges, setNudges] = useState([]);
  const [unreadNudgeCount, setUnreadNudgeCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchGoals = useCallback(async (memberId) => {
    if (!memberId) return;
    try {
      const res = await API.get('/goals', {
        params: { memberId },
        headers: getAuthHeader(),
      });
      setGoals(res.data);
    } catch (err) {
      console.error('Failed to fetch goals:', err);
    }
  }, [API, getAuthHeader]);

  const fetchMoodHistory = useCallback(async (memberId, days = 30) => {
    if (!memberId) return;
    try {
      const res = await API.get('/mood/history', {
        params: { memberId, days },
        headers: getAuthHeader(),
      });
      setMoodHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch mood history:', err);
    }
  }, [API, getAuthHeader]);

  const fetchMemories = useCallback(async (memberId) => {
    if (!memberId) return;
    try {
      const res = await API.get('/memories', {
        params: { memberId },
        headers: getAuthHeader(),
      });
      setMemories(res.data);
    } catch (err) {
      console.error('Failed to fetch memories:', err);
    }
  }, [API, getAuthHeader]);

  const fetchTokenLedger = useCallback(async (memberId) => {
    if (!memberId) return;
    try {
      const res = await API.get('/tokens', {
        params: { memberId },
        headers: getAuthHeader(),
      });
      setTokenLedger(res.data);
    } catch (err) {
      console.error('Failed to fetch token ledger:', err);
    }
  }, [API, getAuthHeader]);

  const fetchGreeting = useCallback(async () => {
    try {
      const res = await API.get('/profile/greeting', { headers: getAuthHeader() });
      setGreeting(res.data.greeting);
      return res.data;
    } catch (err) {
      console.error('Failed to fetch greeting:', err);
      return null;
    }
  }, [API, getAuthHeader]);

  const createGoal = useCallback(async (memberId, title, why, milestones) => {
    const res = await API.post('/goals', { memberId, title, why, milestones }, { headers: getAuthHeader() });
    setGoals((prev) => [res.data, ...prev]);
    return res.data;
  }, [API, getAuthHeader]);

  const updateGoal = useCallback(async (goalId, updates) => {
    const res = await API.put(`/goals/${goalId}`, updates, { headers: getAuthHeader() });
    setGoals((prev) => prev.map((g) => (g._id === goalId || g.id === goalId ? res.data : g)));
    return res.data;
  }, [API, getAuthHeader]);

  const deleteGoal = useCallback(async (goalId) => {
    await API.delete(`/goals/${goalId}`, { headers: getAuthHeader() });
    setGoals((prev) => prev.filter((g) => g._id !== goalId && g.id !== goalId));
  }, [API, getAuthHeader]);

  const toggleMilestone = useCallback(async (goalId, milestoneId) => {
    const res = await API.put(`/goals/${goalId}/milestones/${milestoneId}/toggle`, {}, { headers: getAuthHeader() });
    setGoals((prev) => prev.map((g) => (g._id === goalId || g.id === goalId ? res.data : g)));
    return res.data;
  }, [API, getAuthHeader]);

  const addMilestone = useCallback(async (goalId, title) => {
    const res = await API.post(`/goals/${goalId}/milestones`, { title }, { headers: getAuthHeader() });
    setGoals((prev) => prev.map((g) => (g._id === goalId || g.id === goalId ? res.data : g)));
    return res.data;
  }, [API, getAuthHeader]);

  const pauseGoal = useCallback(async (goalId, reactivateAt) => {
    const res = await API.post(`/goals/${goalId}/pause`, { reactivateAt }, { headers: getAuthHeader() });
    setGoals((prev) => prev.map((g) => (g._id === goalId || g.id === goalId ? res.data : g)));
    return res.data;
  }, [API, getAuthHeader]);

  const resumeGoal = useCallback(async (goalId) => {
    const res = await API.post(`/goals/${goalId}/resume`, {}, { headers: getAuthHeader() });
    setGoals((prev) => prev.map((g) => (g._id === goalId || g.id === goalId ? res.data : g)));
    return res.data;
  }, [API, getAuthHeader]);

  const logMood = useCallback(async (memberId, mood, note) => {
    const res = await API.post('/mood', { memberId, mood, note }, { headers: getAuthHeader() });
    await fetchMoodHistory(memberId);
    return res.data;
  }, [API, getAuthHeader, fetchMoodHistory]);

  const deleteMemory = useCallback(async (memoryId) => {
    await API.delete(`/memories/${memoryId}`, { headers: getAuthHeader() });
    setMemories((prev) => prev.filter((m) => m._id !== memoryId && m.id !== memoryId));
  }, [API, getAuthHeader]);

  const clearMemories = useCallback(async (memberId) => {
    await API.delete('/memories', { params: { memberId }, headers: getAuthHeader() });
    setMemories([]);
  }, [API, getAuthHeader]);

  const resetTokenLedger = useCallback(async (memberId) => {
    await API.post('/tokens/reset', { memberId }, { headers: getAuthHeader() });
    setTokenLedger({ tokensIn: 0, tokensOut: 0, turnCount: 0, tokensSavedEstimate: 0 });
  }, [API, getAuthHeader]);

  const fetchNudges = useCallback(async () => {
    try {
      const res = await API.get('/nudges', { params: { includeRead: true }, headers: getAuthHeader() });
      setNudges(res.data);
    } catch (err) {
      console.error('Failed to fetch nudges:', err);
    }
  }, [API, getAuthHeader]);

  const fetchUnreadNudgeCount = useCallback(async () => {
    try {
      const res = await API.get('/nudges/unread-count', { headers: getAuthHeader() });
      setUnreadNudgeCount(res.data.count);
    } catch (err) {
      console.error('Failed to fetch nudge count:', err);
    }
  }, [API, getAuthHeader]);

  const markNudgeRead = useCallback(async (nudgeId) => {
    try {
      await API.put(`/nudges/${nudgeId}/read`, {}, { headers: getAuthHeader() });
      setNudges((prev) => prev.map((n) => 
        (n._id === nudgeId || n.id === nudgeId) ? { ...n, read: true } : n
      ));
      setUnreadNudgeCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark nudge read:', err);
    }
  }, [API, getAuthHeader]);

  const markAllNudgesRead = useCallback(async () => {
    try {
      await API.put('/nudges/read-all', {}, { headers: getAuthHeader() });
      setNudges((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadNudgeCount(0);
    } catch (err) {
      console.error('Failed to mark all nudges read:', err);
    }
  }, [API, getAuthHeader]);

  const dismissNudge = useCallback(async (nudgeId) => {
    try {
      await API.put(`/nudges/${nudgeId}/dismiss`, {}, { headers: getAuthHeader() });
      setNudges((prev) => prev.filter((n) => n._id !== nudgeId && n.id !== nudgeId));
      setUnreadNudgeCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to dismiss nudge:', err);
    }
  }, [API, getAuthHeader]);

  const refreshAll = useCallback(async (memberId) => {
    if (!memberId) return;
    setLoading(true);
    await Promise.all([
      fetchGoals(memberId),
      fetchMoodHistory(memberId),
      fetchMemories(memberId),
      fetchTokenLedger(memberId),
    ]);
    setLoading(false);
  }, [fetchGoals, fetchMoodHistory, fetchMemories, fetchTokenLedger]);

  useEffect(() => {
    if (activeMemberId) {
      refreshAll(activeMemberId);
      fetchUnreadNudgeCount();
    }
  }, [activeMemberId, refreshAll, fetchUnreadNudgeCount]);

  // Poll for unread nudge count every 60s
  useEffect(() => {
    if (!activeMemberId) return;
    const interval = setInterval(() => {
      fetchUnreadNudgeCount();
    }, 60000);
    return () => clearInterval(interval);
  }, [activeMemberId, fetchUnreadNudgeCount]);

  const value = {
    goals,
    moodHistory,
    memories,
    tokenLedger,
    greeting,
    nudges,
    unreadNudgeCount,
    loading,
    fetchGoals,
    fetchMoodHistory,
    fetchMemories,
    fetchTokenLedger,
    fetchGreeting,
    setGreeting,
    createGoal,
    updateGoal,
    deleteGoal,
    toggleMilestone,
    addMilestone,
    pauseGoal,
    resumeGoal,
    logMood,
    deleteMemory,
    clearMemories,
    resetTokenLedger,
    refreshAll,
    fetchNudges,
    fetchUnreadNudgeCount,
    markNudgeRead,
    markAllNudgesRead,
    dismissNudge,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
