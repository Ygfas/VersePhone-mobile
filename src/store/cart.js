import { useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

let currentUserKey = 'guest';
let cartItems = [];
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

    const saved = await loadFromStorage(currentUserKey);
    cartItems = saved;
    isInitialized = true;
    emit();
  } catch (e) {
    console.warn('Init cart storage error:', e);
  }
}

initStorage();

async function loadFromStorage(key) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedWeb = window.localStorage.getItem(`verse_cart_${key}`);
      if (savedWeb) {
        const parsed = JSON.parse(savedWeb);
        memoryCache[key] = parsed;
        return parsed;
      }
    }
    const savedAsync = await AsyncStorage.getItem(`verse_cart_${key}`);
    if (savedAsync) {
      const parsed = JSON.parse(savedAsync);
      memoryCache[key] = parsed;
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to load cart:', e);
  }
  return memoryCache[key] || [];
}

async function saveToStorage(key, data) {
  memoryCache[key] = data;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(`verse_cart_${key}`, JSON.stringify(data));
      window.localStorage.setItem('verse_active_user_key', key);
    }
    await AsyncStorage.setItem(`verse_cart_${key}`, JSON.stringify(data));
    await AsyncStorage.setItem('verse_active_user_key', key);
  } catch (e) {
    console.warn('Failed to save cart:', e);
  }
}

export async function setCartUser(user) {
  const newKey = user ? (user.id || user.email || user.username || 'user') : null;
  if (!newKey) return;
  if (currentUserKey !== newKey || !isInitialized) {
    currentUserKey = newKey;
    cartItems = await loadFromStorage(currentUserKey);
    saveToStorage(currentUserKey, cartItems);
    emit();
  }
}

export async function clearCartUser() {
  currentUserKey = 'guest';
  cartItems = await loadFromStorage('guest');
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem('verse_active_user_key');
  }
  await AsyncStorage.removeItem('verse_active_user_key');
  emit();
}

export function getCart() {
  return cartItems;
}

export function addToCart(item) {
  // Unik berdasarkan ID produk + warna + RAM + ROM
  const itemKey = `${item.id}-${item.color || 'default'}-${item.ram || ''}-${item.rom || ''}`;
  const existingIndex = cartItems.findIndex((i) => (i.cartKey || i.id) === itemKey);

  if (existingIndex > -1) {
    const updated = [...cartItems];
    updated[existingIndex] = {
      ...updated[existingIndex],
      qty: updated[existingIndex].qty + (item.qty || 1),
    };
    cartItems = updated;
  } else {
    cartItems = [{ ...item, cartKey: itemKey, qty: item.qty || 1, checked: true }, ...cartItems];
  }

  saveToStorage(currentUserKey, cartItems);
  emit();
}

export function updateCartQty(cartKey, qty) {
  if (qty <= 0) {
    removeFromCart(cartKey);
    return;
  }
  cartItems = cartItems.map((i) => ((i.cartKey || i.id) === cartKey ? { ...i, qty } : i));
  saveToStorage(currentUserKey, cartItems);
  emit();
}

export function toggleCartItemCheck(cartKey) {
  cartItems = cartItems.map((i) => ((i.cartKey || i.id) === cartKey ? { ...i, checked: !i.checked } : i));
  saveToStorage(currentUserKey, cartItems);
  emit();
}

export function toggleAllCartCheck(checkedState) {
  cartItems = cartItems.map((i) => ({ ...i, checked: checkedState }));
  saveToStorage(currentUserKey, cartItems);
  emit();
}

export function removeFromCart(cartKey) {
  cartItems = cartItems.filter((i) => (i.cartKey || i.id) !== cartKey);
  saveToStorage(currentUserKey, cartItems);
  emit();
}

export function clearCart() {
  cartItems = [];
  saveToStorage(currentUserKey, cartItems);
  emit();
}

export function useCart() {
  return useSyncExternalStore(subscribe, getCart);
}
