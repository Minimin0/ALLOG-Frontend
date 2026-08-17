import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('./api.js', import.meta.url), 'utf8')
  .replace('import { getCurrentIdToken } from "./authApi";', 'const getCurrentIdToken = async () => null;');
const { ApiError, apiRequest } = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`,
);

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

  console.log('api 401 refresh retry OK');
} finally {
  globalThis.fetch = originalFetch;
}
