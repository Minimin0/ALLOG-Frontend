import { useEffect, useRef, useState } from 'react';

/**
 * 요소가 화면(뷰포트)에 들어오는지 감지하는 훅 — 스크롤 등장 애니메이션 트리거용.
 * IntersectionObserver(브라우저 표준)를 사용. 라이브러리 불필요.
 * @param {{ threshold?: number, once?: boolean }} options
 *        threshold: 요소가 이만큼 보이면 true (0~1). once: 한 번만 트리거(기본 true).
 * @returns {[React.RefObject, boolean]} [대상에 붙일 ref, 화면에 들어왔는지]
 */
export function useInView({ threshold = 0.2, once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect(); // 한 번 보이면 관찰 종료
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return [ref, inView];
}
