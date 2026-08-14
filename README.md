# ALLOG Frontend

ALLOG 모바일 앱 또는 웹 프론트엔드 애플리케이션 전용 저장소입니다.

현재는 기술 스택 확정 전 초기 구조만 포함합니다. React, React Native, Flutter 등 실제 프레임워크 초기화는 팀 합의 후 진행합니다.

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

## Local Development

로컬 실행 방법은 프론트엔드 기술 스택 확정 후 추가합니다.

## Environment Variables

- 실제 환경 변수는 `.env`에 작성하고 커밋하지 않습니다.
- 공유 가능한 예시 키만 `.env.example`에 유지합니다.
- `API_BASE_URL`은 백엔드 API 주소를 가리킵니다.

## Branch Strategy

```text
main
└── develop
    ├── feature/*
    ├── fix/*
    ├── refactor/*
    ├── test/*
    └── docs/*
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

1. 기능별 브랜치에서 작업합니다.
2. `develop` 브랜치로 Pull Request를 생성합니다.
3. 자기 자신이 작성한 PR도 변경 내용을 직접 검토합니다.
4. 가능한 경우 최소 1명의 리뷰를 받은 후 병합합니다.
5. API 변경 사항은 PR 본문에 반드시 작성합니다.
6. 테스트하지 않은 기능을 테스트 완료로 표시하지 않습니다.
7. `main`에는 직접 푸시하지 않습니다.
8. 배포 가능한 버전만 `develop`에서 `main`으로 병합합니다.
