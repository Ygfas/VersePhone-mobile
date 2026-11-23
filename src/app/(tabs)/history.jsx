import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TopAppBar } from '../../components/TopAppBar';
import ImageWithFallback from '../../components/ImageWithFallback';
import { useThemeMode } from '../../store/theme-store';
import { useAuth } from '../../store/auth';
import { getApiBaseUrl } from '../../lib/api';
import { T } from '../../store/language-store';

// --- CHIP STATUS TRANSAKSI ---
function StatusChip({ status }) {
  const normalized = (status || '').toLowerCase();

  let bgClass = 'bg-amber-100 dark:bg-amber-950/40';
  let textClass = 'text-amber-800 dark:text-amber-300';
  let iconName = 'schedule';
  let label = 'Menunggu Bayar';

  if (normalized === 'success') {
    bgClass = 'bg-emerald-100 dark:bg-emerald-950/40';
    textClass = 'text-emerald-800 dark:text-emerald-300';
    iconName = 'verified';
    label = 'Dibayar';
  } else if (normalized === 'process') {
    bgClass = 'bg-sky-100 dark:bg-sky-950/40';
    textClass = 'text-sky-800 dark:text-sky-300';
    iconName = 'inventory-2';
    label = 'Diproses';
  } else if (normalized === 'shipped') {
    bgClass = 'bg-indigo-100 dark:bg-indigo-950/40';
    textClass = 'text-indigo-800 dark:text-indigo-300';
    iconName = 'local-shipping';
    label = 'Sedang Dikirim';
  } else if (normalized === 'delivered') {
    bgClass = 'bg-emerald-100 dark:bg-emerald-950/40';
    textClass = 'text-emerald-800 dark:text-emerald-300';
    iconName = 'check-circle';
    label = 'Selesai / Diterima';
  } else if (normalized === 'cancelled') {
    bgClass = 'bg-rose-100 dark:bg-rose-950/40';
    textClass = 'text-rose-800 dark:text-rose-300';
    iconName = 'cancel';
    label = 'Dibatalkan';
  }

  return (
    <View className={`flex-row items-center rounded-full px-2.5 py-1 ${bgClass}`}>
      <MaterialIcons name={iconName} size={14} className={textClass} />
      <Text className={`ml-1 text-[11px] font-bold ${textClass}`}>
        <T>{label}</T>
      </Text>
    </View>
  );
}

