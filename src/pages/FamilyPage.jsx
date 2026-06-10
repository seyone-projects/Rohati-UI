import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const EMOJIS = ['🌼', '🌳', '🦊', '🌟', '🌸', '🌻', '🦋', '🌈', '🍀', '⭐'];

export default function FamilyPage() {
  const { members, API, getAuthHeader, updateMembers } = useAuth();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [kind, setKind] = useState('parent');
  const [emoji, setEmoji] = useState('🌼');
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    try {
      const res = await API.post('/members', { name: name.trim(), role, kind, emoji }, { headers: getAuthHeader() });
      const newMembers = [...members, res.data];
      updateMembers(newMembers);
      setName('');
      setRole('');
      setKind('parent');
      setEmoji('🌼');
      setShowForm(false);
    } catch (err) {
      console.error('Failed to add member:', err);
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Remove this family member? Their goals and data will be deleted.')) return;
    try {
      await API.delete(`/members/${id}`, { headers: getAuthHeader() });
      updateMembers(members.filter((m) => m.id !== id && m._id !== id));
    } catch (err) {
      console.error('Failed to remove member:', err);
    }
  };

  return (
    <div className="family-page">
      <div className="flex-between mb-3">
        <h1>Family</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add member'}
        </button>
      </div>

      {showForm && (
        <form className="add-member-form" onSubmit={handleAdd}>
          <input
            type="text"
            className="form-input full-width"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <input
            type="text"
            className="form-input"
            placeholder="Role (e.g. Mom, Dad)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <select className="form-input" value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="parent">Parent</option>
            <option value="teen">Teen</option>
            <option value="kid">Kid</option>
            <option value="other">Other</option>
          </select>
          <div className="full-width" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                style={{
                  fontSize: '1.5rem',
                  padding: '0.375rem',
                  border: emoji === e ? '2px solid var(--terracotta)' : '2px solid transparent',
                  borderRadius: '8px',
                  background: 'none',
                  cursor: 'pointer',
                }}
              >
                {e}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="btn btn-primary full-width"
            disabled={adding || !name.trim()}
          >
            {adding ? 'Adding...' : 'Add member'}
          </button>
        </form>
      )}

      <div className="family-grid">
        {members.map((member) => {
          const mid = member.id || member._id;
          return (
            <div key={mid} className="family-member-card">
              <div className="family-member-emoji">{member.emoji || '🌼'}</div>
              <div className="family-member-name">{member.name}</div>
              <div className="family-member-role">{member.role}</div>
              <div className="family-member-support">
                {member.supportStyle === 'cheerleader' && '🌟 Cheerleader'}
                {member.supportStyle === 'accountability' && '🎯 Accountability'}
                {member.supportStyle === 'gentleNudge' && '🌿 Gentle Nudge'}
                {member.supportStyle === 'strategist' && '📋 Strategist'}
              </div>
              <button
                className="btn btn-ghost btn-sm mt-2"
                onClick={() => handleRemove(mid)}
                style={{ color: 'var(--danger)' }}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
