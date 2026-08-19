# ALLOG UI Baseline Handoff

> **기준 시각:** 2026-08-19 (KST)  
> **Frontend baseline:** `origin/main` `61f6212b0a98ad575d4dda25f8f94ee382f04bba`  
> **Backend baseline:** `origin/main` `70cf3410931fde6323e8b80f6b3ddb848ff7cc1b`

이 문서는 ALLOG의 UI/UX polishing 시작 전 상태를 사람이 재검토할 수 있도록 정리한 handoff다. 사실 주장에는 실행 명령 또는 GitHub artifact를 함께 적고, **실제 Android runtime에서 확인하지 못한 항목을 통과로 표시하지 않는다.**

## 1. Release decision summary

| 영역 | 상태 | 판단 |
|---|---|---|
| Canonical Expo entry/import reachability | PASS | `package.json`은 `expo-router/entry`를 entry로 사용하고 `app/_layout.jsx`가 root다. route reachability audit에서 실제 source import 미해결 항목은 없었다. |
| API client·onboarding contract check | PASS | `node src/services/api.check.mjs`, `node src/stores/onboardingStore.check.mjs` 성공. |
| Android static export | PASS | `npx expo export --platform android --clear` 성공. |
| PR #10 static asset comparison | PASS (limited) | PR #10 전 기준과 현재 기준의 Android export asset record는 각각 37개, asset set diff는 0개였다. 번들 크기는 7,033,259 B → 6,967,572 B였다. 이는 static export equivalence일 뿐 screenshot equivalence는 아니다. |
| Actual Android launch / interaction / visual diff | BLOCKED | 실행 환경과 연결 desktop에 Android SDK, emulator, ADB device, physical device가 없었다. |
| Canonical font fix | OPEN PR | [#12](https://github.com/Minimin0/ALLOG-Frontend/pull/12)가 canonical root에서 Pretendard를 실제 로드한다. merge 전까지 current main은 intended font를 runtime에서 보장하지 않는다. |
| Design / process / handoff docs | OPEN dependent PR | [#13](https://github.com/Minimin0/ALLOG-Frontend/pull/13)는 #12를 base로 하며, #12 merge 후 검토·merge한다. |
| Backend automated tests | BLOCKED | Java 21 compiler가 설치되어도 Gradle 9.7이 Ubuntu toolchain을 JRE로 판정하여 `./gradlew test --rerun-tasks`가 test compile 전에 중단되었다. backend source는 수정하지 않았다. |

**현재 권고:** #12와 #13은 review 가능하지만, 두 PR 모두 실제 Android smoke를 통과했다는 근거가 없다. Android visual verification과 reviewer 승인 전에는 merge하지 않는다.

## 2. Canonical runtime map

| 경계 | 현재 authority | 검토 포인트 |
|---|---|---|
| 앱 entry | `expo-router/entry` | `mobile/App.js`는 canonical entry가 아니다. |
| root | `app/_layout.jsx` | Firebase auth store 초기화와, #12 이후 Pretendard/splash 초기화가 위치한다. |
| live mobile screens | `mobile/src/**` | `src/components/MobileScreenRoute.jsx`가 Expo routes에서 import한다. legacy로 삭제하거나 방치하지 않는다. |
| API endpoint | `EXPO_PUBLIC_API_BASE_URL` | default production endpoint는 `https://api.allog-app.store`; Android emulator local backend에는 `http://10.0.2.2:8080`만 사용한다. |
| identity | Firebase bearer token → backend internal user | client는 Firebase identity만 다루며 business domain user id는 backend authority다. |
| media upload | upload intent → signed PUT → submit | Android는 filesystem path·signing secret을 받지 않는다. 현 backend는 nginx/Spring/Gabia private local media store를 사용한다. |

## 3. Backend authority boundary

| 항목 | client가 해도 되는 일 | client가 하면 안 되는 일 |
|---|---|---|
| Group lifecycle | status/reason code 렌더링, backend data refetch | join/leave/activation/completion을 local status·clock으로 최종 결정 |
| Schedule / deadline | schedule 응답 표시, countdown 표현 | client clock·AI clock으로 deadline authority 생성 |
| Heart / Reward | wallet·ledger 결과 표시 | balance, spend, refund, reward 지급 직접 계산·변경 |
| Verification | upload intent 요청, 파일 PUT, submit, backend decision 표시 | AI 결과 또는 UI state만으로 최종 성공/실패 결정 |

## 4. Design-system audit result

`src/theme.js`와 `tailwind.config.js`의 semantic color/radius 값은 token consistency audit에서 **color mismatch 0, radius mismatch 0, alias mismatch 0**이었다. `src/styles/variables.css`는 runtime import가 없는 참고 팔레트다.

| 항목 | 수치 / 상태 | 후속 판단 |
|---|---|---|
| Raw HEX/RGBA baseline | 116 occurrences, 88 distinct values | 모두 자동 치환하지 않았다. 실제 Android screenshot 없이 색상을 바꾸면 visual regression을 만들 수 있다. |
| 명백한 예외 | Kakao/Naver brand color, transparent overlay/shadow, SVG/illustration assets | semantic token으로 강제 승격하지 않는다. |
| 반복된 screen literal 후보 | Explore, Home, Reward, onboarding, group/detail 화면의 text/surface/border 계열 | Android capture 후 같은 visual role이 반복되는 것만 별도 `refactor/design-token-*` PR로 승격한다. |
| Font | #12가 `app/_layout.jsx`에서 `PretendardVariable.ttf`를 로드 | merge 후 Android launch에서 fallback/flash 여부를 확인한다. |
| Pill radius | JS `radius.pill`을 NativeWind `rounded-pill`과 동일한 9999로 정렬 | 현재 component size에서는 visual change가 의도되지 않는다. |

> Raw literal이 존재한다는 사실만으로 모두 bug는 아니다. tokenization 대상은 반복되는 **semantic UI role**이며, source code duplication·overlay·brand asset은 capture와 component context를 함께 본다.

## 5. PR #10 evidence and limits

[PR #10](https://github.com/Minimin0/ALLOG-Frontend/pull/10)은 `main@2497b42be68a4714a0a3e437ba24f17de106b6b5`을 base로 하여 `main@61f6212b0a98ad575d4dda25f8f94ee382f04bba`에 merge되었다. GitHub metadata상 3 commits, 194 changed files였고 audit 시점에 submitted review, comment, GitHub status check은 모두 0개였다.

PR #10 전후 `npx expo export --platform android`의 asset set은 같았고 export 자체도 성공했다. 그러나 export asset parity는 layout, typography, safe area, touch interaction, auth redirect, loading/error state의 parity를 증명하지 않는다. **Android screenshot/diff와 end-to-end interaction은 아직 확인되지 않았다.**

## 6. Required Android smoke checklist

실행 환경을 확보한 reviewer는 아래 조건과 결과를 PR comment 또는 release evidence에 남긴다.

| 조건 | 기록할 값 |
|---|---|
| Target | physical device 또는 emulator 이름, Android API level |
| Rendering | resolution, density, font scale, locale, light/dark mode |
| Build | Expo development/release build 구분, commit SHA |
| Launch | cold launch, first-frame/splash, Pretendard fallback 또는 flash 여부 |
| Navigation | onboarding → login/profile → tabs → group detail → verification → progress/reward |
| Failure state | unauthorized refresh, no group, media disabled/503, upload failure/retry messaging |
| Visual | 각 핵심 route의 screenshot; release candidate와 baseline의 expected visual change annotation |
| Interaction | primary button, disabled state, keyboard/input, safe area, back behavior, tab navigation |

Expo official guidance는 SDK 52 이후 Expo Go/development build가 release splash behavior를 완전히 재현하지 못할 수 있다고 명시한다. 따라서 font/splash fix는 가능하면 release build에서도 확인한다. [Expo SplashScreen](https://docs.expo.dev/versions/v57.0.0/sdk/splash-screen/)

## 7. Collaboration and merge order

1. [#12](https://github.com/Minimin0/ALLOG-Frontend/pull/12) — canonical font runtime fix를 self-review, Android smoke, reviewer approval 후 `main`으로 merge한다.
2. [#13](https://github.com/Minimin0/ALLOG-Frontend/pull/13) — #12 merge 후 base를 `main`으로 전환하거나 #12 merge commit을 포함하도록 갱신한 뒤 검토한다. design docs, process docs, this handoff가 포함된다.
3. Android screenshots와 smoke result를 #12/#13 또는 release ticket에 attach한다.
4. `develop`은 main보다 **98 commits behind, 0 commits ahead**인 legacy branch다. 새 PR target으로 사용하지 않는다. 삭제 또는 protection change는 별도 팀 policy decision이다.
5. 현재 private repository plan에서는 GitHub branch protection/rulesets API가 HTTP 403을 반환했고 workflow도 없었다. required reviewer/check enforcement는 code change가 아니라 repository settings·plan policy로 해결해야 한다.

## 8. Reproducible commands

```sh
npm ci
node src/services/api.check.mjs
node src/stores/onboardingStore.check.mjs
node scripts/canonical-font.check.mjs
npx expo export --platform android --clear
git diff --check
```

이 문서가 가리키는 external/one-off audit 결과는 PR body와 review log에 요약한다. repository에 sandbox absolute path, local machine path, token, credential, signed media URL을 commit하지 않는다.

## 9. Explicitly deferred items

| Item | Reason | Owner / next action |
|---|---|---|
| Android actual runtime evidence | no runnable Android target connected | Mobile owner: run Section 6 checklist and attach screenshots |
| Raw-literal tokenization | visual role classification requires capture/context | UI owner: screen-scoped follow-up PRs only |
| Backend Gradle test execution | Gradle toolchain recognition mismatch | Backend owner: use CI/provisioned JDK distribution and record passing test run |
| Branch protection / rulesets | repository-plan policy, not application code | Repository owner: decide plan/settings, then enable required reviews/checks |
| Dependency audit warnings | existing transitive package audit output; no safe baseline-only upgrade selected | Dependency owner: separate security/dependency update with compatibility test |
