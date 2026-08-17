import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { isFirebaseConfigured, missingKeys } from '@/services/firebase.js';

// Firebase 설정 상태 확인 (웹 FirebaseDebugPage 포팅).
export default function FirebaseDebugScreen() {
  const router = useRouter();
  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg px-6 pt-6">
      <Pressable onPress={() => router.back()} className="mb-4 h-8 w-8 items-center justify-center"><Text className="text-2xl text-ink">‹</Text></Pressable>
      <Text className="text-[22px] font-bold text-ink">Firebase 상태</Text>

      <View className="mt-6 rounded-card border border-line bg-surface p-5">
        <View className="flex-row items-center gap-2">
          <View className={`h-3 w-3 rounded-full ${isFirebaseConfigured ? 'bg-success' : 'bg-danger'}`} />
          <Text className="text-[15px] font-bold text-ink">{isFirebaseConfigured ? '설정 완료' : '설정 필요'}</Text>
        </View>
        {isFirebaseConfigured ? (
          <Text className="mt-3 text-[13px] text-muted">EXPO_PUBLIC_FIREBASE_* 값이 모두 채워져 있어요.</Text>
        ) : (
          <View className="mt-3">
            <Text className="text-[13px] text-muted">비어 있는 환경변수:</Text>
            {missingKeys.map((k) => (
              <Text key={k} className="mt-1 text-[12px] font-semibold text-danger">• EXPO_PUBLIC_{k.replace(/([A-Z])/g, '_$1').toUpperCase()}</Text>
            ))}
            <Text className="mt-3 text-[12px] text-muted">.env.example을 참고해 .env를 만들고 백엔드 키를 채우면 로그인이 활성화돼요.</Text>
          </View>
        )}
      </View>

      <Pressable onPress={() => router.replace('/onboarding/basic-info')} className="mt-auto mb-4 h-[52px] items-center justify-center rounded-pill bg-primary">
        <Text className="text-[15px] font-bold text-white">계속</Text>
      </Pressable>
    </SafeAreaView>
  );
}
