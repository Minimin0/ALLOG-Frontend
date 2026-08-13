import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 마스코트 버튼: 누르면 한 번 폴짝 뛴 뒤 AI 코칭(/ai)으로 이동.
// 내 그룹 헤더와 전체 랭킹 헤더가 공유한다(동작 단일화). 크기는 className으로 조절.
// source: 진입 화면('feed' | 'ranking')을 쿼리로 넘겨 화면별 추천 질문을 띄운다.
export default function CoachMascotButton({ className = 'h-14 w-14', source = 'ranking' }) {
  const navigate = useNavigate();
  const [hopping, setHopping] = useState(false);

  const openCoach = () => {
    if (hopping) return;
    setHopping(true);
    setTimeout(() => navigate(`/ai?from=${source}`), 380); // 폴짝 뛴 뒤 이동
  };

  return (
    <button type="button" onClick={openCoach} aria-label="AI 코칭 열기">
      <img
        src="/images/mascot.png"
        alt="AI 코치"
        className={`origin-bottom object-contain ${className} ${hopping ? 'animate-hop' : ''}`}
      />
    </button>
  );
}
