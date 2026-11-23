import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// Gambar dengan fallback, memakai expo-image (lebih tangguh untuk data URI
// base64 & URL rusak — tidak crash, tidak pernah putih polos).
export default function ImageWithFallback({ uri, style, className = '', contentFit = 'cover', blurRadius }) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [uri]);

  // Paksa cache bust & bypass memory cache expo-image dengan timestamp unik jika berupa URL
  const processedUri = uri && uri.startsWith('http') 
    ? (uri.includes('?') ? `${uri}&_cb=${Date.now()}` : `${uri}?_cb=${Date.now()}`)
    : uri;

  if (!processedUri || error) {
    return (
      <View style={style} className={`bg-surfaceContainerHigh items-center justify-center ${className}`}>
        <MaterialIcons name="image-not-supported" size={36} color="#90CAF9" />
        <Text className="text-xs text-onSurfaceVariant mt-1">Gambar tidak tersedia</Text>
      </View>
    );
  }

  return (
    <Image
      key={processedUri}
      source={{ uri: processedUri, cache: 'reload' }}
      style={style}
      className={className}
      contentFit={contentFit}
      blurRadius={blurRadius}
      transition={200}
      onError={() => setError(true)}
    />
  );
}