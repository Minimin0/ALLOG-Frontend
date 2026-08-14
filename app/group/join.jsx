import { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { mockGroup } from '@/data/mockGroups.js';

// 코드로 참여하기 (웹 JoinByCodePage 포팅). 6자리 초대 코드 → 그룹 이동.
export default function JoinByCodeScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const onChange = (v) => {
    setCode(v.toUpperCase().slice(0, 6));
    setError('');
  };

  const submit = () => {
    if (code.trim().length < 6) return;
    if (code === mockGroup.inviteCode) {
      router.replace('/group');
    } else {
      setError('존재하지 않는 코드예요. 코드를 다시 확인해주세요.');
    }
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
        <Text className="mt-2 text-[13px] font-medium text-muted">친구에게 받은 6자리 초대 코드를 입력해주세요.</Text>

        <TextInput
          value={code}
          onChangeText={onChange}
          placeholder="ABC123"
          placeholderTextColor="#bababa"
          autoCapitalize="characters"
          autoFocus
          maxLength={6}
          className="mt-5 rounded-[15px] border border-line bg-surface px-4 py-4 text-center text-[22px] font-bold text-ink"
          style={{ letterSpacing: 6 }}
        />

        {error ? <Text className="mt-2 text-center text-[12px] font-semibold text-[#d9573b]">{error}</Text> : null}
      </View>

      <View className="px-5 pb-8">
        <Pressable
          onPress={submit}
          disabled={code.trim().length < 6}
          className={`items-center justify-center rounded-[27.5px] py-4 ${code.trim().length < 6 ? 'bg-ink opacity-40' : 'bg-ink'}`}
        >
          <Text className="text-[15px] font-bold text-white">참여하기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
