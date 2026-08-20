import assert from 'node:assert/strict';
import fs from 'node:fs';

const previousApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
process.env.EXPO_PUBLIC_API_BASE_URL = 'https://api.allog-app.store';
const source = fs.readFileSync(new URL('./api.js', import.meta.url), 'utf8')
  .replace(
    "import { clearAccessToken, getAccessToken, notifyUnauthorized } from './tokenStore';",
    `let cleared = 0;
     let unauthorized = 0;
     const clearAccessToken = async () => { cleared += 1; };
     const getAccessToken = async () => null;
     const notifyUnauthorized = () => { unauthorized += 1; };`,
  );
assert.equal(source.includes('http://localhost:8080'), false);
assert.equal(source.includes('forceRefresh'), false);
const module = await import(`data:text/javascript;base64,${Buffer.from(`${source}\nexport { cleared, unauthorized };`).toString('base64')}`);
const { ApiError, apiRequest } = module;

const aiSource = fs.readFileSync(new URL('./aiApi.js', import.meta.url), 'utf8')
  .replace('import { apiRequest } from "./api";', 'const apiRequest = (path, options) => ({ path, options });');
const { fetchAiCoachFollowUp } = await import(
  `data:text/javascript;base64,${Buffer.from(aiSource).toString('base64')}`,
);
const followUp = fetchAiCoachFollowUp(42, 'PACE_CHECK');
assert.equal(followUp.path, '/api/v1/groups/42/ai-coach/follow-up');
assert.deepEqual(followUp.options, { method: 'POST', body: { questionId: 'PACE_CHECK' } });

const originalFetch = globalThis.fetch;
const response = (status, body = null) => ({
  ok: status >= 200 && status < 300,
  status,
  text: async () => (body === null ? '' : JSON.stringify(body)),
});

async function run({ status, options = {} }) {
  const tokenCalls = [];
  const requestCalls = [];
  globalThis.fetch = async (_url, request) => {
    requestCalls.push(request);
    return response(status);
  };
  const result = await apiRequest('/e2e', {
    ...options,
    _getToken: async () => {
      tokenCalls.push(true);
      return 'stored-token';
    },
  });
  return { result, tokenCalls, requestCalls };
}

try {
  let check = await run({ status: 200 });
  assert.deepEqual(check.tokenCalls, [true]);
  assert.equal(check.requestCalls.length, 1);
  assert.equal(check.requestCalls[0].headers.Authorization, 'Bearer stored-token');

  check = await run({ status: 401 });
  assert.deepEqual(check.tokenCalls, [true]);
  assert.equal(check.requestCalls.length, 1);
  assert.equal(check.result.errorCode, ApiError.UNAUTHORIZED);
  assert.equal(module.cleared, 1);
  assert.equal(module.unauthorized, 1);

  check = await run({ status: 401, options: { skipAuth: true } });
  assert.deepEqual(check.tokenCalls, []);
  assert.equal(module.cleared, 1);
  assert.equal(module.unauthorized, 1);

  check = await run({ status: 401, options: { overrideToken: 'invalid-fixture' } });
  assert.deepEqual(check.tokenCalls, []);
  assert.equal(module.cleared, 1);
  assert.equal(module.unauthorized, 1);

  check = await run({ status: 429, options: { skipAuth: true } });
  assert.equal(check.result.errorCode, ApiError.RATE_LIMITED);

  globalThis.fetch = async (_url, request) => new Promise((_resolve, reject) => {
    request.signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true });
  });
  const timeout = await apiRequest('/timeout', { _getToken: async () => null, _timeoutMs: 5 });
  assert.equal(timeout.errorCode, ApiError.NETWORK);

  globalThis.fetch = async (_url, request) => ({
    ok: true,
    status: 200,
    text: async () => new Promise((_resolve, reject) => {
      request.signal.addEventListener('abort', () => reject(new Error('body aborted')), { once: true });
    }),
  });
  const bodyTimeout = await apiRequest('/body-timeout', { _getToken: async () => null, _timeoutMs: 5 });
  assert.equal(bodyTimeout.errorCode, ApiError.NETWORK);

  console.log('api timeout and finite 401 invalidation OK');
} finally {
  if (previousApiBaseUrl === undefined) delete process.env.EXPO_PUBLIC_API_BASE_URL;
  else process.env.EXPO_PUBLIC_API_BASE_URL = previousApiBaseUrl;
  globalThis.fetch = originalFetch;
}
