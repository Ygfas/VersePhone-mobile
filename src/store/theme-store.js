import { useSyncExternalStore } from 'react';

// Store global mode gelap sederhana (lintas layar, instan, tanpa konfigurasi rumit)
let isDark = false;
const listeners = new Set();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getIsDarkMode() {
  return isDark;
}

export function setDarkMode(val) {
  isDark = !!val;
  emit();
}

export function useThemeMode() {
  return useSyncExternalStore(subscribe, getIsDarkMode);
}
