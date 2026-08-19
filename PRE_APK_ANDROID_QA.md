# PRE-APK Android QA Handoff

> **Baseline status:** `DEFERRED_TO_PRE_APK_ANDROID_QA`
>
> **Device-runtime status:** `ANDROID_DEVICE_E2E_NOT_FAKED`
>
> **Branch under test:** `feature/final-ui-polish`
>
> **Baseline main:** `f3abf9ccd8a5a3a298462bfd07dd2f83d4663f36` (`PR #14` merged)

이 문서는 APK 또는 development build가 준비된 뒤 Android 담당자가 수행할 실제 기기 QA의 실행 기준이다. 여기 기록된 정적 검사와 Android JavaScript bundle export는 완료되었지만, 이는 **실제 Android 기기 또는 에뮬레이터 runtime PASS를 의미하지 않는다**. 그 단계는 명시적으로 보류되어 있으며, 이 문서의 절차와 결과 기록을 통해서만 해제할 수 있다.

## A. 목적과 완료 기준

이번 baseline은 Pretendard 로딩, backend-authoritative 홈·그룹 상태 표시, 로그인/온보딩의 layout polish, 그룹 대기실의 bottom safe-area, 그리고 무음 short-video에서 파생한 **JPEG-only 인증 제출**을 포함한다. QA의 목적은 이 visual polish가 기존 인증·온보딩·그룹·리워드 계약을 침해하지 않는지 Android에서 확인하는 것이다.

| 구분 | 현재 상태 | 완료 판단 |
|---|---|---|
| 정적 계약 검사 | PASS | 각 명령이 exit code 0으로 종료되어야 한다. |
| Android bundle export | PASS | `metadata.json`과 Android Hermes bundle이 생성되어야 한다. |
| 실제 기기/에뮬레이터 E2E | DEFERRED | 아래 A–O 체크리스트를 실제 Android 환경에서 수행·기록해야 한다. |
| 인증 transport E2E | `TRANSPORT_E2E_NOT_RERUN` | 유효한 backend, Firebase, signed-URL test fixture가 제공될 때만 재실행한다. |

## B. 빌드 대상과 선행 조건

QA 담당자는 PR merge 후보의 정확한 commit SHA를 기록하고, 연결할 backend 환경과 Firebase test account를 사전에 확보한다. 실제 Wallet, Reward, Group lifecycle의 판단값은 client state가 아니라 backend 응답을 사용하므로, backend fixture 없이 보이는 숫자만으로 성공을 판정해서는 안 된다.

| 필요 항목 | 확인 내용 |
|---|---|
| Android 환경 | 실제 기기 또는 API level이 명시된 emulator, 화면 크기, Android 버전 |
| 인증 | Firebase test user 또는 로그인 가능한 test identity |
| backend | groups, progress, user stats, verification upload-intent가 동작하는 test environment |
| 권한 | camera permission만 허용한다. microphone permission을 요청하면 실패다. |
| 증빙 | 화면 녹화 또는 스크린샷, API 실패 시 timestamp와 error code |

## C. 설치와 기동

APK 또는 development build를 깨끗한 Android 환경에 설치한다. Cold start, background 복귀, process death 이후 재기동을 각각 한 번 이상 수행한다. Safe-area와 keyboard behavior는 gesture navigation과 three-button navigation에서 모두 확인한다.

> Android export 성공은 native install 성공이나 permission prompt의 정상 동작을 보장하지 않는다. 설치 및 기동은 반드시 기기에서 별도 확인한다.

## D. 시작·로그인 화면

로그인 화면에서 아이디 입력 후 IME의 다음 동작이 비밀번호 field로 이동하는지 확인한다. 비밀번호 입력 중 키보드가 CTA와 오류 문구를 가리지 않는지, 완료 action이 기존 로그인 이동 동작을 보존하는지 확인한다. Google 버튼의 미설정 오류는 기존 안내 문구가 가독성 있게 표시되어야 하며, visual polish가 auth provider나 Firebase credential 동작을 바꾸면 안 된다.

