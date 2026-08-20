# ALLOG API 명세서 v1.0

- 상태: 확정
- 작성일: 2026-08-14
- 대상: ALLOG MVP
- Base URL: `/api/v1`
- 인증: ALLOG Access Token

> 이 문서는 ALLOG 프론트엔드와 백엔드 사이의 MVP API 계약서다. MVP 제외 기능은 부록 A에 기록하며 본문 API의 동작은 하나로 고정한다.

---

# 0. 공통 계약

## 0.1 인증

- 공개 API로 표시된 API를 제외한 모든 요청은 `Authorization: Bearer <ALLOG Access Token>` 헤더가 필요하다.
- 백엔드는 서명·issuer·만료를 검증하고 token subject의 내부 `userId`로 사용자를 식별한다.
- 회원가입과 로그인은 아이디·비밀번호만 사용한다. 전화번호·SMS·OTP 인증 경로는 없다.
- 인증 실패는 `401 UNAUTHORIZED`를 반환한다.

### 회원가입

- `POST /api/v1/auth/signup` (공개 API)
- `loginId`: trim/lowercase 정규화, 영문 소문자·숫자·underscore, 4~32자
- `password`: 8~72자. 응답과 token에는 포함되지 않는다.

```json
{ "loginId": "alloguser", "password": "judge-copyable-password" }
```

성공 시 `201 Created`:

```json
{ "accessToken": "...", "tokenType": "Bearer", "expiresInSeconds": 86400 }
```

중복 아이디는 `409 LOGIN_ID_ALREADY_EXISTS`, 입력 오류는 `400 VALIDATION_ERROR`다.

### 로그인

- `POST /api/v1/auth/login` (공개 API)
- 요청·성공 응답 형식은 회원가입과 같다.
- 존재하지 않는 아이디와 틀린 비밀번호는 모두 `401 INVALID_CREDENTIALS`와 같은 일반 메시지를 반환한다.

## 0.2 요청 및 응답

- 기본 Content-Type은 `application/json`이다. 인증 영상 제출과 재업로드만 `multipart/form-data`를 사용한다.
- 필수 필드 누락 또는 형식 오류는 `400 VALIDATION_ERROR`를 반환한다.
- 명세에 없는 요청 필드는 `400 UNKNOWN_FIELD`를 반환한다.
- 선택 필드는 생략할 수 있다. 값을 명시적으로 비울 수 있는 필드만 `null`을 허용한다.
- 응답에는 정의된 필드를 항상 포함한다. 값이 없는 nullable 필드는 `null`, 빈 목록은 `[]`로 반환한다.
- 빈 문자열과 `null`을 혼용하지 않는다.

## 0.3 오류 형식

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값을 확인해 주세요.",
    "details": [{ "field": "capacity", "reason": "2 이상 10 이하로 입력해야 합니다." }]
  }
}
```

| HTTP | 의미 |
|---:|---|
| 200 | 조회·수정 성공 |
| 201 | 생성 성공 |
| 202 | 비동기 요청 접수 |
| 204 | 응답 본문 없는 성공 |
| 400 | 요청 검증 실패 |
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 404 | 리소스 없음 |
| 409 | 현재 상태와 충돌 |
| 413 | 업로드 크기 초과 |
| 415 | 지원하지 않는 미디어 형식 |

## 0.4 이름과 enum

- ID는 `userId`, `groupId`, `verificationId`, `rewardId`, `reportId`처럼 대상을 포함한다.
- 사용자 표시명은 `nickname`, 그룹명은 `groupName`, 일반 제목은 `title`을 사용한다.
- 프로필 이미지는 `profileImageUrl`, 인증 이미지·영상은 `mediaUrl`을 사용한다.
- `etcText`는 `reasonId=etc`일 때만 사용하고 일반 설명은 `description`을 사용한다.
- 모든 enum은 영문 소문자 `lower_snake_case` 고정값이다.

| enum | 값 |
|---|---|
| `gender` | `female`, `male` |
| `interestRoutine` | `water_care`, `exercise`, `meal`, `sleep` |
| `coachStyle` | `supportive`, `pressuring`, `fact_based`, `humorous` |
| `visibility` | `public`, `private` |
| `groupStatus` | `recruiting`, `active`, `completed`, `cancelled` |
| `verificationStatus` | `processing`, `success`, `retry`, `failed` |
| `voucherStatus` | `available`, `used`, `expired`, `cancelled` |

## 0.5 날짜와 시간

- 서버 저장 및 datetime 응답은 UTC ISO 8601을 사용한다: `2026-08-14T05:00:00Z`.
- 날짜는 `YYYY-MM-DD`, 시간은 `HH:mm:ss`, 기간은 정수 일수로 반환한다.
- 서비스의 일일 정책 기준 시간대는 `Asia/Seoul`이다.
- `2시간 전`, `D-2`, `8.10~8.24` 같은 표시 문자열은 프론트에서 생성한다.

## 0.6 페이지네이션

- 목록 API 기본값은 `page=1`, `size=20`, 최대 `size=100`이다.
- 잘못된 값은 `400 INVALID_PAGINATION`을 반환한다.

```json
{
  "items": [],
  "pagination": { "page": 1, "size": 20, "totalItems": 0, "totalPages": 0, "hasNext": false }
}
```

## 0.7 멱등성

- GET은 같은 상태에서 같은 결과를 반환한다. PATCH는 같은 값을 반복 적용해도 성공한다. 이미 삭제된 리소스의 DELETE는 `204`를 반환한다.
- 하트·포인트·재고·쿠폰처럼 자산을 변경하는 POST는 `Idempotency-Key` 헤더가 필수다. 같은 키의 재요청에는 최초 성공 응답을 반환한다.
- 동일 대상 일일 응원은 `409 ALREADY_CHEERED_TODAY`, 이벤트 중복 수령은 `409 ALREADY_CLAIMED`를 반환한다.
- 동일 인증에 처리 중인 재인증 요청 또는 동일 신고가 있으면 중복 생성하지 않는다.

## 0.8 삭제 사용자

과거 인증·랭킹·신고 기록의 참조 ID는 유지하고 개인정보만 익명화한다.

```json
{ "userId": "deleted_u2", "nickname": "탈퇴한 사용자", "profileImageUrl": null, "deletedUser": true }
```

---

# 1. 사용자와 온보딩

## 내 프로필 조회

### 1. 기본 정보
- Method / Path: `GET /api/v1/users/me`
- 목적: 로그인 사용자의 프로필·온보딩·자산 정보를 조회한다.
- 호출 시점: 로그인 직후와 마이페이지 진입 시. 신규 사용자는 `404 PROFILE_NOT_FOUND`로 온보딩 여부를 판별한다.
- 인증: 필수
- Content-Type: 없음
- 중복 호출 정책: 동일 상태의 프로필을 반환한다.

### 2. Path 파라미터
없음

### 3. Query 파라미터
없음

### 4. 요청 Body
없음

### 5. 요청 예시
`GET /api/v1/users/me`

### 6. 성공 응답
`200 OK`

```json
{
  "userId": "u1",
  "nickname": "민지",
  "gender": "female",
  "birthDate": "2000-07-30",
  "heightCm": 165,
  "weightKg": 50,
  "profileImageUrl": null,
  "onboarding": {
    "interestRoutines": ["water_care", "exercise"],
    "coachStyle": "supportive",
    "averageSleepHours": 7,
    "exerciseDaysPerWeek": 3,
    "mealsPerDay": 3,
    "preferredGroupDurationDays": 7
  },
  "stats": { "hearts": 3, "rewardPoints": 1540, "successfulRoutines": 13 }
}
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `userId` | string | X | 사용자 ID |
| `nickname` | string | X | 닉네임 |
| `gender` | enum | O | 선택 입력 성별 |
| `birthDate` | string(date) | O | 선택 입력 생년월일 |
| `heightCm` | number | O | 선택 입력 키(cm) |
| `weightKg` | number | O | 선택 입력 몸무게(kg) |
| `profileImageUrl` | string(url) | O | 프로필 이미지 |
| `onboarding` | object | X | 온보딩 정보 |
| `stats` | object | X | 현재 하트·포인트·성공 루틴 수 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 401 | `UNAUTHORIZED` | 토큰 검증 실패 |
| 404 | `PROFILE_NOT_FOUND` | 계정은 있으나 프로필 미생성 |

### 9. 중복 호출 처리
조회 API이므로 동일 데이터를 반환한다.

## 프로필 및 온보딩 생성

### 1. 기본 정보
- Method / Path: `POST /api/v1/users`
- 목적: 기본정보와 온보딩 정보를 저장하고 최초 하트 3개를 지급한다.
- 호출 시점: 온보딩 완료 버튼 선택 시
- 인증: 필수
- Content-Type: `application/json`
- 중복 호출 정책: 동일 인증 사용자에게 프로필이 있으면 `409 PROFILE_ALREADY_EXISTS`; `Idempotency-Key` 재요청은 최초 성공 응답을 반환한다.

### 2. Path 파라미터
없음

### 3. Query 파라미터
없음

### 4. 요청 Body
| 필드 | 타입 | 필수 | Nullable | 설명 |
|---|---|---:|---:|---|
| `nickname` | string | O | X | 닉네임 |
| `gender` | enum | X | O | 성별 |
| `birthDate` | string(date) | X | O | 생년월일 |
| `heightCm` | number | X | O | 키(cm) |
| `weightKg` | number | X | O | 몸무게(kg) |
| `onboarding.interestRoutines` | enum[] | O | X | 1개 이상 복수 선택 |
| `onboarding.coachStyle` | enum | O | X | 4개 스타일 중 하나 |
| `onboarding.averageSleepHours` | number | O | X | 평균 수면시간 |
| `onboarding.exerciseDaysPerWeek` | integer | O | X | 0~7 |
| `onboarding.mealsPerDay` | integer | O | X | 하루 식사 횟수 |
| `onboarding.preferredGroupDurationDays` | integer | O | X | `7`, `14`, `30` 중 하나 |

