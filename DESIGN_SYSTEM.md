# ALLOG 디자인 시스템

Figma 디자인에서 추출한 색·타이포·모양 토큰과 재사용 컴포넌트 규칙.
**모든 화면은 이 토큰만 사용한다** — 색/크기를 직접 하드코딩하지 않는다.

## 핵심 원칙

1. **색은 CSS 변수로만.** `src/styles/variables.css`가 단일 진실 공급원(single source of truth).
   여기 값만 바꾸면 `tailwind.config.js`를 통해 전 화면 색이 한 번에 바뀐다.
2. **Tailwind 유틸 클래스로 적용.** 예: `bg-primary`, `text-ink`, `rounded-card`, `text-display`.
   임의값(`bg-[#14453a]`)을 쓰지 말 것 — 토큰 클래스를 쓴다.
2-1. **className을 못 쓰는 자리는 `src/theme.js`.** `ActivityIndicator color`,
   `placeholderTextColor`, `react-native-svg`의 `stroke`/`fill`, `StyleSheet` 값에는
   `import { colors } from '@/theme'` 후 `colors.primary`처럼 쓴다. hex를 직접 쓰지 않는다.
   (`mobile/` 화면은 상대경로 `../../theme`으로 같은 파일을 본다.)
3. **숫자/점수/랭킹 같은 데이터는 `src/utils`의 함수로.** 화면에 계산을 하드코딩하지 않는다.

---

## 색상 토큰

역할별로 정의돼 있고, `bg-*` / `text-*` / `border-*` 어디에나 쓸 수 있다.

| 역할 | Tailwind 클래스 | CSS 변수 | Hex | 용도 |
|---|---|---|---|---|
| 브랜드 메인 | `primary` | `--color-primary` | `#14453a` | 진행바·점수·핵심 버튼·강조 |
| 브랜드(어두움) | `primary-dark` | `--color-primary-dark` | `#0e3229` | 눌림/hover |
| 브랜드 틴트 | `primary-tint` | `--color-primary-tint` | `#edf2ec` | 파스텔 카드 배경 |
| 리워드(골드) | `reward` | `--color-reward` | `#c08a24` | 보상 포인트·목표 강조 |
| 리워드 틴트 | `reward-tint` | `--color-reward-tint` | `#f7f1e0` | 골드 파스텔(시상대 1위) |
| 화면 배경 | `bg` | `--color-bg` | `#f7f6f3` | 페이지 바탕(크림) |
| 카드 | `surface` | `--color-surface` | `#fefefe` | 카드 배경 |
| 카드(회색) | `surface-alt` | `--color-surface-alt` | `#eae9e7` | 보조 카드·아바타 placeholder |
| 본문 | `ink` | `--color-ink` | `#111111` | 기본 텍스트 |
| 보조 텍스트 | `muted` | `--color-muted` | `#6b7268` | 캡션·비활성 탭 |
| 라벨 | `subtle` | `--color-subtle` | `#4a4a4a` | 작은 라벨 |
| 비활성 | `disabled` | `--color-disabled` | `#bababa` | 비활성 버튼·구분선 |
| 테두리 | `line` | `--color-line` | `#e7e3d8` | 카드 border·divider |
| 어두운 배경 위 텍스트 | `on-dark` | `--color-on-dark` | `#e7e3d8` | 딥브라운 리워드 카드 안의 글자. `line`과 값만 같고 역할이 다르다 |
| 하트 | `heart` | `--color-heart` | `#d9573b` | 하트 잔량·소모 안내 |
| 브랜드(연함) | `primary-light` | `--color-primary-light` | `#669884` | 진행률 강조 숫자·게이지 |
| 민트 배지 | `mint-badge` | `--color-mint-badge` | `#e5f4e8` | 배지 배경·어두운 버튼 위 글자 |
| 베이지 아이콘 | `beige-icon` | `--color-beige-icon` | `#f3efe4` | 아이콘 원형 배경 |
| 보조 버튼 | `gray-btn` | `--color-gray-btn` | `#f0eee8` | 수량 +/- 등 보조 버튼 배경 |
| 회색 테두리 | `gray-border` | `--color-gray-border` | `#d9d9d9` | 입력 테두리·스위치 off 트랙 |