| 시나리오 | 기대 결과 | 결과 |
|---|---|---|
| 세로 화면에서 키보드 표시 | 입력 field·CTA가 가려지지 않는다. | ☐ |
| 아이디 IME `다음` | 비밀번호 field로 focus가 이동한다. | ☐ |
| 로그인 CTA press | pressed feedback 후 기존 navigation만 수행한다. | ☐ |
| 소셜 로그인 미설정 안내 | 오류 문구가 다른 요소와 겹치지 않는다. | ☐ |

## E. 온보딩 Safe Area와 CTA

기본 정보, 습관, 코치 스타일, 라이프스타일 단계를 순서대로 진행한다. 상단 progress와 하단 이전/다음 CTA가 display cutout·navigation bar·IME와 겹치지 않는지 확인한다. 이 QA에서 숫자 validation이나 추천 정책을 새로 판단하지 않으며, 기존 저장 경로와 navigation이 유지되는지만 검증한다.

| 시나리오 | 기대 결과 | 결과 |
|---|---|---|
| 상단 cutout 기기 | STEP·back button·progress가 safe area 안에 있다. | ☐ |
| 하단 gesture 영역 | 두 CTA가 tap 가능하며 system gesture와 겹치지 않는다. | ☐ |
| 습관/코치/라이프스타일 선택 | active border와 누르는 동안의 feedback이 자연스럽고 값이 유지된다. | ☐ |
| 다음/이전 이동 | 기존 화면 순서와 선택 값이 유지된다. | ☐ |

## F. 홈 화면

홈은 `GET /users/me/stats`, `GET /me/groups`, `GET /me/groups/{id}/progress`의 표시 소비자다. Heart, Reward Point, 성공 루틴, streak, 마감, 완주 목표는 모두 backend 응답과 동일한지 확인한다. 하트 획득 이벤트는 현재 준비 중으로 표시되며, 화면이 임의로 잔액을 지급하거나 변경해서는 안 된다.

| 시나리오 | 기대 결과 | 결과 |
|---|---|---|
| 상단 header | `홈`, 28px bold hierarchy, coach button alignment이 일관된다. | ☐ |
| 하트·포인트 카드 | backend stats와 일치하며, 하트 이벤트를 실제 지급 기능처럼 암시하지 않는다. | ☐ |
| 활성 그룹 | 그룹명·마감·진행률·CTA가 실제 progress 응답을 표시한다. | ☐ |
| 그룹 없음 | 그룹 탐색 CTA가 표시되고 인증 flow로 잘못 진입하지 않는다. | ☐ |

## G. 탐색과 그룹 참가

탐색의 목록·모집 상태·정원·참가 가능 여부는 public group API 결과와 일치해야 한다. 부족한 Heart, full group, 이미 참가한 group 등의 conflict는 client 계산이 아니라 backend error code에 맞는 메시지를 보여야 한다. QA 중 Heart 또는 Reward Point를 수동으로 증감시키지 않는다.

| 시나리오 | 기대 결과 | 결과 |
|---|---|---|
| 검색·필터 | 서버가 제공한 목록을 표시용으로만 좁힌다. | ☐ |
| 일반 참가 | 성공 후 서버 갱신된 stats와 group 상태를 다시 읽는다. | ☐ |
| 하트 부족 | local 잔액 차감/가산 없이 backend 오류 안내가 보인다. | ☐ |
| 정원 마감/충돌 | 재시도·새로고침 안내가 보이며 가짜 성공 화면이 없다. | ☐ |

## H. 내 그룹과 lifecycle 상태

