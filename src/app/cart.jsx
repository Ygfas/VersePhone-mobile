import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Modal, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TopAppBar } from '../components/TopAppBar';
import { useRouter } from 'expo-router';
import { useCart, updateCartQty, removeFromCart, toggleCartItemCheck, toggleAllCartCheck, clearCart } from '../store/cart';
import { useThemeMode } from '../store/theme-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CartScreen() {
  const router = useRouter();
  const isDark = useThemeMode();
  const insets = useSafeAreaInsets();
  const cart = useCart();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const totalHarga = cart.reduce((acc, i) => {
    if (!i.checked) return acc;
    let p = i.price;
    if (typeof p === 'string') {
      p = p.replace(/[^0-9]/g, '');
    }
    const numPrice = parseInt(p, 10) || 0;
    const numQty = parseInt(i.qty, 10) || 0;
    return acc + (numPrice * numQty);
  }, 0);

  console.log('Cart Items:', cart.map(i => ({ name: i.name, checked: i.checked, price: i.price, qty: i.qty })));
  console.log('Calculated totalHarga:', totalHarga);

  const allChecked = cart.length > 0 && cart.every((i) => i.checked);

  return (
    <View className="flex-1 bg-surface dark:bg-[#0F172A]">
      <TopAppBar title="Keranjang Belanja" leftIcon="arrow-back" />

      {cart.length > 0 ? (
        <View className="flex-1">
          <ScrollView contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 16, paddingTop: 12, gap: 12 }}>
            {/* Pilih Semua Bar */}
            <View className="bg-white dark:bg-[#1E293B] p-4 rounded-[16px] flex-row items-center justify-between border border-outlineVariant dark:border-[#334155] shadow-sm">
              <TouchableOpacity
                onPress={() => toggleAllCartCheck(!allChecked)}
                className="flex-row items-center gap-3"
                activeOpacity={0.8}
              >
                <View className={`w-6 h-6 rounded-md border-2 items-center justify-center ${allChecked ? 'bg-primary border-primary' : 'border-outline dark:border-[#64748B]'}`}>
                  {allChecked && <MaterialIcons name="check" size={16} color="#FFFFFF" />}
                </View>
                <Text className="font-bold text-base text-onSurface dark:text-[#E3F2FD]">
                  Pilih Semua ({cart.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={clearCart}
                className="flex-row items-center gap-1 bg-red-50 dark:bg-red-950/40 px-3 py-1.5 rounded-full"
                activeOpacity={0.7}
              >
                <MaterialIcons name="delete-outline" size={16} color="#EF4444" />
                <Text className="text-red-500 font-bold text-xs">Bersihkan</Text>
              </TouchableOpacity>
            </View>

            {/* List Cart Items */}
            {cart.map((item) => {
              const itemKey = item.cartKey || item.id;
              return (
                <View
                  key={itemKey}
                  className="bg-white dark:bg-[#1E293B] p-4 rounded-[20px] border border-outlineVariant dark:border-[#334155] shadow-sm flex-row items-center gap-3"
                >
                  {/* Checkbox */}
                  <TouchableOpacity
                    onPress={() => toggleCartItemCheck(itemKey)}
                    activeOpacity={0.8}
                    className={`w-6 h-6 rounded-md border-2 items-center justify-center flex-shrink-0 ${item.checked ? 'bg-primary border-primary' : 'border-outline dark:border-[#64748B]'}`}
                  >
                    {item.checked && <MaterialIcons name="check" size={16} color="#FFFFFF" />}
                  </TouchableOpacity>

                  {/* Gambar Produk */}
                  <View className="w-20 h-20 bg-surfaceContainerLow dark:bg-[#0F172A] rounded-[12px] p-2 items-center justify-center flex-shrink-0 overflow-hidden">
                    <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="contain" />
                  </View>

                  {/* Info Produk */}
                  <View className="flex-1 min-w-0">
                    <Text className="text-xs text-outline dark:text-[#90CAF9] font-semibold uppercase" numberOfLines={1}>
                      {item.brand || 'Brand'}
                    </Text>
                    <Text className="text-sm font-bold text-onSurface dark:text-[#E3F2FD] mt-0.5" numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View className="flex-row items-center gap-2 mt-1 flex-wrap">
                      {item.color && (
                        <View className="bg-surfaceContainerHigh dark:bg-[#0F172A] px-2 py-0.5 rounded-md">
                          <Text className="text-[10px] font-semibold text-onSurfaceVariant dark:text-[#90CAF9]">
                            {item.color}
                          </Text>
                        </View>
                      )}
                      {(item.ram || item.rom) && (
                        <View className="bg-surfaceContainerHigh dark:bg-[#0F172A] px-2 py-0.5 rounded-md">
                          <Text className="text-[10px] font-semibold text-onSurfaceVariant dark:text-[#90CAF9]">
                            {[item.ram, item.rom].filter(Boolean).join(' / ')}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-primary dark:text-[#90CAF9] font-black text-sm mt-1.5">
                      Rp {(item.price || 0).toLocaleString('id-ID')}
                    </Text>
                  </View>

                  {/* Qty Stepper & Delete */}
                  <View className="items-end justify-between flex-shrink-0 gap-3">
                    <TouchableOpacity
                      onPress={() => setDeleteTarget(item)}
                      activeOpacity={0.7}
                      className="p-1"
                    >
                      <MaterialIcons name="delete-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>

                    <View className="flex-row items-center bg-surfaceContainerLow dark:bg-[#0F172A] rounded-[10px] p-1 border border-outlineVariant dark:border-[#334155]">
                      <TouchableOpacity
                        onPress={() => updateCartQty(itemKey, item.qty - 1)}
                        className="w-7 h-7 bg-white dark:bg-[#1E293B] rounded-lg items-center justify-center shadow-sm"
                        activeOpacity={0.7}
                      >
                        <MaterialIcons name="remove" size={14} color={isDark ? '#E3F2FD' : '#1F1B18'} />
                      </TouchableOpacity>
                      <Text className="w-7 text-center font-bold text-xs text-onSurface dark:text-[#E3F2FD]">
                        {item.qty}
                      </Text>
                      <TouchableOpacity
                        onPress={() => updateCartQty(itemKey, item.qty + 1)}
                        className="w-7 h-7 bg-white dark:bg-[#1E293B] rounded-lg items-center justify-center shadow-sm"
                        activeOpacity={0.7}
                      >
                        <MaterialIcons name="add" size={14} color={isDark ? '#E3F2FD' : '#1F1B18'} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Bottom Checkout Footer */}
          <View
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#1E293B] border-t border-outlineVariant dark:border-[#334155] px-6 flex-row items-center justify-between shadow-lg"
            style={{ paddingBottom: Math.max(insets.bottom, 16), paddingTop: 16, zIndex: 50 }}
          >
            <View className="flex-1">
              <Text className="text-xs text-outline dark:text-[#90CAF9] uppercase tracking-wider font-bold">Total Pembayaran</Text>
              <Text className="text-xl font-black text-primary dark:text-[#90CAF9] mt-0.5">
                Rp {totalHarga ? totalHarga.toLocaleString('id-ID') : '0'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/payment')}
              activeOpacity={0.85}
              className="bg-primary px-8 py-3.5 rounded-[16px] shadow-md flex-row items-center gap-2"
            >
              <MaterialIcons name="shopping-bag" size={18} color="#FFFFFF" />
              <Text className="text-white font-bold text-base">Checkout</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
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
            <Text className="text-white font-bold text-base" numberOfLines={1}>
              Mulai Belanja
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal Konfirmasi Hapus */}
      <Modal
        visible={!!deleteTarget}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteTarget(null)}
      >
        <Pressable className="flex-1 bg-black/50 items-center justify-center px-6" onPress={() => setDeleteTarget(null)}>
          <Pressable className="bg-white dark:bg-[#1E293B] p-6 rounded-[24px] w-full max-w-sm" onPress={(e) => e.stopPropagation()}>
            <Text className="text-lg font-bold text-onSurface dark:text-[#E3F2FD] mb-2">Hapus dari Keranjang?</Text>
            <Text className="text-sm text-onSurfaceVariant dark:text-[#90CAF9] mb-6">
              Hapus {deleteTarget?.name} dari keranjang belanja Anda?
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setDeleteTarget(null)}
                className="flex-1 py-3 rounded-full bg-surfaceContainerLow dark:bg-[#0F172A] items-center"
                activeOpacity={0.8}
              >
                <Text className="text-onSurface dark:text-[#E3F2FD] font-bold">Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (deleteTarget) {
                    removeFromCart(deleteTarget.cartKey || deleteTarget.id);
                    setDeleteTarget(null);
                  }
                }}
                className="flex-1 py-3 rounded-full bg-red-500 items-center"
                activeOpacity={0.8}
              >
                <Text className="text-white font-bold">Hapus</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
