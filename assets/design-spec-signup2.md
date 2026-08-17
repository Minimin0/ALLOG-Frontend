# 회원가입2 - 계정 생성 디자인 명세

## 기준

- Figma 파일: `S5s5CrO8B2iz1l09YxXy2d`
- Figma 노드: `1:1558` (`회원가입`)
- 기준 프레임: `393 × 852px`
- 배경: `#F7F6F3`
- 폰트: `Pretendard Variable`

> 이 명세는 Figma Dev Mode의 설계를 기반으로 작성한다. 모든 좌표는 `393 × 852px` 화면 프레임의 왼쪽 위를 `(0, 0)`으로 한 절대 좌표다.

## 화면 구조

```text
signup2-screen (393 × 852, position: relative)
├─ signup2-title
├─ signup2-username-label
├─ signup2-username-input
├─ signup2-password-label
├─ signup2-password-input
├─ signup2-password-confirm-label
├─ signup2-password-confirm-wrap
│  ├─ signup2-password-confirm-input
│  └─ signup2-password-confirm-check
└─ signup2-complete-button
```

모든 요소는 `.signup2-screen`의 직접 자식 또는 그 내부 자식으로 배치한다.

## 요소별 명세

### 제목

| 항목      | 값                                                   |
| --------- | ---------------------------------------------------- |
| 텍스트    | `아이디와 비밀번호를\n입력해주세요.`                 |
| 위치·크기 | `left: 26px; top: 118px; width: 310px; height: 98px` |
| 폰트      | Pretendard Variable Bold, `25px`                     |
| 줄 높이   | `35px`                                               |
| 색상      | `#000000`                                            |
| 정렬      | 왼쪽                                                 |

### 아이디

| 항목             | 값                                                               |
| ---------------- | ---------------------------------------------------------------- |
| 라벨             | `아이디`                                                         |
| 라벨 위치        | `left: 32px; top: 229px`                                         |
| 라벨 스타일      | Pretendard Bold, `15px`, line-height `35px`, `#4A4A4A`           |
| 입력 상자        | `left: 21px; top: 261px; width: 343px; height: 44px`             |
| 입력 상자 스타일 | 배경 `#FEFEFE`, `1px solid #E7E3D8`, radius `15px`, shadow 없음  |
| placeholder      | `아이디 (4~13자리 이내)` - 상자 내부, SemiBold `14px`, `#BABABA` |

### 비밀번호

| 항목             | 값                                                                  |
| ---------------- | ------------------------------------------------------------------- |
| 라벨             | `비밀번호`                                                          |
| 라벨 위치        | `left: 32px; top: 303px`                                            |
| 라벨 스타일      | Pretendard Bold, `15px`, line-height `35px`, `#4A4A4A`              |
| 입력 상자        | `left: 21px; top: 335px; width: 343px; height: 44px`                |
| 입력 상자 스타일 | 배경 `#FEFEFE`, `1px solid #E7E3D8`, radius `15px`, shadow 없음     |
| placeholder      | `비밀번호 (10~12자리 이내)` - 상자 내부, SemiBold `14px`, `#BABABA` |

### 비밀번호 확인

| 항목             | 값                                                                  |
| ---------------- | ------------------------------------------------------------------- |
| 라벨             | `비밀번호 확인`                                                     |
| 라벨 위치        | `left: 32px; top: 377px`                                            |
| 라벨 스타일      | Pretendard Bold, `15px`, line-height `35px`, `#4A4A4A`              |
| 입력 상자        | `left: 21px; top: 409px; width: 343px; height: 44px`                |
| 입력 상자 스타일 | 배경 `#FEFEFE`, `1px solid #E7E3D8`, radius `15px`, shadow 없음     |
| placeholder      | `비밀번호 확인` - 상자 내부, SemiBold `14px`, `#BABABA`             |
| 확인 아이콘      | `public/images/Check.svg`, `20 × 20px`, 상자 우측 `right: 16px`     |
| 아이콘 표시 조건 | 비밀번호와 비밀번호 확인 필드가 일치하고 둘 다 입력되었을 때만 표시 |

### 완료 버튼

| 항목          | 값                                                                |
| ------------- | ----------------------------------------------------------------- |
| 위치·크기     | `left: 31px; top: 776px; width: 338px; height: 50px`              |
| 스타일        | 배경 `#000000`, radius `20px`, border·shadow 없음                 |
| 텍스트        | `완료`                                                            |
| 텍스트 스타일 | Pretendard Bold, `18px`, line-height `35px`, `#F2F2F6`, 중앙 정렬 |

## 상호작용

### 비밀번호 확인 검증

- 사용자가 비밀번호 확인 필드에 입력할 때, 입력값이 비밀번호 필드와 일치하면 Check 아이콘을 표시
- 일치하지 않으면 아이콘을 숨김
- 둘 중 하나의 필드가 비어 있으면 아이콘을 숨김

### 네비게이션

- 완료 버튼 클릭 시 `/onboarding/basic-info` 경로로 이동
- (TODO) 폼 검증 추가 필요
  - 아이디: 4~13자리
  - 비밀번호: 10~12자리
  - 비밀번호 확인: 비밀번호와 일치
