import { useSyncExternalStore } from 'react';

// Menyimpan artikel yang sedang dibuka (untuk halaman detail artikel).
// Dipakai agar tidak perlu meneruskan data besar (mis. gambar base64) lewat
// query params URL.

let current = null;
const listeners = new Set();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCurrentArticle() {
  return current;
}

export function setCurrentArticle(article) {
  current = article;
  emit();
}

export function useCurrentArticle() {
  return useSyncExternalStore(subscribe, getCurrentArticle);
}