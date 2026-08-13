import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CheerOverlay from '@/components/group/CheerOverlay.jsx';
import GroupFeedItem from '@/components/group/GroupFeedItem.jsx';
import ReverifyRequestSheet from '@/components/group/ReverifyRequestSheet.jsx';
import { mockFeed } from '@/data/mockGroups.js';

// 하트 화분 개수(표시용). 응원할 때마다 2→1→0으로 줄고, 다시 채워지며 순환 (항상 누를 수 있음).
const MAX_CHEER = 3;

// 내 그룹 > 인증 탭. 멤버별 오늘 인증 현황을 2열 피드로 보여준다.
export default function GroupFeedPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [reportTarget, setReportTarget] = useState(null); // 재인증 요청 대상 (이름)
  const [toastMsg, setToastMsg] = useState(''); // 안내 토스트
  const [cheerOn, setCheerOn] = useState(false); // 응원 오버레이
  const [cheerCount, setCheerCount] = useState(0);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2000);
  };

  const handleCheer = () => {
    const next = (cheerCount % MAX_CHEER) + 1; // 1→2→3→1... 항상 누를 수 있음
    setCheerCount(next);
    setCheerOn(true); // 폭죽 + 화분 오버레이 (남은 하트 화분 = MAX - next)
  };

  const handleReverifySubmit = () => {
    setReportTarget(null);
    showToast('재인증 요청이 전송되었어요!');
  };

  return (
    <div className="p-5">
      <div className="grid grid-cols-2 gap-3">
        {mockFeed.map((m) => (
          <GroupFeedItem
            key={m.id}
            name={m.name}
            status={m.status}
            timeAgo={m.timeAgo}
            image={m.image}
            onVerify={() => navigate(`/group/${groupId}/verify`)}
            onCheer={handleCheer}
            onReport={() => setReportTarget(m.name)}
          />
        ))}
      </div>

      {/* 재인증 요청 바텀시트 */}
      <ReverifyRequestSheet
        open={reportTarget !== null}
        targetName={reportTarget}
        onClose={() => setReportTarget(null)}
        onSubmit={handleReverifySubmit}
      />

      {/* 응원 오버레이 (폭죽 + 화분, 2초) */}
      <CheerOverlay show={cheerOn} usedCount={cheerCount} onDone={() => setCheerOn(false)} />

      {/* 안내 토스트 (화면 중앙, 2초) */}
      <div
        className={`fixed left-1/2 top-1/2 z-[80] -translate-x-1/2 -translate-y-1/2 rounded-pill bg-surface px-6 py-3 text-body font-semibold text-primary shadow-2xl ring-1 ring-line transition-opacity duration-300 ${
          toastMsg ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {toastMsg}
      </div>
    </div>
  );
}
