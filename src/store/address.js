import { useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

let currentUserKey = 'guest';
let addresses = [];
const memoryCache = { guest: [] };
const listeners = new Set();
let isInitialized = false;
let pendingMapLocation = null;

export function setPendingMapLocation(loc) {
  pendingMapLocation = loc;
  emit();
}

export function getPendingMapLocation() {
  const loc = pendingMapLocation;
  pendingMapLocation = null;
  return loc;
}

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
    addresses = saved;
    isInitialized = true;
    emit();
  } catch (e) {
    console.warn('Init address storage error:', e);
  }
}

initStorage();

async function loadFromStorage(key) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedWeb = window.localStorage.getItem(`verse_alamat_user_${key}`);
      if (savedWeb) {
        const parsed = JSON.parse(savedWeb);
        memoryCache[key] = parsed;
        return parsed;
      }
    }
    const savedAsync = await AsyncStorage.getItem(`verse_alamat_user_${key}`);
    if (savedAsync) {
      const parsed = JSON.parse(savedAsync);
      memoryCache[key] = parsed;
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to load alamat_user:', e);
  }
  return memoryCache[key] || [];
}

async function saveToStorage(key, data) {
  memoryCache[key] = data;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(`verse_alamat_user_${key}`, JSON.stringify(data));
    }
    await AsyncStorage.setItem(`verse_alamat_user_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save alamat_user:', e);
  }
}

export async function setAddressUser(user) {
  const newKey = user ? (user.id || user.email || user.username || 'user') : 'guest';
  if (currentUserKey !== newKey || !isInitialized) {
    currentUserKey = newKey;
    addresses = await loadFromStorage(currentUserKey);
    emit();
  }
}

export async function clearAddressUser() {
  currentUserKey = 'guest';
  addresses = await loadFromStorage('guest');
  emit();
}

export function getAddresses() {
  return addresses;
}

export function addAddress(addr) {
  const newAddr = {
    id: Date.now().toString(),
    name: addr.name || 'Penerima',
    phone: addr.phone || '081234567890',
    label: addr.label || 'Rumah',
    detail: addr.detail || '',
    isDefault: addresses.length === 0 ? true : (addr.isDefault || false),
  };
  
  if (newAddr.isDefault) {
    addresses = addresses.map(a => ({ ...a, isDefault: false }));
  }
  
  addresses = [newAddr, ...addresses];
  saveToStorage(currentUserKey, addresses);
  emit();
}

export function updateAddress(id, updatedData) {
  if (updatedData.isDefault) {
    addresses = addresses.map(a => ({ ...a, isDefault: false }));
  }
  addresses = addresses.map(a => a.id === id ? { ...a, ...updatedData } : a);
  saveToStorage(currentUserKey, addresses);
  emit();
}

export function deleteAddress(id) {
  addresses = addresses.filter(a => a.id !== id);
  if (addresses.length > 0 && !addresses.some(a => a.isDefault)) {
    addresses[0].isDefault = true;
  }
  saveToStorage(currentUserKey, addresses);
  emit();
}

export function setDefaultAddress(id) {
  addresses = addresses.map(a => ({ ...a, isDefault: a.id === id }));
  saveToStorage(currentUserKey, addresses);
  emit();
}

// Reverse geocoding helper - converts lat/long to address
async function reverseGeocode(latitude, longitude) {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (results && results.length > 0) {
      const place = results[0];
      // Build Indonesian address format
      const parts = [
        place.street || place.name,
        place.subregion || place.district,
        place.region || place.city,
        place.postalCode,
        place.country,
      ].filter(Boolean);
      return parts.join(', ');
    }
  } catch (e) {
    console.warn('Reverse geocode failed:', e);
  }
  return `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`;
}

// Automated GPS location detection with reverse geocoding
export async function detectCurrentLocationAddress() {
  try {
    // Request permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Izin lokasi ditolak');
    }

    // Get current position
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      timeout: 10000,
    });

    const { latitude, longitude } = location.coords;
    
    // Reverse geocode to get actual address
    const addressDetail = await reverseGeocode(latitude, longitude);

    return {
      name: 'Lokasi GPS Saat Ini',
      phone: '081234567890',
      label: 'Lokasi GPS',
      detail: addressDetail,
      isDefault: addresses.length === 0,
      latitude,
      longitude,
    };
  } catch (e) {
    console.warn('GPS detection failed:', e);
    // Fallback
    return {
      name: 'Lokasi Manual',
      phone: '081234567890',
      label: 'Manual',
      detail: 'Masukkan alamat secara manual',
      isDefault: addresses.length === 0,
    };
  }
}

export function useAddresses() {
  return useSyncExternalStore(subscribe, getAddresses);
}
