# 회원가입1 - 본인 인증 디자인 명세 (재작성)

## 기준

- Figma 파일: `S5s5CrO8B2iz1l09YxXy2d`
- Figma 노드: `1:1534` (`회원가입`)
- 기준 프레임: `393 × 852px`
- 배경: `#F7F6F3`
- 폰트: `Pretendard Variable`

> 이 명세만 사용한다. 이전 `design-spec-signup1.md`의 내용은 구현 기준에서 제외한다. 모든 좌표는 `393 × 852px` 화면 프레임의 왼쪽 위를 `(0, 0)`으로 한 절대 좌표다.

## 화면에 포함하지 않는 요소

Figma 노드 `1:1534`에는 아래 요소가 없다. 구현에 절대 추가하지 않는다.

- 상태 바(시간, Wi-Fi, 신호, 배터리)
- 상단 진행 바
- 전화번호 입력창 밖의 `010-0000-0000` 텍스트
- 별도 `인증번호` 라벨
- 입력창 또는 버튼의 추가 그림자

## 화면 구조

```text
signup1-screen (393 × 852, position: relative)
├─ signup1-title
├─ signup1-carrier-label
├─ signup1-carrier-select
├─ signup1-phone-label
├─ signup1-phone-input
├─ signup1-code-input
├─ signup1-agreement
└─ signup1-next-button
```

모든 요소는 반드시 `.signup1-screen`의 직접 자식 또는 그 내부 자식으로 배치한다. 다른 공통 레이아웃·상태 바·전역 폼 컴포넌트 안에 끼워 넣지 않는다.

## 요소별 명세

### 제목

| 항목 | 값 |
| --- | --- |
| 텍스트 | `본인 확인을 위해\n인증을 진행해 주세요.` |
| 위치·크기 | `left: 26px; top: 118px; width: 310px; height: 98px` |
| 폰트 | Pretendard Variable Bold, `25px` |
| 줄 높이 | `35px` |
| 색상 | `#000000` |
| 정렬 | 왼쪽 |

### 통신사

| 항목 | 값 |
| --- | --- |
| 라벨 | `통신사` |
| 라벨 위치 | `left: 32px; top: 209px` |
| 라벨 스타일 | Pretendard Bold, `15px`, line-height `35px`, `#4A4A4A` |
| 선택 상자 | `left: 21px; top: 241px; width: 148px; height: 44px` |
| 선택 상자 스타일 | 배경 `#FEFEFE`, `1px solid #E7E3D8`, radius `15px`, shadow 없음 |
| 기본값 | `SKT` - `left: 37px; top: 246px`, Medium `12px`, `#9C9C9C` |
| 화살표 | 상자 안 `left: 134px; top: 258px; width: 24px; height: 12px`; Figma 원본 또는 동일 에셋 사용 |

### 전화번호

| 항목 | 값 |
| --- | --- |
| 라벨 | `전화번호` |
| 라벨 위치 | `left: 24px; top: 296px` |
| 라벨 스타일 | Pretendard Bold, `15px`, line-height `35px`, `#4A4A4A` |
| 입력 상자 | `left: 21px; top: 329px; width: 343px; height: 44px` |
| 입력 상자 스타일 | 배경 `#FEFEFE`, `1px solid #E7E3D8`, radius `15px`, shadow 없음 |
| placeholder | `010-0000-0000` - 상자 내부 `left: 40px; top: 333px`, SemiBold `12px`, line-height `35px`, `#BABABA` |

### 인증번호

| 항목 | 값 |
| --- | --- |
| 입력 상자 | `left: 21px; top: 382px; width: 233px; height: 44px` |
| 입력 상자 스타일 | 배경 `#FEFEFE`, `1px solid #E7E3D8`, radius `15px`, shadow 없음 |
| placeholder | `인증번호 6자리` - 상자 내부 `left: 42px; top: 387px`, SemiBold `12px`, line-height `35px`, `#BABABA` |
| 타이머 | `00:00` - 상자 내부 우측 `left: 162px; top: 387px; width: 105px`, Medium `12px`, line-height `35px`, `#BABABA`, 중앙 정렬 |

### 약관 동의

| 항목 | 값 |
| --- | --- |
| 행 컨테이너 | `left: 28px; top: 429px; height: 26px`; `display: flex; align-items: center; gap: 6px` |
| 체크 아이콘 | `public/images/Check.svg`, `19 × 19px`, `flex: none` |
| 문구 | `본인 인증 서비스 약관 전체동의` |
| 문구 스타일 | Pretendard Medium, `13px`, line-height `35px`, `#000000`, 줄바꿈 금지 |

### 다음 버튼

| 항목 | 값 |
| --- | --- |
| 위치·크기 | `left: 31px; top: 776px; width: 338px; height: 50px` |
| 스타일 | 배경 `#000000`, radius `20px`, border·shadow 없음 |
| 텍스트 | `다음` |
| 텍스트 스타일 | Pretendard Bold, `18px`, line-height `35px`, `#F2F2F6`, 중앙 정렬 |

## 구현 제한

- 화면 프레임은 `position: relative; width: 393px; height: 852px; overflow: hidden`으로 고정한다.
- 폼 요소의 위치·크기에 `%`, `vw`, `flex: 1`, `width: 100%`, `position: fixed`, `transform: translate(...)`를 사용하지 않는다.
- 전화번호 input은 전화번호 입력 상자 내부에 한 번만 렌더링한다.
- 인증번호 input과 약관 동의 행은 서로 다른 형제 요소로 구현한다.
- 화면을 고친 뒤 `393 × 852px` 캡처로 제목·입력창·약관·하단 버튼이 명세 좌표에 맞는지 확인한다.
