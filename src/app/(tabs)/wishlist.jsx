import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TopAppBar } from '../../components/TopAppBar';
import { useWishlist, removeFromWishlist } from '../../store/wishlist';
import { useTranslatedText } from '../../store/language-store';
import { useRouter } from 'expo-router';

// Kartu wishlist grid 2 kolom dengan gaya Neumorphism & card bisa diklik ke detail
function WishlistCard({ item }) {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/detail?slug=${item.slug || item.id}`);
  };

  const handleRemove = () => {
    removeFromWishlist(item.id);
  };

  return (
    <TouchableOpacity
      onPress={handleNavigate}
      activeOpacity={0.9}
      className="w-[100%] bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-slate-800 rounded-[16px] overflow-hidden mb-4 shadow-md elevation-2"
    >
      {/* Container gambar dengan background putih */}
      <View className="w-full aspect-square relative bg-white dark:bg-[#1E293B] items-center justify-center p-3">
        <Image
          source={{ uri: item.image }}
          className="w-full h-full"
          resizeMode="contain"
        />
        {/* Tombol like warna biru di atas kiri */}
        <TouchableOpacity
          onPress={handleRemove}
          activeOpacity={0.8}
          className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-sm items-center justify-center border border-blue-100 dark:border-slate-700"
        >
          <Ionicons name="heart" size={16} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <View className="p-3 bg-white dark:bg-[#1E293B]">
        <Text className="text-[10px] text-blue-500 dark:text-[#90CAF9] font-bold uppercase tracking-wider">
          {item.brand || 'Verse'}
        </Text>
        <Text className="text-xs text-onSurface dark:text-[#E3F2FD] font-bold mt-1" numberOfLines={2}>
          {item.name}
        </Text>
        <Text className="text-sm font-extrabold text-primary dark:text-[#90CAF9] mt-2">
          {item.price || 'Rp 0'}
        </Text>

        {/* Tombol Keranjang */}
        <TouchableOpacity
          onPress={handleNavigate}
          activeOpacity={0.8}
          className="mt-3 w-full py-2.5 rounded-[12px] bg-blue-50 dark:bg-slate-700 flex-row items-center justify-center gap-1.5 border border-blue-100 dark:border-slate-600"
        >
          <Ionicons name="cart" size={16} color="#2196F3" />
          <Text className="text-[11px] font-bold text-blue-600 dark:text-blue-300">
            Tambah ke Keranjang
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function Wishlist() {
  const items = useWishlist();
  const tTitle = useTranslatedText('Wishlist Kosong');
  const tDesc = useTranslatedText('Ketuk ikon hati di halaman detail produk untuk menyimpannya di sini.');

  return (
    <View className="flex-1 bg-surface dark:bg-[#0F172A]">
      <TopAppBar title="Wishlist" />

      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8" style={{ paddingBottom: 100 }}>
          <View className="w-24 h-24 rounded-full bg-surfaceContainerHigh dark:bg-[#1E293B] items-center justify-center shadow-inner">
            <MaterialIcons name="favorite-border" size={44} color="#2196F3" />
          </View>
          <Text className="text-lg font-bold text-onSurface dark:text-[#E3F2FD] mt-5">{tTitle}</Text>
          <Text className="text-sm text-onSurfaceVariant dark:text-[#90CAF9] text-center mt-2 leading-5">
            {tDesc}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 12 }} showsVerticalScrollIndicator={false}>
          <View className="flex-row flex-wrap justify-between">
            {items.map((item) => (
              <View
                key={item.id}
                className="w-[48.5%] px-1"
              >
                <WishlistCard item={item} />
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}