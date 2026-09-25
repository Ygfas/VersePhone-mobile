import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';

const destinations = [
  { name: 'Home',      icon: 'home',       iconActive: 'home',           route: '/' },
  { name: 'Wishlist',  icon: 'favorite-border', iconActive: 'favorite',  route: '/wishlist' },
  { name: 'History',   icon: 'history',    iconActive: 'history',        route: '/history' },
  { name: 'More',      icon: 'more-horiz', iconActive: 'more-horiz',     route: '/more' },
];

const adminDestinations = [
  { name: 'Overview', icon: 'dashboard',     iconActive: 'dashboard',       route: '/overview' },
  { name: 'Invoice',  icon: 'receipt-long',  iconActive: 'receipt-long',    route: '/invoice' },
  { name: 'Produk',   icon: 'shopping-bag',  iconActive: 'shopping-bag',    route: '/produk' },
  { name: 'Artikel',  icon: 'article',       iconActive: 'article',         route: '/artikel' },
  { name: 'Laporan',  icon: 'monitoring',    iconActive: 'monitoring',      route: '/laporan' },
];

export const NavigationBar = ({ isAdmin = false }) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const items = isAdmin ? adminDestinations : destinations;

  return (
    <View
      className="bg-surface border-t border-outlineVariant flex-row items-stretch justify-around"
      style={{ paddingBottom: insets.bottom, minHeight: 64 }}
    >
      {items.map((item) => {
        const isSelected = pathname === item.route;

        return (
          <TouchableOpacity
            key={item.name}
            onPress={() => router.push(item.route)}
            className="items-center justify-center flex-1 pt-2 pb-1 relative"
            activeOpacity={0.7}
          >
          {/* Icon — filled/bold when active */}
            <MaterialIcons
              name={isSelected ? item.iconActive : item.icon}
              size={isSelected ? 26 : 24}
              color={isSelected ? '#0D47A1' : '#80756C'}
            />

            {/* Underline indicator — below icon, above label */}
            <View
              style={{
                width: '20%',
                height: 2,
                borderRadius: 1,
                marginTop: 3,
                marginBottom: 2,
                backgroundColor: isSelected ? '#0D47A1' : 'transparent',
              }}
            />

            {/* Label */}
            <Text
              className="text-xs mt-0.5"
              style={{
                color: isSelected ? '#0D47A1' : '#80756C',
                fontWeight: isSelected ? '700' : '400',
              }}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
