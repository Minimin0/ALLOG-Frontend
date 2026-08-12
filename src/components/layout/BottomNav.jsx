import { NavLink } from 'react-router-dom';

// 하단 네비게이션 (Figma 하단 5영역). 가운데 홈은 원형으로 띄움.
// 아이콘은 임시 이모지 — 추후 Figma 아이콘 에셋으로 교체 가능.
// NavLink는 to와 현재 경로가 일치하면 active 스타일 적용.
const ITEMS = [
  { to: '/group/g1', label: '내 그룹', icon: '👥' },
  { to: '/explore', label: '탐색', icon: '🔍' },
  { to: '/', label: '홈', icon: '🏠', center: true },
  { to: '/reward', label: '리워드', icon: '🎁' },
  { to: '/my', label: '마이', icon: '👤' },
];

export default function BottomNav() {
  return (
    <nav className="flex items-end justify-around border-t border-line bg-surface px-2 pb-2 pt-1.5">
      {ITEMS.map((item) =>
        item.center ? (
          <NavLink key={item.to} to={item.to} className="-mt-6 flex flex-col items-center gap-1">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl shadow-md">
              {item.icon}
            </span>
          </NavLink>
        ) : (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-1 ${
                isActive ? 'text-primary' : 'text-disabled'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-nav">{item.label}</span>
          </NavLink>
        )
      )}
    </nav>
  );
}
