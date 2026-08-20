import assert from 'node:assert/strict';
import fs from 'node:fs';

let source = fs.readFileSync(new URL('./authStore.js', import.meta.url), 'utf8')
  .replace('import { create } from \'zustand\';', `
    const create = (initializer) => {
      let state;
      const set = (update) => {
        const patch = typeof update === 'function' ? update(state) : update;
        state = { ...state, ...patch };
      };
      const get = () => state;
      const store = (selector = (value) => value) => selector(state);
      store.getState = get;
      store.setState = set;
      state = initializer(set, get);
      return store;
    };
  `)
  .replace("import { ApiError } from '../services/api';", `
    const ApiError = {
      NETWORK: 'NETWORK_ERROR', UNAUTHORIZED: 'UNAUTHORIZED', NOT_FOUND: 'NOT_FOUND',
      SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
    };
  `)
  .replace("import { signIn, signUp } from '../services/authApi';", `
    let authCalls = 0;
    let authResponder = async () => ({ ok: true, status: 200, data: {}, errorCode: null });
    const signIn = async (...args) => { authCalls += 1; return authResponder(...args); };
    const signUp = async (...args) => { authCalls += 1; return authResponder(...args); };
  `)
  .replace("import { clearAccessToken, getAccessToken, onUnauthorized } from '../services/tokenStore';", `
    let storedToken = null;
    let clearSucceeds = true;
    let unauthorizedHandler = () => {};
    const clearAccessToken = async () => {
      if (!clearSucceeds) return false;
      storedToken = null;
      return true;
    };
    const getAccessToken = async () => storedToken;
    const onUnauthorized = (handler) => { unauthorizedHandler = handler; };
  `)
  .replace("import { useUserStore } from './userStore';", `
    let profileLoader = async () => ({ ok: true, status: 200, data: {}, errorCode: null });
    const useUserStore = { getState: () => ({ loadProfile: profileLoader, reset: () => {} }) };
  `);
source += `
  export const __setToken = (token) => { storedToken = token; };
  export const __setClearSucceeds = (value) => { clearSucceeds = value; };
  export const __setProfileLoader = (loader) => { profileLoader = loader; };
  export const __setAuthResponder = (responder) => { authResponder = responder; authCalls = 0; };
  export const __authCalls = () => authCalls;
  export const __unauthorized = () => unauthorizedHandler();
`;

const module = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const {
  AuthStatus, __authCalls, __setAuthResponder, __setClearSucceeds, __setProfileLoader, __setToken,
  __unauthorized, useAuthStore,
} = module;

async function initWith(token, loader) {
  __setToken(token);
  __setProfileLoader(loader);
  useAuthStore.setState({
    status: AuthStatus.LOADING, hasSession: false, errorCode: null,
    initialized: false, authPromise: null,
  });
  await useAuthStore.getState().init();
  assert.notEqual(useAuthStore.getState().status, AuthStatus.LOADING);
}

await initWith(null, async () => { throw new Error('must not load'); });
assert.equal(useAuthStore.getState().status, AuthStatus.SIGNED_OUT);

await initWith('token', async () => ({ ok: true, status: 200, data: {}, errorCode: null }));
assert.equal(useAuthStore.getState().status, AuthStatus.READY);

await initWith('token', async () => ({ ok: false, status: 404, data: null, errorCode: 'NOT_FOUND' }));
assert.equal(useAuthStore.getState().status, AuthStatus.ONBOARDING);

await initWith('token', async () => ({ ok: false, status: 401, data: null, errorCode: 'UNAUTHORIZED' }));
assert.equal(useAuthStore.getState().status, AuthStatus.SIGNED_OUT);
assert.equal(useAuthStore.getState().hasSession, false);

await initWith('token', async () => ({ ok: false, status: 0, data: null, errorCode: 'NETWORK_ERROR' }));
assert.equal(useAuthStore.getState().status, AuthStatus.ERROR_RETRYABLE);

await initWith('token', async () => { throw new Error('timeout'); });
assert.equal(useAuthStore.getState().status, AuthStatus.ERROR_RETRYABLE);

__setProfileLoader(async () => ({ ok: true, status: 200, data: {}, errorCode: null }));
__setAuthResponder(async () => ({ ok: true, status: 200, data: { accessToken: 'token' }, errorCode: null }));
await useAuthStore.getState().signIn('judge', 'password');
assert.equal(useAuthStore.getState().status, AuthStatus.READY);

__setAuthResponder(async () => ({ ok: false, status: 401, data: null, errorCode: 'UNAUTHORIZED' }));
await useAuthStore.getState().signIn('judge', 'wrong');
assert.equal(useAuthStore.getState().status, AuthStatus.AUTH_ERROR);
assert.equal(useAuthStore.getState().authPromise, null);

__setAuthResponder(async () => ({ ok: false, status: 429, data: null, errorCode: 'RATE_LIMITED' }));
const limited = await useAuthStore.getState().signIn('judge', 'wrong');
assert.equal(limited.status, 429);
assert.equal(useAuthStore.getState().status, AuthStatus.AUTH_ERROR);
assert.equal(useAuthStore.getState().authPromise, null);

