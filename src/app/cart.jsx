import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TopAppBar } from '../components/TopAppBar';
import { useRouter } from 'expo-router';

export default function CartScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface dark:bg-[#0F172A]">
      <TopAppBar title="Keranjang Belanja" leftIcon="arrow-back" />

      <View className="flex-1 items-center justify-center px-8" style={{ paddingBottom: 100 }}>
        <View className="w-24 h-24 rounded-full bg-surfaceContainerHigh dark:bg-[#1E293B] items-center justify-center shadow-inner">
          <MaterialIcons name="shopping-cart" size={44} color="#2196F3" />
        </View>
        <Text className="text-2xl font-bold text-onSurface dark:text-[#E3F2FD] mt-5">
          Keranjang Belanja Kosong
        </Text>
        <Text className="text-md text-onSurfaceVariant dark:text-[#90CAF9] text-center mt-2 leading-5">
          {"Belum ada produk di keranjang belanja Anda.\nYuk temukan produk impianmu sekarang!"}
        </Text>
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)')}
          activeOpacity={0.8}
          className="mt-6 bg-primary dark:bg-blue-600 px-6 py-3.5 rounded-[16px] shadow-md flex-row items-center justify-center gap-2 self-center flex-shrink-0"
        >
          <MaterialIcons name="storefront" size={20} color="#FFFFFF" />
          <Text
            className="text-white font-bold text-base shrink-0"
            numberOfLines={1}
          >
            Mulai Belanja
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