내 그룹 화면에서는 `DRAFT`, `RECRUITING`, `FULL`, `ACTIVE`, `COMPLETED`, `CANCELLED`, `EXPIRED`가 사람이 읽을 수 있는 label로 표시되어야 한다. `ACTIVE`이고 schedule day를 계산할 수 있을 때에만 `DAY n` 표기가 우선한다. 실제 lifecycle transition은 backend와 데이터 fixture가 authority이며, 프런트엔드가 상태를 생성하거나 변경하면 안 된다.

| 시나리오 | 기대 결과 | 결과 |
|---|---|---|
| header/coach | 다른 탭과 동일한 28px bold header inset과 coach alignment를 유지한다. | ☐ |
| pending 인증 | `todayVerificationPending`이면 검토 안내만 보이고 중복 인증 CTA가 없다. | ☐ |
| 완료 인증 | 완료 상태와 count/streak이 backend progress와 일치한다. | ☐ |
| 시작 전 leave/cancel | 지원되는 경우만 노출되며 API 결과 후 stats를 재조회한다. | ☐ |
| 시작 후 leave/cancel | backend conflict를 정확히 안내하고 local state를 성공으로 바꾸지 않는다. | ☐ |

## I. 그룹 생성·대기실 layout

기존 group flow의 UI state와 navigation을 확인하되, 이 screen의 mock/local flow를 production business truth로 승인해서는 안 된다. 이번 baseline에서 검증할 visual 항목은 28px header hierarchy와 waiting-room CTA의 bottom safe area다.

| 시나리오 | 기대 결과 | 결과 |
|---|---|---|
| 그룹 flow header | title과 back button이 잘리지 않고 hierarchy가 유지된다. | ☐ |
| 대기실 하단 CTA | gesture/navigation bar와 겹치지 않으며 tap 가능하다. | ☐ |
| 화면 회전/작은 기기 | footer가 scroll content와 겹치거나 사라지지 않는다. | ☐ |

## J. 인증 카메라 권한과 촬영

인증 흐름은 camera permission만 요구해야 한다. 무음으로 짧은 영상을 촬영하는 것은 UI framing 목적이며, video file은 transient local artifact다. 카메라 권한 거부, 재시도, 화면 back 동작을 각각 검증한다.

| 시나리오 | 기대 결과 | 결과 |
|---|---|---|
| 첫 진입 | 카메라 권한만 요청한다. microphone prompt가 보이면 실패다. | ☐ |
| 촬영 | preview로 이동하며 무음 video preview가 재생된다. | ☐ |
| 재촬영 | `videoUri`, JPEG media, outcome이 함께 reset되고 camera로 돌아간다. | ☐ |
| 화면 이탈 | stale preview가 camera/Loading navigation과 경쟁하지 않는다. | ☐ |

## K. 인증 preview·loading·result

`인증하기`를 누르면 Preview는 곧바로 Loading으로 이동하고, Loading 진입 뒤 transient local video만 정리한다. JPEG media는 upload-intent, signed PUT, submit 재시도에 필요한 동안 유지된다. network request 본문과 signed PUT의 content type은 `image/jpeg` 또는 `image/png`만 허용된다.

| 시나리오 | 기대 결과 | 결과 |
|---|---|---|
| Preview → submit | camera redirect race 없이 Loading으로 한 번만 이동한다. | ☐ |
| upload source | local `.mp4`가 upload-intent·PUT·submit 대상으로 사용되지 않는다. | ☐ |
| 실패/재시도 | JPEG artifact를 이용해 기존 retry flow가 작동한다. | ☐ |
| result | backend final result만 표시하며 `verifiedToday` 같은 local 승인 상태를 만들지 않는다. | ☐ |

## L. 리워드·마이 페이지

리워드 point, Heart, 성공 루틴은 모두 stats API에서 온 값을 표시한다. 리워드 카탈로그와 교환 기능은 아직 준비 중이므로 mock redemption, point 차감, local balance mutation이 발생하면 실패다. 각 탭은 동일한 28px bold header scale과 30px horizontal rhythm을 유지한다.

