import { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export function useGoals() {
  const { goals, loading, createGoal, updateGoal, deleteGoal, toggleMilestone, addMilestone, pauseGoal, resumeGoal, fetchGoals } = useApp();
  const { activeMemberId } = useAuth();

  const refresh = useCallback(() => {
    fetchGoals(activeMemberId);
  }, [fetchGoals, activeMemberId]);

  const create = useCallback((title, why, milestones) => {
    return createGoal(activeMemberId, title, why, milestones);
  }, [createGoal, activeMemberId]);

  const getGoalById = useCallback((goalId) => {
    return goals.find((g) => g._id === goalId || g.id === goalId) || null;
  }, [goals]);

  return {
    goals,
    loading,
    refresh,
    createGoal: create,
    updateGoal,
    deleteGoal,
    toggleMilestone,
    addMilestone,
    pauseGoal,
    resumeGoal,
    getGoalById,
  };
}
