# ALLOG Frontend
ALLOG is an Android-first React Native and Expo Router wellness group client.
## Repository Links

- 공통 문서: https://github.com/Minimin0/ALLOG
- 백엔드: https://github.com/Minimin0/ALLOG-Backend

## Canonical runtime

`package.json`의 `main`은 `expo-router/entry`다. `app/_layout.jsx`가 실제 root이고 `app/**`는 file-based route다. `mobile/App.js`는 별도 React Navigation entry라 canonical runtime에서는 실행되지 않는다.

`mobile/src/**`는 legacy로 분류하지 않는다. `src/components/MobileScreenRoute.jsx`가 이를 Expo Router routes로 import하므로 현재 live screen source다. Pretendard Variable은 `app/_layout.jsx`가 `mobile/assets/fonts/PretendardVariable.ttf`에서 로드하며, 로드 전에는 splash를 유지한다.

## Directory Structure

```text
.
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── assets/
├── docs/
├── src/
├── .env.example
├── .gitignore
├── CONTRIBUTING.md
└── README.md
```

## Production integration

Production API is https://api.allog-app.store. Expo uses only `EXPO_PUBLIC_API_BASE_URL`; local ID/password authentication and token signing are backend-owned. Database passwords, token-signing secrets, AI keys, media-signing secrets, and server filesystem paths are backend-only secrets.

Backend is the business-truth authority for lifecycle, schedule, Heart, reward, and final verification decisions.

Android renders backend truth and must not calculate group lifecycle, deadlines, Heart balance, rewards, or final verification decisions.

## Verification media

Request upload-intent, PUT the returned uploadUrl with returned requiredHeaders, then submit. Media travels Android to nginx to Spring to Gabia private local filesystem; Android never receives a filesystem path or signing secret.

## Local Development

Copy `.env.example` to `.env`, set `EXPO_PUBLIC_API_BASE_URL`, run `npm ci`, then run `npm run android`. Use the production HTTPS API by default; for an Android emulator local backend use `http://10.0.2.2:8080`, never `localhost`.

## Environment Variables

- Put local public client configuration in .env and never commit it.
- EXPO_PUBLIC variables are visible in the client bundle and must not contain server secrets.
- EXPO_PUBLIC_API_BASE_URL is the only runtime API endpoint input for this Expo app.

## Branch Strategy

```text
main
  <- feature/* | fix/* | integration/* | docs/*
```

브랜치 예시:

- `feature/login`
- `feature/challenge-list`
- `fix/navigation-error`
- `docs/api-spec`

`develop`은 현재 main보다 뒤처져 있고 독자 커밋이 없는 legacy branch다. 새 작업의 base나 PR target으로 사용하지 않으며, 삭제·보호 정책 변경은 별도 팀 승인으로 결정한다.

## Commit Convention

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷 변경
- `refactor`: 리팩터링
- `test`: 테스트 추가 또는 수정
- `chore`: 설정 및 기타 작업

## Pull Request

1. Work on a scoped branch and set `main` as the Pull Request base.
2. Self-review every change before requesting review; never push directly to `main`.
3. State scope, UI effect, API contract effect, backend-authority impact, test evidence, and known deferred work in the PR body.
4. For UI-affecting work, attach Android runtime evidence and screenshots or explain why the evidence is unavailable.
5. Run `npm ci`, `node src/services/api.check.mjs`, `node src/stores/onboardingStore.check.mjs`, and `npx expo export --platform android` when applicable.
6. Obtain at least one reviewer where possible. Merge only after review and required checks; never mark untested work as tested.
