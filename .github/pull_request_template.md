## Goal

<!-- 이 PR이 완료하는 사용자·운영 목표를 한 문단으로 작성하세요. -->

## Why and scope

<!-- 왜 지금 필요한지, 의도적으로 제외한 범위를 작성하세요. -->

## Change type

- [ ] Feature
- [ ] Bug fix
- [ ] Refactor
- [ ] Test / validation
- [ ] Documentation / process
- [ ] Configuration

## Files and runtime effect

<!-- 주요 파일과 canonical Expo Router runtime에 미치는 영향을 작성하세요. -->

## UI effect

- [ ] UI visual change 없음
- [ ] UI visual change 있음 — 아래 Android evidence와 screenshots를 첨부함
- [ ] UI visual change 있음 — Android runtime evidence가 아직 없음; blocker와 후속 검증을 아래에 기록함

## API and backend authority

- [ ] API contract 변경 없음
- [ ] API contract 변경 있음 — 기존/변경 contract와 frontend·backend 영향 작성
- [ ] Heart, Reward, group lifecycle, deadline, final verification business decision을 client에서 새로 계산하거나 결정하지 않음

## Test evidence

- [ ] `npm ci`
- [ ] `node src/services/api.check.mjs`
- [ ] `node src/stores/onboardingStore.check.mjs`
- [ ] `npx expo export --platform android`
- [ ] `git diff --check`
- [ ] 변경 범위에 맞는 추가 검증 실행: <!-- 명령과 결과 -->

## Android runtime evidence

<!-- device/emulator, Android/API level, resolution/density, font scale, locale, theme, launch/navigation/interaction 결과를 작성하세요. 미실행이면 이유와 필요한 후속 조치를 작성하세요. -->

## Screenshots / visual diff summary

<!-- UI change가 있으면 전후 screenshot 또는 diff 요약을 첨부하세요. 비결정 영역은 명시하세요. -->

## Security and review

- [ ] secret, private key, local `.env`, server filesystem path가 포함되지 않음
- [ ] author self-review 완료
- [ ] 필요한 문서 갱신 완료
- [ ] reviewer: <!-- GitHub handle 또는 pending 사유 -->

## Known deferred / approval required

<!-- branch protection, Android device verification, policy decision 등 merge 전에 알아야 할 미완료 사항 -->
