import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';

import { useVerificationStore } from '@/stores/verificationStore.js';

// 동영상 촬영 (웹 getUserMedia+MediaRecorder → expo-camera recordAsync).
// 점 3개가 1초마다 채워지고, 3초 후 자동 정지 → 미리보기로.
export default function CameraScreen() {
  const router = useRouter();
  const setMedia = useVerificationStore((s) => s.setMedia);
  const cameraRef = useRef(null);
  const permissionRequested = useRef(false);
  const [camPerm, requestCam] = useCameraPermissions();
  const [recording, setRecording] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (
      camPerm &&
      !camPerm.granted &&
      camPerm.canAskAgain &&
      !permissionRequested.current
    ) {
      permissionRequested.current = true;
      requestCam();
    }
  }, [camPerm, requestCam]);

  const startRecording = async () => {
    if (recording || !cameraRef.current) return;
    setRecording(true);
    setProgress(0);
    const timer = setInterval(() => setProgress((p) => Math.min(p + 1, 3)), 1000);
    try {
      const video = await cameraRef.current.recordAsync({ maxDuration: 3 });
      clearInterval(timer);
      if (video?.uri) {
        setMedia({ uri: video.uri, type: 'video' });
        router.replace('/verify/preview');
      } else {
        setRecording(false);
      }
    } catch {
      clearInterval(timer);
      setRecording(false);
    }
  };

  if (!camPerm) return <View className="flex-1 bg-black" />;

  if (!camPerm.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-8">
        <Text className="text-center text-[15px] text-white/80">운동 인증 영상을 찍으려면 카메라 권한이 필요해요.</Text>
        <Pressable onPress={requestCam} className="mt-4 rounded-pill bg-white px-6 py-3">
          <Text className="font-bold text-black">권한 허용</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* 진행 점 3개 */}
      <View className="flex-row justify-center gap-2 pt-14 pb-3">
        {[0, 1, 2].map((i) => (
          <View key={i} className={`h-2.5 w-2.5 rounded-full ${i < progress ? 'bg-[#3ddc84]' : 'bg-white/30'}`} />
        ))}
      </View>

      {/* 라이브 프리뷰 */}
      <View className="mx-5 flex-1 overflow-hidden rounded-[44px]">
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" mode="video" mute />
      </View>

      {/* 촬영 버튼 */}
      <View className="items-center py-8">
        <Pressable
          onPress={startRecording}
          disabled={recording}
          className="h-16 w-16 rounded-full bg-white"
          style={{ opacity: recording ? 0.7 : 1 }}
        />
      </View>
    </View>
  );
}