### 상태색 (인증 흐름)

| 상태 | 클래스 | Hex | 의미 |
|---|---|---|---|
| 성공 | `success` | `#14453a` | 인증 성공(= 브랜드 그린) |
| 검토중/목표 | `warning` | `#c08a24` | AI 검토중·목표 안내(골드) |
| 재인증/실패 | `danger` | `#c0492f` | 재인증 요청·인증 실패(테라코타) |

### 랭킹 메달색

| 순위 | 테두리 클래스 | 배경 클래스(틴트) |
|---|---|---|
| 1위 | `border-rank-gold` (`#f6b424`) | `bg-rank-gold-tint` |
| 2위 | `border-rank-silver` (`#bababa`) | `bg-rank-silver-tint` |
| 3위 | `border-rank-bronze` (`#cba04d`) | `bg-rank-bronze-tint` |

---

## 타이포그래피

폰트: **Pretendard Variable** (CDN, `globals.css`에서 로드). weight는 `font-bold`/`font-semibold`/`font-medium`로 조절.

| 클래스 | 크기 | 기본 weight | 용도 |
|---|---|---|---|
| `text-display` | 28px | Bold | 페이지 타이틀 |
| `text-h2` | 22px | SemiBold | 화면/카드 제목 |
| `text-score` | 25px | Bold | 큰 점수·순위 숫자 |
| `text-section` | 17px | SemiBold | 탭·섹션 헤더 |
| `text-body` | 15px | — | 본문·버튼 |
| `text-label` | 12px | Bold | 소형 라벨 |
| `text-caption` | 11px | — | 캡션·설명 |
| `text-nav` | 10px | Bold | 하단 네비 |

---

## 모양 (Radius)

| 클래스 | 값 | 용도 |
|---|---|---|
| `rounded-card` | 24px | 큰 카드 |
| `rounded-item` | 15px | 리스트 행·입력창 |
| `rounded-pill` | 9999px | 알약형 버튼 |

---

## 재사용 컴포넌트

### `RankingItem` (`components/group/RankingItem.jsx`)
랭킹 한 줄. 그룹 랭킹·전체 랭킹 공통.

```jsx
<RankingItem
  rank={1}                 // 1·2·3위는 메달, 그 외 숫자
  name="서준"
  caption="94점"           // 자유 문자열
  isMe={true}              // "나" 배지 표시
  avatarUrl={null}         // 없으면 회색 원
/>
```

### 데이터 → 화면 파이프라인 (점수/랭킹)
```
breakdown(4요소 0~1)
  └ utils/score.js  calcScore()   → { total, parts }
  └ utils/ranking.js rankMembers() → 정렬 + 조밀 순위(1-2-2-3)
  └ components/group/RankingItem   → 렌더
```
점수 가중치(개인35·그룹25·연속20·기여20)는 `utils/score.js`의 `SCORE_WEIGHTS` 한 곳에만 있다.

---

## 자주 쓰는 패턴

```jsx
// 기본 버튼(주요/보조)
<button className="rounded-pill bg-primary py-3 text-body font-semibold text-white">확인</button>
<button className="rounded-pill bg-disabled py-3 text-body font-semibold text-white">비활성</button>

// 카드
<div className="rounded-card border border-line bg-surface p-4">…</div>

// 상태 텍스트
<span className="text-caption text-danger">재인증 필요</span>

// 진행바
<div className="h-2 w-full rounded-pill bg-disabled">
  <div className="h-full rounded-pill bg-primary" style={{ width: '87%' }} />
</div>
```

---

## 토큰을 바꾸려면

1. **색/모양/폰트 크기** → `src/styles/variables.css`의 변수만 수정.
2. **새 색·클래스를 추가**할 때만 `tailwind.config.js`에 매핑 추가.
3. 새 클래스가 안 먹으면 dev 서버 재시작(Tailwind가 새 파일을 스캔하도록).
