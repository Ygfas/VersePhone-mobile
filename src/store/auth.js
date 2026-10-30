import { useSyncExternalStore } from "react";
import { getApiBaseUrl } from "../lib/api";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";

// Supaya auth session bisa jalan di Expo Go
WebBrowser.maybeCompleteAuthSession();

// Auth store menggunakan useSyncExternalStore (mirip wishlist.js)
let authState = {
  user: null,
  isLoading: true,
  error: null,
};

const listeners = new Set();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return authState;
}

async function apiRequest(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Penting untuk cookie session
  };

  const response = await fetch(url, { ...defaultOptions, ...options });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export function setAuth(user, error = null) {
  authState = { user, isLoading: false, error };
  emit();
}

export function setLoading(isLoading) {
  authState = { ...authState, isLoading };
  emit();
}

export function clearAuth() {
  authState = { user: null, isLoading: false, error: null };
  emit();
}

// Login dengan email/username + password
export async function login(emailOrUsername, password) {
  setLoading(true);
  try {
    const data = await apiRequest("/api/login", {
      method: "POST",
      body: JSON.stringify({ emailOrUsername, password }),
    });
    setAuth(data.user);
    return { success: true, role: data.role, user: data.user };
  } catch (error) {
    setAuth(null, error.message);
    return { success: false, error: error.message };
  }
}

// Register user baru
export async function register(name, phone, email, password) {
  setLoading(true);
  try {
    const data = await apiRequest("/api/register", {
      method: "POST",
      body: JSON.stringify({ name, phone, email, password }),
    });
    // Register tidak auto-login, user harus login manual
    setAuth(null);
    return { success: true, username: data.username };
  } catch (error) {
    setAuth(null, error.message);
    return { success: false, error: error.message };
  }
}

// Login dengan Google via expo-auth-session (web-based, jalan di Expo Go)
export async function loginWithGoogle() {
  setLoading(true);
  try {
    const clientId =
      Constants.expoConfig?.extra?.Google_client_auth ||
      process.env.Google_client_auth ||
      "56321620017-urs0kl8hr0lghilh2h6sie3o51s3pijv.apps.googleusercontent.com";

    const redirectUri = AuthSession.makeRedirectUri({
      scheme: "testreactnative",
      preferLocalhost: true,
    });

    const discovery = await AuthSession.fetchDiscoveryAsync(
      "https://accounts.google.com"
    );

    const [request, response, promptAsync] = AuthSession.useAuthRequest(
      {
        clientId,
        scopes: ["openid", "profile", "email"],
        redirectUri,
        responseType: "id_token",
        usePKCE: true,
      },
      discovery
    );

    const result = await promptAsync();

    if (result.type === "success") {
      const { id_token } = result.params;

      if (!id_token) {
        throw new Error("ID token tidak diterima dari Google");
      }

      const data = await apiRequest("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({ idToken: id_token }),
      });

      setAuth(data.user);
      return { success: true, role: data.role, user: data.user };
    } else if (result.type === "cancel") {
      setAuth(null, "Login dibatalkan");
      return { success: false, error: "Login dibatalkan" };
    } else {
      throw new Error(result.error?.message || "Gagal login Google");
    }
  } catch (error) {
    setAuth(null, error.message);
    return { success: false, error: error.message };
  }
}

// Logout
export async function logout() {
  try {
    await apiRequest("/api/logout", { method: "POST" });
  } catch (error) {
    console.warn("Logout API error:", error);
  }
  clearAuth();
}

// Cek session yang sudah ada (dipanggil saat app start)
export async function checkSession() {
  setLoading(true);
  try {
    const data = await apiRequest("/api/auth/session");
    if (data.user) {
      setAuth(data.user);
    } else {
      clearAuth();
    }
  } catch (error) {
    clearAuth();
  }
}

// Hook untuk menggunakan auth state di component
export function useAuth() {
  return useSyncExternalStore(subscribe, getSnapshot);
}