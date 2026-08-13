// SVG 아이콘 매핑 (react-native-svg-transformer로 .svg를 컴포넌트 import).
import Heart from '../../../assets/icons/heart.svg';
import Coin from '../../../assets/icons/coin.svg';
import Chart from '../../../assets/icons/chart.svg';
import Fire from '../../../assets/icons/fire.svg';
import Exercise from '../../../assets/icons/exercise.svg';
import Sleep from '../../../assets/icons/sleep.svg';
import Meal from '../../../assets/icons/meal.svg';
import Selfcare from '../../../assets/icons/selfcare.svg';
import Search from '../../../assets/icons/search.svg';
import Filter from '../../../assets/icons/filter.svg';
import Ticket from '../../../assets/icons/ticket.svg';
import Coupon from '../../../assets/icons/coupon.svg';
import Shipping from '../../../assets/icons/shipping.svg';
import Check from '../../../assets/icons/check.svg';
import Bell from '../../../assets/icons/bell.svg';
import Privacy from '../../../assets/icons/privacy.svg';
import Terms from '../../../assets/icons/terms.svg';
import Support from '../../../assets/icons/support.svg';
import Coach from '../../../assets/icons/coach.svg';
import Pressure from '../../../assets/icons/pressure.svg';
import Fact from '../../../assets/icons/fact.svg';
import Humor from '../../../assets/icons/humor.svg';

const ICONS = {
  heart: Heart, coin: Coin, chart: Chart, fire: Fire,
  exercise: Exercise, sleep: Sleep, meal: Meal, selfcare: Selfcare,
  search: Search, filter: Filter, ticket: Ticket, coupon: Coupon, shipping: Shipping,
  check: Check, bell: Bell, privacy: Privacy, terms: Terms, support: Support,
  coach: Coach, pressure: Pressure, fact: Fact, humor: Humor,
};

export default function Icon({ name, size = 20, style }) {
  const Cmp = ICONS[name];
  if (!Cmp) return null;
  return <Cmp width={size} height={size} style={style} />;
}
