import fs from 'node:fs';

const layout = fs.readFileSync(new URL('../app/_layout.jsx', import.meta.url), 'utf8');
const fontAsset = new URL('../mobile/assets/fonts/PretendardVariable.ttf', import.meta.url);

const required = [
  "import { useFonts } from 'expo-font';",
  "import * as SplashScreen from 'expo-splash-screen';",
  "Pretendard: require('../mobile/assets/fonts/PretendardVariable.ttf')",
  "fontFamily: 'Pretendard'",
  'SplashScreen.preventAutoHideAsync()',
  'SplashScreen.hideAsync()',
];

for (const source of required) {
  if (!layout.includes(source)) throw new Error(`canonical font setup is missing: ${source}`);
}
if (!fs.existsSync(fontAsset)) throw new Error('Pretendard font asset is missing');

console.log('canonical Expo font setup OK');
