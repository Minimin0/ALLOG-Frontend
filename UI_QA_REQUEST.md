# ALLOG 최신 UI 최종 검수 요청

Firebase 삭제 후 Backend와 통합된 프론트 구조는 그대로 유지하면서, 병합 전 최종 프론트의 UI 스타일을 복구하고 사용자 흐름의 프론트 오류를 보완한 브랜치입니다.

## 검수 기준

- Frontend repository: `https://github.com/Minimin0/ALLOG-Frontend.git`
- Branch: `codex/latest-ui-final-qa`
- Backend: Gabia production API
- API base URL: `https://api.allog-app.store`

검수 전에 현재 HEAD가 원격 검수 브랜치 HEAD와 동일한지 반드시 확인해주세요.

```bash
git fetch origin
git switch codex/latest-ui-final-qa
git pull --ff-only origin codex/latest-ui-final-qa
git rev-parse HEAD
git rev-parse origin/codex/latest-ui-final-qa
npm ci
EXPO_PUBLIC_API_BASE_URL=https://api.allog-app.store npx expo start --clear
```

PowerShell에서는 마지막 명령을 아래처럼 실행합니다.

```powershell
$env:EXPO_PUBLIC_API_BASE_URL='https://api.allog-app.store'
npx expo start --clear
```

두 `git rev-parse` 결과가 반드시 같아야 합니다.

## 변경 원칙

- Backend 코드, API endpoint, 요청/응답 계약을 변경하지 않았습니다.
- Firebase를 다시 도입하지 않았습니다.
- 서버 응답을 대신하는 mock 데이터나 fake success를 추가하지 않았습니다.
- 하트 잔액은 실제 Backend 값만 표시합니다.
- 하트 획득 이벤트는 Backend 정책/API 완성 전까지 `획득 이벤트는 준비 중이에요`로 유지합니다.
- 그룹 대기방 및 관련 Backend 흐름은 이번 작업 범위에서 제외했습니다.
- 온보딩 완료 화면은 합의된 상태를 유지했습니다.

## 반영된 UI 및 프론트 UX

- 시작·로그인·온보딩의 병합 전 레이아웃과 입력 스타일 복구
- 온보딩 단계 진행 표시, 선택 카드, 코치 이미지와 전환 애니메이션 복구
- 홈·내 그룹·탐색·리워드·마이페이지의 색상, 간격, 정렬, 카드 스타일 정리
- 화면 진입 애니메이션에 시스템의 동작 줄이기 설정 반영
- 홈·내 그룹·탐색·AI 코치의 코치 이미지 원형 배경 제거
- AI 코치 하단바를 공통 탭바 디자인과 통일
- 마이페이지 프로필 null 방어 유지 및 저장 후 즉시 갱신 흐름 유지
- AI 코치 후속 답변 실패 시 다시 시도 UI 추가
- 인증 시작·촬영·미리보기·결과 화면의 합의된 UI 복구
- 온보딩 이전 버튼을 명시적인 경로로 연결
- 기본 정보 첫 단계에서 이전을 누르면 로컬 세션을 종료하고 시작 화면으로 이동

## 검수 포인트

### 공통 UI

- 시작 화면 / 로그인 / 온보딩 / 홈 / 내 그룹 / 탐색 / 리워드 / 마이페이지 디자인
- 탭 전체가 아래로 밀리거나 safe area와 겹치지 않는지
- 공통 탭바와 AI 코치·인증 화면 하단바가 같은 디자인인지
- 검정 주요 버튼, 따뜻한 배경과 카드, 간격과 정렬이 일관적인지
- 동작 줄이기 설정에서 과도한 진입 애니메이션이 실행되지 않는지

### 인증 및 세션

- 로그아웃 상태에서 시작 화면이 표시되는지
- 로그인 성공 후 프로필이 있으면 홈으로 이동하는지
- 프로필이 없으면 기본 정보 온보딩으로 이동하는지
- 앱 재실행 시 로그인/온보딩 세션이 정상 복구되는지
- 기본 정보 첫 단계의 이전 버튼으로 시작 화면에 돌아갈 수 있는지
- 로그아웃 후 시작 화면이 표시되고 기존 세션이 복구되지 않는지

### 온보딩

- 기본 정보 입력과 달력, 성별 선택, 키·몸무게 입력이 정상인지
- 습관 복수 선택과 선택 애니메이션이 정상인지
- AI 코치 유형 이미지와 선택 상태가 정상인지
- 생활 패턴 입력 및 수면 시간 선택이 정상인지
- 이전/다음 이동 시 입력값이 유지되는지
- 완료 화면에서 실제 서버 프로필 저장 결과만 표시되는지

### 주요 화면

- 홈의 하트 잔액이 실제 Backend 값인지
- 하트 획득 영역이 의도대로 `준비 중이에요`인지
- 내 그룹의 피드·랭킹 준비 상태가 가짜 데이터 없이 표시되는지
- 그룹 시작 전 멤버는 `그룹 나가기`, 방장은 `그룹 취소하기`로 표시되는지
- 탐색 필터, 그룹 상세, 참가, 그룹 만들기/코드 참가 흐름이 정상인지
- 리워드가 실제 지원 범위만 표시하는지
- AI Coach의 실제 응답, 추천 질문, 재시도, 액션 이동이 정상인지
- Verification의 촬영, 미리보기, JPEG 프레임 제출, 결과 상태가 정상인지

### 마이페이지

- 실제 닉네임이 정상 표시되는지
- 닉네임 옆 편집 버튼 선택 시 `Cannot read property 'nickname' of null` 오류가 없는지
- 프로필 저장 후 마이페이지에 바로 반영되는지
- 알림 / 고객센터 / 약관 화면과 뒤로가기가 정상인지
- 로그아웃 확인 바텀시트와 로그아웃 처리가 정상인지

## 옛 UI 또는 변경 미반영 시

1. `git rev-parse HEAD`와 `git rev-parse origin/codex/latest-ui-final-qa`를 비교합니다.
2. 기존 ALLOG Metro를 종료합니다.
3. Expo Go의 기존 프로젝트 세션을 종료합니다.
4. production API 환경변수를 지정합니다.
5. `npx expo start --clear`를 실행합니다.
6. Expo Go에서 QR을 다시 스캔하고 Reload합니다.

## 문제 보고 형식

```text
화면/기능 → 재현 순서 → 예상 → 실제
```

가능하면 아래 정보도 함께 전달해주세요.

- iOS/Android 및 OS 버전
- Expo Go 버전
- `git rev-parse HEAD` 결과
- 오류 문구 또는 화면 캡처
- Metro 터미널 오류 로그