### 5. 요청 예시
```json
{
  "nickname": "민지",
  "gender": "female",
  "birthDate": "2000-07-30",
  "heightCm": 165,
  "weightKg": 50,
  "onboarding": {
    "interestRoutines": ["water_care", "exercise"],
    "coachStyle": "supportive",
    "averageSleepHours": 7,
    "exerciseDaysPerWeek": 3,
    "mealsPerDay": 3,
    "preferredGroupDurationDays": 7
  }
}
```

### 6. 성공 응답
`201 Created` — 내 프로필 조회와 같은 구조를 반환한다.

### 7. 응답 필드
내 프로필 조회 응답 필드와 같다.

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 400 | `VALIDATION_ERROR` | enum, 범위 또는 필수 필드 오류 |
| 401 | `UNAUTHORIZED` | 토큰 검증 실패 |
| 409 | `PROFILE_ALREADY_EXISTS` | 이미 생성된 프로필 |

### 9. 중복 호출 처리
자산 지급이 포함되므로 `Idempotency-Key`를 사용하며 온보딩 하트는 계정당 한 번만 지급한다.

## 내 프로필 수정

### 1. 기본 정보
- Method / Path: `PATCH /api/v1/users/me`
- 목적: 기본정보 또는 온보딩 선호 정보를 부분 수정한다.
- 호출 시점: 프로필 편집 저장 시
- 인증: 필수
- Content-Type: `application/json`
- 중복 호출 정책: 같은 값의 반복 요청은 갱신된 동일 프로필을 반환한다.

### 2. Path 파라미터
없음

### 3. Query 파라미터
없음

### 4. 요청 Body
프로필 생성 필드 중 변경할 필드만 보낸다. `gender`, `birthDate`, `heightCm`, `weightKg`, `profileImageUrl`은 `null`로 초기화할 수 있다.

### 5. 요청 예시
```json
{ "nickname": "민지2", "heightCm": null, "onboarding": { "preferredGroupDurationDays": 14 } }
```

### 6. 성공 응답
`200 OK` — 갱신된 전체 프로필을 반환한다.

### 7. 응답 필드
내 프로필 조회 응답 필드와 같다.

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 400 | `VALIDATION_ERROR` | 값 또는 범위 오류 |
| 401 | `UNAUTHORIZED` | 토큰 검증 실패 |
| 404 | `PROFILE_NOT_FOUND` | 프로필 없음 |

### 9. 중복 호출 처리
동일 값을 반복 적용해도 `200`을 반환한다.

## 회원 탈퇴 요청

### 1. 기본 정보
- Method / Path: `POST /api/v1/users/me/deletion-request`
- 목적: 계정 탈퇴와 개인정보 삭제·익명화 작업을 비동기로 접수한다.
- 호출 시점: 회원 탈퇴 최종 확인 시
- 인증: 필수
- Content-Type: `application/json`
- 중복 호출 정책: 처리 중 요청이 있으면 기존 요청을 반환한다.

### 2. Path 파라미터
없음

### 3. Query 파라미터
없음

### 4. 요청 Body
| 필드 | 타입 | 필수 | Nullable | 설명 |
|---|---|---:|---:|---|
| `reason` | enum | O | X | 탈퇴 사유 |
| `etcText` | string | X | O | `reason=etc`일 때 필수 |

### 5. 요청 예시
```json
{ "reason": "not_using", "etcText": null }
```

### 6. 성공 응답
`202 Accepted`
```json
{ "requestId": "del_123", "status": "requested", "requestedAt": "2026-08-14T05:00:00Z" }
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `requestId` | string | X | 탈퇴 요청 ID |
| `status` | enum | X | `requested`, `processing`, `completed`, `rejected` |
| `requestedAt` | string(datetime) | X | 접수 시각 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 400 | `VALIDATION_ERROR` | 사유 입력 오류 |
| 401 | `UNAUTHORIZED` | 토큰 검증 실패 |
| 409 | `ACTIVE_GROUP_EXISTS` | 처리할 수 없는 활성 그룹 관계 존재 |

### 9. 중복 호출 처리
처리 중인 요청이 있으면 새로 만들지 않고 `202`와 기존 요청을 반환한다.

---

# 2. 그룹

## 그룹 목록 조회

### 1. 기본 정보
- Method / Path: `GET /api/v1/groups`
- 목적: 내 그룹 또는 공개 그룹을 탐색한다.
- 호출 시점: 홈·내 그룹·탐색 화면 진입 시
- 인증: 필수
- Content-Type: 없음
- 중복 호출 정책: 동일 조건의 현재 목록을 반환한다.

### 2. Path 파라미터
없음

### 3. Query 파라미터
| 필드 | 타입 | 필수 | 기본값 | 설명 |
|---|---|---:|---|---|
| `membership` | enum | X | 없음 | `me`이면 내 그룹만 조회 |
| `category` | enum | X | 없음 | 관심 카테고리 |
| `durationDays` | integer | X | 없음 | `7`, `14`, `30` |
| `status` | enum | X | 없음 | 그룹 상태 |
| `q` | string | X | 없음 | 그룹명 검색어 |
| `page` | integer | X | `1` | 페이지 |
| `size` | integer | X | `20` | 페이지 크기 |

### 4. 요청 Body
없음

### 5. 요청 예시
`GET /api/v1/groups?category=water_care&status=recruiting&page=1&size=20`

### 6. 성공 응답
`200 OK`
```json
{
  "items": [{
    "groupId": "g12", "groupName": "매일 물 2L 마시기", "category": "water_care",
    "visibility": "public", "status": "recruiting", "memberCount": 4, "capacity": 5,
    "startDate": "2026-08-15", "endDate": "2026-08-28", "durationDays": 14, "heartCost": 1
  }],
  "pagination": { "page": 1, "size": 20, "totalItems": 1, "totalPages": 1, "hasNext": false }
}
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `items[].groupId` | string | X | 그룹 ID |
| `items[].groupName` | string | X | 그룹명 |
| `items[].category` | enum | X | 그룹 카테고리 |
| `items[].visibility` | enum | X | 공개 범위 |
| `items[].status` | enum | X | 그룹 상태 |
| `items[].memberCount` | integer | X | 현재 인원 |
| `items[].capacity` | integer | X | 정원 |
| `items[].startDate` | string(date) | X | 시작일 |
| `items[].endDate` | string(date) | X | 종료일 |
| `items[].durationDays` | integer | X | 실제 진행 기간 |
| `items[].heartCost` | integer | X | 참가 비용 |
| `pagination` | object | X | 페이지 정보 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 400 | `INVALID_PAGINATION` | 페이지 값 오류 |
| 400 | `VALIDATION_ERROR` | 필터 값 오류 |
| 401 | `UNAUTHORIZED` | 토큰 검증 실패 |

### 9. 중복 호출 처리
조회 API이므로 현재 목록을 반환한다.

## 그룹 상세 조회

### 1. 기본 정보
- Method / Path: `GET /api/v1/groups/{groupId}`
- 목적: 그룹 상세·진행 현황과 정책을 조회한다.
- 호출 시점: 그룹 상세 또는 내 그룹 진입 시
- 인증: 필수
- Content-Type: 없음
- 중복 호출 정책: 현재 상세를 반환한다.

### 2. Path 파라미터
| 필드 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `groupId` | string | O | 그룹 ID |

### 3. Query 파라미터
없음

### 4. 요청 Body
없음

### 5. 요청 예시
`GET /api/v1/groups/g1`

