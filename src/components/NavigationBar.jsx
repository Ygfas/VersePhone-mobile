import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';

// 4 tab untuk User
const destinations = [
  { name: 'Home',      icon: 'home',           iconActive: 'home',           route: '/' },
  { name: 'Wishlist',  icon: 'favorite-border', iconActive: 'favorite',      route: '/wishlist' },
  { name: 'History',   icon: 'history',        iconActive: 'history',        route: '/history' },
  { name: 'More',      icon: 'more-horiz',     iconActive: 'more-horiz',     route: '/more' },
];

// 5 tab untuk Admin
const adminDestinations = [
  { name: 'Overview', icon: 'dashboard',     iconActive: 'dashboard',       route: '/overview' },
  { name: 'Invoice',  icon: 'receipt-long',  iconActive: 'receipt-long',    route: '/invoice' },
  { name: 'Produk',   icon: 'shopping-bag',  iconActive: 'shopping-bag',    route: '/produk' },
  { name: 'Artikel',  icon: 'article',       iconActive: 'article',         route: '/artikel' },
  { name: 'Laporan',  icon: 'monitoring',    iconActive: 'monitoring',      route: '/laporan' },
];

const ACTIVE_COLOR = '#0D47A1';
const INACTIVE_COLOR = '#80756C';

export const NavigationBar = ({ isAdmin = false }) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const items = isAdmin ? adminDestinations : destinations;

  return (
    <View
      className="bg-surface border-t border-outlineVariant flex-row items-stretch justify-around"
      style={{ paddingBottom: insets.bottom, minHeight: 72 }}
    >
      {items.map((item) => {
        const isSelected = pathname === item.route;
        const color = isSelected ? ACTIVE_COLOR : INACTIVE_COLOR;

        return (
          <TouchableOpacity
            key={item.name}
            onPress={() => router.push(item.route)}
            className="items-center justify-center flex-1 pt-2 pb-1"
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={isSelected ? item.iconActive : item.icon}
              size={24}
              color={color}
            />
            <Text
              className="text-xs mt-1"
              style={{
                color: color,
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
