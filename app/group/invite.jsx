import { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { ApiError } from '@/services/api';
import { issueInviteCode } from '@/services/inviteApi';

// 비공개 그룹 초대 코드. 코드는 백엔드가 발급한다(POST /me/groups/{id}/invite).
export default function InviteGroupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const groupId = Array.isArray(params.groupId) ? params.groupId[0] : params.groupId;
  const [code, setCode] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!groupId) {
      setError('그룹을 알 수 없어요.');
      return;
    }
    issueInviteCode(groupId).then((response) => {
      if (response.ok) setCode(response.data?.code ?? null);
      else if (response.errorCode === ApiError.CONFLICT) setError('공개 그룹은 초대 코드가 필요 없어요.');
      else if (response.errorCode === ApiError.NOT_FOUND) setError('내가 만든 그룹이 아니에요.');
      else if (response.errorCode === ApiError.NETWORK) setError('서버에 연결할 수 없어요.');
      else setError('초대 코드를 만들지 못했어요.');
    });
  }, [groupId]);

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 items-center justify-center gap-6 bg-bg px-8">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-tint">
        <Text className="text-3xl">🔗</Text>
      </View>
      <Text className="text-center text-[19px] font-bold text-ink">그룹에 친구를 초대해요</Text>
      <View className="w-full items-center rounded-[20px] border border-line bg-surface py-6">
        <Text className="text-[12px] font-semibold text-muted">초대 코드</Text>
        {error ? (
          <Text className="mt-2 px-4 text-center text-[13px] font-semibold text-danger">{error}</Text>
        ) : code ? (
          <Text className="mt-1 text-[24px] font-bold tracking-widest text-primary">{code}</Text>
        ) : (
          <ActivityIndicator className="mt-2" color="#4b7f63" />
        )}
      </View>
      <Pressable
        onPress={() => router.replace(groupId ? { pathname: '/group', params: { groupId } } : '/group')}
        className="w-full items-center justify-center rounded-[27.5px] bg-ink py-4"
      >
        <Text className="text-[15px] font-bold text-white">그룹으로 이동</Text>
      </Pressable>
    </SafeAreaView>
  );
}
