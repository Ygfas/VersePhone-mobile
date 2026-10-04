import { useSyncExternalStore } from 'react';

// Store wishlist sederhana (lintas layar, tanpa backend).
// `items` selalu diganti dengan array baru agar snapshot berubah.

let items = [];
const listeners = new Set();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getWishlist() {
  return items;
}

export function addToWishlist(item) {
  if (!items.some((i) => i.id === item.id)) {
    items = [item, ...items];
    emit();
  }
}

export function removeFromWishlist(id) {
  const before = items.length;
  items = items.filter((i) => i.id !== id);
  if (items.length !== before) emit();
}

export function useWishlist() {
  return useSyncExternalStore(subscribe, getWishlist);
}