import { useSyncExternalStore } from 'react';

let history = ['Samsung', 'iPhone', 'Xiaomi'];
const listeners = new Set();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSearchHistory() {
  return history;
}

export function addSearchHistory(query) {
  if (!query || typeof query !== 'string') return;
  const trimmed = query.trim();
  if (!trimmed) return;
  history = [trimmed, ...history.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 10);
  emit();
}

export function removeSearchHistory(query) {
  history = history.filter((item) => item !== query);
  emit();
}

export function clearSearchHistory() {
  history = [];
  emit();
}

export function useSearchHistory() {
  return useSyncExternalStore(subscribe, getSearchHistory);
}
