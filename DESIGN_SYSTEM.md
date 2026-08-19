# ALLOG 디자인 시스템

ALLOG Android-first Expo 앱의 색상·타이포그래피·형상 토큰과 사용 경계를 정의한다. 이 문서는 현재 **Expo Router runtime**을 기준으로 하며, 웹 전용 JSX 예제를 제공하지 않는다.

## Runtime source of truth

| 역할 | 파일 | 적용 위치 | 변경 규칙 |
|---|---|---|---|
| JS/StyleSheet/SVG 토큰 | `src/theme.js` | `StyleSheet`, `ActivityIndicator`, `placeholderTextColor`, SVG `fill`/`stroke` | `tailwind.config.js`와 함께 수정한다. |
| NativeWind 클래스 토큰 | `tailwind.config.js` | `className`이 있는 `app/**`·`src/**` 컴포넌트 | `src/theme.js`와 같은 semantic value를 유지한다. |
| 참고 팔레트 | `src/styles/variables.css` | runtime import 없음 | 화면 값을 바꾸지 않는다. 필요할 때만 두 runtime SSOT를 반영해 기록을 맞춘다. |
| 폰트 로더 | `app/_layout.jsx` | canonical `expo-router/entry` root | `mobile/assets/fonts/PretendardVariable.ttf`를 `expo-font`로 로드하고 준비 전 splash를 유지한다. |

> `mobile/App.js`는 canonical entry가 아니다. 다만 `mobile/src/**`의 화면은 `src/components/MobileScreenRoute.jsx`를 통해 Expo Router route에서 실제로 사용된다. 이 트리는 `mobile/src/theme.js` re-export와 `StyleSheet`를 사용하며 현재 `className`을 사용하지 않는다.

## 핵심 원칙

1. `className`이 가능한 React Native 컴포넌트에서는 `bg-primary`, `text-ink`, `rounded-card`처럼 semantic NativeWind 클래스를 쓴다. `bg-[#14453a]` 같은 임의값은 사용하지 않는다.
2. `className`을 쓸 수 없는 값에는 `import { colors } from '@/theme'` 후 `colors.primary`처럼 JS 토큰을 쓴다.
3. 반복되는 semantic 색상·radius·type scale만 토큰으로 승격한다. 일회성 gradient stop, 투명 overlay, 공식 소셜 브랜드색은 무조건 토큰화하지 않는다.
4. Heart, reward, ranking, deadline, group lifecycle, verification outcome은 UI가 계산하거나 결정하지 않는다. backend response를 표시·해석만 한다.

## 색상 토큰

| 역할 | NativeWind | JS | 값 |
|---|---|---|---|
| 브랜드 | `primary`, `primary-dark`, `primary-tint`, `primary-pale` | `primary`, `primaryDark`, `primaryTint`, `primaryPale` | `#14453a`, `#0e3229`, `#edf2ec`, `#eaf4ec` |
| 리워드 | `reward`, `reward-tint` | `reward`, `rewardTint` | `#c08a24`, `#f7f1e0` |
| 표면 | `bg`, `surface`, `surface-alt` | `bg`, `surface`, `surfaceAlt` | `#f7f6f3`, `#fefefe`, `#eae9e7` |
| 텍스트·선 | `ink`, `muted`, `subtle`, `disabled`, `line`, `on-dark` | 같은 camelCase 이름 | semantic role별 `src/theme.js` 값 |
| 상태 | `success`, `warning`, `danger`, `heart` | `primary`/`reward` alias 및 `danger`, `heart` | success·warning은 기존 브랜드/리워드 값과 일치 |
| 보조·순위 | `primary-light`, `mint-badge`, `beige-icon`, `gray-btn`, `gray-border`, `rank-gold`, `rank-silver`, `rank-bronze` | 같은 camelCase 이름 | `src/theme.js` 값 |

`white`, `black`은 Tailwind 기본 색상 클래스를 사용한다. `spinner`는 JS 전용 `ActivityIndicator` 토큰이다.

## Typography and radius

Pretendard Variable은 canonical root가 로드하며 `Text`와 `TextInput`의 기본 `fontFamily`다. text size와 radius는 다음 semantic names를 쓴다.

| 목적 | NativeWind | JS token | 값 |
|---|---|---|---|
| 페이지 제목 | `text-display` | `font.display` | 28 |
| 화면·카드 제목 | `text-h2` | `font.h2` | 22 |
| 점수 | `text-score` | `font.score` | 25 |
| 섹션 | `text-section` | `font.section` | 17 |
| 본문 | `text-body` | `font.body` | 15 |
| 라벨·캡션·탭 | `text-label`, `text-caption`, `text-nav` | `font.label`, `font.caption`, `font.nav` | 12, 11, 10 |
| 큰 카드·행·pill | `rounded-card`, `rounded-item`, `rounded-pill` | `radius.card`, `radius.item`, `radius.pill` | 24, 15, 9999 |

## React Native patterns

```jsx
import { Pressable, Text, View } from 'react-native';

<Pressable className="rounded-pill bg-primary py-3 active:opacity-90">
  <Text className="text-center text-body font-semibold text-white">확인</Text>
</Pressable>

<View className="rounded-card border border-line bg-surface p-4">
  <Text className="text-h2 text-ink">카드 제목</Text>
  <Text className="mt-1 text-caption text-muted">설명</Text>
</View>
```

```jsx
import { ActivityIndicator } from 'react-native';
import { colors } from '@/theme';

<ActivityIndicator color={colors.spinner} />
```

## Token maintenance check

토큰을 바꿀 때 `src/theme.js`와 `tailwind.config.js`의 같은 semantic value를 diff로 함께 검토한다. 아래 검증을 실행한다.

```sh
node scripts/canonical-font.check.mjs
npx expo export --platform android
```

일회성 audit script는 repository에 추가하지 않는다. maintainer가 별도로 실행한 경우에는 명령·결과를 PR 또는 handoff report에 기록한다.

## Android UI change boundary

새 UI 작업은 canonical `app/**` routes 또는 그것이 사용하는 `src/**`·`mobile/src/**` 화면에서 수행한다. layout, typography, branding, icon, animation, spacing 변경은 PR에 Android runtime evidence와 screenshot을 첨부한다. 화면·계약·authority를 동시에 바꾸는 대형 PR은 피하고, runtime fix와 docs/process change를 별도로 검토 가능하게 분리한다.
