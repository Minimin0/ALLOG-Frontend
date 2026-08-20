import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'allog.accessToken';
let cachedToken;
let unauthorizedHandler = () => {};

export async function getAccessToken() {
  if (cachedToken !== undefined) return cachedToken;
  if (Platform.OS === 'web') return (cachedToken = null);
  cachedToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  return cachedToken;
}

export async function setAccessToken(token) {
  if (Platform.OS !== 'web') await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  cachedToken = token;
}

export async function clearAccessToken() {
  const previousToken = cachedToken;
  cachedToken = null;
  if (Platform.OS === 'web') return true;
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    return true;
  } catch {
    cachedToken = previousToken;
    return false;
  }
}

export function onUnauthorized(handler) {
  unauthorizedHandler = handler;
}

export function notifyUnauthorized() {
  unauthorizedHandler();
}
