import assert from 'node:assert/strict';
import fs from 'node:fs';

let source = fs.readFileSync(new URL('./authStore.js', import.meta.url), 'utf8')
  .replace('import { create } from "zustand";', `
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
  .replace('import { ApiError } from "../services/api";', `
    const ApiError = {
      NETWORK: 'NETWORK_ERROR',
      UNAUTHORIZED: 'UNAUTHORIZED',
      NOT_FOUND: 'NOT_FOUND',
      SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
    };
  `)
  .replace('import { signOutUser, subscribeToAuthChanges } from "../services/authApi";', `
    const signOutUser = async () => {};
    const subscribeToAuthChanges = () => () => {};
  `)
  .replace('import { isFirebaseConfigured } from "../services/firebase";', 'const isFirebaseConfigured = true;')
  .replace('import { useUserStore } from "./userStore";', `
    let profileLoader = async () => ({ ok: true, status: 200, data: {}, errorCode: null });
    const useUserStore = { getState: () => ({ loadProfile: profileLoader, reset: () => {} }) };
  `);
source += '\nexport const __setProfileLoader = (loader) => { profileLoader = loader; };';

const module = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const { AuthStatus, __setProfileLoader, useAuthStore } = module;

async function bootstrapWith(loader) {
  __setProfileLoader(loader);
  useAuthStore.setState({ status: AuthStatus.SIGNED_OUT, firebaseUser: { uid: 'judge' }, errorCode: null });
  const result = await Promise.race([
    useAuthStore.getState().bootstrap(),
    new Promise((_resolve, reject) => setTimeout(() => reject(new Error('bootstrap did not settle')), 250)),
  ]);
  assert.notEqual(useAuthStore.getState().status, AuthStatus.LOADING);
  return result;
}

await bootstrapWith(async () => ({ ok: true, status: 200, data: {}, errorCode: null }));
assert.equal(useAuthStore.getState().status, AuthStatus.READY);

await bootstrapWith(async () => ({ ok: false, status: 404, data: null, errorCode: 'NOT_FOUND' }));
assert.equal(useAuthStore.getState().status, AuthStatus.ONBOARDING);

await bootstrapWith(async () => ({ ok: false, status: 0, data: null, errorCode: 'NETWORK_ERROR' }));
assert.equal(useAuthStore.getState().status, AuthStatus.ERROR);
assert.equal(useAuthStore.getState().errorCode, 'NETWORK_ERROR');

await bootstrapWith(async () => { throw new Error('unexpected'); });
assert.equal(useAuthStore.getState().status, AuthStatus.ERROR);
assert.equal(useAuthStore.getState().errorCode, 'NETWORK_ERROR');

for (const path of ['../../app/auth/login.jsx', '../../app/auth/signup-account.jsx']) {
  const screen = fs.readFileSync(new URL(path, import.meta.url), 'utf8');
  assert.match(screen, /AuthStatus\.ERROR/);
  assert.match(screen, /setBusy\(false\)/);
  assert.match(screen, /getState\(\)\.bootstrap\(\)/);
  assert.match(screen, /finally/);
}

console.log('auth bootstrap terminal states and screen recovery OK');