__setProfileLoader(async () => ({ ok: false, status: 0, data: null, errorCode: 'NETWORK_ERROR' }));
__setAuthResponder(async () => ({ ok: true, status: 200, data: { accessToken: 'token' }, errorCode: null }));
const failedBootstrap = await useAuthStore.getState().signIn('judge', 'password');
assert.equal(failedBootstrap.errorCode, 'NETWORK_ERROR');
assert.equal(useAuthStore.getState().status, AuthStatus.ERROR_RETRYABLE);
assert.equal(useAuthStore.getState().authPromise, null);

__setProfileLoader(async () => ({ ok: false, status: 404, data: null, errorCode: 'NOT_FOUND' }));
__setAuthResponder(async () => ({ ok: true, status: 201, data: { accessToken: 'token' }, errorCode: null }));
await useAuthStore.getState().signUp('newjudge', 'password');
assert.equal(useAuthStore.getState().status, AuthStatus.ONBOARDING);

let resolveAuth;
__setAuthResponder(() => new Promise((resolve) => { resolveAuth = resolve; }));
const first = useAuthStore.getState().signIn('judge', 'password');
const second = useAuthStore.getState().signIn('judge', 'password');
assert.equal(__authCalls(), 1);
resolveAuth({ ok: false, status: 401, data: null, errorCode: 'UNAUTHORIZED' });
await Promise.all([first, second]);
assert.equal(useAuthStore.getState().status, AuthStatus.AUTH_ERROR);

__unauthorized();
assert.equal(useAuthStore.getState().status, AuthStatus.SIGNED_OUT);

useAuthStore.setState({ status: AuthStatus.READY, hasSession: true });
__setClearSucceeds(false);
assert.equal(await useAuthStore.getState().signOut(), false);
assert.equal(useAuthStore.getState().status, AuthStatus.READY);
__setClearSucceeds(true);
assert.equal(await useAuthStore.getState().signOut(), true);
assert.equal(useAuthStore.getState().status, AuthStatus.SIGNED_OUT);

for (const path of ['../../app/auth/login.jsx', '../../app/auth/signup-account.jsx']) {
  const screen = fs.readFileSync(new URL(path, import.meta.url), 'utf8');
  assert.match(screen, /if \(busy/);
  assert.match(screen, /finally/);
  assert.match(screen, /useAuthStore\.getState\(\)\.status === AuthStatus\.AUTH_ERROR/);
  assert.doesNotMatch(screen, /Firebase|phone|email-address|placeholder="이메일"/i);
}

const loginScreen = fs.readFileSync(new URL('../../app/auth/login.jsx', import.meta.url), 'utf8');
assert.doesNotMatch(loginScreen, /아이디 찾기|비밀번호 찾기/);

const authApiSource = fs.readFileSync(new URL('../services/authApi.js', import.meta.url), 'utf8')
  .replace("import { ApiError, apiRequest } from './api';", `
    const ApiError = {
      VALIDATION: 'VALIDATION_ERROR', NETWORK: 'NETWORK_ERROR', SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
    };
    const apiRequest = async () => ({ ok: false });
  `)
  .replace("import { setAccessToken } from './tokenStore';", 'const setAccessToken = async () => {};');
const authApiModule = await import(`data:text/javascript;base64,${Buffer.from(authApiSource).toString('base64')}`);
assert.equal(
  authApiModule.authErrorMessage({ status: 429, errorCode: 'RATE_LIMITED' }),
  '로그인 시도가 너무 많아요. 잠시 후 다시 시도해 주세요.',
);

const rootLayout = fs.readFileSync(new URL('../../app/_layout.jsx', import.meta.url), 'utf8');
assert.match(rootLayout, /authStatus === AuthStatus\.SIGNED_OUT/);
assert.match(rootLayout, /router\.dismissTo\('\/'\)/);

const tokenStore = fs.readFileSync(new URL('../services/tokenStore.js', import.meta.url), 'utf8');
assert.match(tokenStore, /expo-secure-store/);
assert.doesNotMatch(tokenStore, /AsyncStorage|console\./);

const tokenModuleSource = tokenStore
  .replace("import { Platform } from 'react-native';", "const Platform = { OS: 'android' };")
  .replace("import * as SecureStore from 'expo-secure-store';", `
    let secureValue = null;
    let failWrite = false;
    let failDelete = false;
    const SecureStore = {
      getItemAsync: async () => secureValue,
      setItemAsync: async (_key, value) => {
        if (failWrite) throw new Error('write failed');
        secureValue = value;
      },
      deleteItemAsync: async () => {
        if (failDelete) throw new Error('delete failed');
        secureValue = null;
      },
    };
  `) + `
    export const __failWrite = () => { failWrite = true; };
    export const __failDelete = () => { failDelete = true; };
  `;
const tokenModule = await import(`data:text/javascript;base64,${Buffer.from(tokenModuleSource).toString('base64')}`);
await tokenModule.setAccessToken('stable-token');
tokenModule.__failWrite();
await assert.rejects(tokenModule.setAccessToken('unsaved-token'));
assert.equal(await tokenModule.getAccessToken(), 'stable-token');
tokenModule.__failDelete();
assert.equal(await tokenModule.clearAccessToken(), false);
assert.equal(await tokenModule.getAccessToken(), 'stable-token');

const myScreen = fs.readFileSync(new URL('../../app/(tabs)/my.jsx', import.meta.url), 'utf8');
assert.match(myScreen, /if \(!await useAuthStore\.getState\(\)\.signOut\(\)\)/);
assert.match(myScreen, /router\.dismissTo\('\/'\)/);

console.log('finite local auth states, SecureStore, and duplicate-submit guard OK');
