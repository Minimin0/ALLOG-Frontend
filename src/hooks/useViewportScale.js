import { useEffect, useState } from "react";

// Figma에서 고정 픽셀 좌표(position: absolute)로 그대로 옮긴 화면을
// 안드로이드 등 더 좁은 화면에서도 레이아웃이 안 깨지게 비율대로 축소하기 위한 훅.
// designWidth보다 뷰포트가 좁으면 그 비율만큼 scale을 줄이고, 넓으면 1(원본 크기)을 유지한다.
export function useViewportScale(designWidth) {
  const [scale, setScale] = useState(() =>
    typeof window === "undefined" ? 1 : Math.min(1, window.innerWidth / designWidth),
  );

  useEffect(() => {
    const updateScale = () => {
      setScale(Math.min(1, window.innerWidth / designWidth));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [designWidth]);

  return scale;
}

export default useViewportScale;
