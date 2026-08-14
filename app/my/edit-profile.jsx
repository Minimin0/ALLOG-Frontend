import { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import Icon from '@/components/common/Icon';
import SleepTimeDial from '@/components/common/SleepTimeDial';

// 프로필 편집 (웹 EditProfilePage 포팅).
const genders = ['여성', '남성', '선택 안함'];
const coachStyles = [
  { name: '응원형', icon: 'coach' },
  { name: '압박형', icon: 'pressure' },
  { name: '팩트형', icon: 'fact' },
  { name: '유머형', icon: 'humor' },
];
const exerciseOptions = ['주 1회', '주 2회', '주 3회', '주 4회', '주 5회', '거의 안함'];
const waterOptions = ['0.5L 미만', '0.5L~1L', '1L~1.5L', '1.5L~2L', '2L 이상'];

function FieldChip({ active, children, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-[15px] border px-3.5 py-2.5 ${active ? 'border-primary bg-primary-pale' : 'border-line bg-surface'}`}
    >
      <Text className={`text-[12px] font-semibold ${active ? 'text-ink' : 'text-[#4a4a4a]'}`}>{children}</Text>
    </Pressable>
  );
}

function Divider() {
  return <View className="h-px bg-line" />;
}

export default function EditProfile() {
  const router = useRouter();
  const [nickname, setNickname] = useState('민지');
  const [gender, setGender] = useState('여성');
  const [year, setYear] = useState('2000');
  const [month, setMonth] = useState('07');
  const [day, setDay] = useState('30');
  const [height, setHeight] = useState('165');
  const [weight, setWeight] = useState('50');
  const [coachStyle, setCoachStyle] = useState('응원형');
  const [exercise, setExercise] = useState('주 3회');
  const [water, setWater] = useState('1L~1.5L');
  const [sleepHours, setSleepHours] = useState(6);
  const [sleepMinutes, setSleepMinutes] = useState(30);

  const sleepValue = sleepHours + sleepMinutes / 60;
  const handleSleepChange = (value) => {
    setSleepHours(Math.floor(value));
    setSleepMinutes(Math.round((value % 1) * 60));
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <View className="flex-row items-center gap-3 px-5 py-3">
        <Pressable onPress={() => router.back()} className="h-[43px] w-[43px] items-center justify-center rounded-full border border-line bg-surface">
          <Text className="text-[20px] text-ink">‹</Text>
        </Pressable>
        <Text className="text-[19px] font-bold text-ink">프로필 편집</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="gap-6 pb-10">
        {/* 프로필 이미지 */}
        <View className="items-center pt-2">
          <View className="h-[68px] w-[68px] items-center justify-center rounded-full bg-primary">
            <Text className="text-[22px] font-bold text-white">A</Text>
          </View>
          <Pressable className="mt-3">
            <Text className="text-[12px] font-semibold text-muted">프로필 사진 바꾸기</Text>
          </Pressable>
        </View>

        {/* 닉네임 */}
        <View className="h-[52px] flex-row items-center gap-3 rounded-[26px] border border-line bg-surface px-5">
          <Text className="text-[12px] font-semibold text-muted">닉네임</Text>
          <TextInput
            value={nickname}
            onChangeText={setNickname}
            className="flex-1 text-center text-[15px] font-semibold text-ink"
          />
          <Text className="text-[14px] text-[#4a4a4a]">✎</Text>
        </View>

        {/* 성별 */}
        <View>
          <Text className="mb-2 text-[13px] font-bold text-[#4a4a4a]">성별</Text>
          <View className="flex-row gap-2">
            {genders.map((item) => {
              const active = gender === item;
              return (
                <Pressable
                  key={item}
                  onPress={() => setGender(item)}
                  className={`flex-1 items-center rounded-[15px] border py-3 ${active ? 'border-primary bg-primary-pale' : 'border-line bg-surface'}`}
                  style={active ? { borderWidth: 2 } : undefined}
                >
                  <Text className="text-[13px] font-semibold text-ink">{item}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 생년월일 */}
        <View>
          <Text className="mb-2 text-[13px] font-bold text-[#4a4a4a]">생년월일</Text>
          <View className="flex-row items-center gap-2">
            <TextInput value={year} onChangeText={setYear} keyboardType="number-pad" className="w-[70px] rounded-[8px] border border-line bg-surface py-3 text-center text-[15px] font-medium text-ink" />
            <Text className="text-[13px] font-semibold text-[#4a4a4a]">년</Text>
            <TextInput value={month} onChangeText={setMonth} keyboardType="number-pad" className="w-[48px] rounded-[8px] border border-line bg-surface py-3 text-center text-[15px] font-medium text-ink" />
            <Text className="text-[13px] font-semibold text-[#4a4a4a]">월</Text>
            <TextInput value={day} onChangeText={setDay} keyboardType="number-pad" className="w-[48px] rounded-[8px] border border-line bg-surface py-3 text-center text-[15px] font-medium text-ink" />
            <Text className="text-[13px] font-semibold text-[#4a4a4a]">일</Text>
          </View>
        </View>

        {/* 키 / 몸무게 */}
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="mb-2 text-[13px] font-bold text-[#4a4a4a]">키</Text>
            <View className="justify-center">
              <TextInput value={height} onChangeText={setHeight} keyboardType="number-pad" className="rounded-[15px] border border-line bg-surface py-3.5 pl-4 pr-9 text-center text-[14px] font-semibold text-ink" />
              <Text className="absolute right-4 text-[12px] text-disabled">cm</Text>
            </View>
          </View>
          <View className="flex-1">
            <Text className="mb-2 text-[13px] font-bold text-[#4a4a4a]">몸무게</Text>
            <View className="justify-center">
              <TextInput value={weight} onChangeText={setWeight} keyboardType="number-pad" className="rounded-[15px] border border-line bg-surface py-3.5 pl-4 pr-9 text-center text-[14px] font-semibold text-ink" />
              <Text className="absolute right-4 text-[12px] text-disabled">kg</Text>
            </View>
          </View>
        </View>

        {/* AI 코칭 */}
        <View>
          <Text className="mb-2 text-[13px] font-bold text-[#4a4a4a]">AI 코칭</Text>
          <View className="flex-row flex-wrap gap-3">
            {coachStyles.map((item) => {
              const active = coachStyle === item.name;
              return (
                <Pressable
                  key={item.name}
                  onPress={() => setCoachStyle(item.name)}
                  className={`items-center gap-1 rounded-[15px] border px-3 py-3 ${active ? 'border-primary bg-primary-pale' : 'border-line bg-surface'}`}
                  style={[{ width: '47%' }, active ? { borderWidth: 2 } : undefined]}
                >
                  <Icon name={item.icon} size={44} />
                  <Text className="text-[13px] font-bold text-ink">{item.name}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Divider />

        {/* 수면 시간 */}
        <View className="gap-3">
          <Text className="text-center text-[15px] font-bold text-ink">수면 시간</Text>
          <View className="rounded-[15px] border border-line bg-surface px-4 py-6">
            <View className="flex-row items-end justify-center gap-1">
              <Text className="text-[33px] font-bold text-ink">{sleepHours}</Text>
              <Text className="mb-1 mr-3 text-[13px] text-[#696973]">시간</Text>
              <Text className="text-[33px] font-bold text-ink">{sleepMinutes}</Text>
              <Text className="mb-1 text-[13px] text-[#696973]">분</Text>
            </View>
            <View className="mt-5">
              <SleepTimeDial value={sleepValue} onChange={handleSleepChange} />
            </View>
          </View>
        </View>

        <Divider />

        {/* 운동 빈도 */}
        <View>
          <Text className="mb-2 text-center text-[15px] font-bold text-ink">운동 빈도</Text>
          <View className="flex-row flex-wrap justify-center gap-2">
            {exerciseOptions.map((item) => (
              <FieldChip key={item} active={exercise === item} onPress={() => setExercise(item)}>{item}</FieldChip>
            ))}
          </View>
        </View>

        <Divider />

        {/* 하루 물 섭취량 */}
        <View>
          <Text className="mb-2 text-center text-[15px] font-bold text-ink">하루 물 섭취량</Text>
          <View className="flex-row flex-wrap justify-center gap-2">
            {waterOptions.map((item) => (
              <FieldChip key={item} active={water === item} onPress={() => setWater(item)}>{item}</FieldChip>
            ))}
          </View>
        </View>

        <Pressable onPress={() => router.replace('/my')} className="h-[52px] items-center justify-center rounded-[27.5px] bg-primary">
          <Text className="text-[15px] font-bold text-white">저장하기</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
