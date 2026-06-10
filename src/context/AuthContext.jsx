import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

const AuthContext = createContext(null);

let refreshPromise = null;

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED' && !original._retry) {
      original._retry = true;
      try {
        if (!refreshPromise) {
          const stored = localStorage.getItem('rohati_refresh_token');
          if (!stored) throw new Error('No refresh token');
          refreshPromise = axios.post('/api/auth/refresh', { refreshToken: stored }).then((r) => r.data);
        }
        const data = await refreshPromise;
        refreshPromise = null;
        localStorage.setItem('rohati_access_token', data.accessToken);
        localStorage.setItem('rohati_refresh_token', data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return API(original);
      } catch {
        refreshPromise = null;
        localStorage.removeItem('rohati_access_token');
        localStorage.removeItem('rohati_refresh_token');
        localStorage.removeItem('rohati_user');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [activeMemberId, setActiveMemberId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set auth header
  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem('rohati_access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  // Load persisted user on mount
  useEffect(() => {
    const stored = localStorage.getItem('rohati_user');
    const token = localStorage.getItem('rohati_access_token');
    if (stored && token) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        // Fetch full profile
        API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
          .then((res) => {
            setUser(res.data.user);
            setMembers(res.data.members);
            setProfile(res.data.profile);
            if (res.data.members?.length > 0 && !res.data.profile?.onboardingComplete) {
              // Onboarding not complete
            }
            if (res.data.members?.length > 0 && !activeMemberId) {
              setActiveMemberId(res.data.members[0].id);
            }
          })
          .catch(() => {
            // Token might be expired, will redirect to login
          })
          .finally(() => setLoading(false));
      } catch {
        localStorage.removeItem('rohati_user');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const data = res.data;
    localStorage.setItem('rohati_access_token', data.accessToken);
    localStorage.setItem('rohati_refresh_token', data.refreshToken);
    localStorage.setItem('rohati_user', JSON.stringify(data.user));
    setUser(data.user);
    setMembers(data.members || []);
    setProfile(data.profile);
    if (data.members?.length > 0) {
      setActiveMemberId(data.members[0].id);
    }
    return data;
  };

  const register = async (email, password, familyName) => {
    const res = await API.post('/auth/register', { email, password, familyName });
    const data = res.data;
    localStorage.setItem('rohati_access_token', data.accessToken);
    localStorage.setItem('rohati_refresh_token', data.refreshToken);
    localStorage.setItem('rohati_user', JSON.stringify(data.user));
    setUser(data.user);
    setMembers(data.member ? [data.member] : []);
    setProfile(null);
    if (data.member) {
      setActiveMemberId(data.member.id);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('rohati_access_token');
    localStorage.removeItem('rohati_refresh_token');
    localStorage.removeItem('rohati_user');
    setUser(null);
    setMembers([]);
    setProfile(null);
    setActiveMemberId(null);
  };

  const updateProfile = (newProfile) => {
    setProfile(newProfile);
  };

  const updateMembers = (newMembers) => {
    setMembers(newMembers);
  };

  const value = {
    user,
    members,
    profile,
    activeMemberId,
    setActiveMemberId,
    loading,
    login,
    register,
    logout,
    getAuthHeader,
    updateProfile,
    updateMembers,
    API,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
