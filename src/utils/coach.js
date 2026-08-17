export const COACH_IMAGES = {
  응원형: require("../../assets/images/CheerCoach.png"),
  압박형: require("../../assets/images/PushCoach.png"),
  팩트형: require("../../assets/images/FactCoach.png"),
  유머형: require("../../assets/images/HumorCoach.png"),
};

export function getCoachImage(style) {
  return COACH_IMAGES[style] || COACH_IMAGES["응원형"];
}
