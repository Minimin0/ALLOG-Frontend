import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const canonicalRoutes = [
  'app/index.jsx', 'app/auth/login.jsx', 'app/auth/signup-account.jsx',
  'app/my/edit-profile.jsx', 'app/(tabs)/home.jsx', 'app/(tabs)/group.jsx',
  'app/(tabs)/explore.jsx', 'app/(tabs)/reward.jsx', 'app/(tabs)/my.jsx',
];

for (const route of canonicalRoutes) {
  const source = read(route);
  if (source.includes('MobileScreenRoute')) throw new Error(`${route} regressed to a legacy route adapter`);
  if (/firebase|signup-phone|phone auth|\bOTP\b/i.test(source)) throw new Error(`${route} contains removed auth architecture`);
}

const edit = read('app/my/edit-profile.jsx');
for (const required of ['useUserStore', 'updateProfile', 'profileToEditForm']) {
  if (!edit.includes(required)) throw new Error(`canonical Edit Profile is missing ${required}`);
}
if (edit.includes('useAppState')) throw new Error('canonical Edit Profile depends on legacy AppState');

for (const name of ['home', 'group', 'explore', 'reward', 'my']) {
  if (read(`app/(tabs)/${name}.jsx`).includes('SafeAreaView')) throw new Error(`${name} has a duplicate tab safe area`);
}
if (!read('tailwind.config.js').includes("'./mobile/**/*.{js,jsx,ts,tsx}'")) throw new Error('Tailwind mobile scan is missing');

console.log('canonical UI route ownership OK');
