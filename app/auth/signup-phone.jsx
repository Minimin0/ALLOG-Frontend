import { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import TermsAgreementModal from '@/components/auth/TermsAgreementModal';
import FieldError from '@/components/common/FieldError';

// 본인 인증 (웹 SignUpPhonePage 포팅). 약관 동의는 바텀시트 모달로.
const carriers = ['SKT', 'KT', 'LG U+'];
const PHONE_RE = /^010-\d{4}-\d{4}$/;

// 입력하는 대로 010-0000-0000 형태로 자동 정렬.
function formatPhone(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export default function SignUpPhoneScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [code, setCode] = useState('');
  const [codeVerified, setCodeVerified] = useState(false);
  const [codeError, setCodeError] = useState('');
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

  const onChangePhone = (v) => {
    setPhone(formatPhone(v));
    if (phoneError) setPhoneError('');
  };

  const verifyCode = () => {
    if (code.length !== 6) {
      setCodeError('인증번호 6자리를 입력해주세요');
      return;
    }
    setCodeError('');
    setCodeVerified(true);
  };

  const onChangeCode = (v) => {
    setCode(v.replace(/\D/g, '').slice(0, 6));
    setCodeVerified(false);
    if (codeError) setCodeError('');
  };

  const handleNext = () => {
    if (!PHONE_RE.test(phone)) {
      setPhoneError('010-0000-0000 형식으로 입력해주세요');
      return;
    }
    if (!codeVerified) {
      setCodeError('인증번호를 먼저 확인해주세요');
      return;
    }
    router.push('/auth/signup-account');
  };

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
            <Text className="text-[12px] font-semibold text-[#9c9c9c]">{carrier}</Text>
            <Text className="text-[#555]">⌄</Text>
          </Pressable>
          {carrierOpen && (
            <View className="mt-1 overflow-hidden rounded-[15px] border border-line bg-surface">
              {carriers.map((c) => (
                <Pressable key={c} onPress={() => { setCarrier(c); setCarrierOpen(false); }} className="px-3 py-2.5">
                  <Text className="text-[12px] font-semibold text-ink">{c}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* 전화번호 */}
        <Text className="mt-6 text-[15px] font-bold text-subtle">전화번호</Text>
        <TextInput
          value={phone}
          onChangeText={onChangePhone}
          keyboardType="phone-pad"
          maxLength={13}
          placeholder="010-0000-0000"
          placeholderTextColor="#9c9c9c"
          className={`mt-2 h-11 rounded-[15px] border bg-surface px-4 text-[12px] font-semibold text-ink ${phoneError ? 'border-danger' : 'border-line'}`}
        />
        <FieldError>{phoneError}</FieldError>

        {/* 인증번호 + 확인 버튼 */}
        <View className={`mt-3 h-11 flex-row items-center rounded-[15px] border bg-surface pr-1.5 ${codeError ? 'border-danger' : codeVerified ? 'border-primary' : 'border-line'}`}>
          <TextInput
            value={code}
            onChangeText={onChangeCode}
            keyboardType="number-pad"
            maxLength={6}
            editable={!codeVerified}
            placeholder="인증번호 6자리"
            placeholderTextColor="#9c9c9c"
            textAlignVertical="center"
            className="flex-1 px-4 text-[12px] font-semibold text-ink"
            style={{ minWidth: 0, paddingVertical: 0, height: '100%' }}
          />
          <Pressable
            onPress={verifyCode}
            disabled={codeVerified}
            className={`h-8 items-center justify-center rounded-[11px] px-3.5 ${codeVerified ? 'bg-primary-tint' : 'bg-ink'}`}
          >
            <Text className={`text-[12px] font-bold ${codeVerified ? 'text-primary' : 'text-white'}`}>{codeVerified ? '확인됨' : '확인'}</Text>
          </Pressable>
        </View>
        <FieldError>{codeError}</FieldError>

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
          onPress={handleNext}
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
