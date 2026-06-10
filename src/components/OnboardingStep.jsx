import React from 'react';

export default function OnboardingStep({ step, total, question, hint, children, onBack, onNext, nextLabel, canProceed }) {
  return (
    <div className="onboarding-card fade-in">
      <div className="onboarding-progress">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`onboarding-step-dot ${i < step ? 'done' : ''} ${i === step ? 'active' : ''}`}
          />
        ))}
      </div>
      <div className="onboarding-step-number">Step {step + 1} of {total}</div>
      <h2 className="onboarding-question">{question}</h2>
      {hint && <p className="onboarding-hint">{hint}</p>}
      <div className="mt-3">{children}</div>
      <div className="onboarding-nav">
        <button
          className="btn btn-ghost"
          onClick={onBack}
          disabled={step === 0}
        >
          ← Back
        </button>
        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={!canProceed}
        >
          {nextLabel || (step === total - 1 ? 'Finish' : 'Next →')}
        </button>
      </div>
    </div>
  );
}
