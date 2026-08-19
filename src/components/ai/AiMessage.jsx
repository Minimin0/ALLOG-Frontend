import { useEffect, useState } from 'react';
import { getCoachStyleImage } from '@/utils/constants.js';
import { getCoachStyle } from '@/utils/storage.js';

// 마운트 직후 0 → 목표값으로 채워지는 애니메이션 트리거.
// requestAnimationFrame은 미표시 프레임에서 안 불릴 수 있어 setTimeout으로 확실히 발화.
function useGrown(delay = 40) {
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setGrown(true), delay);
    return () => clearTimeout(id);
  }, [delay]);
  return grown;
}

// ── ① 인원 점(pips): 부분/전체 소수 개수 → 채운 점 vs 빈 점 (미인증 인원)
function VizPips({ filled, total, note }) {
  const grown = useGrown();
  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: total }).map((_, i) => {
          const on = i < filled;
          return (
            <span
              key={i}
              className={`h-6 w-6 rounded-full transition-all duration-300 ${
                on ? 'bg-primary' : 'border-2 border-line bg-transparent'
              } ${grown ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            />
          );
        })}
      </div>
      {note && <p className="mt-2 text-caption font-bold text-primary">{note}</p>}
    </div>
  );
}

// ── ② 진행 링(ring): 한 값의 목표 대비 진행 → SVG 도넛 + gold 목표 눈금 (공동목표)
function VizRing({ value, goal, unit, note }) {
  const grown = useGrown();
  const r = 34;
  const circ = 2 * Math.PI * r;
  const offset = grown ? circ * (1 - value / 100) : circ; // 가득참 → 목표만큼 채움

  return (
    <div className="mt-3 flex items-center gap-4">
      <div className="relative h-[84px] w-[84px]">
        <svg viewBox="0 0 84 84" className="h-full w-full -rotate-90">
          <circle cx="42" cy="42" r={r} fill="none" stroke="var(--color-line)" strokeWidth="9" />
          <circle
            cx="42"
            cy="42"
            r={r}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 900ms ease-out' }}
          />
          {/* 목표(goal) 눈금 — gold */}
          <line
            x1="42"
            y1="4"
            x2="42"
            y2="12"
            stroke="var(--color-reward)"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${goal * 3.6} 42 42)`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-section font-bold text-primary">
          {value}
          {unit}
        </div>
      </div>
      <div className="text-caption leading-relaxed text-muted">
        목표 {goal}
        {unit}
        {note && (
          <>
            <br />
            <span className="font-bold text-reward">{note}</span>
          </>
        )}
      </div>
    </div>
  );
}

// ── ③ 미니 컬럼(columns): 카테고리 분포 → 세로 기둥, highlight=강조 (시간대)
// 말풍선을 넓혀(flex-1) 받고, 기둥은 중앙 정렬 → 라벨 겹침/넘침 방지.
function VizColumns({ data, unit }) {
  const grown = useGrown();
  const max = Math.max(...data.map((d) => d.value));
  const H = 64; // 막대 최대 높이(px)
  // 컨테이너 높이 = 막대(H) + 위 값 라벨 + 아래 카테고리 라벨 + 간격 → 라벨이 밖으로 안 삐져나가게
  const BOX_H = H + 44;

  return (
    <div className="mt-3 flex w-full items-end justify-center gap-7" style={{ height: BOX_H }}>
      {data.map((d, i) => (
        <div key={d.label} className="flex flex-col items-center gap-1.5">
          <span className={`text-caption font-bold ${d.highlight ? 'text-primary' : 'text-muted'}`}>
            {d.value}
            {unit}
          </span>
          <div
            className={`w-7 rounded-t transition-[height] duration-700 ease-out ${
              d.highlight ? 'bg-primary' : 'bg-disabled'
            }`}
            style={{
              height: grown ? `${(d.value / max) * H}px` : '0px',
              transitionDelay: `${i * 120}ms`,
            }}
          />
          <span className={`text-caption ${d.highlight ? 'font-bold text-primary' : 'text-muted'}`}>
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── ④ 격차 비교(versus): 두 값 비교 + 격차 → 나 vs 상대 카드 + delta (순위)
// deltaMotion: 'float'=계속 둥실 / 'rise'=처음 한 번 아래→위 페이드 후 정지.
function VizVersus({ left, right, delta, metric, unit, deltaMotion }) {
  const grown = useGrown();
  const deltaAnim = deltaMotion === 'float' ? 'animate-float' : 'animate-riseUp';
  const Card = ({ item, me }) => (
    <div
      className={`flex-1 rounded-item px-2 py-2.5 text-center transition-all duration-500 ${
        me ? 'border-[1.5px] border-primary bg-primary-tint' : 'bg-surface-alt'
      } ${grown ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
    >
      <div className={`text-h2 font-bold ${me ? 'text-primary' : 'text-muted'}`}>
        {item.value}
        <span className="text-caption font-bold">{unit}</span>
      </div>
      <div className={`text-caption ${me ? 'text-primary' : 'text-muted'}`}>{item.label}</div>
    </div>
  );
  return (
    <div className="mt-3">
      {metric && <p className="mb-1.5 text-caption text-muted">기준 · {metric}</p>}
      <div className="flex items-center gap-2.5">
        <Card item={left} me={false} />
        {/* 델타만 애니메이션 — 박스는 그대로 (transform만 이동) */}
        <span className={`shrink-0 ${deltaAnim} text-caption font-bold text-reward motion-reduce:animate-none`}>
          {delta}
        </span>
        <Card item={right} me />
      </div>
    </div>
  );
}

function CoachViz({ viz }) {
  switch (viz.type) {
    case 'pips':
      return <VizPips filled={viz.filled} total={viz.total} note={viz.note} />;
    case 'ring':
      return <VizRing value={viz.value} goal={viz.goal} unit={viz.unit} note={viz.note} />;
    case 'columns':
      return <VizColumns data={viz.data} unit={viz.unit} />;
    case 'versus':
      return (
        <VizVersus
          left={viz.left}
          right={viz.right}
          delta={viz.delta}
          metric={viz.metric}
          unit={viz.unit}
          deltaMotion={viz.deltaMotion}
        />
      );
    default:
      return null;
  }
}

// AI 코치 메시지 (왼쪽, 마스코트 아바타 + 연초록 말풍선). viz가 있으면 데이터 시각화 표시.
// 세로 막대 차트(columns)는 가로 공간이 필요해 말풍선을 flex-1로 넓힌다(그 외엔 80% 유지).
export default function AiMessage({ text, viz }) {
  const wideViz = viz?.type === 'columns';
  const [coachImage] = useState(() => getCoachStyleImage(getCoachStyle()));
  return (
    <div className="animate-riseUp flex items-start gap-2">
      <img
        src={coachImage}
        alt="AI 코치"
        className="h-9 w-9 shrink-0 rounded-full bg-primary-tint object-cover ring-1 ring-line"
      />
      <div
        className={`rounded-2xl rounded-tl-md bg-primary-tint px-4 py-3 text-body leading-relaxed text-ink [word-break:keep-all] ${
          wideViz ? 'flex-1' : 'max-w-[80%]'
        }`}
      >
        <p className="whitespace-pre-line">{text}</p>
        {viz && <CoachViz viz={viz} />}
      </div>
    </div>
  );
}
