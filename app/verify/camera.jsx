import { useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';

import { useVerificationStore } from '@/stores/verificationStore.js';

const RECORDING_SECONDS = 3;
const FRAME_TIME_MS = 1500;

export default function CameraScreen() {
  const router = useRouter();
  const setCapture = useVerificationStore((s) => s.setCapture);
  const cameraRef = useRef(null);
  const [camPerm, requestCam] = useCameraPermissions();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [captureError, setCaptureError] = useState(null);

  const recordVerification = async () => {
    if (busy || !cameraReady || !cameraRef.current) return;

    setBusy(true);
    setCaptureError(null);
    setProgress(0);
    const timer = setInterval(() => setProgress((current) => Math.min(current + 1, RECORDING_SECONDS)), 1000);
    try {
      const video = await cameraRef.current.recordAsync({ maxDuration: RECORDING_SECONDS });
      clearInterval(timer);
      if (!video?.uri) {
        setCaptureError('영상을 저장하지 못했어요. 다시 촬영해주세요.');
        return;
      }

      setProgress(RECORDING_SECONDS);
      const frame = await VideoThumbnails.getThumbnailAsync(video.uri, {
        time: FRAME_TIME_MS,
        quality: 0.8,
      });
      const jpeg = await ImageManipulator.manipulateAsync(frame.uri, [], {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
      });
      if (!jpeg?.uri) {
        setCaptureError('인증 사진을 만들지 못했어요. 다시 촬영해주세요.');
        return;
      }

      // The video stays local for muted preview only. The upload flow receives this JPEG artifact.
      setCapture({
        videoUri: video.uri,
        media: { uri: jpeg.uri, type: 'frame', contentType: 'image/jpeg' },
      });
      router.replace('/verify/preview');
    } catch {
      setCaptureError('인증 사진을 만들지 못했어요. 다시 촬영해주세요.');
    } finally {
      clearInterval(timer);
      setBusy(false);
    }
  };

  if (!camPerm) return <View className="flex-1 bg-black" />;

  if (!camPerm.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-8">
        <Text className="text-center text-[15px] text-white/80">운동 인증 영상을 촬영하려면 카메라 권한이 필요해요.</Text>
        <Pressable onPress={requestCam} className="mt-4 rounded-pill bg-white px-6 py-3">
          <Text className="font-bold text-black">권한 허용</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <View className="flex-row justify-center gap-2 pb-3 pt-14">
        {[0, 1, 2].map((index) => (
          <View key={index} className={`h-2.5 w-2.5 rounded-full ${index < progress ? 'bg-[#3ddc84]' : 'bg-white/30'}`} />
        ))}
      </View>

      <View className="mx-5 flex-1 overflow-hidden rounded-[44px]">
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="back"
          mode="video"
          mute
          onCameraReady={() => setCameraReady(true)}
          onMountError={() => {
            setCameraReady(false);
            setCaptureError('카메라를 시작하지 못했어요. 권한과 기기를 확인해주세요.');
          }}
        />
      </View>

      <View className="items-center py-8">
        <View className="h-[82px] w-[82px] items-center justify-center">
          {busy && (
            <Svg width={82} height={82} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
              <Circle cx={41} cy={41} r={37} fill="none" stroke="rgba(255,255,255,.25)" strokeWidth={4} />
              <Circle cx={41} cy={41} r={37} fill="none" stroke="#ffffff" strokeWidth={4} strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 37}`} strokeDashoffset={(2 * Math.PI * 37) * (1 - progress / RECORDING_SECONDS)} />
            </Svg>
          )}
          <Pressable
            onPress={recordVerification}
            disabled={busy || !cameraReady}
            className="h-[68px] w-[68px] items-center justify-center rounded-full border-[5px] border-white"
            style={{ opacity: !cameraReady ? 0.7 : 1 }}
          >
            <View className={`h-[50px] w-[50px] ${busy ? 'rounded-[14px]' : 'rounded-full'} bg-white`} />
          </Pressable>
        </View>
        <Text className="mt-3 text-center text-[13px] text-white/80">{captureError ?? (busy ? `3초 촬영 중 · ${Math.min(progress + 1, RECORDING_SECONDS)}초` : '3초 동안 루틴을 촬영해요')}</Text>
      </View>
    </View>
  );
}
