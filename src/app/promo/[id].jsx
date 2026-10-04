import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TopAppBar } from '../../components/TopAppBar';
import ImageWithFallback from '../../components/ImageWithFallback';
import { useCurrentPromo } from '../../store/promo-view';

// Halaman khusus Detail Promo (dibuka dari: strip Flash Sale & kartu promo di Home)
export default function PromoPage() {
  const router = useRouter();
  const promo = useCurrentPromo();

  if (!promo) {
    return (
      <View className="flex-1 bg-surface">
        <TopAppBar title="Promo" leftIcon="arrow-back" onLeftPress={() => router.back()} />
        <View className="flex-1 items-center justify-center p-6">
          <MaterialIcons name="local-offer" size={48} color="#90CAF9" />
          <Text className="text-sm text-onSurfaceVariant mt-3 text-center">
            Promo tidak ditemukan. Kembali ke beranda untuk memilih promo.
          </Text>
        </View>
      </View>
    );
  }

  const safeBody =
    typeof promo.body === 'string' && promo.body.trim()
      ? promo.body
      : 'Detail promo ini akan segera hadir. Nantikan terus update dari kami!';

  return (
    <View className="flex-1 bg-surface">
      <TopAppBar title="Promo" leftIcon="arrow-back" onLeftPress={() => router.back()} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Gambar promo dengan background lebih besar & blur 70% */}
        <View className="relative w-full h-[360px] overflow-hidden justify-center items-center bg-black">
          {/* Background gambar lebih besar & blur 70% */}
          <ImageWithFallback
            uri={promo.image}
            contentFit="cover"
            blurRadius={25}
            style={{ position: 'absolute', top: -30, bottom: -30, left: -30, right: -30, opacity: 0.65 }}
          />

          {/* Gambar utama di depan — contain: utuh, proporsional, tajam */}
          <ImageWithFallback
            uri={promo.image}
            contentFit="contain"
            style={{ width: '100%', height: 340 }}
          />
        </View>

        <View className="px-4 pt-5">
          <Text className="text-2xl font-bold text-onSurface leading-8">{promo.title}</Text>

          <View className="h-px bg-outlineVariant my-5" />

          <Text className="text-[15px] text-onSurface leading-7">{safeBody}</Text>
        </View>
      </ScrollView>
    </View>
  );
}