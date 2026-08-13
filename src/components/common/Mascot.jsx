import { Image } from 'react-native';

// 실제 마스코트 이미지 (assets/images/mascot.png).
const MASCOT = require('../../../assets/images/mascot.png');

export default function Mascot({ size = 40, style }) {
  return <Image source={MASCOT} style={[{ width: size, height: size, resizeMode: 'contain' }, style]} />;
}
