import assert from 'node:assert/strict';
import fs from 'node:fs';

const previousApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
process.env.EXPO_PUBLIC_API_BASE_URL = 'https://api.allog-app.store';
const source = fs.readFileSync(new URL('./api.js', import.meta.url), 'utf8')
  .replace('import { getCurrentIdToken } from "./authApi";', 'const getCurrentIdToken = async () => null;');
assert.equal(source.includes('http://localhost:8080'), false);
const { ApiError, apiRequest } = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`,
);
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

async function run({ statuses, options = {}, tokens = ['initial', 'refreshed'] }) {
  const tokenCalls = [];
  const requestCalls = [];
  let responseIndex = 0;
  globalThis.fetch = async (_url, request) => {
    requestCalls.push(request);
    return response(statuses[responseIndex++]);
  };
  const result = await apiRequest('/e2e', {
    ...options,
    _getToken: async (forceRefresh = false) => {
      tokenCalls.push(forceRefresh);
      return tokens[forceRefresh ? 1 : 0];
    },
  });
  return { result, tokenCalls, requestCalls };
}

try {
  let check = await run({ statuses: [200] });
  assert.deepEqual(check.tokenCalls, [false]);
  assert.equal(check.requestCalls.length, 1);
  assert.equal(check.requestCalls[0].headers.Authorization, 'Bearer initial');

  check = await run({ statuses: [401, 200] });
  assert.deepEqual(check.tokenCalls, [false, true]);
  assert.equal(check.requestCalls.length, 2);
  assert.equal(check.requestCalls[1].headers.Authorization, 'Bearer refreshed');
  assert.equal(check.result.ok, true);

  check = await run({ statuses: [401, 401] });
  assert.deepEqual(check.tokenCalls, [false, true]);
  assert.equal(check.requestCalls.length, 2);
  assert.equal(check.result.errorCode, ApiError.UNAUTHORIZED);

  check = await run({ statuses: [401], options: { skipAuth: true } });
  assert.deepEqual(check.tokenCalls, []);
  assert.equal(check.requestCalls.length, 1);
  assert.equal(check.result.errorCode, ApiError.UNAUTHORIZED);

  check = await run({ statuses: [401], options: { overrideToken: "debug-token" } });
  assert.deepEqual(check.tokenCalls, []);
  assert.equal(check.requestCalls.length, 1);
  assert.equal(check.result.errorCode, ApiError.UNAUTHORIZED);

  globalThis.fetch = async (_url, request) => new Promise((_resolve, reject) => {
    request.signal.addEventListener('abort', () => {
      const error = new Error('aborted');
      error.name = 'AbortError';
      reject(error);
    }, { once: true });
  });
  const timeout = await apiRequest('/timeout', { _getToken: async () => null, _timeoutMs: 5 });
  assert.equal(timeout.errorCode, ApiError.NETWORK);
  assert.equal(timeout.status, 0);

  globalThis.fetch = async (_url, request) => ({
    ok: true,
    status: 200,
    text: async () => new Promise((_resolve, reject) => {
      request.signal.addEventListener('abort', () => reject(new Error('body aborted')), { once: true });
    }),
  });
  const bodyTimeout = await apiRequest('/body-timeout', { _getToken: async () => null, _timeoutMs: 5 });
  assert.equal(bodyTimeout.errorCode, ApiError.NETWORK);
  assert.equal(bodyTimeout.status, 0);

  console.log('api timeout and 401 refresh retry OK');
} finally {
  if (previousApiBaseUrl === undefined) {
    delete process.env.EXPO_PUBLIC_API_BASE_URL;
  } else {
    process.env.EXPO_PUBLIC_API_BASE_URL = previousApiBaseUrl;
  }
  globalThis.fetch = originalFetch;
}