### 6. 성공 응답
`200 OK`
```json
{
  "groupId": "g1", "groupName": "하루 운동 30분", "category": "exercise",
  "visibility": "public", "status": "active", "ownerUserId": "u1",
  "memberCount": 5, "capacity": 5, "startDate": "2026-08-10", "endDate": "2026-08-24",
  "durationDays": 14, "dayNumber": 5, "verifiedTodayCount": 2,
  "successRate": 87, "goalRate": 80, "inviteCode": "7XQK92",
  "rankingEnabled": true, "rankingRewardEnabled": true,
  "verificationStartTime": "00:00:00", "verificationEndTime": "23:59:59", "timeZone": "Asia/Seoul"
}
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `groupId`, `ownerUserId` | string | X | 그룹·방장 ID |
| `groupName` | string | X | 그룹명 |
| `category`, `visibility`, `status` | enum | X | 분류·공개 범위·상태 |
| `memberCount`, `capacity` | integer | X | 현재 인원·정원 |
| `startDate`, `endDate` | string(date) | X | 진행 시작·종료일 |
| `durationDays`, `dayNumber` | integer | X | 진행 기간·현재 일차 |
| `verifiedTodayCount` | integer | X | 오늘 인증 완료 인원 |
| `successRate`, `goalRate` | number | X | 성공률·목표율(0~100) |
| `inviteCode` | string | O | 참가 코드 |
| `rankingEnabled`, `rankingRewardEnabled` | boolean | X | 랭킹·보상 활성 여부 |
| `verificationStartTime`, `verificationEndTime` | string(time) | X | 일일 인증 가능 시간 |
| `timeZone` | string | X | 그룹 시간대 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 401 | `UNAUTHORIZED` | 토큰 검증 실패 |
| 403 | `GROUP_ACCESS_DENIED` | 비공개 그룹 접근 권한 없음 |
| 404 | `GROUP_NOT_FOUND` | 그룹 없음 |

### 9. 중복 호출 처리
조회 API이므로 현재 상세를 반환한다.

## 그룹 생성

### 1. 기본 정보
- Method / Path: `POST /api/v1/groups`
- 목적: 새 그룹을 생성한다. 생성 자체에는 하트를 사용하지 않는다.
- 호출 시점: 그룹 만들기 완료 시
- 인증: 필수
- Content-Type: `application/json`
- 중복 호출 정책: `Idempotency-Key`가 필수이며 같은 키에는 최초 생성 응답을 반환한다.

### 2. Path 파라미터
없음

### 3. Query 파라미터
없음

### 4. 요청 Body
| 필드 | 타입 | 필수 | Nullable | 설명 |
|---|---|---:|---:|---|
| `category` | enum | O | X | 카테고리 |
| `groupName` | string | O | X | 그룹명 |
| `durationDays` | integer | O | X | 이번 그룹 실제 기간 `7`, `14`, `30` |
| `capacity` | integer | O | X | 정원 2~10 |
| `visibility` | enum | O | X | `public`, `private` |
| `startDate` | string(date) | O | X | 시작일 |

### 5. 요청 예시
```json
{ "category": "exercise", "groupName": "매일 운동하기", "durationDays": 14, "capacity": 5, "visibility": "public", "startDate": "2026-08-15" }
```

### 6. 성공 응답
`201 Created` — 그룹 상세 구조를 반환한다.

### 7. 응답 필드
그룹 상세 조회 응답 필드와 같다.

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 400 | `VALIDATION_ERROR` | 기간·정원·시작일 오류 |
| 401 | `UNAUTHORIZED` | 토큰 검증 실패 |

### 9. 중복 호출 처리
동일 `Idempotency-Key`에는 최초 생성 결과를 반환한다.

## 그룹 수정

### 1. 기본 정보
- Method / Path: `PATCH /api/v1/groups/{groupId}`
- 목적: 모집 중인 그룹의 이름·정원·공개 범위를 수정한다.
- 호출 시점: 방장이 그룹 설정을 저장할 때
- 인증: 필수, 방장만 가능
- Content-Type: `application/json`
- 중복 호출 정책: 같은 값 반복 요청은 동일 결과를 반환한다.

### 2. Path 파라미터
| 필드 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `groupId` | string | O | 그룹 ID |

### 3. Query 파라미터
없음

### 4. 요청 Body
| 필드 | 타입 | 필수 | Nullable | 설명 |
|---|---|---:|---:|---|
| `groupName` | string | X | X | 변경 그룹명 |
| `capacity` | integer | X | X | 현재 인원 이상, 최대 10 |
| `visibility` | enum | X | X | 공개 범위 |

### 5. 요청 예시
```json
{ "groupName": "퇴근 후 30분 걷기", "capacity": 6, "visibility": "private" }
```

### 6. 성공 응답
`200 OK` — 갱신된 그룹 상세를 반환한다.

### 7. 응답 필드
그룹 상세 조회 응답 필드와 같다.

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 400 | `CAPACITY_BELOW_MEMBER_COUNT` | 정원이 현재 인원보다 작음 |
| 403 | `GROUP_OWNER_REQUIRED` | 방장이 아님 |
| 404 | `GROUP_NOT_FOUND` | 그룹 없음 |
| 409 | `GROUP_ALREADY_STARTED` | 시작 후 수정 불가 필드 요청 |

### 9. 중복 호출 처리
동일 값을 반복 적용해도 `200`을 반환한다.

## 그룹 삭제 또는 취소

### 1. 기본 정보
- Method / Path: `DELETE /api/v1/groups/{groupId}`
- 목적: 모집 중 빈 그룹을 삭제하거나 시작한 그룹을 취소 상태로 전환한다.
- 호출 시점: 방장이 그룹 삭제를 확정할 때
- 인증: 필수, 방장만 가능
- Content-Type: 없음
- 중복 호출 정책: 이미 삭제·취소된 그룹은 `204`를 반환한다.

### 2. Path 파라미터
| 필드 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `groupId` | string | O | 그룹 ID |

### 3. Query 파라미터
없음

### 4. 요청 Body
없음

### 5. 요청 예시
`DELETE /api/v1/groups/g1`

### 6. 성공 응답
- 기록이 없는 모집 그룹: `204 No Content`
- 시작했거나 기록이 있는 그룹: `200 OK`
```json
{ "groupId": "g1", "status": "cancelled", "refundedMemberCount": 4 }
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `groupId` | string | X | 취소 그룹 ID |
| `status` | enum | X | `cancelled` |
| `refundedMemberCount` | integer | X | 참가 하트를 돌려받은 인원 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 403 | `GROUP_OWNER_REQUIRED` | 방장이 아님 |
| 404 | `GROUP_NOT_FOUND` | 그룹 없음 |

### 9. 중복 호출 처리
이미 삭제·취소된 경우 추가 환불 없이 `204`를 반환한다.

## 공개 그룹 참가

### 1. 기본 정보
- Method / Path: `POST /api/v1/groups/{groupId}/join`
- 목적: 모집 중인 공개 그룹에 참가하고 하트 1개를 차감한다.
- 호출 시점: 공개 그룹 상세의 참가 버튼 선택 시
- 인증: 필수
- Content-Type: `application/json`
- 중복 호출 정책: `Idempotency-Key` 필수. 이미 참가 중이면 추가 차감 없이 `409 ALREADY_MEMBER`를 반환한다.

### 2. Path 파라미터
| 필드 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `groupId` | string | O | 참가할 그룹 ID |

### 3. Query 파라미터
없음

### 4. 요청 Body
없음

### 5. 요청 예시
```http
POST /api/v1/groups/g1/join
Authorization: Bearer <ALLOG Access Token>
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
```

### 6. 성공 응답
`200 OK`
```json
{ "groupId": "g1", "groupName": "하루 운동 30분", "membershipStatus": "active", "joinedAt": "2026-08-14T05:00:00Z", "heartCost": 1, "remainingHearts": 2 }
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `groupId` | string | X | 그룹 ID |
| `groupName` | string | X | 그룹명 |
| `membershipStatus` | enum | X | `active` |
| `joinedAt` | string(datetime) | X | 참가 시각 |
| `heartCost` | integer | X | 차감한 하트 |
| `remainingHearts` | integer | X | 참가 후 잔액 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 404 | `GROUP_NOT_FOUND` | 그룹 없음 |
| 409 | `ALREADY_MEMBER` | 이미 참가 중 |
| 409 | `GROUP_FULL` | 정원 마감 |
| 409 | `GROUP_NOT_RECRUITING` | 모집 상태가 아님 |
| 409 | `NOT_ENOUGH_HEARTS` | 하트 부족 |

### 9. 중복 호출 처리
같은 멱등 키는 최초 성공 응답을 반환하며 어떤 경우에도 하트를 두 번 차감하지 않는다.

## 초대 코드로 그룹 참가

### 1. 기본 정보
- Method / Path: `POST /api/v1/groups/join-by-code`
- 목적: 초대 코드로 그룹에 참가하고 하트 1개를 차감한다.
- 호출 시점: 코드 참가 화면 제출 시
- 인증: 필수
- Content-Type: `application/json`
- 중복 호출 정책: 공개 그룹 참가와 동일하다.

### 2. Path 파라미터
없음

### 3. Query 파라미터
없음

### 4. 요청 Body
| 필드 | 타입 | 필수 | Nullable | 설명 |
|---|---|---:|---:|---|
| `inviteCode` | string | O | X | 6자리 초대 코드 |

### 5. 요청 예시
```json
{ "inviteCode": "7XQK92" }
```

### 6. 성공 응답
`200 OK` — 공개 그룹 참가와 같은 응답을 반환한다.

### 7. 응답 필드
공개 그룹 참가 응답 필드와 같다.

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 404 | `INVALID_INVITE_CODE` | 유효한 코드가 아님 |
| 409 | `ALREADY_MEMBER` | 이미 참가 중 |
| 409 | `GROUP_FULL` | 정원 마감 |
| 409 | `NOT_ENOUGH_HEARTS` | 하트 부족 |

### 9. 중복 호출 처리
`Idempotency-Key`를 사용하며 하트를 중복 차감하지 않는다.

## 그룹 나가기

### 1. 기본 정보
- Method / Path: `DELETE /api/v1/groups/{groupId}/members/me`
- 목적: 그룹 멤버십을 종료한다.
- 호출 시점: 그룹 나가기 최종 확인 시
- 인증: 필수
- Content-Type: 없음
- 중복 호출 정책: 이미 나간 경우 `204`를 반환한다.

### 2. Path 파라미터
| 필드 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `groupId` | string | O | 그룹 ID |

### 3. Query 파라미터
없음

### 4. 요청 Body
없음

### 5. 요청 예시
`DELETE /api/v1/groups/g1/members/me`

### 6. 성공 응답
`200 OK`
```json
{ "groupId": "g1", "left": true, "heartRefunded": false }
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `groupId` | string | X | 그룹 ID |
| `left` | boolean | X | 탈퇴 완료 여부 |
| `heartRefunded` | boolean | X | 하트 반환 여부. 자발적 탈퇴는 항상 `false` |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 404 | `MEMBERSHIP_NOT_FOUND` | 소속되지 않은 그룹 |
| 409 | `OWNER_CANNOT_LEAVE` | 방장 권한 위임 또는 그룹 취소 필요 |

### 9. 중복 호출 처리
이미 나간 경우 추가 변경 없이 `204`를 반환한다.

## 오늘 인증 피드 조회

### 1. 기본 정보
- Method / Path: `GET /api/v1/groups/{groupId}/feed`
- 목적: 그룹 멤버의 오늘 인증 상태와 인증 미디어를 조회한다.
- 호출 시점: 내 그룹 피드 탭 진입 시
- 인증: 필수, 그룹 멤버만 가능
- Content-Type: 없음
- 중복 호출 정책: 현재 피드를 반환한다.

### 2. Path 파라미터
| 필드 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `groupId` | string | O | 그룹 ID |

### 3. Query 파라미터
| 필드 | 타입 | 필수 | 기본값 | 설명 |
|---|---|---:|---|---|
| `date` | string(date) | X | 오늘 | 그룹 시간대 기준 날짜 |
| `page` | integer | X | `1` | 페이지 |
| `size` | integer | X | `20` | 페이지 크기 |

### 4. 요청 Body
없음

### 5. 요청 예시
`GET /api/v1/groups/g1/feed?date=2026-08-14&page=1&size=20`

