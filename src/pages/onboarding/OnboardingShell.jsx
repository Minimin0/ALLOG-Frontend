function OnboardingShell({
  step,
  total,
  title,
  subtitle,
  onBack,
  onNext,
  nextLabel = "다음",
  canNext = true,
  children,
}) {
  const stepLabel = `STEP ${step}`;
  const segments = Array.from({ length: total || step }, (_, i) => i < step);

  return (
    <div className="onboarding-app">
      <div className="onboarding-phone">
        <div className="onboarding-content">
          <div className="onboarding-stephead">
            <button
              type="button"
              className="back"
              onClick={onBack}
              aria-label="뒤로가기"
            >
              ←
            </button>
            <span>{stepLabel}</span>
          </div>

          <div className="onboarding-progress" aria-label="진행도">
            {segments.map((filled, i) => (
              <div
                key={i}
                className={`onboarding-progress-segment ${filled ? "is-filled" : ""}`}
              />
            ))}
          </div>

          <h1 className="onboarding-title">{title}</h1>
          {subtitle ? <p className="onboarding-subtitle">{subtitle}</p> : null}

          <div className="onboarding-form">{children}</div>

          <div className="onboarding-footer">
            <button type="button" className="secondary" onClick={onBack}>
              이전
            </button>
            <button
              type="button"
              className="primary"
              onClick={onNext}
              disabled={!canNext}
            >
              {nextLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingShell;
