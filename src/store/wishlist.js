import { useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store wishlist per pengguna dengan persistensi AsyncStorage & localStorage
let currentUserKey = 'guest';
let items = [];
const memoryCache = { guest: [] };
const listeners = new Set();
let isInitialized = false;

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Inisialisasi awal dari storage saat module di-load
async function initStorage() {
  try {
    let activeKey = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      activeKey = window.localStorage.getItem('verse_active_user_key');
    }
    if (!activeKey) {
      activeKey = await AsyncStorage.getItem('verse_active_user_key');
    }
    if (activeKey) {
      currentUserKey = activeKey;
    }

    const savedItems = await loadFromStorage(currentUserKey);
    items = savedItems;
    isInitialized = true;
    emit();
  } catch (e) {
    console.warn('Init wishlist storage error:', e);
  }
}

initStorage();

async function loadFromStorage(key) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedWeb = window.localStorage.getItem(`verse_wishlist_${key}`);
      if (savedWeb) {
        const parsed = JSON.parse(savedWeb);
        memoryCache[key] = parsed;
        return parsed;
      }
    }
    const savedAsync = await AsyncStorage.getItem(`verse_wishlist_${key}`);
    if (savedAsync) {
      const parsed = JSON.parse(savedAsync);
      memoryCache[key] = parsed;
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to load wishlist:', e);
  }
  return memoryCache[key] || [];
}

async function saveToStorage(key, data) {
  memoryCache[key] = data;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(`verse_wishlist_${key}`, JSON.stringify(data));
      window.localStorage.setItem('verse_active_user_key', key);
    }
    await AsyncStorage.setItem(`verse_wishlist_${key}`, JSON.stringify(data));
    await AsyncStorage.setItem('verse_active_user_key', key);
  } catch (e) {
    console.warn('Failed to save wishlist:', e);
  }
}

export async function setWishlistUser(user) {
  const newKey = user ? (user.id || user.email || user.username || 'user') : null;
  if (!newKey) return; // Jangan reset ke guest jika user null saat initial load/checkSession
  if (currentUserKey !== newKey || !isInitialized) {
    currentUserKey = newKey;
    items = await loadFromStorage(currentUserKey);
    saveToStorage(currentUserKey, items);
    emit();
  }
}

export async function clearWishlistUser() {
  currentUserKey = 'guest';
  items = await loadFromStorage('guest');
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem('verse_active_user_key');
  }
  await AsyncStorage.removeItem('verse_active_user_key');
  emit();
}

export function getWishlist() {
  return items;
}

export function addToWishlist(item) {
  if (!items.some((i) => i.id === item.id)) {
    items = [item, ...items];
    saveToStorage(currentUserKey, items);
    emit();
  }
}

export function removeFromWishlist(id) {
  const before = items.length;
  items = items.filter((i) => i.id !== id);
  if (items.length !== before) {
    saveToStorage(currentUserKey, items);
    emit();
  }
}

export function useWishlist() {
  return useSyncExternalStore(subscribe, getWishlist);
}
