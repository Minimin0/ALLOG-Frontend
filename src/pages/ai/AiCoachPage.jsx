import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import AiMessage from '@/components/ai/AiMessage.jsx';
import AiSuggestionChip from '@/components/ai/AiSuggestionChip.jsx';
import UserMessage from '@/components/ai/UserMessage.jsx';
import { getCoachContent } from '@/data/mockChat.js';

// AI 코칭 채팅 화면. 내 그룹 우측 상단 캐릭터로 진입.
// 진입 화면(?from=feed|ranking)에 따라 인트로/추천 질문 세트가 달라진다.
// 추천 질문을 누르면 사용자 말풍선 + 코치 응답이 순서대로 쌓인다.
export default function AiCoachPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { intro, qa } = getCoachContent(params.get('from'));
  const [messages, setMessages] = useState([{ role: 'ai', text: intro }]);
  const endRef = useRef(null);

  // 진입 출처(intro)가 바뀌면 대화를 해당 화면의 인트로로 초기화.
  useEffect(() => {
    setMessages([{ role: 'ai', text: intro }]);
  }, [intro]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const ask = (item) => {
    setMessages((m) => [...m, { role: 'user', text: item.q }]);
    // 코치가 잠깐 뒤에 답하는 느낌 (수치는 viz로 데이터 모양별 시각화)
    setTimeout(
      () => setMessages((m) => [...m, { role: 'ai', text: item.a, viz: item.viz }]),
      450
    );
  };

  return (
    <div className="mx-auto flex h-[100dvh] max-w-md flex-col bg-bg">
      {/* 헤더 */}
      <header className="relative flex h-14 shrink-0 items-center justify-center border-b border-line px-4">
        <button
          onClick={() => navigate(-1)}
          aria-label="뒤로"
          className="absolute left-4 flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-section font-bold text-ink">AI 코칭</h1>
      </header>

      {/* 대화 */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((msg, i) =>
          msg.role === 'ai' ? (
            <AiMessage key={i} text={msg.text} viz={msg.viz} />
          ) : (
            <UserMessage key={i}>{msg.text}</UserMessage>
          )
        )}
        <div ref={endRef} />
      </div>

      {/* 추천 질문 칩 */}
      <div className="shrink-0 border-t border-line p-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {qa.map((item) => (
            <AiSuggestionChip key={item.id} onClick={() => ask(item)}>
              {item.q}
            </AiSuggestionChip>
          ))}
        </div>
      </div>
    </div>
  );
}