### 6. 성공 응답
`200 OK`
```json
{
  "items": [
    { "userId": "u1", "nickname": "민지", "profileImageUrl": null, "feedStatus": "not_verified", "verification": null },
    { "userId": "u2", "nickname": "민수", "profileImageUrl": null, "feedStatus": "verified", "verification": { "verificationId": "v31", "mediaUrl": "https://example.com/v31.mp4", "mediaType": "video", "createdAt": "2026-08-14T02:00:00Z" } }
  ],
  "pagination": { "page": 1, "size": 20, "totalItems": 2, "totalPages": 1, "hasNext": false }
}
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `items[].userId` | string | X | 사용자 ID |
| `items[].nickname` | string | X | 닉네임 |
| `items[].profileImageUrl` | string(url) | O | 프로필 이미지 |
| `items[].feedStatus` | enum | X | `not_verified`, `verified`, `waiting` |
| `items[].verification` | object | O | 오늘 인증. 미인증이면 `null` |
| `items[].verification.verificationId` | string | X | 인증 ID |
| `items[].verification.mediaUrl` | string(url) | X | 인증 미디어 URL |
| `items[].verification.mediaType` | enum | X | `image`, `video` |
| `items[].verification.createdAt` | string(datetime) | X | 인증 생성 시각 |
| `pagination` | object | X | 페이지 정보 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 400 | `INVALID_DATE` | 날짜 형식 오류 |
| 403 | `GROUP_ACCESS_DENIED` | 그룹 멤버가 아님 |
| 404 | `GROUP_NOT_FOUND` | 그룹 없음 |

### 9. 중복 호출 처리
조회 API이므로 현재 피드를 반환한다.

## 그룹 랭킹 조회

### 1. 기본 정보
- Method / Path: `GET /api/v1/groups/{groupId}/ranking`
- 목적: 서버가 계산한 그룹 순위와 100점 기준 점수 내역을 조회한다.
- 호출 시점: 그룹 랭킹·결과 화면 진입 시
- 인증: 필수, 그룹 멤버만 가능
- Content-Type: 없음
- 중복 호출 정책: 현재 계산 결과를 반환한다.

### 2. Path 파라미터
| 필드 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `groupId` | string | O | 그룹 ID |

### 3. Query 파라미터
| 필드 | 타입 | 필수 | 기본값 | 설명 |
|---|---|---:|---|---|
| `page` | integer | X | `1` | 페이지 |
| `size` | integer | X | `20` | 페이지 크기 |

### 4. 요청 Body
없음

### 5. 요청 예시
`GET /api/v1/groups/g1/ranking?page=1&size=20`

### 6. 성공 응답
`200 OK`
```json
{
  "items": [{
    "userId": "u1", "nickname": "서준", "rank": 1, "score": 77, "rewardPoints": 300,
    "breakdown": {
      "personalAchievement": { "score": 30, "maxScore": 35, "validCount": 12, "totalCount": 14 },
      "groupAchievement": { "score": 20, "maxScore": 25, "validCount": 56, "totalCount": 70 },
      "streak": { "score": 10, "maxScore": 20, "longestDays": 7, "durationDays": 14 },
      "contribution": { "score": 17, "maxScore": 20, "activeDays": 5, "requiredActiveDays": 7, "uniqueMembersCheered": 3, "targetMemberCount": 3 }
    }
  }],
  "pagination": { "page": 1, "size": 20, "totalItems": 1, "totalPages": 1, "hasNext": false }
}
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `items[].userId`, `items[].nickname` | string | X | 사용자 ID·닉네임 |
| `items[].rank` | integer | X | 서버 계산 dense rank |
| `items[].score` | integer | X | 서버 계산 총점(0~100) |
| `items[].rewardPoints` | integer | X | 지급 포인트. 보상 비활성 그룹은 `0` |
| `items[].breakdown` | object | X | 35·25·20·20점 계산 내역 |
| `pagination` | object | X | 페이지 정보 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 403 | `GROUP_ACCESS_DENIED` | 그룹 멤버가 아님 |
| 404 | `GROUP_NOT_FOUND` | 그룹 없음 |

### 9. 중복 호출 처리
조회 API이다. 프론트는 점수·순위를 재계산하거나 재정렬하지 않는다.

### 점수 계산 정책

공개 그룹의 최종 점수는 서버가 100점 만점으로 계산한다.

- 개인 루틴 달성률: `유효 인증 수 / 전체 예정 인증 수 × 35`
- 그룹 공동 달성률: `그룹 전체 유효 인증 수 / 그룹 전체 예정 인증 수 × 25`
- 연속 성공률: `개인 최장 연속 인증 일수 / durationDays × 20`
- 그룹 기여도: 응원 활동을 기준으로 최대 20점

그룹 기여도 중 활동 점수는 `min(activeDays / ceil(durationDays × 0.5), 1) × 10`, 관계 점수는 `min(uniqueMembersCheered / min(본인 제외 그룹 멤버 수, 3), 1) × 10`이다. 관계 점수의 분모가 0이면 관계 점수는 0이다. 합계를 소수점 첫째 자리에서 반올림해 정수로 저장한다. 본인 응원, 같은 대상에 대한 같은 날 중복 응원, 무효 응원은 제외한다.

동점은 dense rank를 적용한다. 공동 순위 내부 표시는 `score`·개인 달성률·연속 성공률 내림차순, `userId` 오름차순으로 고정한다.

---

# 3. 인증

## 인증 영상 제출

### 1. 기본 정보
- Method / Path: `POST /api/v1/groups/{groupId}/verifications`
- 목적: 오늘의 인증 영상을 제출하고 비동기 검사를 시작한다.
- 호출 시점: 3초 촬영 영상 미리보기에서 제출할 때
- 인증: 필수, 그룹 멤버만 가능
- Content-Type: `multipart/form-data`
- 중복 호출 정책: `Idempotency-Key` 필수. 같은 키는 최초 인증을 반환한다.

### 2. Path 파라미터
| 필드 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `groupId` | string | O | 그룹 ID |

### 3. Query 파라미터
없음

### 4. 요청 Body
| 필드 | 타입 | 필수 | Nullable | 설명 |
|---|---|---:|---:|---|
| `file` | binary | O | X | 앱 카메라로 촬영한 영상 |
| `durationSec` | number | O | X | 클라이언트 측 영상 길이 |

### 5. 요청 예시
```http
Content-Disposition: form-data; name="file"; filename="verification.mp4"
Content-Type: video/mp4
```

### 6. 성공 응답
`201 Created`
```json
{ "verificationId": "v_123", "status": "processing", "attempt": 1, "createdAt": "2026-08-14T05:00:00Z" }
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `verificationId` | string | X | 인증 ID |
| `status` | enum | X | `processing` |
| `attempt` | integer | X | 최초 제출은 `1` |
| `createdAt` | string(datetime) | X | 접수 시각 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 400 | `INVALID_VIDEO_DURATION` | 서버 측 길이가 2.5초 미만 또는 3.5초 초과 |
| 403 | `GROUP_ACCESS_DENIED` | 그룹 멤버가 아님 |
| 409 | `VERIFICATION_ALREADY_SUBMITTED` | 오늘 성공·처리 중 인증 존재 |
| 409 | `VERIFICATION_DEADLINE_PASSED` | 인증 시간 종료 |
| 413 | `VIDEO_FILE_TOO_LARGE` | 10MB 초과 |
| 415 | `UNSUPPORTED_VIDEO_FORMAT` | MP4·MOV·WebM 또는 허용 MIME이 아님 |

### 9. 중복 호출 처리
같은 멱등 키는 같은 인증을 반환하며 동일 날짜에 처리 중인 인증을 중복 생성하지 않는다.

### 인증 영상 정책

- 앱 내 카메라로 3초 촬영하며 갤러리 업로드는 허용하지 않는다.
- 서버 허용 길이는 2.5~3.5초, 최대 크기는 10MB다.
- 허용 MIME은 `video/mp4`, `video/quicktime`, `video/webm`이다.
- MVP는 multipart를 사용한다.

## 인증 결과 조회

### 1. 기본 정보
- Method / Path: `GET /api/v1/verifications/{verificationId}`
- 목적: 비동기 인증 검사 상태와 결과를 폴링한다.
- 호출 시점: 인증 로딩·결과 화면
- 인증: 필수, 본인 또는 허용된 그룹 멤버
- Content-Type: 없음
- 중복 호출 정책: 현재 상태를 반환한다.

### 2. Path 파라미터
| 필드 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `verificationId` | string | O | 인증 ID |

### 3. Query 파라미터
없음

### 4. 요청 Body
없음

### 5. 요청 예시
`GET /api/v1/verifications/v_123`

### 6. 성공 응답
`200 OK`
```json
{
  "verificationId": "v_123", "status": "success",
  "checks": [{ "key": "quality", "passed": true }, { "key": "relevance", "passed": true }, { "key": "duration", "passed": true }, { "key": "duplicate", "passed": true }],
  "feedback": { "streakDays": 3, "bestVerificationHour": 21 },
  "retryGuide": null,
  "resubmissionCountToday": 0, "remainingResubmissionsToday": 5
}
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `verificationId` | string | X | 인증 ID |
| `status` | enum | X | 검사 상태 |
| `checks` | object[] | X | `quality`, `relevance`, `duration`, `duplicate` 검사 |
| `feedback` | object | O | 성공 피드백 |
| `retryGuide` | object | O | 재시도 사유·팁 |
| `resubmissionCountToday` | integer | X | 오늘 재업로드 횟수 |
| `remainingResubmissionsToday` | integer | X | 오늘 남은 재업로드 횟수 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 403 | `VERIFICATION_ACCESS_DENIED` | 조회 권한 없음 |
| 404 | `VERIFICATION_NOT_FOUND` | 인증 없음 |

### 9. 중복 호출 처리
폴링 호출마다 현재 처리 상태를 반환한다.

## 인증 영상 재업로드

