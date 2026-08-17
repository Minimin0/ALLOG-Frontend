import { useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const categories = ['수분케어', '식사', '운동', '수면'];
const durations = ['7일', '14일', '30일'];

// 그룹 만들기 (웹 CreateGroupPage 포팅).
export default function CreateGroupScreen() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('14일');
  const [capacity, setCapacity] = useState(5);
  const [visibility, setVisibility] = useState('public');
  const canSubmit = category && name.trim().length > 0;

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <View className="flex-row items-center gap-3 px-5 py-3">
        <Pressable onPress={() => router.back()} className="h-[43px] w-[43px] items-center justify-center rounded-full border border-line bg-surface">
          <Text className="text-xl text-ink">‹</Text>
        </Pressable>
        <Text className="text-[19px] font-bold text-ink">그룹 만들기</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="gap-6 pb-8">
        <View>
          <Text className="mb-2 text-[15px] font-bold text-ink">카테고리 선택</Text>
          <View className="flex-row flex-wrap gap-2">
            {categories.map((c) => {
              const active = category === c;
              return (
                <Pressable key={c} onPress={() => setCategory(c)} className={`rounded-full border px-4 py-2 ${active ? 'border-primary bg-primary-pale' : 'border-line bg-surface'}`}>
                  <Text className={`text-[13px] font-semibold ${active ? 'text-ink' : 'text-subtle'}`}>{c}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View>
          <Text className="mb-2 text-[15px] font-bold text-ink">그룹명</Text>
          <TextInput value={name} onChangeText={setName} placeholder="매일 물 2L 마시기" placeholderTextColor="#bababa"
            className="rounded-[15px] border border-line bg-surface px-4 py-4 text-[14px] text-ink" />
        </View>

        <View>
          <Text className="mb-2 text-[15px] font-bold text-ink">진행기간</Text>
          <View className="flex-row gap-3">
            {durations.map((d) => {
              const active = duration === d;
              return (
                <Pressable key={d} onPress={() => setDuration(d)} className={`flex-1 items-center rounded-[15px] border py-3 ${active ? 'border-primary bg-primary-pale' : 'border-line bg-surface'}`}>
                  <Text className={`text-[14px] font-bold ${active ? 'text-ink' : 'text-subtle'}`}>{d}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View>
          <Text className="mb-2 text-[15px] font-bold text-ink">참여 인원</Text>
          <View className="flex-row items-center justify-between rounded-[15px] border border-line bg-surface px-4 py-4">
            <Pressable onPress={() => setCapacity((p) => Math.max(2, p - 1))} className="h-8 w-8 items-center justify-center rounded-full bg-[#f0eee8]"><Text className="text-lg font-bold text-ink">−</Text></Pressable>
            <Text className="text-[16px] font-bold text-ink">{capacity}명</Text>
            <Pressable onPress={() => setCapacity((p) => Math.min(10, p + 1))} className="h-8 w-8 items-center justify-center rounded-full bg-[#f0eee8]"><Text className="text-lg font-bold text-ink">＋</Text></Pressable>
          </View>
        </View>

        <View>
          <Text className="mb-2 text-[15px] font-bold text-ink">공개 범위</Text>
          <View className="flex-row gap-3">
            {[
              { key: 'public', title: '공개', note: '누구나 참여할 수 있어요.' },
              { key: 'private', title: '비공개', note: '초대한 사람만 참여할 수 있어요.' },
            ].map((v) => {
              const active = visibility === v.key;
              return (
                <Pressable key={v.key} onPress={() => setVisibility(v.key)} className={`flex-1 items-center rounded-[15px] border px-3 py-4 ${active ? 'border-2 border-primary bg-primary-pale' : 'border-line bg-surface'}`}>
                  <Text className="text-[14px] font-bold text-ink">{v.title}</Text>
                  <Text className="mt-1 text-center text-[11px] font-medium text-subtle">{v.note}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable
          onPress={() => canSubmit && router.push('/group/created')}
          disabled={!canSubmit}
          className={`items-center justify-center rounded-[27.5px] py-4 ${canSubmit ? 'bg-primary' : 'bg-primary opacity-40'}`}
        >
          <Text className="text-[15px] font-bold text-white">그룹 만들기</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
