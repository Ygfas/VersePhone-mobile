import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TopAppBar } from '../../components/TopAppBar';
import { useWishlist, removeFromWishlist } from '../../store/wishlist';

// Kartu wishlist meniru kartu produk di halaman detail:
// gambar kiri (1/3), konten kanan (2/3) berisi nama, RAM, harga.
function WishlistCard({ item }) {
  return (
    <View className="flex-row bg-white border border-blue-500 rounded-[10px] overflow-hidden shadow-sm elevation-1">
      <Image
        source={{ uri: item.image }}
        className="w-[33.33%] h-[140px] bg-surfaceContainerHighest object-cover"
      />

      <View className="flex-1 p-3 justify-between">
        <View>
          {item.brand && (
            <Text className="text-[10px] text-outline font-semibold tracking-wider uppercase">
              {item.brand}
            </Text>
          )}
          <Text className="text-sm text-onSurface font-bold mt-0.5" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-xs text-onSurfaceVariant font-medium mt-1">
            {item.ram}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-bold text-primary">{item.price}</Text>

          {/* Bookmark terisi: tersimpan, tekan untuk hapus */}
          <TouchableOpacity
            onPress={() => removeFromWishlist(item.id)}
            activeOpacity={0.8}
            className="w-9 h-9 rounded-full bg-primary items-center justify-center"
          >
            <MaterialIcons name="bookmark" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function Wishlist() {
  const items = useWishlist();

  return (
    <View className="flex-1 bg-surface">
      <TopAppBar title="Wishlist" />

      {items.length === 0 ? (
        /* EMPTY STATE - wishlist kosong sampai bookmark di detail ditekan */
        <View className="flex-1 items-center justify-center px-8" style={{ paddingBottom: 100 }}>
          <View className="w-24 h-24 rounded-full bg-surfaceContainerHigh items-center justify-center">
            <MaterialIcons name="favorite-border" size={44} color="#90CAF9" />
          </View>
          <Text className="text-lg font-bold text-onSurface mt-5">Wishlist Kosong</Text>
          <Text className="text-sm text-onSurfaceVariant text-center mt-2 leading-5">
            Ketuk ikon bookmark di halaman detail produk untuk menyimpannya di sini.
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
