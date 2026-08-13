import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCoachStyleImage } from '@/utils/constants.js';
import { getCoachStyle } from '@/utils/storage.js';

// 마스코트 버튼: 누르면 한 번 폴짝 뛴 뒤 AI 코칭(/ai-coach)으로 이동.
// 내 그룹 헤더와 전체 랭킹 헤더가 공유한다(동작 단일화). 크기는 className으로 조절.
// source: 진입 화면('feed' | 'ranking')을 쿼리로 넘겨 화면별 추천 질문을 띄운다.
// 이미지는 온보딩(또는 프로필 편집)에서 고른 코치 스타일(응원형/압박형/팩트형/유머형)을 그대로 사용.
export default function CoachMascotButton({ className = 'h-14 w-14', source = 'ranking' }) {
  const navigate = useNavigate();
  const [hopping, setHopping] = useState(false);
  const [coachImage] = useState(() => getCoachStyleImage(getCoachStyle()));

  const openCoach = () => {
    if (hopping) return;
    setHopping(true);
    setTimeout(() => navigate(`/ai-coach?from=${source}`), 380); // 폴짝 뛴 뒤 이동
  };

  return (
    <button type="button" onClick={openCoach} aria-label="AI 코칭 열기">
      <img
        src={coachImage}
        alt="AI 코치"
        className={`origin-bottom object-contain ${className} ${hopping ? 'animate-hop' : ''}`}
      />
    </button>
  );
}
