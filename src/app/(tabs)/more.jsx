import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TopAppBar } from '../../components/TopAppBar';
import { useThemeMode, setDarkMode } from '../../store/theme-store';

// --- ROW MENU SETTINGS ---
function SettingsRow({ icon, title, value, onPress, right, isLast = false }) {
  const borderClass = isLast ? '' : 'border-b border-outlineVariant';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row items-center px-4 py-3.5 bg-transparent ${borderClass}`}
    >
      <View className="w-10 h-10 rounded-full bg-primaryContainer items-center justify-center mr-3">
        <MaterialIcons name={icon} size={22} color="#0D47A1" />
      </View>

      <Text className="flex-1 text-[15px] text-onSurface">{title}</Text>

      {value && (
        <Text className="text-xs text-onSurfaceVariant mr-1">{value}</Text>
      )}

      {right ? (
        right
      ) : (
        <MaterialIcons name="chevron-right" size={22} color="#80756C" />
      )}
    </TouchableOpacity>
  );
}

// --- SECTION CARD ---
function SettingsSection({ title, children }) {
  return (
    <View className="mb-4">
      <Text className="px-1 mb-2 text-base font-bold text-onSurface">{title}</Text>
      <View className="bg-surfaceContainerLow rounded-[20px] overflow-hidden shadow-sm elevation-1">
        {children}
      </View>
    </View>
  );
}

export default function More() {
  const router = useRouter();
  const isDarkMode = useThemeMode();
  const [isNotifOn, setIsNotifOn] = useState(true);

  return (
    <View className="flex-1 bg-surface">
      <TopAppBar title="Akun" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        {/* BANNER PROFIL / LOGIN */}
        <View className="bg-primary rounded-[20px] p-5 shadow-sm elevation-2 mb-4">
          <View className="flex-row items-center">
            <View className="w-14 h-14 rounded-full bg-white items-center justify-center mr-4">
              <MaterialIcons name="person" size={30} color="#2196F3" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-lg font-bold">Halo, Pengunjung!</Text>
              <Text className="text-white/85 text-xs mt-1">
                Masuk untuk akses pesanan & fitur lengkap
              </Text>
            </View>
          </View>

          <View className="flex-row gap-2 mt-5">
            <TouchableOpacity
              onPress={() => router.push('/login')}
              activeOpacity={0.8}
              className="flex-1 bg-white rounded-full h-11 items-center justify-center"
            >
              <Text className="text-primary font-bold text-sm">Masuk</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/signup')}
              activeOpacity={0.8}
              className="flex-1 border border-white/70 rounded-full h-11 items-center justify-center"
            >
              <Text className="text-white font-bold text-sm">Daftar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PESANAN */}
        <SettingsSection title="Pesanan">
          <SettingsRow
            icon="receipt-long"
            title="Riwayat Pesanan"
            onPress={() => router.push('/history')}
          />
          <SettingsRow
            icon="favorite-border"
            title="Wishlist"
            onPress={() => router.push('/wishlist')}
          />
          <SettingsRow
            icon="credit-card"
            title="Metode Pembayaran"
            onPress={() => router.push('/payment')}
            isLast
          />
        </SettingsSection>

        {/* PREFERENSI */}
        <SettingsSection title="Preferensi">
          <SettingsRow
            icon="notifications"
            title="Notifikasi"
            right={
              <Switch
                value={isNotifOn}
                onValueChange={setIsNotifOn}
                trackColor={{ false: '#90CAF9', true: '#2196F3' }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingsRow
            icon="dark-mode"
            title="Mode Gelap"
            right={
              <Switch
                value={isDarkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#90CAF9', true: '#2196F3' }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingsRow
            icon="language"
            title="Bahasa"
            value="Indonesia"
            onPress={() => {}}
            isLast
          />
        </SettingsSection>

        {/* LAINNYA */}
        <SettingsSection title="Lainnya">
          <SettingsRow icon="location-on" title="Alamat Pengiriman" onPress={() => {}} />
          <SettingsRow icon="help-outline" title="Pusat Bantuan" onPress={() => {}} />
          <SettingsRow icon="support-agent" title="Hubungi Kami" onPress={() => {}} />
          <SettingsRow icon="info-outline" title="Tentang Aplikasi" onPress={() => {}} />
          <SettingsRow icon="star-border" title="Beri Rating" onPress={() => {}} />
          <SettingsRow icon="share" title="Bagikan Aplikasi" onPress={() => {}} isLast />
        </SettingsSection>

        <Text className="text-center text-xs text-onSurfaceVariant mt-2">
          Versi 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}