// --- KARTU RIWAYAT PESANAN ---
function OrderCard({ order, onConfirmDelivered, onCheckPayment, isUpdating }) {
  const router = useRouter();
  const isDark = useThemeMode();
  const baseUrl = getApiBaseUrl();

  const isPending = order.status === 'Pending';
  const isShippedOrProcess = order.status === 'Shipped' || order.status === 'Process' || order.status === 'Success';
  const isDelivered = order.status === 'Delivered';

  const imageUrl = order.image
    ? `${baseUrl}${order.image}`
    : 'https://via.placeholder.com/150';

  return (
    <View className="bg-white dark:bg-[#1E293B] rounded-[20px] p-4 shadow-sm border border-outlineVariant/50 dark:border-[#334155] gap-3">
      {/* Header: No. Transaksi + Status Badge */}
      <View className="flex-row items-center justify-between pb-2 border-b border-outlineVariant/40 dark:border-[#334155]">
        <View className="flex-1 pr-2">
          <Text className="text-[11px] font-semibold text-outline dark:text-[#90CAF9] uppercase">
            <T>Kode Pesanan</T>
          </Text>
          <Text className="text-xs font-mono font-bold text-onSurface dark:text-[#E3F2FD] mt-0.5">
            {order.kode_transaksi || order.id}
          </Text>
        </View>
        <StatusChip status={order.status} />
      </View>

      {/* Rincian Produk */}
      <View className="flex-row items-center gap-3">
        <View className="w-16 h-16 rounded-[14px] overflow-hidden bg-surfaceContainerHighest dark:bg-[#334155] border border-outlineVariant/40 dark:border-[#475569]">
          <ImageWithFallback
            uri={imageUrl}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-bold text-onSurface dark:text-[#E3F2FD]" numberOfLines={1}>
            {order.name}
          </Text>
          {(order.ram || order.rom) && (
            <Text className="text-xs text-outline dark:text-[#90CAF9] mt-0.5">
              {[order.ram, order.rom, order.color].filter(Boolean).join(' • ')}
            </Text>
          )}
          <Text className="text-xs text-outlineVariant dark:text-[#64748B] mt-0.5">
            {order.qty || 1} <T>barang</T>
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs text-outline dark:text-[#90CAF9]"><T>Total Tagihan</T></Text>
          <Text className="text-sm font-black text-primary mt-0.5">
            {order.priceFormatted}
          </Text>
        </View>
      </View>

      {/* Informasi Pengiriman Singkat */}
      {order.alamat ? (
        <View className="bg-surfaceContainerLow dark:bg-[#0F172A] p-2.5 rounded-[12px] flex-row items-start gap-1.5 border border-outlineVariant/30 dark:border-[#334155]">
          <MaterialIcons name="local-shipping" size={14} color="#2196F3" style={{ marginTop: 1 }} />
          <Text className="text-[11px] text-onSurfaceVariant dark:text-[#90CAF9] flex-1 leading-4" numberOfLines={1}>
            {order.recipient ? `${order.recipient} - ` : ''}{order.alamat}
          </Text>
        </View>
      ) : null}

      {/* Footer: Tanggal Pembelian + Tombol Aksi */}
      <View className="flex-row items-center justify-between pt-2 border-t border-outlineVariant/40 dark:border-[#334155]">
        <View className="flex-row items-center">
          <MaterialIcons name="schedule" size={13} color={isDark ? '#94A3B8' : '#80756C'} />
          <Text className="text-[11px] text-outline dark:text-[#94A3B8] ml-1">
            {order.date}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          {/* Tombol Konfirmasi Terima Pesanan (Jika sedang dikirim/diproses) */}
          {isShippedOrProcess && (
            <TouchableOpacity
              onPress={() => onConfirmDelivered(order.kode_transaksi || order.id)}
              disabled={isUpdating}
              activeOpacity={0.8}
              className="bg-emerald-600 px-4 py-2 rounded-full flex-row items-center gap-1 shadow-sm"
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <MaterialIcons name="check" size={14} color="#FFFFFF" />
                  <Text className="text-white text-xs font-bold">
                    <T>Pesanan Diterima</T>
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Tombol Cek Bayar / Sinkronisasi (Jika status masih Pending) */}
          {isPending && (
            <TouchableOpacity
              onPress={() => onCheckPayment(order.kode_transaksi || order.id)}
              disabled={isUpdating}
              activeOpacity={0.8}
              className="bg-primary px-4 py-2 rounded-full flex-row items-center gap-1 shadow-sm"
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <MaterialIcons name="sync" size={14} color="#FFFFFF" />
                  <Text className="text-white text-xs font-bold">
                    <T>Cek Status Bayar</T>
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Tombol Beli Lagi (Jika sudah Selesai/Delivered) */}
          {isDelivered && (
            <TouchableOpacity
              onPress={() => router.push('/(tabs)')}
              activeOpacity={0.8}
              className="border border-primary px-4 py-1.5 rounded-full flex-row items-center gap-1"
            >
              <MaterialIcons name="repeat" size={14} color="#2196F3" />
              <Text className="text-primary text-xs font-bold">
                <T>Beli Lagi</T>
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

export default function History() {
  const router = useRouter();
  const auth = useAuth();
  const user = auth?.user;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [activeTab, setActiveTab] = useState('Semua');
  const tabs = ['Semua', 'Pending', 'Dikirim', 'Selesai'];

  // Ambil riwayat transaksi dari database
  const fetchOrders = useCallback(async () => {
    try {
      const baseUrl = getApiBaseUrl();

      // Ambil daftar order_id lokal dari AsyncStorage
      let localOrderIds = [];
      try {
        const rawLocal = await AsyncStorage.getItem('verse_local_orders');
        if (rawLocal) localOrderIds = JSON.parse(rawLocal);
      } catch (e) {
        console.warn('Read local orders error:', e);
      }

      const params = new URLSearchParams();
      if (user?.id_user || user?.id) {
        params.append('id_user', String(user.id_user || user.id));
      }
      if (user?.username) {
        params.append('username', String(user.username));
      }
      if (user?.email) {
        params.append('email', String(user.email));
      }
      if (Array.isArray(localOrderIds) && localOrderIds.length > 0) {
        params.append('order_ids', localOrderIds.join(','));
      }

      const url = `${baseUrl}/api/transaksi?${params.toString()}`;
      console.log('[History] Fetching transaction history from:', url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (error) {
      console.warn('[History] Error fetching orders:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  // Konfirmasi Terima Pesanan oleh User
  const handleConfirmDelivered = (orderId) => {
    Alert.alert(
      'Konfirmasi Penerimaan',
      'Apakah Anda yakin barang pesanan ini sudah sampai dan telah Anda terima dengan baik?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Sudah Diterima',
          onPress: async () => {
            setUpdatingId(orderId);
            try {
              const res = await fetch(`${getApiBaseUrl()}/api/transaksi`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  order_id: orderId,
                  status: 'Delivered',
                }),
              });

              const result = await res.json();
              if (res.ok && result.success) {
                Alert.alert('Sukses', 'Pesanan telah berhasil dikonfirmasi selesai!');
                fetchOrders();
              } else {
                Alert.alert('Gagal', result.error || 'Gagal mengonfirmasi pesanan.');
              }
            } catch (err) {
              console.error('Confirm Delivered Error:', err);
              Alert.alert('Error', 'Gagal terhubung ke server.');
            } finally {
              setUpdatingId(null);
            }
          },
        },
      ]
    );
  };

  // Cek Status Pembayaran ke Midtrans
  const handleCheckPayment = async (orderId) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/payment?order_id=${orderId}`);
      const result = await res.json();
      console.log('[History] Check payment status:', result);

      if (result.status === 'Success') {
        Alert.alert('Pembayaran Berhasil', 'Pembayaran transaksi ini telah terverifikasi sukses!');
        fetchOrders();
      } else if (result.status === 'Cancelled') {
        Alert.alert('Transaksi Dibatalkan', 'Waktu pembayaran transaksi telah habis atau dibatalkan.');
        fetchOrders();
      } else {
        Alert.alert(
          'Menunggu Pembayaran',
          `Pesanan ${orderId} masih menunggu pembayaran.\nSilakan selesaikan pembayaran sesuai metode yang dipilih.`
        );
      }
    } catch (err) {
      console.warn('Check Payment Error:', err);
      Alert.alert('Error', 'Gagal memeriksa status pembayaran.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter daftar berdasarkan Tab Aktif
  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'Semua') return true;
    if (activeTab === 'Pending') return o.status === 'Pending';
    if (activeTab === 'Dikirim') return o.status === 'Shipped' || o.status === 'Process';
    if (activeTab === 'Selesai') return o.status === 'Delivered' || o.status === 'Success';
    return true;
  });

  return (
    <View className="flex-1 bg-surface dark:bg-[#0F172A]">
      <TopAppBar title="Riwayat Pesanan" />

      {/* Tab Filter Pesanan */}
      <View className="flex-row h-[48px] border-b border-outlineVariant dark:border-[#334155] bg-white dark:bg-[#1E293B]">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
              className="flex-1 items-center justify-center relative"
            >
              <Text
                className={`text-xs font-bold ${
                  isSelected ? 'text-primary' : 'text-outline dark:text-[#90CAF9]'
                }`}
              >
                <T>{tab}</T>
              </Text>
              {isSelected && (
                <View className="absolute bottom-0 w-12 h-[3px] bg-primary rounded-t-full" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Konten Daftar Riwayat */}
      {loading ? (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#2196F3" />
          <Text className="text-xs text-outline dark:text-[#90CAF9] mt-3 font-medium">
            <T>Memuat riwayat transaksi...</T>
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2196F3']} />
          }
        >
          {filteredOrders.length === 0 ? (
            <View className="items-center py-24 px-6">
              <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-3">
                <MaterialIcons name="receipt-long" size={36} color="#2196F3" />
              </View>
              <Text className="text-base font-bold text-onSurface dark:text-[#E3F2FD] text-center">
                <T>Belum Ada Pesanan</T>
              </Text>
              <Text className="text-xs text-outline dark:text-[#90CAF9] text-center mt-1 leading-5">
                {activeTab === 'Semua'
                  ? 'Anda belum memiliki transaksi pesanan. Mulai belanja produk favorit Anda sekarang!'
                  : `Tidak ada pesanan dengan status "${activeTab}".`}
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)')}
                activeOpacity={0.85}
                className="bg-primary px-6 py-2.5 rounded-full mt-5"
              >
                <Text className="text-white font-bold text-xs">
                  <T>Mulai Belanja</T>
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.kode_transaksi || order.id_transaksi || order.id}
                order={order}
                onConfirmDelivered={handleConfirmDelivered}
                onCheckPayment={handleCheckPayment}
                isUpdating={updatingId === (order.kode_transaksi || order.id)}
              />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}