### 1. 기본 정보
- Method / Path: `POST /api/v1/verifications/{verificationId}/resubmit`
- 목적: `retry` 판정을 받은 인증 영상을 다시 제출한다.
- 호출 시점: 재촬영 후 제출 시
- 인증: 필수, 인증 소유자만 가능
- Content-Type: `multipart/form-data`
- 중복 호출 정책: `Idempotency-Key` 필수. 같은 영상 요청은 기존 처리 결과를 반환한다.

### 2. Path 파라미터
| 필드 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `verificationId` | string | O | 원본 인증 ID |

### 3. Query 파라미터
없음

### 4. 요청 Body
인증 영상 제출과 같은 `file`, `durationSec` 필드를 사용한다.

### 5. 요청 예시
`POST /api/v1/verifications/v_123/resubmit`

### 6. 성공 응답
`200 OK`
```json
{ "verificationId": "v_123", "attempt": 4, "status": "processing", "resubmissionCountToday": 3, "maxResubmissionsPerDay": 5, "remainingResubmissionsToday": 2 }
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `verificationId` | string | X | 기존 인증 ID |
| `attempt` | integer | X | 최초 제출 포함 누적 시도 번호 |
| `status` | enum | X | `processing` |
| `resubmissionCountToday` | integer | X | 오늘 재업로드 횟수 |
| `maxResubmissionsPerDay` | integer | X | `5` |
| `remainingResubmissionsToday` | integer | X | 오늘 남은 횟수 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 409 | `VERIFICATION_NOT_RETRYABLE` | `retry` 상태가 아님 |
| 409 | `REUPLOAD_LIMIT_EXCEEDED` | 한국시간 기준 하루 5회 초과 |
| 409 | `VERIFICATION_DEADLINE_PASSED` | 인증 마감 이후 |
| 413 | `VIDEO_FILE_TOO_LARGE` | 10MB 초과 |
| 415 | `UNSUPPORTED_VIDEO_FORMAT` | 지원 형식이 아님 |

### 9. 중복 호출 처리
같은 멱등 키는 기존 결과를 반환한다. 최초 제출은 재업로드 횟수에 포함하지 않으며 재업로드는 하루 최대 5회다.

---

# 4. 피드 상호작용과 운영

## 응원 보내기

### 1. 기본 정보
- Method / Path: `POST /api/v1/groups/{groupId}/cheers`
- 목적: 그룹 멤버에게 응원을 보내고 기여도 및 일일 첫 응원 이벤트를 기록한다.
- 호출 시점: 피드의 응원 버튼 선택 시
- 인증: 필수, 그룹 멤버만 가능
- Content-Type: `application/json`
- 중복 호출 정책: 같은 대상에게 같은 한국 날짜에는 한 번만 가능하다.

### 2. Path 파라미터
| 필드 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `groupId` | string | O | 그룹 ID |

### 3. Query 파라미터
없음

### 4. 요청 Body
| 필드 | 타입 | 필수 | Nullable | 설명 |
|---|---|---:|---:|---|
| `targetUserId` | string | O | X | 응원 대상 사용자 ID |

### 5. 요청 예시
```json
{ "targetUserId": "u4" }
```

### 6. 성공 응답
`201 Created`
```json
{ "cheerId": "cheer_123", "targetUserId": "u4", "cheerCount": 5, "heartConsumed": 0, "eventRewardGranted": true }
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `cheerId` | string | X | 응원 ID |
| `targetUserId` | string | X | 대상 사용자 ID |
| `cheerCount` | integer | X | 대상이 오늘 받은 총 응원 수 |
| `heartConsumed` | integer | X | 항상 `0` |
| `eventRewardGranted` | boolean | X | 오늘 첫 응원 하트 지급 여부 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 400 | `CANNOT_CHEER_SELF` | 본인 대상 |
| 403 | `GROUP_ACCESS_DENIED` | 그룹 멤버가 아님 |
| 404 | `GROUP_MEMBER_NOT_FOUND` | 대상이 유효한 그룹 멤버가 아님 |
| 409 | `ALREADY_CHEERED_TODAY` | 같은 날짜·같은 대상 중복 |

### 9. 중복 호출 처리
같은 대상의 일일 중복 응원은 생성하지 않는다. 하루 여러 명을 응원해도 활동 일수와 하트 이벤트는 하루 한 번만 반영한다.

## 재인증 요청 생성

### 1. 기본 정보
- Method / Path: `POST /api/v1/groups/{groupId}/reverify-requests`
- 목적: 다른 멤버의 인증에 대한 재검토를 요청한다.
- 호출 시점: 피드 재인증 요청 제출 시
- 인증: 필수, 그룹 멤버만 가능
- Content-Type: `application/json`
- 중복 호출 정책: 동일 인증에 처리 중인 본인 요청이 있으면 `409 REVERIFY_REQUEST_ALREADY_EXISTS`를 반환한다.

### 2. Path 파라미터
| 필드 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `groupId` | string | O | 그룹 ID |

### 3. Query 파라미터
없음

### 4. 요청 Body
| 필드 | 타입 | 필수 | Nullable | 설명 |
|---|---|---:|---:|---|
| `verificationId` | string | O | X | 대상 인증 ID |
| `reasonId` | enum | O | X | `duplicate`, `stolen`, `unrelated`, `fake`, `etc` |
| `etcText` | string | X | O | `reasonId=etc`일 때 필수 |

### 5. 요청 예시
```json
{ "verificationId": "v_123", "reasonId": "duplicate", "etcText": null }
```

### 6. 성공 응답
`201 Created`
```json
{ "requestId": "rr_1", "verificationId": "v_123", "status": "pending", "createdAt": "2026-08-14T05:00:00Z" }
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `requestId` | string | X | 재인증 요청 ID |
| `verificationId` | string | X | 대상 인증 ID |
| `status` | enum | X | `pending` |
| `createdAt` | string(datetime) | X | 생성 시각 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 400 | `VALIDATION_ERROR` | 사유·기타 내용 오류 |
| 403 | `GROUP_ACCESS_DENIED` | 그룹 멤버가 아님 |
| 404 | `VERIFICATION_NOT_FOUND` | 인증 없음 |
| 409 | `REVERIFY_REQUEST_ALREADY_EXISTS` | 처리 중인 동일 요청 존재 |

### 9. 중복 호출 처리
동일 인증에 처리 중인 요청을 중복 생성하지 않는다.

## 내 재인증 요청 목록

### 1. 기본 정보
- Method / Path: `GET /api/v1/groups/{groupId}/reverify-requests`
- 목적: 내가 생성한 재인증 요청과 처리 상태를 조회한다.
- 호출 시점: 재인증 요청 내역 화면
- 인증: 필수
- Content-Type: 없음
- 중복 호출 정책: 현재 목록을 반환한다.

### 2. Path 파라미터
| 필드 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `groupId` | string | O | 그룹 ID |

### 3. Query 파라미터
| 필드 | 타입 | 필수 | 기본값 | 설명 |
|---|---|---:|---|---|
| `requestedBy` | enum | X | `me` | MVP에서는 `me`만 허용 |
| `page`, `size` | integer | X | `1`, `20` | 페이지 정보 |

### 4. 요청 Body
없음

### 5. 요청 예시
`GET /api/v1/groups/g1/reverify-requests?requestedBy=me&page=1&size=20`

### 6. 성공 응답
`200 OK`
```json
{
  "items": [{ "requestId": "rr_1", "verificationId": "v_123", "targetUserId": "u2", "reasonId": "duplicate", "status": "pending", "createdAt": "2026-08-14T05:00:00Z", "resolvedAt": null }],
  "pagination": { "page": 1, "size": 20, "totalItems": 1, "totalPages": 1, "hasNext": false }
}
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `items[].requestId`, `verificationId`, `targetUserId` | string | X | 요청·인증·대상 ID |
| `items[].reasonId` | enum | X | 요청 사유 |
| `items[].status` | enum | X | `pending`, `accepted`, `rejected`, `cancelled` |
| `items[].createdAt` | string(datetime) | X | 생성 시각 |
| `items[].resolvedAt` | string(datetime) | O | 처리 시각 |
| `pagination` | object | X | 페이지 정보 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 403 | `GROUP_ACCESS_DENIED` | 그룹 접근 권한 없음 |
| 404 | `GROUP_NOT_FOUND` | 그룹 없음 |

### 9. 중복 호출 처리
조회 API이므로 현재 목록을 반환한다.

## 인증 신고 생성

### 1. 기본 정보
- Method / Path: `POST /api/v1/verifications/{verificationId}/reports`
- 목적: 부정·무관·불쾌한 인증을 신고한다.
- 호출 시점: 신고 화면 제출 시
- 인증: 필수
- Content-Type: `application/json`
- 중복 호출 정책: 같은 사용자의 동일 인증 신고는 중복 생성하지 않는다.

### 2. Path 파라미터
| 필드 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `verificationId` | string | O | 대상 인증 ID |

### 3. Query 파라미터
없음

### 4. 요청 Body
| 필드 | 타입 | 필수 | Nullable | 설명 |
|---|---|---:|---:|---|
| `reasonId` | enum | O | X | `ai_verdict`, `not_related`, `fake`, `offensive`, `etc` |
| `etcText` | string | X | O | `reasonId=etc`일 때 필수 |

### 5. 요청 예시
```json
{ "reasonId": "fake", "etcText": null }
```

