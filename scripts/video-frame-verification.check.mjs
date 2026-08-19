import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const camera = read('app/verify/camera.jsx');
const preview = read('app/verify/preview.jsx');
const loading = read('app/verify/loading.jsx');
const api = read('src/services/verificationApi.js');
const config = JSON.parse(read('app.json'));
const pkg = JSON.parse(read('package.json'));

assert.match(camera, /recordAsync\(\{ maxDuration: RECORDING_SECONDS \}\)/);
assert.match(camera, /mode="video"/);
assert.match(camera, /\bmute\b/);
assert.match(camera, /getThumbnailAsync\(video\.uri, \{\s*time: FRAME_TIME_MS,/s);
assert.match(camera, /format: ImageManipulator\.SaveFormat\.JPEG/);
assert.match(camera, /contentType: 'image\/jpeg'/);
assert.doesNotMatch(camera, /useMicrophonePermissions|video\/mp4|console\.(log|warn)/);
assert.match(preview, /instance\.muted = true/);
assert.match(preview, /nativeControls=\{false\}/);
assert.match(preview, /router\.replace\('\/verify\/loading'\)/);
assert.doesNotMatch(preview, /clearVideo/);
assert.match(loading, /clearVideo\(\);/);
assert.match(loading, /fetch\(media\.uri\)/);
assert.doesNotMatch(loading, /videoUri|video\/mp4/);
assert.doesNotMatch(api, /video\/mp4|S3|AWS/);
assert.deepEqual(api.match(/SUPPORTED_CONTENT_TYPES = (\[[^;]+\])/)[1], '["image/jpeg", "image/png"]');
assert.equal(config.expo.plugins.find((plugin) => Array.isArray(plugin) && plugin[0] === 'expo-camera')[1].recordAudioAndroid, false);
assert.ok(pkg.dependencies['expo-video-thumbnails']);
assert.ok(pkg.dependencies['expo-image-manipulator']);

console.log('video frame verification boundary OK');
