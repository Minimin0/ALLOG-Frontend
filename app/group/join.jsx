import { useState } from 'react';
import { View, Text, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ApiError } from '@/services/api';
import { joinByInviteCode } from '@/services/inviteApi';
import { useUserStore } from '@/stores/userStore';
import { colors } from '@/theme';

// 코드로 참여하기. 비공개 그룹은 공개 join으로 우회하지 않고 반드시 이 경로를 쓴다.
// 공개 참가와 동일하게 하트 1개를 쓰며, 차감은 백엔드가 한다.
export default function JoinByCodeScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onChange = (v) => {
    setCode(v.toUpperCase().slice(0, 32)); // 백엔드 제한: 공백 아님, 32자 이하
    setError('');
  };

  const submit = async () => {
    const trimmed = code.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    setError('');

    const response = await joinByInviteCode(trimmed);
    setBusy(false);

    if (response.ok) {
      await useUserStore.getState().loadStats();
      router.replace({ pathname: '/group/join-complete', params: { code: trimmed } });
      return;
    }

    if (response.errorCode === ApiError.INSUFFICIENT_HEARTS) setError('하트가 부족해요. 하트를 먼저 얻어주세요.');
    else if (response.errorCode === ApiError.NOT_FOUND) setError('존재하지 않는 코드예요. 코드를 다시 확인해주세요.');
    else if (response.errorCode === ApiError.CONFLICT) setError('이미 참가했거나 정원이 찬 그룹이에요.');
    else if (response.errorCode === ApiError.NETWORK) setError('서버에 연결할 수 없어요.');
    else setError('참여에 실패했어요. 잠시 후 다시 시도해주세요.');
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <View className="flex-row items-center gap-3 px-5 py-3">
        <Pressable onPress={() => router.back()} className="h-[43px] w-[43px] items-center justify-center rounded-[13px] bg-ink">
          <Text className="text-lg text-white">‹</Text>
        </Pressable>
        <Text className="text-[19px] font-bold text-ink">코드로 참여하기</Text>
      </View>

      <View className="flex-1 px-5">
        <Text className="mt-2 text-[13px] font-medium text-muted">친구에게 받은 초대 코드를 입력해주세요.</Text>

        <TextInput
          value={code}
          onChangeText={onChange}
          placeholder="ABC123"
          placeholderTextColor={colors.disabled}
          autoCapitalize="characters"
          autoCorrect={false}
          autoFocus
          maxLength={32}
          onSubmitEditing={submit}
          className="mt-5 rounded-[15px] border border-line bg-surface px-4 py-4 text-center text-[22px] font-bold text-ink"
          style={{ letterSpacing: 6 }}
        />

        {error ? <Text className="mt-2 text-center text-[12px] font-semibold text-heart">{error}</Text> : null}
      </View>

      <View className="px-5 pb-8">
        <Pressable
          onPress={submit}
          disabled={!code.trim() || busy}
          className={`items-center justify-center rounded-[27.5px] py-4 ${!code.trim() || busy ? 'bg-ink opacity-40' : 'bg-ink'}`}
        >
          {busy ? <ActivityIndicator color={colors.white} /> : <Text className="text-[15px] font-bold text-white">참여하기</Text>}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