### 6. 성공 응답
`201 Created`
```json
{ "reportId": "rp_1", "verificationId": "v_123", "status": "received", "createdAt": "2026-08-14T05:00:00Z" }
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `reportId` | string | X | 신고 ID |
| `verificationId` | string | X | 인증 ID |
| `status` | enum | X | `received` |
| `createdAt` | string(datetime) | X | 접수 시각 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 400 | `VALIDATION_ERROR` | 사유 입력 오류 |
| 404 | `VERIFICATION_NOT_FOUND` | 인증 없음 |
| 409 | `REPORT_ALREADY_EXISTS` | 동일 신고가 이미 존재 |

### 9. 중복 호출 처리
동일 사용자의 동일 인증 신고는 하나만 유지한다.

## 내 신고 목록

### 1. 기본 정보
- Method / Path: `GET /api/v1/users/me/reports`
- 목적: 내가 접수한 신고의 최소 처리 상태를 조회한다.
- 호출 시점: 신고 내역 화면
- 인증: 필수
- Content-Type: 없음
- 중복 호출 정책: 현재 목록을 반환한다.

### 2. Path 파라미터
없음

### 3. Query 파라미터
`page`, `size`는 공통 페이지네이션 규칙을 따른다.

### 4. 요청 Body
없음

### 5. 요청 예시
`GET /api/v1/users/me/reports?page=1&size=20`

### 6. 성공 응답
`200 OK`
```json
{
  "items": [{ "reportId": "rp_1", "verificationId": "v_123", "reasonId": "fake", "status": "reviewing", "createdAt": "2026-08-14T05:00:00Z", "resolvedAt": null }],
  "pagination": { "page": 1, "size": 20, "totalItems": 1, "totalPages": 1, "hasNext": false }
}
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `items[].reportId`, `verificationId` | string | X | 신고·인증 ID |
| `items[].reasonId` | enum | X | 신고 사유 |
| `items[].status` | enum | X | `received`, `reviewing`, `resolved`, `dismissed` |
| `items[].createdAt` | string(datetime) | X | 접수 시각 |
| `items[].resolvedAt` | string(datetime) | O | 처리 시각 |
| `pagination` | object | X | 페이지 정보 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 401 | `UNAUTHORIZED` | 토큰 검증 실패 |

### 9. 중복 호출 처리
조회 API이다. 운영 메모·다른 신고자·피신고자 개인정보는 반환하지 않는다.

---

# 5. 리워드와 하트

## 리워드 목록 조회

### 1. 기본 정보
- Method / Path: `GET /api/v1/rewards`
- 목적: 교환 가능한 리워드와 현재 포인트를 조회한다.
- 호출 시점: 리워드 탭 진입 시
- 인증: 필수
- Content-Type: 없음
- 중복 호출 정책: 현재 목록을 반환한다.

### 2. Path 파라미터
없음

### 3. Query 파라미터
| 필드 | 타입 | 필수 | 기본값 | 설명 |
|---|---|---:|---|---|
| `category` | enum | X | 없음 | `experience`, `product`, `other` |
| `sort` | enum | X | `popular` | `popular`, `price_desc`, `price_asc` |
| `page`, `size` | integer | X | `1`, `20` | 페이지 정보 |

### 4. 요청 Body
없음

### 5. 요청 예시
`GET /api/v1/rewards?sort=price_asc&page=1&size=20`

### 6. 성공 응답
`200 OK`
```json
{
  "rewardPoints": 1540,
  "items": [{ "rewardId": "serum_trial", "title": "세럼 체험권", "description": "발급 후 30일 이내 사용", "cost": 1500, "category": "experience", "stock": 100, "exchangeLimitType": "lifetime", "exchangeLimit": 1, "available": true }],
  "pagination": { "page": 1, "size": 20, "totalItems": 1, "totalPages": 1, "hasNext": false }
}
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `rewardPoints` | integer | X | 현재 포인트 |
| `items[].rewardId` | string | X | 리워드 ID |
| `items[].title`, `description` | string | X | 제목·설명 |
| `items[].cost` | integer | X | 필요 포인트 |
| `items[].category` | enum | X | 분류 |
| `items[].stock` | integer | O | `null`이면 무제한 |
| `items[].exchangeLimitType` | enum | X | `lifetime`, `monthly` |
| `items[].exchangeLimit` | integer | X | 제한 횟수 |
| `items[].available` | boolean | X | 교환 가능 여부 |
| `pagination` | object | X | 페이지 정보 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 400 | `INVALID_PAGINATION` | 페이지 값 오류 |

### 9. 중복 호출 처리
조회 API이므로 현재 목록을 반환한다. 문서의 재고 숫자는 개발 seed 예시이며 운영 재고 계약이 아니다.

## 리워드 교환

### 1. 기본 정보
- Method / Path: `POST /api/v1/rewards/{rewardId}/exchange`
- 목적: 포인트·재고를 차감하고 쿠폰을 발급한다.
- 호출 시점: 교환 최종 확인 시
- 인증: 필수
- Content-Type: `application/json`
- 중복 호출 정책: `Idempotency-Key` 필수. 포인트 차감·재고 차감·쿠폰 발급·이력 저장을 한 트랜잭션으로 처리한다.

### 2. Path 파라미터
| 필드 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `rewardId` | string | O | 리워드 ID |

### 3. Query 파라미터
없음

### 4. 요청 Body
없음

### 5. 요청 예시
`POST /api/v1/rewards/discount_15/exchange`

### 6. 성공 응답
`200 OK`
```json
{ "rewardId": "discount_15", "remainingPoints": 40, "voucher": { "voucherId": "voucher_123", "code": "AAC-7K2P9Q", "expiresAt": "2026-09-13T05:00:00Z" } }
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `rewardId` | string | X | 교환 리워드 ID |
| `remainingPoints` | integer | X | 교환 후 포인트 |
| `voucher.voucherId` | string | X | 쿠폰 ID |
| `voucher.code` | string | X | 쿠폰 코드 |
| `voucher.expiresAt` | string(datetime) | X | 발급일부터 30일 뒤 만료 시각 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 404 | `REWARD_NOT_FOUND` | 리워드 없음 |
| 409 | `NOT_ENOUGH_POINTS` | 포인트 부족 |
| 409 | `REWARD_OUT_OF_STOCK` | 재고 없음 |
| 409 | `EXCHANGE_LIMIT_EXCEEDED` | 사용자별 제한 초과 |
| 409 | `REWARD_NOT_AVAILABLE` | 교환 중지 상태 |

### 9. 중복 호출 처리
같은 멱등 키에는 같은 쿠폰을 반환한다. 발급 실패 시 포인트와 재고를 모두 복구한다.

## 내 쿠폰 목록

### 1. 기본 정보
- Method / Path: `GET /api/v1/users/me/vouchers`
- 목적: 발급받은 쿠폰을 조회한다.
- 호출 시점: 내 쿠폰 화면
- 인증: 필수
- Content-Type: 없음
- 중복 호출 정책: 현재 목록을 반환한다.

### 2. Path 파라미터
없음

### 3. Query 파라미터
| 필드 | 타입 | 필수 | 기본값 | 설명 |
|---|---|---:|---|---|
| `status` | enum | X | 없음 | 쿠폰 상태 필터 |
| `page`, `size` | integer | X | `1`, `20` | 페이지 정보 |

### 4. 요청 Body
없음

### 5. 요청 예시
`GET /api/v1/users/me/vouchers?status=available&page=1&size=20`

### 6. 성공 응답
`200 OK`
```json
{
  "items": [{ "voucherId": "voucher_123", "rewardId": "discount_15", "title": "공식몰 15% 할인 쿠폰", "code": "AAC-7K2P9Q", "status": "available", "issuedAt": "2026-08-14T05:00:00Z", "expiresAt": "2026-09-13T05:00:00Z", "usedAt": null }],
  "pagination": { "page": 1, "size": 20, "totalItems": 1, "totalPages": 1, "hasNext": false }
}
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `items[].voucherId`, `rewardId` | string | X | 쿠폰·리워드 ID |
| `items[].title`, `code` | string | X | 표시 제목·코드 |
| `items[].status` | enum | X | 쿠폰 상태 |
| `items[].issuedAt`, `expiresAt` | string(datetime) | X | 발급·만료 시각 |
| `items[].usedAt` | string(datetime) | O | 사용 시각 |
| `pagination` | object | X | 페이지 정보 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 400 | `VALIDATION_ERROR` | 상태 필터 오류 |

### 9. 중복 호출 처리
조회 API이므로 현재 목록을 반환한다.

## 하트 이벤트 목록

### 1. 기본 정보
- Method / Path: `GET /api/v1/heart-events`
- 목적: 하트 잔액과 이벤트별 달성·수령 상태를 조회한다.
- 호출 시점: 하트 이벤트 화면 진입 시
- 인증: 필수
- Content-Type: 없음
- 중복 호출 정책: 현재 상태를 반환한다.

### 2. Path 파라미터
없음

### 3. Query 파라미터
없음

### 4. 요청 Body
없음

### 5. 요청 예시
`GET /api/v1/heart-events`

### 6. 성공 응답
`200 OK`
```json
{
  "hearts": 3, "dailyEarnedHearts": 1, "dailyEarnLimit": 3,
  "items": [{ "eventKey": "verify", "title": "오늘의 루틴 인증하기", "rewardHearts": 1, "completed": true, "claimed": false }]
}
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `hearts` | integer | X | 현재 잔액 |
| `dailyEarnedHearts` | integer | X | 반복 이벤트로 오늘 획득한 수량 |
| `dailyEarnLimit` | integer | X | `3` |
| `items[].eventKey` | enum | X | `verify`, `cheer`, `invite`, `follow`, `onboarding` |
| `items[].title` | string | X | 표시명 |
| `items[].rewardHearts` | integer | X | 지급량 |
| `items[].completed`, `claimed` | boolean | X | 달성·수령 여부 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 401 | `UNAUTHORIZED` | 인증 실패 |

### 9. 중복 호출 처리
조회 API이므로 현재 상태를 반환한다.

## 하트 이벤트 수령

### 1. 기본 정보
- Method / Path: `POST /api/v1/heart-events/{eventKey}/claim`
- 목적: 달성한 이벤트의 하트를 지급한다.
- 호출 시점: 이벤트 보상받기 선택 시
- 인증: 필수
- Content-Type: `application/json`
- 중복 호출 정책: `Idempotency-Key` 필수. 이벤트 고유 키로 중복 지급을 막는다.

### 2. Path 파라미터
| 필드 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `eventKey` | enum | O | 이벤트 키 |

### 3. Query 파라미터
없음

### 4. 요청 Body
없음

### 5. 요청 예시
`POST /api/v1/heart-events/verify/claim`

