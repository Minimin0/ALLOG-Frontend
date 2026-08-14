import { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import TermsAgreementModal from '@/components/auth/TermsAgreementModal';

// 본인 인증 (웹 SignUpPhonePage 포팅). 약관 동의는 바텀시트 모달로.
const carriers = ['SKT', 'KT', 'LG U+'];

export default function SignUpPhoneScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [carrier, setCarrier] = useState('SKT');
  const [carrierOpen, setCarrierOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [agreements, setAgreements] = useState({ terms: false, privacy: false, marketing: false });
  const agreed = agreements.terms && agreements.privacy; // 필수 2개

  const toggle = (key) => setAgreements((a) => ({ ...a, [key]: !a[key] }));
  const toggleAll = () =>
    setAgreements((a) => {
      const next = !(a.terms && a.privacy && a.marketing);
      return { terms: next, privacy: next, marketing: next };
    });

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <View className="flex-1 px-6 pt-16">
        <Pressable onPress={() => router.back()} className="mb-4 h-8 w-8 items-center justify-center">
          <Text className="text-2xl text-ink">‹</Text>
        </Pressable>

        <Text className="text-[25px] font-black text-ink" style={{ lineHeight: 35 }}>본인 확인을 위해{'\n'}인증을 진행해 주세요.</Text>

        {/* 통신사 */}
        <Text className="mt-8 text-[15px] font-bold text-subtle">통신사</Text>
        <View className="mt-2 w-[148px]">
          <Pressable onPress={() => setCarrierOpen((o) => !o)} className="h-11 flex-row items-center justify-between rounded-[15px] border border-line bg-surface px-3">
            <Text className="text-[12px] text-[#9c9c9c]">{carrier}</Text>
            <Text className="text-[#555]">⌄</Text>
          </Pressable>
          {carrierOpen && (
            <View className="mt-1 overflow-hidden rounded-[15px] border border-line bg-surface">
              {carriers.map((c) => (
                <Pressable key={c} onPress={() => { setCarrier(c); setCarrierOpen(false); }} className="px-3 py-2.5">
                  <Text className="text-[12px] text-ink">{c}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* 전화번호 */}
        <Text className="mt-6 text-[15px] font-bold text-subtle">전화번호</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="010-0000-0000"
          placeholderTextColor="#bababa"
          className="mt-2 h-11 rounded-[15px] border border-line bg-surface px-4 text-[15px] font-semibold text-ink"
        />

        {/* 인증번호 */}
        <View className="mt-3 h-11 flex-row items-center rounded-[15px] border border-line bg-surface px-4">
          <TextInput
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="인증번호 6자리"
            placeholderTextColor="#bababa"
            className="flex-1 text-[12px] font-semibold text-ink"
          />
          <Text className="text-[12px] text-[#bababa]">00:00</Text>
        </View>

        {/* 약관 동의 (모달 열기) */}
        <Pressable onPress={() => setTermsOpen(true)} className="mt-4 flex-row items-center gap-2">
          <View className={`h-5 w-5 items-center justify-center rounded-full ${agreed ? 'bg-primary' : 'border border-disabled'}`}>
            {agreed && <Text className="text-[11px] text-white">✓</Text>}
          </View>
          <Text className="flex-1 text-[13px] text-ink">약관에 동의해주세요 (필수)</Text>
          <Text className="text-[12px] text-muted">보기 ›</Text>
        </Pressable>

        <View className="flex-1" />

        <Pressable
          onPress={() => agreed && router.push('/auth/signup-account')}
          disabled={!agreed}
          className={`mb-4 h-[50px] items-center justify-center rounded-[20px] ${agreed ? 'bg-ink' : 'bg-disabled'}`}
        >
          <Text className="text-[18px] font-bold text-[#f2f2f6]">다음</Text>
        </Pressable>
      </View>

      <TermsAgreementModal
        open={termsOpen}
        agreements={agreements}
        onToggle={toggle}
        onToggleAll={toggleAll}
        onClose={() => setTermsOpen(false)}
        onConfirm={() => setTermsOpen(false)}
      />
    </SafeAreaView>
  );
}
