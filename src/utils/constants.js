// constants utility

export const COACH_STYLES = [
  {
    name: "응원형",
    tone: "따뜻하게 격려해드려요",
    image: "/images/응원형.svg",
  },
  {
    name: "압박형",
    tone: "긴장감 있게 자극할게요",
    image: "/images/압박형.svg",
  },
  {
    name: "팩트형",
    tone: "숫자와 근거로 말할게요",
    image: "/images/팩트형.svg",
  },
  {
    name: "유머형",
    tone: "가볍고 재밌게 말할게요",
    image: "/images/유머형.svg",
  },
];

export const DEFAULT_COACH_STYLE = COACH_STYLES[0].name;

export function getCoachStyleImage(name) {
  return (
    COACH_STYLES.find((style) => style.name === name)?.image ??
    COACH_STYLES[0].image
  );
}

export function getCoachStyleTone(name) {
  return (
    COACH_STYLES.find((style) => style.name === name)?.tone ??
    COACH_STYLES[0].tone
  );
}