### 6. 성공 응답
`200 OK`
```json
{ "eventKey": "verify", "rewardHearts": 1, "hearts": 4, "claimedAt": "2026-08-14T05:00:00Z" }
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `eventKey` | enum | X | 이벤트 키 |
| `rewardHearts` | integer | X | 지급량 |
| `hearts` | integer | X | 지급 후 잔액 |
| `claimedAt` | string(datetime) | X | 지급 시각 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 409 | `EVENT_NOT_COMPLETED` | 이벤트 미달성 |
| 409 | `ALREADY_CLAIMED` | 이미 수령함 |
| 409 | `DAILY_HEART_LIMIT_EXCEEDED` | 반복 이벤트 하루 3개 상한 도달 |

### 9. 중복 호출 처리
반복 이벤트는 `eventKey:YYYY-MM-DD`, 일회성 이벤트는 `eventKey:account` 키로 중복 지급을 막는다. 일일 기준은 한국시간이다. 온보딩·팔로우 최초 보상과 하트 반환은 일일 상한에서 제외한다.

### 하트 반환 정책

그룹 참가 시 1개를 차감한다. 그룹 종료 후 `개인 유효 인증 수 / 개인 전체 예정 인증 수 >= 0.7`이고 확정된 부정 인증이 없으면 서버가 1개를 자동 반환한다. 자발적 탈퇴나 미완주는 반환하지 않는다. 그룹 운영자 취소는 참가자 전원에게 차감 하트를 반환한다.

---

# 6. AI 코치와 전체 랭킹

## AI 코치 인트로 조회

### 1. 기본 정보
- Method / Path: `GET /api/v1/groups/{groupId}/coach`
- 목적: 진입 화면에 맞는 프리셋 인트로와 추천 질문을 조회한다.
- 호출 시점: AI 코치 화면 진입 시
- 인증: 필수, 그룹 멤버만 가능
- Content-Type: 없음
- 중복 호출 정책: 현재 프리셋을 반환한다.

### 2. Path 파라미터
| 필드 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `groupId` | string | O | 그룹 ID |

### 3. Query 파라미터
| 필드 | 타입 | 필수 | 기본값 | 설명 |
|---|---|---:|---|---|
| `from` | enum | O | 없음 | `feed`, `ranking` |

### 4. 요청 Body
없음

### 5. 요청 예시
`GET /api/v1/groups/g1/coach?from=feed`

### 6. 성공 응답
`200 OK`
```json
{ "intro": "안녕하세요, 그룹 코치예요.", "suggestions": [{ "suggestionId": "pace", "question": "우리 그룹 요즘 페이스 어때?" }] }
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `intro` | string | X | 인트로 문구 |
| `suggestions[].suggestionId` | string | X | 프리셋 ID |
| `suggestions[].question` | string | X | 표시 질문 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 400 | `VALIDATION_ERROR` | `from` 오류 |
| 403 | `GROUP_ACCESS_DENIED` | 그룹 멤버가 아님 |
| 404 | `GROUP_NOT_FOUND` | 그룹 없음 |

### 9. 중복 호출 처리
조회 API이므로 동일한 현재 프리셋을 반환한다.

## AI 코치 메시지 요청

### 1. 기본 정보
- Method / Path: `POST /api/v1/groups/{groupId}/coach/messages`
- 목적: 추천 질문에 대한 규칙 기반 프리셋 답변을 반환한다.
- 호출 시점: 추천 질문 또는 자유 질문 전송 시
- 인증: 필수, 그룹 멤버만 가능
- Content-Type: `application/json`
- 중복 호출 정책: 같은 입력은 현재 그룹 데이터 기준 답변을 반환한다.

### 2. Path 파라미터
| 필드 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `groupId` | string | O | 그룹 ID |

### 3. Query 파라미터
없음

### 4. 요청 Body
| 필드 | 타입 | 필수 | Nullable | 설명 |
|---|---|---:|---:|---|
| `suggestionId` | string | 조건부 | O | 추천 질문 ID |
| `question` | string | 조건부 | O | 자유 질문. 둘 중 하나만 전송 |

### 5. 요청 예시
```json
{ "suggestionId": "pace" }
```

### 6. 성공 응답
`200 OK`
```json
{
  "answer": "최근 3일 동안 그룹 인증률이 상승하고 있어요.", "answerType": "preset",
  "viz": { "type": "columns", "unit": "%", "data": [{ "label": "3일 전", "value": 60 }, { "label": "오늘", "value": 87, "highlight": true }] },
  "suggestions": []
}
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `answer` | string | X | 답변 |
| `answerType` | enum | X | `preset`, `fallback` |
| `viz` | object | O | `pips`, `ring`, `columns`, `versus` 시각화 |
| `suggestions` | object[] | X | fallback 시 다시 선택할 추천 질문 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 400 | `VALIDATION_ERROR` | 두 입력이 모두 없거나 동시에 존재 |
| 403 | `GROUP_ACCESS_DENIED` | 그룹 멤버가 아님 |
| 404 | `SUGGESTION_NOT_FOUND` | 존재하지 않는 프리셋 ID |

### 9. 중복 호출 처리
MVP는 LLM을 호출하지 않는다. 자유 질문은 `fallback` 안내와 추천 질문을 반환한다.

## 전체 랭킹 조회

### 1. 기본 정보
- Method / Path: `GET /api/v1/rankings/global`
- 목적: 공개 그룹 사용자의 통합 누적 포인트 순위를 조회한다.
- 호출 시점: 전체 랭킹 화면 진입 시
- 인증: 필수
- Content-Type: 없음
- 중복 호출 정책: 현재 서버 순위를 반환한다.

### 2. Path 파라미터
없음

### 3. Query 파라미터
`page`, `size`는 공통 페이지네이션 규칙을 따른다.

### 4. 요청 Body
없음

### 5. 요청 예시
`GET /api/v1/rankings/global?page=1&size=20`

### 6. 성공 응답
`200 OK`
```json
{
  "items": [{ "userId": "u1", "nickname": "서준", "groupId": "g1", "groupName": "하루 운동 30분", "score": 1980, "rank": 4, "isMe": true }],
  "pagination": { "page": 1, "size": 20, "totalItems": 1, "totalPages": 1, "hasNext": false }
}
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `items[].userId`, `groupId` | string | X | 사용자·대표 그룹 ID |
| `items[].nickname`, `groupName` | string | X | 닉네임·그룹명 |
| `items[].score` | integer | X | 누적 포인트 |
| `items[].rank` | integer | X | 서버 계산 dense rank |
| `items[].isMe` | boolean | X | 로그인 사용자 여부 |
| `pagination` | object | X | 페이지 정보 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 400 | `INVALID_PAGINATION` | 페이지 값 오류 |

### 9. 중복 호출 처리
조회 API이다. 프론트는 순위를 다시 계산하지 않는다.

---

# 7. 설정, 푸시 토큰 및 약관

## 알림 설정 조회

### 1. 기본 정보
- Method / Path: `GET /api/v1/users/me/notification-settings`
- 목적: 사용자 알림 수신 설정을 조회한다.
- 호출 시점: 알림 설정 화면 진입 시
- 인증: 필수
- Content-Type: 없음
- 중복 호출 정책: 현재 설정을 반환한다.

### 2. Path 파라미터
없음

### 3. Query 파라미터
없음

### 4. 요청 Body
없음

### 5. 요청 예시
`GET /api/v1/users/me/notification-settings`

### 6. 성공 응답
`200 OK`
```json
{ "routine": true, "group": true, "goal": true, "reward": true, "marketing": false }
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `routine`, `group`, `goal`, `reward`, `marketing` | boolean | X | 유형별 발송 허용 여부 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 401 | `UNAUTHORIZED` | 인증 실패 |

### 9. 중복 호출 처리
조회 API이므로 현재 설정을 반환한다.

## 알림 설정 수정

### 1. 기본 정보
- Method / Path: `PATCH /api/v1/users/me/notification-settings`
- 목적: 알림 수신 설정을 부분 수정한다.
- 호출 시점: 설정 토글 변경 시
- 인증: 필수
- Content-Type: `application/json`
- 중복 호출 정책: 같은 값 반복 요청은 같은 설정을 반환한다.

### 2. Path 파라미터
없음

### 3. Query 파라미터
없음

### 4. 요청 Body
알림 설정 필드 중 하나 이상을 보낸다. `marketing=true`는 유효한 마케팅 약관 동의가 있을 때만 허용한다.

### 5. 요청 예시
```json
{ "routine": false, "marketing": false }
```

### 6. 성공 응답
`200 OK` — 갱신된 전체 알림 설정을 반환한다.

### 7. 응답 필드
알림 설정 조회 응답 필드와 같다.

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 400 | `VALIDATION_ERROR` | boolean이 아니거나 빈 요청 |
| 409 | `MARKETING_CONSENT_REQUIRED` | 동의 없이 마케팅 알림 활성화 |

### 9. 중복 호출 처리
동일 값을 반복 적용해도 `200`을 반환한다. 알림을 꺼도 푸시 토큰 자체는 삭제하지 않는다.

## 개인정보 공개 설정 조회

### 1. 기본 정보
- Method / Path: `GET /api/v1/users/me/privacy-settings`
- 목적: 프로필·랭킹 공개 설정을 조회한다.
- 호출 시점: 개인정보 공개 설정 화면
- 인증: 필수
- Content-Type: 없음
- 중복 호출 정책: 현재 설정을 반환한다.

### 2. Path 파라미터
없음

### 3. Query 파라미터
없음

### 4. 요청 Body
없음

### 5. 요청 예시
`GET /api/v1/users/me/privacy-settings`

### 6. 성공 응답
`200 OK`
```json
{ "profilePublic": true, "rankingPublic": true }
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `profilePublic`, `rankingPublic` | boolean | X | 공개 여부 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 401 | `UNAUTHORIZED` | 인증 실패 |

### 9. 중복 호출 처리
조회 API이므로 현재 설정을 반환한다.

