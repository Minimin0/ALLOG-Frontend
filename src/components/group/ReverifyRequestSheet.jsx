import { useState } from 'react';
import { View, Text, Pressable, TextInput, Modal, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

import { REVERIFY_REASONS } from '@/utils/constants.js';

// 재인증 요청 바텀시트 (웹 ReverifyRequestSheet 포팅) — 피드에서 다른 멤버의 인증 카드 ⋯ 를 눌렀을 때.
export default function ReverifyRequestSheet({ open, onClose, onSubmit, targetName }) {
  const [reasonId, setReasonId] = useState(REVERIFY_REASONS[0].id); // 첫 사유 기본 선택
  const [etcText, setEtcText] = useState('');
  const [error, setError] = useState('');

  const selectReason = (id) => {
    setReasonId(id);
    setError('');
  };

  const handleSubmit = () => {
    if (reasonId === 'etc' && etcText.trim().length === 0) {
      setError('사유를 입력해주세요');
      return;
    }
    setError('');
    // TODO: reportApi.reverify({ targetName, reasonId, etcText }) 연결
    onSubmit?.({ reasonId, etcText });
  };

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/40" onPress={onClose}>
        <Pressable className="rounded-t-[24px] bg-bg p-6" onPress={() => {}} style={{ maxHeight: '85%' }}>
          <Text className="text-center text-[17px] font-bold text-ink">재인증 요청</Text>
          <Text className="mt-1 text-center text-[12px] text-muted">
            {targetName ? `${targetName}님의 ` : ''}재인증을 요청하려는 사유를 선택해주세요.
          </Text>

          <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
          <View className="mt-5 gap-2">
            {REVERIFY_REASONS.map((r) => {
              const selected = reasonId === r.id;
              return (
                <Animated.View key={r.id} layout={LinearTransition.duration(220)}>
                  <Pressable
                    onPress={() => selectReason(r.id)}
                    className={`flex-row items-center gap-3 rounded-[15px] border px-4 py-3 ${
                      selected ? 'border-primary bg-primary-tint' : 'border-line bg-surface'
                    }`}
                  >
                    <View
                      className={`h-5 w-5 items-center justify-center rounded-full border-2 ${
                        selected ? 'border-primary' : 'border-disabled'
                      }`}
                    >
                      {selected && <View className="h-2.5 w-2.5 rounded-full bg-primary" />}
                    </View>
                    <Text className={`text-[13px] ${selected ? 'font-semibold text-ink' : 'text-subtle'}`}>{r.label}</Text>
                  </Pressable>

                  {/* 기타 선택 시: 바로 밑에 직접 입력칸 (부드럽게 나타났다 사라짐) */}
                  {r.id === 'etc' && reasonId === 'etc' && (
                    <Animated.View entering={FadeIn.duration(220)} exiting={FadeOut.duration(160)}>
                      <TextInput
                        value={etcText}
                        onChangeText={(t) => {
                          setEtcText(t);
                          if (error) setError('');
                        }}
                        placeholder="사유를 직접 입력해주세요"
                        placeholderTextColor="#bababa"
                        multiline
                        numberOfLines={3}
                        className={`mt-2 rounded-[15px] border bg-surface p-3 text-[13px] text-ink ${error ? 'border-danger' : 'border-line'}`}
                        style={{ height: 72 }}
                        textAlignVertical="top"
                      />
                      {error ? <Text className="mt-1.5 text-[11px] font-semibold text-danger">{error}</Text> : null}
                    </Animated.View>
                  )}
                </Animated.View>
              );
            })}
          </View>
          </ScrollView>

          <Pressable
            onPress={handleSubmit}
            className="mt-6 h-[50px] items-center justify-center rounded-[27.5px] bg-danger"
          >
            <Text className="text-[15px] font-bold text-white">재인증 요청하기</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
