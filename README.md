# ALLOG Frontend
ALLOG is an Android-first React Native and Expo Router wellness group client.
## Repository Links

- 공통 문서: https://github.com/Minimin0/ALLOG
- 백엔드: https://github.com/Minimin0/ALLOG-Backend

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

Production API is https://api.allog-app.store. Expo uses EXPO_PUBLIC_API_BASE_URL and Firebase public client values use EXPO_PUBLIC_FIREBASE_ variables. Firebase Admin credentials, database passwords, AI keys, media signing secrets, and server filesystem paths are backend-only secrets.

Backend is the business-truth authority for lifecycle, schedule, Heart, reward, and final verification decisions.

Android renders backend truth and must not calculate group lifecycle, deadlines, Heart balance, rewards, or final verification decisions.

## Verification media

Request upload-intent, PUT the returned uploadUrl with returned requiredHeaders, then submit. Media travels Android to nginx to Spring to Gabia private local filesystem; Android never receives a filesystem path or signing secret.

## Local Development

Copy .env.example to .env, set Firebase public values, run npm ci, then run npm run android. Use the production HTTPS API by default; for an Android emulator local backend use http://10.0.2.2:8080, never localhost.

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

## Commit Convention

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷 변경
- `refactor`: 리팩터링
- `test`: 테스트 추가 또는 수정
- `chore`: 설정 및 기타 작업

## Pull Request

1. Work on a scoped branch.
2. Pull Request base is main.
3. Self-review every change before requesting review.
4. Obtain at least one reviewer where possible.
5. Document API contract changes in the pull request.
6. Never mark untested work as tested.
7. Never push directly to main; merge only after review and required checks.