## 개인정보 공개 설정 수정

### 1. 기본 정보
- Method / Path: `PATCH /api/v1/users/me/privacy-settings`
- 목적: 프로필·랭킹 공개 설정을 부분 수정한다.
- 호출 시점: 공개 설정 토글 변경 시
- 인증: 필수
- Content-Type: `application/json`
- 중복 호출 정책: 같은 값 반복 요청은 같은 설정을 반환한다.

### 2. Path 파라미터
없음

### 3. Query 파라미터
없음

### 4. 요청 Body
| 필드 | 타입 | 필수 | Nullable | 설명 |
|---|---|---:|---:|---|
| `profilePublic` | boolean | X | X | 프로필 공개 여부 |
| `rankingPublic` | boolean | X | X | 랭킹 공개 여부 |

### 5. 요청 예시
```json
{ "rankingPublic": false }
```

### 6. 성공 응답
`200 OK` — 갱신된 전체 공개 설정을 반환한다.

### 7. 응답 필드
개인정보 공개 설정 조회 응답 필드와 같다.

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 400 | `VALIDATION_ERROR` | boolean이 아니거나 빈 요청 |

### 9. 중복 호출 처리
동일 값을 반복 적용해도 `200`을 반환한다.

## 푸시 토큰 등록

### 1. 기본 정보
- Method / Path: `POST /api/v1/users/me/push-tokens`
- 목적: Expo 푸시 토큰을 기기별로 등록·갱신한다.
- 호출 시점: 로그인 후 푸시 권한과 토큰 확보 시
- 인증: 필수
- Content-Type: `application/json`
- 중복 호출 정책: 동일 토큰은 새로 만들지 않고 기존 등록을 갱신한다.

### 2. Path 파라미터
없음

### 3. Query 파라미터
없음

### 4. 요청 Body
| 필드 | 타입 | 필수 | Nullable | 설명 |
|---|---|---:|---:|---|
| `token` | string | O | X | Expo 푸시 토큰 |
| `platform` | enum | O | X | `android`, `ios` |
| `deviceId` | string | O | X | 앱 설치 단위 기기 ID |

### 5. 요청 예시
```json
{ "token": "ExponentPushToken[...]", "platform": "android", "deviceId": "device_abc" }
```

### 6. 성공 응답
`200 OK` 또는 최초 등록 시 `201 Created`
```json
{ "tokenId": "push_123", "registered": true }
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `tokenId` | string | X | 서버 토큰 등록 ID |
| `registered` | boolean | X | 활성 등록 여부 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 400 | `INVALID_PUSH_TOKEN` | 토큰 형식 오류 |

### 9. 중복 호출 처리
토큰 또는 `deviceId`가 같으면 upsert하고 활성 상태로 갱신한다.

## 푸시 토큰 삭제

### 1. 기본 정보
- Method / Path: `DELETE /api/v1/users/me/push-tokens/{tokenId}`
- 목적: 로그아웃할 현재 기기의 푸시 토큰을 비활성화한다.
- 호출 시점: 로컬 token 삭제 직전
- 인증: 필수
- Content-Type: 없음
- 중복 호출 정책: 이미 삭제된 경우 `204`를 반환한다.

### 2. Path 파라미터
| 필드 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `tokenId` | string | O | 푸시 토큰 등록 ID |

### 3. Query 파라미터
없음

### 4. 요청 Body
없음

### 5. 요청 예시
`DELETE /api/v1/users/me/push-tokens/push_123`

### 6. 성공 응답
`204 No Content`

### 7. 응답 필드
없음

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 403 | `PUSH_TOKEN_ACCESS_DENIED` | 다른 사용자의 토큰 |

### 9. 중복 호출 처리
이미 삭제된 경우에도 `204`를 반환한다. 로그아웃은 client SecureStore의 ALLOG token을 삭제한다.

## 현재 약관 목록

### 1. 기본 정보
- Method / Path: `GET /api/v1/terms/current`
- 목적: 가입 시 표시할 현재 약관 버전과 필수 여부를 조회한다.
- 호출 시점: 가입 약관 화면 진입 시
- 인증: 공개 API
- Content-Type: 없음
- 중복 호출 정책: 현재 게시 버전을 반환한다.

### 2. Path 파라미터
없음

### 3. Query 파라미터
없음

### 4. 요청 Body
없음

### 5. 요청 예시
`GET /api/v1/terms/current`

### 6. 성공 응답
`200 OK`
```json
{ "items": [{ "type": "service", "version": "2026-08-01", "required": true }, { "type": "privacy", "version": "2026-08-01", "required": true }, { "type": "marketing", "version": "2026-08-01", "required": false }] }
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `items[].type` | enum | X | `service`, `privacy`, `marketing` |
| `items[].version` | string | X | 약관 버전 |
| `items[].required` | boolean | X | 필수 동의 여부 |

### 8. 오류 코드
없음

### 9. 중복 호출 처리
조회 API이므로 현재 목록을 반환한다.

## 약관 동의 저장

### 1. 기본 정보
- Method / Path: `POST /api/v1/users/me/terms-consents`
- 목적: 약관 유형·버전별 동의 또는 철회 이력을 저장한다.
- 호출 시점: 가입 약관 제출 또는 선택 약관 철회 시
- 인증: 필수
- Content-Type: `application/json`
- 중복 호출 정책: 같은 유형·버전·동의값은 이중 생성하지 않는다.

### 2. Path 파라미터
없음

### 3. Query 파라미터
없음

### 4. 요청 Body
| 필드 | 타입 | 필수 | Nullable | 설명 |
|---|---|---:|---:|---|
| `consents` | object[] | O | X | 1개 이상의 동의 항목 |
| `consents[].type` | enum | O | X | 약관 유형 |
| `consents[].version` | string | O | X | 약관 버전 |
| `consents[].agreed` | boolean | O | X | 동의 여부 |
| `consentPath` | enum | O | X | `signup`, `settings` |

### 5. 요청 예시
```json
{ "consents": [{ "type": "service", "version": "2026-08-01", "agreed": true }, { "type": "privacy", "version": "2026-08-01", "agreed": true }, { "type": "marketing", "version": "2026-08-01", "agreed": false }], "consentPath": "signup" }
```

### 6. 성공 응답
`200 OK`
```json
{ "savedAt": "2026-08-14T05:00:00Z", "consents": [{ "type": "service", "version": "2026-08-01", "agreed": true }] }
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `savedAt` | string(datetime) | X | 저장 시각 |
| `consents[].type`, `version` | string | X | 유형·버전 |
| `consents[].agreed` | boolean | X | 저장된 동의 여부 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 400 | `UNKNOWN_TERMS_VERSION` | 존재하지 않는 약관 버전 |
| 409 | `REQUIRED_CONSENT_MISSING` | 가입 시 필수 약관 미동의 |

### 9. 중복 호출 처리
같은 상태는 중복 행 없이 성공 처리하되 동의·철회 변경 이력은 보존한다.

## 내 데이터 내보내기 요청

### 1. 기본 정보
- Method / Path: `POST /api/v1/users/me/data-export`
- 목적: 사용자 데이터 내보내기 작업을 접수한다.
- 호출 시점: 개인정보 화면에서 다운로드 요청 시
- 인증: 필수
- Content-Type: `application/json`
- 중복 호출 정책: 처리 중 요청이 있으면 기존 요청을 반환한다.

### 2. Path 파라미터
없음

### 3. Query 파라미터
없음

### 4. 요청 Body
없음

### 5. 요청 예시
`POST /api/v1/users/me/data-export`

### 6. 성공 응답
`202 Accepted`
```json
{ "requestId": "export_123", "status": "requested", "requestedAt": "2026-08-14T05:00:00Z" }
```

### 7. 응답 필드
| 필드 | 타입 | Nullable | 설명 |
|---|---|---:|---|
| `requestId` | string | X | 내보내기 요청 ID |
| `status` | enum | X | `requested`, `processing`, `completed`, `failed` |
| `requestedAt` | string(datetime) | X | 접수 시각 |

### 8. 오류 코드
| HTTP | 코드 | 발생 조건 |
|---:|---|---|
| 401 | `UNAUTHORIZED` | 인증 실패 |

### 9. 중복 호출 처리
처리 중 요청이 있으면 새로 만들지 않고 기존 요청을 반환한다.

---

# 부록 A. v1.0 범위 제외

- 스토리지 presigned URL 기반 인증 영상 업로드
- 실제 LLM 기반 자유 질문 답변
- 댓글·별도 체크인·공동 목표 활동 기반 그룹 기여도
- 갤러리의 기존 영상 업로드
- 전화번호·SMS·OTP 인증

# 부록 B. 프론트 표시 변환

프론트는 서버 원본을 화면 문구로 변환한다.

```js
const memberText = `${group.memberCount}/${group.capacity}명`;
const remainingSeats = group.capacity - group.memberCount;
const isFull = group.memberCount >= group.capacity;
// createdAt -> 방금 전, 10분 전, 2시간 전
// endDate -> D-2
```

# 부록 C. v1.0 승인 체크리스트

- [x] 모든 API를 프론트·백엔드 담당자가 검토했다.
- [x] 요청·응답 필드 타입과 nullable 규칙을 승인했다.
- [x] enum 고정값을 승인했다.
- [x] mock과 API 응답 필드 변환 규칙을 확정했다.
- [x] 목록 API의 빈 배열과 페이지네이션 규칙을 확정했다.
- [x] 자산 변경 API의 멱등성과 트랜잭션 규칙을 확정했다.
- [x] 날짜·시간·시간대 규칙을 확정했다.
- [x] API별 오류 코드를 확정했다.
- [x] 삭제 사용자 익명화 정책을 승인했다.
- [x] 본문에 미결정 문장이 남아 있지 않다.

프론트엔드와 백엔드의 별도 변경 요청이 없어 2026-08-14 기준 v1.0으로 승인했다. 이후 계약 변경은 문서 버전을 올리고 양측에 공유한다.
