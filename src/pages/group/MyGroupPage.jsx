import { NavLink, Outlet } from 'react-router-dom';

import BottomNav from '@/components/layout/BottomNav.jsx';
import { mockGroup } from '@/data/mockGroups.js';

// 내 그룹 부모 화면(레이아웃): 제목 + 공통 요약 카드 + 탭 + 하위 탭(Outlet) + 하단 네비.
// 요약 카드는 인증/랭킹/정보 세 탭이 공유하므로 여기(부모)에 둔다.
const TABS = [
  { to: 'feed', label: '인증' },
  { to: 'ranking', label: '랭킹' },
  { to: 'info', label: '정보' },
];

export default function MyGroupPage() {
  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col bg-bg">
      <header className="px-5 pt-6">
        <h1 className="text-display font-bold text-ink">내 그룹</h1>
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
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex-1 border-b-2 pb-2 text-center text-section font-semibold ${
                isActive ? 'border-ink text-ink' : 'border-transparent text-muted'
              }`
            }
          >
            {tab.label}
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
