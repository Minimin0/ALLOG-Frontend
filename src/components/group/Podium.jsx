import SparkleIcon from '@/components/common/SparkleIcon.jsx';
import { useInView } from '@/hooks/useInView.js';

// 시상대(상위 3명) 공통 컴포넌트. 합산 화면 / 그룹 정보 탭에서 재사용.
// items: [{ rank, name, score, reward }]
// showScore=true(합산): 바 안에 [점수→메달→프로필→이름], false(정보): [메달→N위→프로필→이름]
// heights: 순위별 바 높이(px) — 화면별로 Figma 값 전달. 보상은 바 아래 + 빛 아이콘.
const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };
const BG = { 1: 'bg-reward-tint', 2: 'bg-surface-alt', 3: 'bg-rank-bronze-tint' };
const DEFAULT_HEIGHTS = { 1: 266, 2: 230, 3: 178 };

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-ink">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

export default function Podium({ items, showScore = false, barWidth = 'w-[93px]', heights = DEFAULT_HEIGHTS }) {
  const [ref, inView] = useInView();

  return (
    <section ref={ref} className="flex items-end justify-center gap-5">
      {items.map((item, i) => (
        <div
          key={item.rank}
          className={`flex ${barWidth} flex-col items-center transition-all duration-500 ease-out ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
          style={{ transitionDelay: inView ? `${i * 150}ms` : '0ms' }}
        >
          {/* 랭킹 바 */}
          <div
            className={`flex w-full flex-col items-center gap-1 rounded-t-card ${BG[item.rank]} px-1 pt-3 shadow-sm`}
            style={{ height: `${heights[item.rank]}px` }}
          >
            {showScore && <span className="text-body font-bold text-ink">{item.score}점</span>}
            <span className="text-2xl leading-none">{MEDAL[item.rank]}</span>
            {!showScore && <span className="text-caption font-bold text-ink">{item.rank}위</span>}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface ring-1 ring-line">
              <PersonIcon />
            </div>
            <span className="text-caption font-semibold text-ink">{item.name}</span>
          </div>

          {/* 보상: 바 아래 + 빛 아이콘 */}
          <div className="mt-2 flex flex-col items-center gap-0.5">
            <span className="text-caption text-subtle">보상</span>
            <span className="flex items-center gap-1 text-body font-semibold text-reward">
              <SparkleIcon className="h-4 w-4" />
              {item.reward}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}
