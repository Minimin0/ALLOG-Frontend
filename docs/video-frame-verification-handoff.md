# Video Frame Verification Handoff

## 목적과 경계

이 변경은 사용자가 **3초 무음 동영상**으로 루틴 장면을 확인한 뒤, 앱이 로컬에서 추출·정규화한 **JPEG 프레임 한 장만** 기존 인증 API로 제출하도록 한다. 동영상은 preview를 위한 transient cache URI이며, 인증 확정 직후 상태에서 제거된다. 동영상 파일이나 `video/mp4` MIME은 upload-intent, signed PUT, submit API에 전달되지 않는다.

기존 `openTodayVerification → requestUploadIntent → uploadToPresignedUrl → submitVerification` 흐름과 Backend authority는 변경하지 않았다. 업로드 artifact는 `contentType: image/jpeg`이고, backend의 signed JPEG upload 및 metadata sanitizer가 계속 권한을 가진다.

| 구분 | 최종 동작 |
|---|---|
| 촬영 | `CameraView mode="video" mute`와 `recordAsync({ maxDuration: 3 })` |
| 오디오/권한 | 카메라 권한만 요청하며 Android config의 `recordAudioAndroid`는 `false` |
| preview | `expo-video`가 loop·muted·native controls 없음으로 로컬 영상만 재생 |
| frame | 1,500ms thumbnail을 `expo-image-manipulator`로 명시 JPEG·0.8 compression으로 저장 |
| network artifact | JPEG frame URI만 기존 signed PUT에 전달 |
| retry | NETWORK 실패에는 기존 JPEG를 재사용하되, loading flow가 새 upload-intent를 발급 |
| retake | video URI, JPEG artifact, 이전 outcome을 모두 지운 뒤 새 촬영 |

## 검증된 자동 근거

`npm ci`, 기존 API·온보딩·canonical font 검사, `node scripts/video-frame-verification.check.mjs`, 토큰 정합성 검사, `git diff --check`, 그리고 `npx expo export --platform android`를 실행했다. 새 정적 검사는 `recordAsync`, `mute`, JPEG normalization, camera-only Android config, preview mute, video URI 정리, JPEG-only upload boundary, 그리고 금지된 video MIME/마이크 권한 패턴의 부재를 확인한다.

## Android Runtime QA — `DEFERRED_TO_FRONTEND_TEAM`

현재 실행 환경에는 ADB가 연결된 Android device/emulator가 없다. 따라서 아래 항목은 통과로 표시하지 않으며, merge 전에 실제 Android에서 확인해야 한다.

| 검증 항목 | 기대 결과 |
|---|---|
| Cold launch 및 Pretendard | 앱이 정상 시작되고 기본 텍스트가 일관되게 렌더링된다. |
| Camera permission | 카메라만 요청되고 마이크 권한 dialog가 나타나지 않는다. |
| 3초 capture | capture를 누르면 무음 recording이 시작되어 3초 후 자동 종료된다. |
| Frame extraction | 1.5초 frame이 JPEG로 생성되며 실패 시 재촬영 안내가 보인다. |
| Preview | 영상이 무음·loop로 재생되고 native controls로 audio를 켤 수 없다. |
| Retake | 새 촬영 뒤 이전 video/JPEG/outcome이 남지 않는다. |
| Submit | signed PUT에는 JPEG만 전송되고 video upload request가 생기지 않는다. |
| Network retry | NETWORK 실패 시 재촬영 없이 JPEG로 재시도하고 새 upload-intent를 발급한다. |
| Backend status | 제출 후 Home/verification 표시는 서버 response·group progress만 사용하며 local approval을 만들지 않는다. |
| Device conditions | Safe Area, back navigation, portrait rotation, 낮은 저장공간, 네트워크 retry를 확인한다. |

## Donor reference

`haewon060310/ALLOG-FRONTEND`의 `e96ac8b → 2fa11ad` 범위는 UX reference로만 분석했다. 적용한 의도는 짧은 무음 동영상 capture와 video preview뿐이다. donor의 `verifiedToday`, mock result, local Heart/Reward state, legacy mobile navigation, web dependency, 파일/lockfile은 포팅하지 않았다.

## Merge order

이 브랜치는 open PR #12와 #13의 stacked integration head를 base로 한다. 권장 순서는 PR #12의 Android QA·Human review·merge, PR #13의 main rebasing/merge, 본 PR의 main rebase·Android QA 재확인·Human review·merge다. 자동 merge는 하지 않는다.

## References

[1]: https://docs.expo.dev/versions/v54.0.0/sdk/camera/ "Expo Camera SDK 54"
[2]: https://docs.expo.dev/versions/v54.0.0/sdk/video-thumbnails/ "Expo VideoThumbnails SDK 54"
[3]: https://docs.expo.dev/versions/v54.0.0/sdk/imagemanipulator/ "Expo ImageManipulator SDK 54"
[4]: https://docs.expo.dev/versions/v54.0.0/sdk/video/ "Expo Video SDK 54"
[5]: https://github.com/haewon060310/ALLOG-FRONTEND/compare/e96ac8bf2b6470b690f9846a906df7bb825bd670...2fa11ad84873df54ef8bcd3acc0ecd392e8c9188 "Donor comparison"
