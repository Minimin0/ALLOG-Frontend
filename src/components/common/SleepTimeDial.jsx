import { useEffect, useRef } from "react";

const TICK_GAP = 28;

function buildTicks(min, max, step) {
  const ticks = [];
  const count = Math.round((max - min) / step);
  for (let i = 0; i <= count; i += 1) {
    ticks.push(Math.round((min + i * step) * 100) / 100);
  }
  return ticks;
}

function SleepTimeDial({ value, onChange, min = 4, max = 10, step = 0.5 }) {
  const trackRef = useRef(null);
  const dragRef = useRef({ dragging: false, startX: 0, startScroll: 0 });
  const scrollTimeoutRef = useRef(null);
  const ticks = buildTicks(min, max, step);

  const scrollToValue = (val, behavior = "auto") => {
    const idx = ticks.findIndex((tick) => Math.abs(tick - val) < 1e-6);
    if (idx < 0 || !trackRef.current) return;
    trackRef.current.scrollTo({ left: idx * TICK_GAP, behavior });
  };

  useEffect(() => {
    scrollToValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const commitFromScroll = () => {
    if (!trackRef.current) return;
    const idx = Math.round(trackRef.current.scrollLeft / TICK_GAP);
    const clamped = Math.max(0, Math.min(ticks.length - 1, idx));
    const newValue = ticks[clamped];
    trackRef.current.scrollTo({ left: clamped * TICK_GAP, behavior: "smooth" });
    if (newValue !== value) onChange(newValue);
  };

  const handleScroll = () => {
    if (dragRef.current.dragging) return;
    clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(commitFromScroll, 100);
  };

  const handlePointerDown = (event) => {
    if (!trackRef.current) return;
    dragRef.current = {
      dragging: true,
      startX: event.clientX,
      startScroll: trackRef.current.scrollLeft,
    };
    trackRef.current.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current.dragging || !trackRef.current) return;
    const delta = event.clientX - dragRef.current.startX;
    trackRef.current.scrollLeft = dragRef.current.startScroll - delta;
  };

  const endDrag = () => {
    if (!dragRef.current.dragging) return;
    dragRef.current.dragging = false;
    commitFromScroll();
  };

  return (
    <div className="w-full min-w-0 overflow-hidden">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        className="no-scrollbar flex w-full min-w-0 cursor-grab select-none overflow-x-scroll active:cursor-grabbing"
        style={{ scrollSnapType: "x mandatory", touchAction: "pan-x" }}
      >
        <div style={{ flex: `0 0 calc(50% - ${TICK_GAP / 2}px)` }} />
        {ticks.map((tick) => {
          const isSelected = Math.abs(tick - value) < 1e-6;
          const isHour = Number.isInteger(tick);
          return (
            <div
              key={tick}
              style={{ flex: `0 0 ${TICK_GAP}px`, scrollSnapAlign: "center" }}
              className="flex flex-col items-center"
            >
              <div className="flex h-[54px] w-full items-end justify-center">
                <div
                  className={`rounded-full ${isSelected ? "bg-[#14453a]" : "bg-[#bababa]"}`}
                  style={{
                    width: isSelected ? "4px" : "3px",
                    height: isSelected ? "54px" : isHour ? "37px" : "20px",
                  }}
                />
              </div>
              <span
                className="mt-2 text-[13px] font-medium text-[#bababa]"
                style={{ visibility: isHour ? "visible" : "hidden" }}
              >
                {Math.floor(tick)}
              </span>
            </div>
          );
        })}
        <div style={{ flex: `0 0 calc(50% - ${TICK_GAP / 2}px)` }} />
      </div>
    </div>
  );
}

export default SleepTimeDial;
