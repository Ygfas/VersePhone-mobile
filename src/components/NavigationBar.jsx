import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { useThemeMode } from '../store/theme-store';
import { useTranslatedText } from '../store/language-store';

const destinations = [
  { name: 'Beranda',   icon: 'home',           iconActive: 'home',           route: '/' },
  { name: 'Wishlist',  icon: 'favorite-border', iconActive: 'favorite',      route: '/wishlist' },
  { name: 'Riwayat',   icon: 'history',        iconActive: 'history',        route: '/history' },
  { name: 'Lainnya',   icon: 'more-horiz',     iconActive: 'more-horiz',     route: '/more' },
];

const adminDestinations = [
  { name: 'Overview', icon: 'dashboard',     iconActive: 'dashboard',       route: '/overview' },
  { name: 'Invoice',  icon: 'receipt-long',  iconActive: 'receipt-long',    route: '/invoice' },
  { name: 'Produk',   icon: 'shopping-bag',  iconActive: 'shopping-bag',    route: '/produk' },
  { name: 'Artikel',  icon: 'article',       iconActive: 'article',         route: '/artikel' },
  { name: 'Laporan',  icon: 'analytics',     iconActive: 'analytics',       route: '/laporan' },
];

const ACTIVE_LIGHT = '#0D47A1';
const INACTIVE_LIGHT = '#80756C';
const ACTIVE_DARK = '#90CAF9';
const INACTIVE_DARK = '#9CA3AF';

function NavItem({ item, isSelected, color, isAdmin }) {
  const router = useRouter();
  const tName = useTranslatedText(item.name);
  return (
    <TouchableOpacity onPress={() => router.push(item.route)} className="items-center justify-center flex-1 pt-2 pb-1" activeOpacity={0.7}>
      <MaterialIcons name={isSelected ? item.iconActive : item.icon} size={24} color={color} />
      <Text className="text-xs mt-1" style={{ color, fontWeight: isSelected ? '700' : '400' }}>{tName}</Text>
    </TouchableOpacity>
  );
}

export const NavigationBar = ({ isAdmin = false }) => {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const isDark = useThemeMode();
  const items = isAdmin ? adminDestinations : destinations;
  return (
    <View
      className="bg-surface dark:bg-[#0F172A] border-t border-outlineVariant dark:border-[#1E293B] flex-row items-stretch justify-around"
      style={{ paddingBottom: insets.bottom, minHeight: 72 }}
    >
      {items.map((item) => {
        const isSelected = pathname === item.route;
        const color = isDark ? (isSelected ? ACTIVE_DARK : INACTIVE_DARK) : (isSelected ? ACTIVE_LIGHT : INACTIVE_LIGHT);
        return <NavItem key={item.name} item={item} isSelected={isSelected} color={color} isAdmin={isAdmin} />;
      })}
    </View>
  );
};
