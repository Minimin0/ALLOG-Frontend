import { useEffect, useState } from 'react';

// 응원 캐릭터 하나. public/images/에 실제 캐릭터 PNG가 있으면 사용,
// 없으면 이모지로 대체(폴백)해서 에셋 없이도 동작.
function CheerCharacter({ withHeart }) {
  const [imgOk, setImgOk] = useState(true);
  const src = withHeart ? '/images/cheer-heart.png' : '/images/cheer-plain.png';

  if (imgOk) {
    return (
      <img
        src={src}
        onError={() => setImgOk(false)}
        alt="응원 캐릭터"
        className="h-28 w-auto animate-popIn drop-shadow-lg"
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

// 응원 오버레이: 배경이 2초간 어두워지며 캐릭터가 떴다가 다시 밝아지며 사라짐.
export default function CheerOverlay({ show, onDone }) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onDone, 2000);
    return () => clearTimeout(timer);
  }, [show, onDone]);

  if (!show) return null;

  return (
    <div className="animate-cheer fixed inset-0 z-[70] flex items-center justify-center bg-black/60">
      <div className="flex items-end gap-3">
        <CheerCharacter withHeart />
        <CheerCharacter withHeart />
        <CheerCharacter />
      </div>
    </div>
  );
}
