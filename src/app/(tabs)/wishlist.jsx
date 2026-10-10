import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TopAppBar } from '../../components/TopAppBar';
import { useWishlist, removeFromWishlist } from '../../store/wishlist';
import { useTranslatedText } from '../../store/language-store';
import { useRouter } from 'expo-router';

// Kartu wishlist meniru kartu produk di halaman detail:
// gambar kiri (1/3), konten kanan (2/3) berisi nama, RAM, harga, stok.
function WishlistCard({ item }) {
  const router = useRouter();
  const hasStock = item.stock !== undefined && item.stock !== null;
  const stockText = hasStock
    ? item.stock > 0
      ? `Stok: ${item.stock} unit`
      : 'Stok habis'
    : null;
  const stockColor = hasStock
    ? item.stock > 0
      ? 'text-emerald-600 dark:text-emerald-300'
      : 'text-red-500'
    : 'text-onSurfaceVariant dark:text-[#90CAF9]';

  const handleNavigate = () => {
    router.push(`/detail?slug=${item.slug || item.id}`);
  };

  const handleRemove = () => {
    removeFromWishlist(item.id);
  };

  return (
    <View className="flex-row bg-white dark:bg-[#1E293B] border border-blue-500 dark:border-[#334155] rounded-[10px] overflow-hidden shadow-sm elevation-1">
      <View className="w-[33.33%] aspect-square relative bg-surfaceContainerHighest dark:bg-[#334155]">
        <Image
          source={{ uri: item.image }}
          className="w-full h-full object-contain"
          resizeMode="contain"
        />
      </View>

      <View className="flex-1 p-3 justify-between min-w-0">
        <View>
          {item.brand && (
            <Text className="text-[10px] text-outline dark:text-[#E3F2FD] font-semibold tracking-wider uppercase">
              {item.brand}
            </Text>
          )}
          <Text className="text-sm text-onSurface dark:text-[#E3F2FD] font-bold mt-0.5" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-xs text-onSurfaceVariant dark:text-[#90CAF9] font-medium mt-1">
            {item.ram || '-'}
          </Text>
          {stockText && (
            <Text className={`text-xs mt-1 ${stockColor} font-medium`}>
              {stockText}
            </Text>
          )}
        </View>

        <View className="flex-row items-center justify-between mt-2">
          <TouchableOpacity
            onPress={handleNavigate}
            activeOpacity={0.9}
            className="flex-1 pr-2"
          >
            <Text className="text-sm font-bold text-primary dark:text-[#90CAF9] flex-shrink-0">{item.price || 'Rp 0'}</Text>
          </TouchableOpacity>

          {/* Hati terisi: tersimpan, tekan untuk hapus */}
          <TouchableOpacity
            onPress={handleRemove}
            activeOpacity={0.8}
            className="w-9 h-9 rounded-full bg-primary items-center justify-center ml-2 flex-shrink-0"
          >
            <Ionicons name="heart" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
        /* EMPTY STATE - wishlist kosong sampai bookmark di detail ditekan */
        <View className="flex-1 items-center justify-center px-8" style={{ paddingBottom: 100 }}>
          <View className="w-24 h-24 rounded-full bg-surfaceContainerHigh dark:bg-[#1E293B] items-center justify-center">
            <MaterialIcons name="favorite-border" size={44} color="#90CAF9" />
          </View>
          <Text className="text-lg font-bold text-onSurface dark:text-[#E3F2FD] mt-5">{tTitle}</Text>
          <Text className="text-sm text-onSurfaceVariant dark:text-[#90CAF9] text-center mt-2 leading-5">
            {tDesc}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
          {items.map((item) => (
            <WishlistCard key={item.id} item={item} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
