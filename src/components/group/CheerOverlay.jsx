import { useEffect, useMemo, useState } from 'react';

// 응원 캐릭터 하나. public/images/에 실제 캐릭터 PNG가 있으면 사용,
// 없으면 이모지로 대체(폴백)해서 에셋 없이도 동작.
function CheerCharacter({ withHeart }) {
  const [imgOk, setImgOk] = useState(true);
  const src = withHeart ? '/images/cheer-heart.png' : '/images/cheer-plain.png';
  // 그릇(화분) 크기를 기준으로 통일: plain은 프레임상 화분이 더 크게 잡혀 있어
  // 114px로 렌더하면 heart(h-36=144px)와 화분 폭이 같아진다(둘 다 렌더 화분 폭 ~88px).
  const heightCls = withHeart ? 'h-36' : 'h-[114px]';

  if (imgOk) {
    return (
      <img
        src={src}
        onError={() => setImgOk(false)}
        alt="응원 캐릭터"
        className={`${heightCls} w-auto animate-popIn object-contain drop-shadow-xl`}
      />
    );
  }
  return (
    <div className="relative animate-popIn text-7xl drop-shadow-lg">
      🪴
      {withHeart && (
        <span className="absolute inset-x-0 bottom-3 text-center text-3xl">❤️</span>
      )}
    </div>
  );
}

const CONFETTI_COLORS = ['#f6b424', '#c0492f', '#14453a', '#3ddc84', '#4f46e5', '#ec4899', '#38bdf8'];

// 응원 오버레이: 배경이 2초간 어두워지며 폭죽이 터지고 캐릭터가 떴다가,
// 다시 밝아지며(페이드) 사라짐.
// usedCount: 오늘 사용한 응원 횟수(1~3). 사용한 만큼 왼쪽부터 빈 화분으로 바뀜.
export default function CheerOverlay({ show, usedCount = 0, onDone }) {
  // 폭죽 파티클: 가운데에서 사방으로 흩어질 방향/색/지연을 미리 생성
  const pieces = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 110 + Math.random() * 190;
        return {
          dx: Math.round(Math.cos(angle) * dist),
          dy: Math.round(Math.sin(angle) * dist),
          rot: Math.round(Math.random() * 720 - 360),
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          delay: Math.random() * 0.15,
          w: 6 + Math.round(Math.random() * 5),
          h: 9 + Math.round(Math.random() * 7),
        };
      }),
    []
  );

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onDone, 2000);
    return () => clearTimeout(timer);
  }, [show, onDone]);

  if (!show) return null;

  return (
    <div className="animate-cheer fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-black/60">
      {/* 폭죽 파티클 */}
      {pieces.map((p, i) => (
        <span
          key={i}
          className="animate-burst absolute left-1/2 top-1/2 rounded-[1px]"
          style={{
            width: `${p.w}px`,
            height: `${p.h}px`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
            '--rot': `${p.rot}deg`,
          }}
        />
      ))}

      {/* 캐릭터: 사용한 만큼(왼쪽부터) 빈 화분, 남은 만큼 하트 화분 */}
      <div className="relative flex items-end gap-3">
        {[0, 1, 2].map((i) => (
          <CheerCharacter key={i} withHeart={i >= usedCount} />
        ))}
      </div>
    </div>
  );
}
