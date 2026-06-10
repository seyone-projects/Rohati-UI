import React, { useState } from 'react';
import { useMood } from '../hooks/useMood';

const MOODS = [
  { key: 'Glowing', emoji: '🌅', label: 'Glowing' },
  { key: 'Steady', emoji: '🌱', label: 'Steady' },
  { key: 'Foggy', emoji: '🌫️', label: 'Foggy' },
  { key: 'Stretched', emoji: '🪢', label: 'Stretched' },
  { key: 'Tender', emoji: '🫶', label: 'Tender' },
];

export default function MoodPicker({ onMoodLogged }) {
  const [selected, setSelected] = useState(null);
  const [acknowledgement, setAcknowledgement] = useState(null);
  const [logging, setLogging] = useState(false);
  const { logMood, todayMood } = useMood();

  const handleSelect = async (mood) => {
    if (logging || selected === mood) return;
    setSelected(mood);
    setLogging(true);
    try {
      const result = await logMood(mood, '');
      setAcknowledgement(result.acknowledgement);
      if (onMoodLogged) onMoodLogged(result);
    } catch (err) {
      console.error('Failed to log mood:', err);
    } finally {
      setLogging(false);
    }
  };

  if (todayMood && !selected) {
    return (
      <div className="mood-ack">
        Today's mood: {todayMood.mood}
      </div>
    );
  }

  return (
    <div>
      <div className="mood-picker">
        {MOODS.map((m) => (
          <button
            key={m.key}
            className={`mood-btn ${selected === m.key ? 'selected' : ''}`}
            onClick={() => handleSelect(m.key)}
            disabled={logging}
          >
            <span className="mood-btn-emoji">{m.emoji}</span>
            <span className="mood-btn-label">{m.label}</span>
          </button>
        ))}
      </div>
      {acknowledgement && <div className="mood-ack">{acknowledgement}</div>}
    </div>
  );
}
