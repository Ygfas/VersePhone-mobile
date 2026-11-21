import React, { useState } from "react";
import { View, ActivityIndicator, StyleSheet, Modal, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { getApiBaseUrl } from "../lib/api";

export function GoogleAuthModal({ visible, onClose, onSuccess }) {
  const [loading, setLoading] = useState(true);
  const baseUrl = getApiBaseUrl();
  // Alrahkan ke halaman web khusus login google di backend Next.js Anda
  const authUrl = `${baseUrl}/api/auth/google-web?platform=mobile`;

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "GOOGLE_LOGIN_SUCCESS" && data.token) {
        onSuccess(data.token);
      }
    } catch (e) {
      console.error("WebView message parse error:", e);
    }
  };

  const handleNavigationStateChange = (navState) => {
    const { url } = navState;
    if (url.includes("token=")) {
      try {
        const parsedUrl = new URL(url);
        const token = parsedUrl.searchParams.get("token");
        if (token) {
          onSuccess(token);
        }
      } catch (e) {
        // Fallback regex jika URL parsing gagal
        const match = url.match(/[?&]token=([^&]+)/);
        if (match && match[1]) {
          onSuccess(decodeURIComponent(match[1]));
        }
      }
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={{ flex: 1, marginTop: Platform.OS === "ios" ? 40 : 24 }}>
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#2196F3" />
          </View>
        )}
        <WebView
          source={{ uri: authUrl }}
          onLoadEnd={() => setLoading(false)}
          onNavigationStateChange={handleNavigationStateChange}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          sharedCookiesEnabled={true}
          thirdPartyCookiesEnabled={true}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    zIndex: 10,
  },
});
