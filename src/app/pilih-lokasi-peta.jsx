import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TopAppBar } from '../components/TopAppBar';
import { useThemeMode } from '../store/theme-store';
import { useRouter } from 'expo-router';
import { setPendingMapLocation } from '../store/address';

const MAP_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Pilih Lokasi</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    body { margin: 0; padding: 0; height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    #map { height: 100vh; width: 100vw; }
    .info-panel { position: absolute; top: 10px; left: 10px; right: 10px; background: white; padding: 12px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); z-index: 1000; }
    .info-panel h3 { margin: 0 0 8px; font-size: 14px; color: #1a1a1a; }
    .info-panel p { margin: 4px 0; font-size: 12px; color: #666; }
    .coords { font-family: monospace; background: #f5f5f5; padding: 4px 8px; border-radius: 4px; }
    .btn-confirm { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: #2196F3; color: white; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 2px 8px rgba(33,150,243,0.4); z-index: 1000; }
    .btn-confirm:disabled { background: #90caf9; box-shadow: none; }
    .marker-popup { padding: 8px; min-width: 200px; }
    .marker-popup .address { font-weight: 600; margin-bottom: 4px; }
    .marker-popup .coords { font-size: 11px; color: #666; }
  </style>
</head>
<body>
  <div id="map"></div>
  <div class="info-panel" id="infoPanel">
    <h3>Pilih Lokasi di Peta</h3>
    <p>Geser peta untuk memilih lokasi. Titik merah = lokasi terpilih.</p>
    <p class="coords" id="coordsDisplay">Menunggu lokasi...</p>
  </div>
  <button class="btn-confirm" id="confirmBtn" disabled>Gunakan Lokasi Ini</button>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    // Default to Jakarta
    const DEFAULT_LAT = -6.2088;
    const DEFAULT_LNG = 106.8456;
    
    let map = L.map('map').setView([DEFAULT_LAT, DEFAULT_LNG], 13);
    let marker = null;
    let selectedLat = DEFAULT_LAT;
    let selectedLng = DEFAULT_LNG;
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const infoPanel = document.getElementById('infoPanel');
    const coordsDisplay = document.getElementById('coordsDisplay');
    const confirmBtn = document.getElementById('confirmBtn');

    function updateMarker(lat, lng) {
      selectedLat = lat;
      selectedLng = lng;
      
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng], { draggable: true }).addTo(map);
        marker.on('dragend', function(e) {
          const pos = e.target.getLatLng();
          updateMarker(pos.lat, pos.lng);
        });
      }
      
      map.panTo([lat, lng], { animate: true });
      coordsDisplay.textContent = 'Lat: ' + lat.toFixed(6) + ', Lng: ' + lng.toFixed(6);
      confirmBtn.disabled = false;
      
      // Reverse geocode using Nominatim
      fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng + '&addressdetails=1&accept-language=id')
        .then(r => r.json())
        .then(data => {
          if (data && data.display_name) {
            coordsDisplay.textContent = data.display_name;
            if (marker) {
              marker.bindPopup('<div class="marker-popup"><div class="address">' + data.display_name + '</div><div class="coords">Lat: ' + lat.toFixed(6) + ', Lng: ' + lng.toFixed(6) + '</div></div>').openPopup();
            }
          }
        })
        .catch(() => {});
    }

    // Click on map to set marker
    map.on('click', function(e) {
      updateMarker(e.latlng.lat, e.latlng.lng);
    });

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(pos) {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        updateMarker(lat, lng);
        map.setView([lat, lng], 16);
      }, function() {
        // Use default
      }, { enableHighAccuracy: true, timeout: 10000 });
    }

    // Confirm button
    confirmBtn.addEventListener('click', function() {
      if (selectedLat && selectedLng) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'LOCATION_SELECTED',
          latitude: selectedLat,
          longitude: selectedLng,
          address: coordsDisplay.textContent
        }));
      }
    });

    // Handle messages from React Native
    document.addEventListener('message', function(e) {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'SET_LOCATION') {
          updateMarker(data.latitude, data.longitude);
          map.setView([data.latitude, data.longitude], 16);
        }
      } catch (err) {}
    });
  </script>
</body>
</html>
`;

export default function PilihLokasiPetaScreen() {
  const router = useRouter();
  const isDark = useThemeMode();
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    // Set dark mode CSS if needed
  }, [isDark]);

  const onMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'LOCATION_SELECTED') {
        const loc = {
          name: 'Lokasi Peta (GPS/Manual)',
          phone: '081234567890',
          label: 'Lokasi Peta',
          detail: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
        };
        setPendingMapLocation(loc);
        router.back();
      }
    } catch (e) {
      console.warn('Map message parse error:', e);
    }
  };

  const onLoad = () => {
    setLoading(false);
  };

  const onError = (err) => {
    console.warn('WebView error:', err);
    setLoading(false);
    Alert.alert('Error', 'Gagal memuat peta. Coba lagi atau gunakan GPS otomatis.');
  };

  return (
    <View style={styles.container}>
      <TopAppBar title="Pilih di Peta" leftIcon="arrow-back" />
      <View style={styles.webViewContainer}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>Memuat peta...</Text>
          </View>
        )}
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: MAP_HTML }}
          onMessage={onMessage}
          onLoad={onLoad}
          onError={onError}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mixedContentMode="always"
          style={styles.webView}
          scalesPageToFit={true}
          scrollEnabled={true}
          allowsInlineMediaPlayback={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  webViewContainer: { flex: 1 },
  webView: { flex: 1 },
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex: 100,
  },
  loadingText: { marginTop: 12, fontSize: 14, color: '#666' },
});