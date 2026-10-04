import { useSyncExternalStore } from 'react';

// Menyimpan promo yang sedang dibuka (untuk halaman detail promo).
// Pola sama seperti article-view.

let current = null;
const listeners = new Set();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCurrentPromo() {
  return current;
}

export function setCurrentPromo(promo) {
  current = promo;
  emit();
}

export function useCurrentPromo() {
  return useSyncExternalStore(subscribe, getCurrentPromo);
}