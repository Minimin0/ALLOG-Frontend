function OnboardingShell({
  step,
  total,
  title,
  subtitle,
  progress,
  onBack,
  onNext,
  nextLabel = "다음",
  canNext = true,
  children,
}) {
  const stepLabel = total ? `STEP ${step}/${total}` : `STEP ${step}`;

  return (
    <div className="onboarding-app">
      <div className="onboarding-phone">
        <div className="onboarding-statusbar">
          <div className="left">12:41</div>
          <div className="right">
            <span className="signal">
              <span />
              <span />
              <span />
              <span />
            </span>
            <span>◔</span>
          </div>
        </div>

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
            <div
              className="onboarding-progress-bar"
              style={{ width: `${progress}%` }}
            />
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
