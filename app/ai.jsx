import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

import AiMessageRN from '@/components/ai/AiMessageRN';
import { getCoachContent } from '@/data/mockChat.js';

// 사용자 메시지 (오른쪽, 흰 말풍선)
function UserMessage({ children }) {
  return (
    <View className="items-end">
      <View className="max-w-[80%] rounded-2xl bg-surface px-4 py-3" style={{ borderWidth: 1, borderColor: '#e7e3d8' }}>
        <Text className="text-[15px] leading-6 text-ink">{children}</Text>
      </View>
    </View>
  );
}

// AI 코칭 채팅 (웹 AiCoachPage 포팅). 진입 화면(?from=feed|ranking)에 따라 질문 세트가 달라진다.
export default function AiCoachScreen() {
  const router = useRouter();
  const { from } = useLocalSearchParams();
  const { intro, qa } = getCoachContent(Array.isArray(from) ? from[0] : from);
  const [messages, setMessages] = useState([{ role: 'ai', text: intro }]);
  const scrollRef = useRef(null);

  useEffect(() => {
    setMessages([{ role: 'ai', text: intro }]);
  }, [intro]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const ask = (item) => {
    setMessages((m) => [...m, { role: 'user', text: item.q }]);
    setTimeout(() => setMessages((m) => [...m, { role: 'ai', text: item.a, viz: item.viz }]), 450);
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      {/* 헤더 */}
      <View className="relative h-14 flex-row items-center justify-center border-b border-line px-4">
        <Pressable onPress={() => router.back()} className="absolute left-4 h-9 w-9 items-center justify-center rounded-xl bg-ink">
          <Text className="text-white">‹</Text>
        </Pressable>
        <Text className="text-[17px] font-bold text-ink">AI 코칭</Text>
      </View>

      {/* 대화 */}
      <ScrollView ref={scrollRef} className="flex-1" contentContainerClassName="gap-3 p-4">
        {messages.map((msg, i) => (
          <Animated.View key={i} entering={FadeInUp.duration(300)}>
            {msg.role === 'ai' ? <AiMessageRN text={msg.text} viz={msg.viz} /> : <UserMessage>{msg.text}</UserMessage>}
          </Animated.View>
        ))}
      </ScrollView>

      {/* 추천 질문 칩 */}
      <View className="border-t border-line p-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
          {qa.map((item) => (
            <Pressable key={item.id} onPress={() => ask(item)} className="rounded-pill bg-primary-tint px-5 py-3">
              <Text className="text-[15px] font-medium text-primary">{item.q}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
