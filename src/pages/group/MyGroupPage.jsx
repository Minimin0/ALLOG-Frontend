import { NavLink, Outlet, useLocation } from 'react-router-dom';

import BottomNav from '@/components/layout/BottomNav.jsx';
import CoachMascotButton from '@/components/common/CoachMascotButton.jsx';
import { mockGroup } from '@/data/mockGroups.js';

// 내 그룹 부모 화면(레이아웃): 제목 + 공통 요약 카드 + 탭 + 하위 탭(Outlet) + 하단 네비.
// 요약 카드는 인증/랭킹/정보 세 탭이 공유하므로 여기(부모)에 둔다.
const TABS = [
  { to: 'feed', label: '인증' },
  { to: 'ranking', label: '랭킹' },
  { to: 'info', label: '정보' },
];

export default function MyGroupPage() {
  const location = useLocation();
  // 정보 탭에는 AI 코치 연결을 넣지 않으므로 우측 상단 캐릭터를 숨긴다.
  const showCoach = !location.pathname.endsWith('/info');
  // 인증 탭에서 진입하면 인증용 질문, 그 외(랭킹)는 랭킹용 질문을 띄운다.
  const coachSource = location.pathname.endsWith('/feed') ? 'feed' : 'ranking';

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col bg-bg">
      <header className="flex items-center justify-between px-5 pt-6">
        <h1 className="text-display font-bold text-ink">내 그룹</h1>
        {/* 우측 상단 캐릭터 → 누르면 폴짝 → AI 코칭 (정보 탭 제외).
            숨길 때도 같은 크기의 빈 자리를 둬 헤더 높이를 유지 → 탭 전환 시 단차 방지. */}
        {showCoach ? (
          <CoachMascotButton className="h-14 w-14" source={coachSource} />
        ) : (
          <div className="h-14 w-14" aria-hidden />
        )}
      </header>

      {/* 공통 요약 카드 */}
      <div className="px-5 pt-3">
        <div className="rounded-card border border-line bg-primary-tint p-4">
          <p className="text-label text-ink">DAY {mockGroup.day}</p>
          <h2 className="text-h2 font-bold text-ink">{mockGroup.title}</h2>
          <p className="mt-1 text-caption text-muted">
            오늘 {mockGroup.verifiedToday}/{mockGroup.totalMembers}명 인증완료
          </p>
          <div className="mt-3 flex gap-2">
            {Array.from({ length: mockGroup.totalMembers }).map((_, i) => (
              <div
                key={i}
                className={`h-8 w-8 rounded-full ${
                  i < mockGroup.verifiedToday ? 'bg-primary' : 'bg-surface-alt'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 탭 */}
      <nav className="mt-4 flex border-b border-line px-5">
        {TABS.map((tab) => (
          <NavLink key={tab.to} to={tab.to} className="flex flex-1 flex-col items-center pb-2">
            {({ isActive }) => (
              <span
                className={`border-b-2 pb-2 text-section font-semibold ${
                  isActive ? 'border-ink text-ink' : 'border-transparent text-muted'
                }`}
              >
                {tab.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="flex-1">
        <Outlet />
      </div>

      <BottomNav />
    </div>
  );
}
