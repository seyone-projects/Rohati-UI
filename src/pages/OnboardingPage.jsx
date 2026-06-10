import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OnboardingStep from '../components/OnboardingStep';

const STEPS = [
  {
    question: 'What should Malar call you?',
    hint: 'Your coach will use this name to greet you.',
    field: 'displayName',
    type: 'text',
  },
  {
    question: 'What stage of life are you in?',
    hint: 'This helps Malar adjust her vocabulary and pacing.',
    field: 'lifeStage',
    type: 'choice',
    options: [
      { value: 'child', label: 'Child (6–12)', desc: 'Concrete, playful, short steps' },
      { value: 'teen', label: 'Teen (13–17)', desc: 'Autonomy, identity, peer-aware' },
      { value: 'youngAdult', label: 'Young adult (18–24)', desc: 'Becoming, exploring, building' },
      { value: 'adult', label: 'Adult (25–44)', desc: 'Career, family, big load' },
      { value: 'midlife', label: 'Midlife (45–64)', desc: 'Refocus, depth, reset' },
      { value: 'elder', label: '65+', desc: 'Meaning, legacy, pace' },
    ],
  },
  {
    question: 'How often do your own goals come last?',
    hint: 'This helps Malar understand how to protect time for what matters to you.',
    field: 'selfPriority',
    type: 'choice',
    options: [
      { value: 'thatsMe', label: "That's me", desc: 'My own goals always end up at the bottom of the list.' },
      { value: 'sometimes', label: 'Sometimes', desc: 'Some weeks I get to me, most weeks I do not.' },
      { value: 'notReally', label: 'Not really', desc: "I am pretty good at carving out time for myself." },
    ],
  },
  {
    question: 'What gets in the way the most?',
    hint: 'Malar will tailor her suggestions to your biggest barrier.',
    field: 'primaryBarrier',
    type: 'choice',
    options: [
      { value: 'time', label: 'Time', desc: "There's never a free block in the day." },
      { value: 'clarity', label: 'Clarity', desc: "I am not sure what the actual next step is." },
      { value: 'accountability', label: 'Accountability', desc: "No one is checking, so it slides." },
      { value: 'energy', label: 'Energy', desc: "By the time I have a moment, I am spent." },
    ],
  },
  {
    question: 'What happened to your last personal goal?',
    hint: 'This helps Malar understand your natural patterns.',
    field: 'goalJourneyPattern',
    type: 'choice',
    options: [
      { value: 'neverStarted', label: 'I never really started', desc: 'It stayed an intention. Life filled the space.' },
      { value: 'stalled', label: 'I started, then it stalled', desc: 'The first push faded after a week or two.' },
      { value: 'lostMomentum', label: 'I made progress, then lost momentum', desc: 'I was moving — then something pulled me off course.' },
      { value: 'achieved', label: 'I actually achieved it', desc: 'I followed through. I want to keep that going.' },
    ],
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { API, getAuthHeader, updateProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const current = STEPS[step];
  const value = answers[current.field] || '';

  const setValue = (val) => {
    setAnswers((prev) => ({ ...prev, [current.field]: val }));
    setError('');
  };

  const canProceed = value.toString().trim().length > 0;

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }

    // Last step — save to server
    setLoading(true);
    setError('');
    try {
      await API.put('/profile', {
        ...answers,
        onboardingComplete: true,
      }, { headers: getAuthHeader() });
      updateProfile({ ...answers, onboardingComplete: true });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  return (
    <div className="onboarding-page">
      <OnboardingStep
        step={step}
        total={STEPS.length}
        question={current.question}
        hint={current.hint}
        onBack={handleBack}
        onNext={handleNext}
        canProceed={canProceed && !loading}
        nextLabel={step === STEPS.length - 1 ? (loading ? 'Saving...' : 'Start your journey →') : undefined}
      >
        {error && <div className="auth-error">{error}</div>}

        {current.type === 'text' && (
          <input
            type="text"
            className="form-input"
            placeholder="Your name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          />
        )}

        {current.type === 'choice' && (
          <div>
            {current.options.map((opt) => (
              <button
                key={opt.value}
                className={`onboarding-option ${value === opt.value ? 'selected' : ''}`}
                onClick={() => setValue(opt.value)}
              >
                <strong>{opt.label}</strong>
                <span className="onboarding-option-desc">{opt.desc}</span>
              </button>
            ))}
          </div>
        )}
      </OnboardingStep>
    </div>
  );
}
