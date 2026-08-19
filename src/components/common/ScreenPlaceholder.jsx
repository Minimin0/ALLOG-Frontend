import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// RN 마이그레이션용 임시 화면. 다음 배치에서 실제 포팅으로 대체된다.
export default function ScreenPlaceholder({ title, note = '이 화면은 다음 배치에서 포팅됩니다.' }) {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      <View className="px-[30px] pt-4">
        <Text className="text-[28px] font-bold text-ink">{title}</Text>
      </View>
      <View className="flex-1 items-center justify-center px-8">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-tint">
          <Text className="text-3xl">🌱</Text>
        </View>
        <Text className="mt-4 text-center text-[15px] font-semibold text-muted">{note}</Text>
      </View>
    </SafeAreaView>
  );
}
