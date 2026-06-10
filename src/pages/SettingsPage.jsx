import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import MemoryChip from '../components/MemoryChip';

export default function SettingsPage() {
  const { user, profile, members, activeMemberId, API, getAuthHeader, updateProfile } = useAuth();
  const { memories, tokenLedger, deleteMemory, clearMemories, resetTokenLedger } = useApp();

  // Profile editing
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [lifeStage, setLifeStage] = useState(profile?.lifeStage || '');
  const [culturalContext, setCulturalContext] = useState(profile?.culturalContext || '');
  const [weeklyRhythm, setWeeklyRhythm] = useState(profile?.weeklyRhythm || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setLifeStage(profile.lifeStage || '');
      setCulturalContext(profile.culturalContext || '');
      setWeeklyRhythm(profile.weeklyRhythm || '');
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await API.put('/profile', {
        displayName: displayName.trim(),
        lifeStage,
        culturalContext: culturalContext.trim(),
        weeklyRhythm,
      }, { headers: getAuthHeader() });
      updateProfile(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleClearMemories = async () => {
    if (!window.confirm('Clear all memories? Malar will forget everything she has learned about you.')) return;
    try {
      await clearMemories(activeMemberId);
    } catch (err) {
      console.error('Failed to clear memories:', err);
    }
  };

  const handleResetTokens = async () => {
    try {
      await resetTokenLedger(activeMemberId);
    } catch (err) {
      console.error('Failed to reset token ledger:', err);
    }
  };

  const activeMember = members.find((m) => (m.id || m._id) === activeMemberId);

  return (
    <div className="settings-page">
      <h1 className="mb-3">Settings</h1>

      {/* Profile */}
      <section className="settings-section">
        <h3 className="settings-section-title">Profile</h3>

        <div className="form-group">
          <label className="form-label">Display name</label>
          <input
            type="text"
            className="form-input"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Life stage</label>
          <select className="form-input" value={lifeStage} onChange={(e) => setLifeStage(e.target.value)}>
            <option value="">Select...</option>
            <option value="child">Child (6–12)</option>
            <option value="teen">Teen (13–17)</option>
            <option value="youngAdult">Young adult (18–24)</option>
            <option value="adult">Adult (25–44)</option>
            <option value="midlife">Midlife (45–64)</option>
            <option value="elder">65+</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Cultural context</label>
          <input
            type="text"
            className="form-input"
            value={culturalContext}
            onChange={(e) => setCulturalContext(e.target.value)}
            placeholder="e.g. Indian-American, Jewish, etc."
          />
          <div className="form-help">Malar will honor this in conversation.</div>
        </div>

        <div className="form-group">
          <label className="form-label">Weekly rhythm</label>
          <select className="form-input" value={weeklyRhythm} onChange={(e) => setWeeklyRhythm(e.target.value)}>
            <option value="">Select...</option>
            <option value="packed">Packed — every day is full</option>
            <option value="balanced">Balanced — mix of structure and open time</option>
            <option value="open">Open — lots of breathing room</option>
            <option value="unpredictable">Unpredictable — each week looks different</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={handleSaveProfile} disabled={saving}>
          {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save profile'}
        </button>
      </section>

      {/* Active Member */}
      {activeMember && (
        <section className="settings-section">
          <h3 className="settings-section-title">Active member</h3>
          <div className="settings-row">
            <span className="settings-row-label">{activeMember.emoji} {activeMember.name}</span>
            <span className="settings-row-value">{activeMember.role} · {activeMember.supportStyle}</span>
          </div>
        </section>
      )}

      {/* Coach Memory Log */}
      <section className="settings-section">
        <div className="flex-between mb-2">
          <h3 className="settings-section-title" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
            What Malar knows ({memories.length} facts)
          </h3>
          <button className="btn btn-danger btn-sm" onClick={handleClearMemories}>
            Clear all
          </button>
        </div>
        {memories.length > 0 ? (
          <div className="memory-list">
            {memories.map((mem) => (
              <MemoryChip
                key={mem._id || mem.id}
                memory={mem}
                onDelete={deleteMemory}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>
            No memories yet. Chat with Malar to build your memory log.
          </p>
        )}
      </section>

      {/* Token Usage */}
      <section className="settings-section">
        <div className="flex-between mb-2">
          <h3 className="settings-section-title" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
            Token usage
          </h3>
          <button className="btn btn-ghost btn-sm" onClick={handleResetTokens}>
            Reset
          </button>
        </div>
        <div className="token-stats">
          <div className="token-stat-card">
            <div className="token-stat-value">{tokenLedger.tokensIn || 0}</div>
            <div className="token-stat-label">Tokens in</div>
          </div>
          <div className="token-stat-card">
            <div className="token-stat-value">{tokenLedger.tokensOut || 0}</div>
            <div className="token-stat-label">Tokens out</div>
          </div>
          <div className="token-stat-card">
            <div className="token-stat-value">{tokenLedger.turnCount || 0}</div>
            <div className="token-stat-label">Chat turns</div>
          </div>
          <div className="token-stat-card">
            <div className="token-stat-value">{tokenLedger.tokensSavedEstimate || 0}</div>
            <div className="token-stat-label">Tokens saved by memory</div>
          </div>
        </div>
      </section>

      {/* Account */}
      <section className="settings-section">
        <h3 className="settings-section-title">Account</h3>
        <div className="settings-row">
          <span className="settings-row-label">Email</span>
          <span className="settings-row-value">{user?.email}</span>
        </div>
      </section>
    </div>
  );
}
