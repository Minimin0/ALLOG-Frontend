import { NavLink } from 'react-router-dom';

// 하단 네비게이션 (Figma). 5영역 + 가운데 홈은 원형으로 띄움.
// 활성=검정(ink), 비활성=#bababa(disabled). NavLink가 현재 경로와 일치 시 active.
function GroupIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 1.8c-2.7 0-6.5 1.34-6.5 4V19H10v-2.2c0-1 .35-1.9.98-2.66C10.3 12.92 9.1 12.8 8 12.8zm8 0c-.3 0-.66.02-1.05.06.66.77 1.05 1.68 1.05 2.74V19h6.5v-2.2c0-2.66-3.8-4-6.5-4z" />
    </svg>
  );
}
function SearchIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.6-3.6" />
    </svg>
  );
}
function HomeIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 3.2 2.6 11l1.4 1.6L5 11.7V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-8.3l1 .9L21.4 11 12 3.2z" />
    </svg>
  );
}
function GiftIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20 8h-2.5a2.5 2.5 0 1 0-4-3 2.5 2.5 0 1 0-4 3H4a1 1 0 0 0-1 1v2h8V9h2v2h8V9a1 1 0 0 0-1-1zM11 8H9.5a1 1 0 1 1 1-1c.28 0 .5.1.68.26L11 8zm3.5 0H13l-.18-.74A1 1 0 1 1 14.5 8zM4 13v6a1 1 0 0 0 1 1h6v-7H4zm9 7h6a1 1 0 0 0 1-1v-6h-7v7z" />
    </svg>
  );
}
function PersonIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6v1H4v-1z" />
    </svg>
  );
}

const ITEMS = [
  { to: '/group/g1', label: '내 그룹', Icon: GroupIcon },
  { to: '/explore', label: '탐색', Icon: SearchIcon },
  { to: '/', center: true, Icon: HomeIcon },
  { to: '/reward', label: '리워드', Icon: GiftIcon },
  { to: '/my', label: '마이 페이지', Icon: PersonIcon },
];

export default function BottomNav() {
  return (
    <nav className="relative flex items-end justify-around border-t border-line bg-surface px-2 pb-2 pt-2">
      {ITEMS.map(({ to, label, Icon, center }) =>
        center ? (
          <NavLink key={to} to={to} end aria-label="홈" className="-mt-8">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c7c3bb] shadow-md ring-4 ring-surface">
              <HomeIcon className="h-6 w-6 text-white" />
            </span>
          </NavLink>
        ) : (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-1 ${
                isActive ? 'text-ink' : 'text-disabled'
              }`
            }
          >
            <Icon className="h-6 w-6" />
            <span className="text-nav">{label}</span>
          </NavLink>
        )
      )}
    </nav>
  );
}
