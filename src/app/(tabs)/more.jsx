import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TopAppBar } from '../../components/TopAppBar';
import { useThemeMode, setDarkMode } from '../../store/theme-store';
import { useLanguage, setLanguage, useTranslatedText } from '../../store/language-store';

// --- ROW MENU SETTINGS ---
function SettingsRow({ icon, title, value, onPress, right, isLast = false }) {
  const isDark = useThemeMode();
  const tTitle = useTranslatedText(title);
  const tValue = useTranslatedText(value);
  const borderClass = isLast ? '' : 'border-b border-outlineVariant dark:border-[#334155]';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row items-center px-4 py-3.5 bg-transparent ${borderClass}`}
    >
      <View className="w-10 h-10 rounded-full bg-primaryContainer dark:bg-[#1E3A5F] items-center justify-center mr-3">
        <MaterialIcons name={icon} size={22} color={isDark ? "#90CAF9" : "#0D47A1"} />
      </View>

      <Text className="flex-1 text-[15px] text-onSurface dark:text-[#E3F2FD]">{tTitle}</Text>

      {tValue && (
        <Text className="text-xs text-onSurfaceVariant dark:text-[#90CAF9] mr-1">{tValue}</Text>
      )}

      {right ? (
        right
      ) : (
        <MaterialIcons name="chevron-right" size={22} color={isDark ? "#9CA3AF" : "#80756C"} />
      )}
    </TouchableOpacity>
  );
}

// --- SECTION CARD ---
function SettingsSection({ title, children }) {
  const tTitle = useTranslatedText(title);
  return (
    <View className="mb-4">
      <Text className="px-1 mb-2 text-base font-bold text-onSurface dark:text-[#E3F2FD]">{tTitle}</Text>
      <View className="bg-surfaceContainerLow dark:bg-[#1E293B] rounded-[20px] overflow-hidden shadow-sm elevation-1">
        {children}
      </View>
    </View>
  );
}

export default function More() {
  const router = useRouter();
  const isDarkMode = useThemeMode();
  const lang = useLanguage();
  const [isNotifOn, setIsNotifOn] = useState(true);
  const tHello = useTranslatedText('Halo, Pengunjung!');
  const tSub = useTranslatedText('Masuk untuk akses pesanan & fitur lengkap');
  const tLogin = useTranslatedText('Masuk');
  const tRegister = useTranslatedText('Daftar');

  return (
    <View className="flex-1 bg-surface dark:bg-[#0F172A]">
      <TopAppBar title="Akun" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        {/* BANNER PROFIL / LOGIN */}
        <View className="bg-primary rounded-[20px] p-5 shadow-sm elevation-2 mb-4">
          <View className="flex-row items-center">
            <View className="w-14 h-14 rounded-full bg-white dark:bg-[#1E293B] items-center justify-center mr-4">
              <MaterialIcons name="person" size={30} color="#2196F3" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-lg font-bold">{tHello}</Text>
              <Text className="text-white/85 text-xs mt-1">
                {tSub}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-2 mt-5">
            <TouchableOpacity
              onPress={() => router.push('/login')}
              activeOpacity={0.8}
              className="flex-1 bg-white dark:bg-[#1E293B] rounded-full h-11 items-center justify-center"
            >
              <Text className="text-primary dark:text-[#90CAF9] font-bold text-sm">{tLogin}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/signup')}
              activeOpacity={0.8}
              className="flex-1 border border-white/70 rounded-full h-11 items-center justify-center"
            >
              <Text className="text-white font-bold text-sm">{tRegister}</Text>
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
            value={lang === 'en' ? 'English' : 'Indonesia'}
            onPress={() => setLanguage(lang === 'en' ? 'id' : 'en')}
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

        <Text className="text-center text-xs text-onSurfaceVariant dark:text-[#90CAF9] mt-2">
          Versi 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}
