import { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export function useMood() {
  const { moodHistory, logMood, fetchMoodHistory } = useApp();
  const { activeMemberId } = useAuth();

  const todayMood = moodHistory.length > 0 ? moodHistory[0] : null;

  const log = useCallback((mood, note) => {
    return logMood(activeMemberId, mood, note);
  }, [logMood, activeMemberId]);

  const refresh = useCallback(() => {
    fetchMoodHistory(activeMemberId);
  }, [fetchMoodHistory, activeMemberId]);

  return {
    moodHistory,
    todayMood,
    logMood: log,
    refresh,
  };
}
