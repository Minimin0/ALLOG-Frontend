import { useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';

// 약관 동의 바텀시트 (웹 TermsAgreementModal 포팅).
export const agreementItems = [
  { key: 'terms', label: '이용약관 동의', required: true, detail: '루틴방 참여, 하트 사용·반환, 인증 및 평가 방식 등 ALLOG 서비스 이용 전반에 관한 약관이에요. 완주 시 하트가 반환되고, 미완주 시에는 반환되지 않아요.' },
  { key: 'privacy', label: '개인정보 수집 및 이용 동의', required: true, detail: '닉네임, 생년월일, 신체 정보 등 맞춤 루틴 추천에 필요한 최소한의 정보만 수집해요. 수집된 정보는 목적 달성 후 관련 절차에 따라 파기돼요.' },
  { key: 'marketing', label: '마케팅 정보 수신 동의', required: false, detail: 'AAC 혜택, 신규 리워드, 이벤트 소식을 이메일·앱 알림으로 받아보실 수 있어요. 동의하지 않아도 서비스 이용에는 제한이 없어요.' },
];

export default function TermsAgreementModal({ open, agreements, onToggle, onToggleAll, onClose, onConfirm }) {
  const [openDetail, setOpenDetail] = useState(null);
  const allChecked = agreementItems.every((i) => agreements[i.key]);
  const requiredChecked = agreementItems.filter((i) => i.required).every((i) => agreements[i.key]);

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/40" onPress={onClose}>
        <Pressable className="rounded-t-[24px] bg-bg p-6" onPress={() => {}}>
          <View className="flex-row items-center justify-between">
            <Text className="text-[17px] font-bold text-ink">약관 동의</Text>
            <Pressable onPress={onClose} className="h-6 w-6 items-center justify-center rounded-full border border-line bg-white">
              <Text className="text-[13px] text-ink">×</Text>
            </Pressable>
          </View>

          {/* 전체 동의 */}
          <Pressable onPress={onToggleAll} className="mt-4 flex-row items-center gap-2 rounded-[15px] border border-line bg-surface px-4 py-3.5">
            <View className={`h-[18px] w-[18px] items-center justify-center rounded-full ${allChecked ? 'bg-primary' : 'border border-disabled'}`}>
              {allChecked && <Text className="text-[10px] font-bold text-white">✓</Text>}
            </View>
            <Text className="text-[14px] font-bold text-ink">약관 전체 동의</Text>
          </Pressable>

          {/* 개별 항목 */}
          <View className="mt-3 overflow-hidden rounded-[15px] border border-line bg-surface">
            {agreementItems.map((item, idx) => {
              const checked = agreements[item.key];
              const detailOpen = openDetail === item.key;
              return (
                <View key={item.key} className={`px-4 py-3.5 ${idx > 0 ? 'border-t border-line' : ''}`}>
                  <View className="flex-row items-center gap-2">
                    <Pressable onPress={() => onToggle(item.key)} className="flex-1 flex-row items-center gap-2">
                      <View className={`h-[16px] w-[16px] items-center justify-center rounded-full ${checked ? 'bg-primary' : 'border border-disabled'}`}>
                        {checked && <Text className="text-[9px] font-bold text-white">✓</Text>}
                      </View>
                      <Text className="text-[13px] font-semibold text-ink">
                        <Text className={item.required ? 'text-primary' : 'text-muted'}>{item.required ? '[필수] ' : '[선택] '}</Text>
                        {item.label}
                      </Text>
                    </Pressable>
                    <Pressable onPress={() => setOpenDetail(detailOpen ? null : item.key)}>
                      <Text className="text-[11px] font-medium text-disabled underline">{detailOpen ? '접기' : '보기'}</Text>
                    </Pressable>
                  </View>
                  {detailOpen && <Text className="pt-2.5 text-[11px] font-medium leading-5 text-muted">{item.detail}</Text>}
                </View>
              );
            })}
          </View>

          <Pressable
            onPress={requiredChecked ? onConfirm : undefined}
            disabled={!requiredChecked}
            className={`mt-5 h-[50px] items-center justify-center rounded-[27.5px] ${requiredChecked ? 'bg-ink' : 'bg-disabled'}`}
          >
            <Text className="text-[15px] font-bold text-white">동의하고 계속하기</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
