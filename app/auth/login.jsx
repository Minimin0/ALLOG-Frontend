import { View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// 로그인 (웹 LoginPage 포팅). Firebase 실제 인증은 네이티브 설정+키 필요 → 지금은 mock 흐름.
const socials = [
  { key: 'naver', label: 'N', bg: '#03C75A' },
  { key: 'apple', label: '', bg: '#000000' },
  { key: 'google', label: 'G', bg: '#ffffff', border: true },
  { key: 'kakao', label: 'K', bg: '#FEE500' },
];

export default function LoginScreen() {
  const router = useRouter();

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <ScrollView contentContainerClassName="flex-grow px-12 pt-16 pb-8">
        <Text className="mb-10 text-center text-[40px] font-bold text-ink">LOGIN</Text>

        <TextInput
          placeholder="아이디"
          placeholderTextColor="#000000"
          className="mb-4 h-[50px] rounded-[30px] border border-line bg-white px-5 text-[15px] text-ink"
        />
        <TextInput
          placeholder="비밀번호"
          placeholderTextColor="#000000"
          secureTextEntry
          className="mb-5 h-[50px] rounded-[30px] border border-line bg-white px-5 text-[15px] text-ink"
        />

        <Pressable onPress={() => router.replace('/home')} className="h-[50px] items-center justify-center rounded-[20px] bg-primary">
          <Text className="text-[18px] font-bold text-white">로그인</Text>
        </Pressable>

        <View className="mt-3 flex-row justify-center gap-6">
          <Text className="text-[13px] text-ink">아이디 찾기</Text>
          <Text className="text-[13px] text-ink">비밀번호 찾기</Text>
        </View>

        <View className="mt-5 flex-row justify-center">
          <Text className="text-[13px] text-ink">계정이 없다면? </Text>
          <Pressable onPress={() => router.push('/auth/signup-phone')}>
            <Text className="text-[13px] font-semibold text-ink underline">회원 가입하기</Text>
          </Pressable>
        </View>

        <View className="my-6 h-px bg-[#d9d9d9]" />
        <Text className="mb-4 text-center text-[15px] font-semibold text-ink">간편 로그인</Text>

        <View className="flex-row justify-center gap-5">
          {socials.map((s) => (
            <Pressable
              key={s.key}
              onPress={() => router.push(s.key === 'google' ? '/auth/firebase-debug' : '/onboarding/basic-info')}
              className="h-[42px] w-[42px] items-center justify-center rounded-full"
              style={{ backgroundColor: s.bg, borderWidth: s.border ? 1 : 0, borderColor: '#e7e3d8' }}
            >
              <Text className="text-[16px] font-bold" style={{ color: s.bg === '#ffffff' || s.bg === '#FEE500' ? '#000' : '#fff' }}>{s.label || ''}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
