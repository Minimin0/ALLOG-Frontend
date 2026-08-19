# Contributing

ALLOG Frontend의 작업 기준은 **scoped branch → Pull Request → main**이다. `main`에는 직접 push하거나 자동 merge하지 않는다.

## 브랜치 전략

```text
main
  ↑ Pull Request
  ├── feature/*
  ├── fix/*
  ├── refactor/*
  ├── integration/*
  ├── test/*
  └── docs/*
```

새 작업은 최신 `origin/main`에서 만든다. `develop`은 main보다 뒤처져 있고 main에 없는 커밋이 없는 legacy branch이므로 새 작업의 base나 PR target으로 사용하지 않는다. branch 삭제 또는 repository protection 변경은 팀 승인 없이는 수행하지 않는다.

## 커밋 규칙

`feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore` prefix를 사용한다. 한 commit에는 하나의 reviewable concern만 넣는다. runtime code fix, docs/process fix, backend change를 한 commit 또는 PR에 섞지 않는다.

## Pull Request 규칙

1. PR base는 `main`이다. scope가 큰 변경은 먼저 분리한다.
2. PR body에 goal, why, files changed, runtime effect, UI effect, API effect, backend-authority impact, tests, Android evidence, screenshots/visual diff summary, known deferred를 기록한다.
3. UI-affecting change는 실제 Android runtime에서 launch, navigation, safe area, font, interaction을 확인하고 screenshot을 첨부한다. 환경상 실행하지 못했으면 pass로 표시하지 말고 blocker와 필요한 검증을 기록한다.
4. API contract 또는 backend authority에 영향이 있으면 backend owner와 함께 검토한다. client는 Heart, Reward, group lifecycle, deadline, final verification outcome을 계산하거나 결정하지 않는다.
5. 최소 `npm ci`, `node src/services/api.check.mjs`, `node src/stores/onboardingStore.check.mjs`, `npx expo export --platform android`, `git diff --check`를 해당 변경 범위에 맞게 실행한다.
6. 작성자도 diff를 self-review하고, 가능한 경우 최소 한 명의 reviewer를 확보한다. reviewer와 required checks가 끝나기 전 merge하지 않는다.

## 보안 규칙

`.env`, API key, password, Firebase Admin credential, media signing secret, filesystem path를 commit하지 않는다. `.env.example`에는 key name과 안전한 설명만 둔다. `EXPO_PUBLIC_*` 값은 client bundle에 노출되므로 server secret으로 사용하지 않는다.
