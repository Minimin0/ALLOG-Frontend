import { useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';

import { useVerificationStore } from '@/stores/verificationStore.js';

// 사진 촬영. 백엔드가 정제·저장할 수 있는 타입은 image/jpeg와 image/png뿐이라
// 동영상 녹화(recordAsync) 대신 takePictureAsync로 JPEG 한 장을 찍는다.
export default function CameraScreen() {
  const router = useRouter();
  const setMedia = useVerificationStore((s) => s.setMedia);
  const cameraRef = useRef(null);
  const [camPerm, requestCam] = useCameraPermissions();
  const [busy, setBusy] = useState(false);

  const takePhoto = async () => {
    if (busy || !cameraRef.current) return;
    setBusy(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8, skipProcessing: false });
      if (photo?.uri) {
        setMedia({ uri: photo.uri, type: 'photo', contentType: 'image/jpeg' });
        router.replace('/verify/preview');
        return;
      }
    } catch {
      // 촬영 실패는 그대로 카메라에 머물러 다시 시도하게 둔다.
    }
    setBusy(false);
  };

  if (!camPerm) return <View className="flex-1 bg-black" />;

  if (!camPerm.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-8">
        <Text className="text-center text-[15px] text-white/80">인증 사진을 찍으려면 카메라 권한이 필요해요.</Text>
        <Pressable onPress={requestCam} className="mt-4 rounded-pill bg-white px-6 py-3">
          <Text className="font-bold text-black">권한 허용</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <View className="items-center pb-3 pt-14">
        <Text className="text-[13px] font-medium text-white/70">오늘의 루틴이 보이도록 한 장 찍어주세요</Text>
      </View>

      {/* 라이브 프리뷰 */}
      <View className="mx-5 flex-1 overflow-hidden rounded-[44px]">
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" mode="picture" />
      </View>

      {/* 촬영 버튼 */}
      <View className="items-center py-8">
        <Pressable
          onPress={takePhoto}
          disabled={busy}
          className="h-16 w-16 rounded-full bg-white"
          style={{ opacity: busy ? 0.7 : 1 }}
        />
      </View>
    </View>
  );
}
