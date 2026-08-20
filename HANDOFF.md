# ALLOG 프론트엔드 UI 정합성 작업 — 인수인계

- 기준 브랜치: `feature/fullstack-integration`(cb905b1, Minimin0/ALLOG-Frontend)에서 분기
- 이 브랜치: `fix/ui-parity-fixes`
- 비교 기준: `origin/main`(haewon060310/ALLOG-FRONTEND) — 팀에서 "최종 디자인"으로 지정한 저장소
- 검증: Android 번들 컴파일 확인(200 OK). **실기기/에뮬레이터 테스트는 아직 안 함** (아래 "진행해야 할 것" 참고)

전체 비교 내역과 결정 근거는 [ui-parity-review.md](ui-parity-review.md) 참고.

---

## 1. 완료된 작업

### 콘텐츠/카피 수정
- `app/onboarding/complete.jsx` — "하트는 그룹 참가에**만** 사용돼요" 조사 복원

### 버그 수정 (기능이 실제로 동작 안 하던 것)
- `app/my/edit-profile.jsx` — "저장하기" 버튼이 아무것도 저장 안 하던 문제. `updateMyProfile()`(`PATCH /api/v1/users/me`)에 실제 연결. 초기값도 하드코딩 대신 실제 프로필에서 로드하도록 수정. **"관심 카테고리" 편집 UI 신규 추가**(수분케어/운동/식사/수면 토글, `onboarding.interestRoutines`로 저장)
- `app/onboarding/basic-info.jsx`, `src/components/onboarding/OnboardingShellRN.jsx` — 온보딩 STEP 1 뒤로가기 버튼이 동작 안 하던 문제(`router.replace()` 진입이라 history 없음). `OnboardingShellRN`에 `canBack` prop 추가해서 STEP 1만 뒤로가기 숨김. STEP 2~4는 기존 동작 그대로.
- `app/group/invite.jsx` — 초대코드 복사 기능이 아예 없던 문제. `expo-clipboard` 추가해서 "코드 복사하기" 버튼 구현. "참여 방법" 안내 텍스트도 복원.
- `app/explore/group/[groupId].jsx` — 헤더 배지에 서버 raw status(`RECRUITING` 등)가 그대로 노출되던 문제 → 사용자용 라벨로 매핑(`app/(tabs)/group.jsx`에 이미 있던 패턴 재사용). 뒤로가기 버튼 스타일을 다른 화면과 통일(원형, `border-line`). 초대코드 칩(🔗) 복원 — 비공개 그룹 멤버에게만 노출.
- `app/group/created.jsx`, `app/group/create.jsx` — 그룹명·정원 개인화 문구("'{name}' 그룹이 생성되었어요! {capacity}명이 모이면...") 복원. `create.jsx`에서 `created.jsx`로 라우팅할 때 `name`/`capacity` 파라미터 추가 전달.

### 디자인 결정 반영
- **Pretendard 폰트 전역 적용**: `assets/fonts/PretendardVariable.ttf` 추가(mobile/ 프로젝트에서 복사), `app/_layout.jsx`에 `useFonts` + `Text/TextInput.defaultProps` 로드 로직 추가.
- **브랜드 컬러 그린(#14453a) 통일**: 검정(`bg-ink`/`#000`)으로 바뀌었던 CTA를 원복 — 홈 "인증하러 가기", 탐색 필터 아이콘/활성 카테고리칩/"직접 그룹 만들기", 마이페이지 아바타, 탐색>그룹상세 "그룹 참가하기". (그룹 생성/초대/참가 플로우의 검정 버튼은 origin/main 자체가 검정이라 안 건드림 — `GroupFlowScreens.js` 참고해서 확인됨)

### 패키지
- `@react-native-community/datetimepicker`, `expo-clipboard` 설치 (`app.json`에 datetimepicker config plugin 자동 추가됨)
- `react-native-web` 재설치 (네이티브 모듈 설치 과정에서 빠졌던 것 복구, 웹 프리뷰용 — 실제 타겟엔 무관)

---

## 2. 아직 안 한 것 / 막힌 것

### 팀 결정 대기 중 (구현 안 함, `ui-parity-review.md` 3번 섹션 참고)
1. **온보딩 완료 화면 하트 환급 다이어그램** — 80%/70% 조건박스 복원 여부
2. **리워드 화면** — 필터/정렬/가격/교환 버튼 완전 제거 유지 vs 비활성화 상태로 남겨두기
3. **하트 안내 화면** — 인터랙티브 하트 획득 리스트(루틴인증/인스타팔로우/친구초대/친구응원) 복원 여부
4. **탐색 "AI 추천" → "마감임박"** 리브랜딩 확정 여부

### 캘린더 피커 — 패키지만 설치, 코드 연결 안 함
`@react-native-community/datetimepicker`는 설치했지만 `app/onboarding/basic-info.jsx`에 실제로 연결하지 않았습니다(주석에 이유 명시). 이유: 네이티브 모듈이라 Expo Go로 테스트가 안 되고, 개발 빌드가 필요해서 이번 작업 범위에서 뒤로 미뤘습니다. 지금은 기존과 동일하게 수동 텍스트 입력만 가능합니다.

### 백엔드 정책과 충돌 — 프론트만으로 해결 불가
**공개 그룹 초대코드 표시**: `issueInviteCode` API가 공개 그룹에는 409 `CONFLICT`("공개 그룹은 초대 코드가 필요 없어요")를 반환하도록 백엔드가 설계돼 있습니다. 그룹명/정원 개인화 문구는 복원했지만, 코드 자체는 백엔드가 발급을 거부하므로 표시할 수 없습니다. **백엔드 팀과 정책 확인 필요** — 공개 그룹도 코드를 지원하게 바꿀지, 아니면 애초에 이 요구사항 자체를 재검토할지.

### 정리 못 한 죽은 코드
`src/components/nav/NavIcons.jsx`, `src/components/nav/BottomNavBar.jsx` — 새 탭바 아이콘 세트가 최종으로 결정되면서 완전히 안 쓰이는 코드가 됐습니다(다른 어디서도 import 안 됨, 확인 완료). 삭제 권한이 없어서 못 지웠으니 다음에 정리해주세요.

---

## 3. 더 진행해야 할 것

1. **Android 개발 빌드 만들기** — 네이티브 모듈(datetimepicker, clipboard) 때문에 Expo Go로는 전체 테스트가 안 됩니다. EAS Build 또는 로컬 Android SDK로 dev client 빌드 필요. 이번 세션에서는 시간 관계상 생략했습니다.
2. **실기기 테스트** — 이번 브랜치의 변경사항은 Android 번들 컴파일까지만 확인했고, 실제 화면 동작(특히 프로필 저장, 관심 카테고리, 초대코드 복사)은 아직 눈으로 확인 못 했습니다.
3. **위 "팀 결정 대기 중" 4개 항목** 결정되는 대로 반영.
4. **공개 그룹 초대코드 백엔드 정책** 확인 후 필요시 백엔드 API 변경 요청.
5. `NavIcons.jsx`/`BottomNavBar.jsx` 삭제.
6. PR 리뷰 후 `feature/fullstack-integration`(또는 팀에서 지정하는 브랜치)로 머지.

---

*작업 브랜치는 로컬에서 변경 후 이 커밋으로 푸시했습니다. 실기기 검증 전이므로 머지 전 반드시 개발 빌드로 확인해주세요.*
