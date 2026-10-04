import Constants from 'expo-constants';

// Ambil host (IP) dari hostUri dev server Expo.
// Mengutamakan IPv4: hotspot/WiFi selalu punya IPv4 yang bisa diakses HP.
// IPv6 link-local (fe80::...%zone) sengaja diabaikan — tidak routable dari HP.
// Hostname biasa (localhost) didukung untuk mode USB/adb reverse.
function getHostFromHostUri(hostUri) {
  if (!hostUri) return null;

  // 1. IPv4 -> "192.168.0.104" (dari "192.168.0.104:8081")
  const ipv4 = hostUri.match(/(\d{1,3}\.){3}\d{1,3}/);
  if (ipv4) return ipv4[0];

  // 2. Buang port (bagian setelah ':' terakhir)
  const parts = hostUri.split(':');
  const host = parts.length > 1 ? parts.slice(0, -1).join(':') : parts[0];

  // 3. Sisa yang masih mengandung ':' = IPv6 -> skip
  if (!host || host.includes(':')) return null;

  // 4. Hostname biasa (localhost / nama domain)
  return host;
}

// Base URL API verse-web.
// Strategi: host dev server Expo mengikuti IP laptop saat ini secara dinamis,
// jadi ganti jaringan (WiFi / hotspot portabel) tanpa mengubah .env sama sekali.
export function getApiBaseUrl() {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.expoGoConfig?.debuggerHost ??
    '';

  const host = getHostFromHostUri(hostUri);

  if (host) {
    const port = process.env.EXPO_PUBLIC_API_PORT || '3000'; // port verse-web
    const url = `http://${host}:${port}`;
    if (__DEV__) console.log('[api] resolved base URL:', url);
    return url;
  }

  // Fallback: build production / tunnel tanpa IPv4 -> pakai konfigurasi eksplisit
  const fallback =
    process.env.EXPO_PUBLIC_API_URL2 ??
    process.env.EXPO_PUBLIC_API_URL ??
    'http://localhost:3000';
  if (__DEV__) console.warn('[api] hostUri tidak mengandung IPv4:', hostUri, '-> fallback', fallback);
  return fallback;
}