| 시나리오 | 기대 결과 | 결과 |
|---|---|---|
| 리워드 | 보유 point는 backend stats와 일치하며 준비 중 상태가 명확하다. | ☐ |
| 마이 | profile/stats 값이 실제 응답과 일치하고 logout confirmation이 정상이다. | ☐ |
| visual system | header, 카드, CTA, icon, text hierarchy가 탭 간에 일관된다. | ☐ |

## M. 오류·네트워크·새로고침

네트워크를 끊거나 API fixture에서 401/409/404를 유도해 사용자 메시지를 확인한다. 오류 상황에서도 optimistic Heart/Point 변동, fake verification approval, fake ranking, 임의 group transition이 없어야 한다. pull-to-refresh 뒤 서버 값으로 화면이 복구되는지 확인한다.

| 상황 | 기대 결과 | 결과 |
|---|---|---|
| 401 | 기존 refresh/retry 계약을 사용하며 로그인 상태가 일관된다. | ☐ |
| 409 / insufficient Heart | backend 결정에 맞는 안내만 표시한다. | ☐ |
| 네트워크 오류 | 재시도 UI가 표시되고 local success로 전환하지 않는다. | ☐ |
| refresh | stats·groups·progress가 서버 값으로 다시 렌더링된다. | ☐ |

## N. 자동 검증 기록

다음 검사는 `feature/final-ui-polish`에서 실행되어 성공했다. 이 결과는 source·bundle 검증이며, Android runtime test 결과가 아니다.

| 명령 | 결과 |
|---|---|
| `npm ci` | PASS. lockfile 기준 dependency install 완료. |
| `node src/services/api.check.mjs` | PASS — `api 401 refresh retry OK` |
| `node src/stores/onboardingStore.check.mjs` | PASS — `onboarding mapping OK` |
| `node scripts/canonical-font.check.mjs` | PASS — `canonical Expo font setup OK` |
| `node scripts/video-frame-verification.check.mjs` | PASS — `video frame verification boundary OK` |
| `node /home/ubuntu/work/allog-final-audit/token-consistency-audit.mjs .` | PASS — color/radius/alias mismatch 없음 |
| backend-authority·secret drift scan | PASS — 금지된 추가 패턴 없음 |
| `npx expo export --platform android --clear --output-dir dist-final-ui` | PASS — Android Hermes bundle 및 `metadata.json` 생성 |
| `git diff --check` | PASS |

## O. QA 결과 기록과 sign-off

QA 종료 시 아래 표를 작성하고 evidence link 또는 파일 경로를 첨부한다. 하나라도 FAIL 또는 BLOCKED이면 APK rollout 승인 대신 issue를 생성하고, reproduction step·device·app SHA·backend response를 함께 기록한다. 모든 항목이 실제 환경에서 PASS로 채워지기 전까지 본 문서의 status는 `DEFERRED_TO_PRE_APK_ANDROID_QA`다.

| 필드 | 기록 |
|---|---|
| 앱 commit SHA | |
| APK/development build 식별자 | |
| Android 기기·버전·navigation mode | |
| backend environment | |
| Firebase test account / fixture | |
| 수행자·일시 | |
| PASS / FAIL / BLOCKED 요약 | |
| evidence 경로 | |
| transport E2E 수행 여부 | `TRANSPORT_E2E_NOT_RERUN` 또는 실제 결과 |
| 최종 결정 | `APPROVED_FOR_APK_QA` / `BLOCKED` |

## 안전 경계 요약

- Video capture는 local-only이며 network upload 대상은 JPEG/PNG frame뿐이다.
- Microphone permission, `video/mp4` upload, local `verifiedToday`, local Heart/Point 지급·차감은 허용되지 않는다.
- Group lifecycle, completion, deadline, reward, Heart balance의 최종 판단은 backend authority다.
- 이번 문서는 Android device E2E를 완료했다고 주장하지 않는다.
