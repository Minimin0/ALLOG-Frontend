import { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import FieldError from '@/components/common/FieldError';

// 아이디/비밀번호 설정 (웹 SignUpAccountPage 포팅).
// 아이디: 영문 대소문자, 4~13자 / 비밀번호: 영문 대소문자+숫자, 10~12자.
export default function SignUpAccountScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const usernameError = username.length > 0 && (username.length < 4 || username.length > 13)
    ? '아이디는 4~13자로 입력해주세요'
    : '';
  const passwordError = password.length > 0 && (password.length < 10 || password.length > 12)
    ? '비밀번호는 10~12자로 입력해주세요'
    : '';
  const mismatch = confirm.length > 0 && password !== confirm;
  const match = confirm.length > 0 && password === confirm;

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <View className="flex-1 px-6 pt-16">
        <Pressable onPress={() => router.back()} className="mb-4 h-8 w-8 items-center justify-center">
          <Text className="text-2xl text-ink">‹</Text>
        </Pressable>

        <Text className="text-[25px] font-black text-ink" style={{ lineHeight: 35 }}>아이디와 비밀번호를{'\n'}입력해 주세요.</Text>

        <Text className="mt-8 text-[15px] font-bold text-subtle">아이디</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="아이디 (영문 대소문자, 4~13자)"
          placeholderTextColor="#bababa"
          autoCapitalize="none"
          className={`mt-2 h-11 rounded-[15px] border bg-surface px-4 text-[13px] text-ink ${usernameError ? 'border-danger' : 'border-line'}`}
        />
        <FieldError>{usernameError}</FieldError>

        <Text className="mt-6 text-[15px] font-bold text-subtle">비밀번호</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="비밀번호 (영문 대소문자+숫자, 10~12자)"
          placeholderTextColor="#bababa"
          className={`mt-2 h-11 rounded-[15px] border bg-surface px-4 text-[13px] text-ink ${passwordError || mismatch ? 'border-danger' : 'border-line'}`}
        />
        <FieldError>{passwordError}</FieldError>

        <View className={`mt-3 h-11 flex-row items-center rounded-[15px] border bg-surface px-4 ${mismatch ? 'border-danger' : 'border-line'}`}>
          <TextInput
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            placeholder="비밀번호 확인"
            placeholderTextColor="#bababa"
            className="flex-1 text-[13px] text-ink"
          />
          {match && <Text className="text-primary">✓</Text>}
        </View>
        <FieldError>{mismatch ? '비밀번호가 일치하지 않아요' : ''}</FieldError>

        <View className="flex-1" />

        <Pressable onPress={() => router.replace('/onboarding/basic-info')} className="mb-4 h-[50px] items-center justify-center rounded-[20px] bg-ink">
          <Text className="text-[18px] font-bold text-[#f2f2f6]">완료</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
