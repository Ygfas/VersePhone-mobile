import { useSyncExternalStore, useState, useEffect } from 'react';

// Language store sederhana mirip theme-store dengan cache memori agar tidak hit API berulang
let currentLang = 'id'; // 'id' | 'en'
const listeners = new Set();
const translationCache = new Map(); // Cache in-memory agar tidak hit API berkali-kali untuk string yang sama

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getLanguage() {
  return currentLang;
}

export function setLanguage(lang) {
  currentLang = lang;
  emit();
}

export function useLanguage() {
  return useSyncExternalStore(subscribe, getLanguage);
}

// Fungsi translate dengan cache in-memory & fallback otomatis ke teks asli jika offline/gagal
export async function translateText(text, targetLang = currentLang) {
  if (!text || targetLang === 'id') return text;
  
  const cacheKey = `${targetLang}:${text}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=id|${targetLang}`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (data && data.responseData && data.responseData.translatedText) {
      const translated = data.responseData.translatedText;
      // Jangan simpan jika hasil terjemahan error limit atau kosong
      if (!translated.includes('MYMEMORY WARNING')) {
        translationCache.set(cacheKey, translated);
        return translated;
      }
    }
  } catch (e) {
    // Silent fail, return original text
  }

  return text;
}

// Hook reaktif untuk translate teks dengan cache
export function useTranslatedText(text) {
  const lang = useLanguage();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    if (lang === 'id' || !text) {
      setTranslated(text);
      return;
    }
    const cacheKey = `${lang}:${text}`;
    if (translationCache.has(cacheKey)) {
      setTranslated(translationCache.get(cacheKey));
      return;
    }

    let isMounted = true;
    translateText(text, lang).then((res) => {
      if (isMounted) setTranslated(res);
    });

    return () => {
      isMounted = false;
    };
  }, [text, lang]);

  return translated;
}

// Komponen helper agar mudah digunakan di JSX: <T>Teks Indonesia</T>
export function T({ children }) {
  const translated = useTranslatedText(children);
  return <>{translated}</>;
}
