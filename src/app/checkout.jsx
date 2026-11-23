import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCart, removeFromCart } from '../store/cart';
import { useThemeMode } from '../store/theme-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAddresses } from '../store/address';
import { useAuth } from '../store/auth';
import { TopAppBar } from '../components/TopAppBar';
import { getApiBaseUrl } from '../lib/api';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CheckoutScreen() {
  const router = useRouter();
  const isDark = useThemeMode();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const cart = useCart() || [];
  const addresses = useAddresses();
  const auth = useAuth();
  const user = auth?.user;
  const [isProcessing, setIsProcessing] = useState(false);

  // Determine items based on purchase method (buyDirect vs Cart)
  const isBuyDirect = params.buyDirect === '1';
  const directItem = isBuyDirect ? {
    id: params.id || 'direct-item',
    name: params.name || 'Product',
    brand: params.brand || 'Brand',
    price: Number(params.price) || 0,
    image: params.image || '',
    color: params.color || 'Default',
    ram: params.ram || '',
    rom: params.rom || '',
    qty: Number(params.qty) || 1,
  } : null;

  const checkoutItems = isBuyDirect ? (directItem ? [directItem] : []) : (Array.isArray(cart) ? cart.filter(i => i && i.checked) : []);

  // Address state - use address store
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Select default address or first address on mount
  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      setSelectedAddress(prev => prev?.id === defaultAddr.id ? prev : defaultAddr);
    }
  }, [addresses]);

  const [showAddressModal, setShowAddressModal] = useState(false);

  // Courier state
  const couriers = [
    { id: 'reg', name: 'Reguler (JNE / J&T)', price: 20000, estimate: 'Estimasi tiba 2-3 hari' },
    { id: 'instant', name: 'Instant (Gojek / Grab)', price: 35000, estimate: 'Tiba dalam 3 jam' },
    { id: 'cargo', name: 'Kargo (SiCepat Cargo)', price: 50000, estimate: 'Estimasi tiba 4-6 hari' },
  ];
  const [selectedCourier, setSelectedCourier] = useState(couriers[0]);
  const [showCourierModal, setShowCourierModal] = useState(false);

  // Payment method state
  const paymentMethods = [
    { id: 'all', name: 'Midtrans Payment Gateway (Semua Metode)', icon: 'payment', group: 'Midtrans Gateway' },
    { id: 'qris', name: 'QRIS (Gopay, Dana, OVO, ShopeePay)', icon: 'qr-code', group: 'E-Wallet & QRIS' },
    { id: 'gopay', name: 'GoPay / GoPay Later', icon: 'account-balance-wallet', group: 'E-Wallet & QRIS' },
    { id: 'bca', name: 'Transfer Bank BCA (Virtual Account)', icon: 'account-balance', group: 'Transfer Bank' },
    { id: 'mandiri', name: 'Transfer Bank Mandiri (Bill Payment)', icon: 'account-balance', group: 'Transfer Bank' },
    { id: 'bri', name: 'Transfer Bank BRI (Virtual Account)', icon: 'account-balance', group: 'Transfer Bank' },
    { id: 'credit_card', name: 'Kartu Kredit / Debit Online', icon: 'credit-card', group: 'Kartu Pembayaran' },
    { id: 'cod', name: 'COD (Bayar di Tempat)', icon: 'local-shipping', group: 'Bayar di Tempat' },
  ];
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Voucher state
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [voucherApplied, setVoucherApplied] = useState(false);

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleApplyVoucher = () => {
    if (voucherCode.toUpperCase() === 'VERSEHEMAT') {
      setDiscount(50000);
      setVoucherApplied(true);
    } else {
      alert('Kode voucher tidak valid (coba: VERSEHEMAT)');
    }
  };

  // Calculations
  const productsSubtotal = (Array.isArray(checkoutItems) ? checkoutItems : []).reduce((acc, item) => {
    const price = typeof item.price === 'number' ? item.price : parseFloat(String(item.price || 0).replace(/[^0-9.]/g, '')) || 0;
    return acc + price * (Number(item.qty) || 1);
  }, 0);
  const shippingCost = selectedCourier.price;
  const adminFee = 1000;
  const totalPayment = Math.max(0, productsSubtotal + shippingCost + adminFee - discount);

  const handlePayOrder = async () => {
    if (checkoutItems.length === 0) {
      Alert.alert('Checkout Kosong', 'Tidak ada produk yang dipilih untuk di-checkout.');
      return;
    }
    if (!selectedAddress) {
      Alert.alert('Alamat Diperlukan', 'Silakan pilih atau tambah alamat pengiriman terlebih dahulu sebelum checkout.', [
        { text: 'Batal', style: 'cancel' },
        { text: 'Tambah Alamat', onPress: () => router.push('/alamat-pengiriman') },
      ]);
      return;
    }

    setIsProcessing(true);

    try {
      const payload = {
        id_produk: checkoutItems[0].id,
        first_name: selectedAddress.name,
        user_name: user?.username || selectedAddress.name || 'User',
        alamat: selectedAddress.detail,
        no_tlp_or_email: selectedAddress.phone,
        payment_type: selectedPayment.id,
        price: totalPayment,
        shipping_cost: shippingCost,
        admin_fee: adminFee,
        discount: discount,
        id_user: user?.id || user?.id_user || null,
        id_alamat: selectedAddress.id && !isNaN(Number(selectedAddress.id)) ? Number(selectedAddress.id) : null,
        items: checkoutItems.map(i => ({
          id: i.id,
          name: i.name,
          price: i.price,
          qty: i.qty || 1,
        })),
      };

      console.log('[Checkout] Submitting payment to API:', payload);

      const response = await fetch(`${getApiBaseUrl()}/api/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('[Checkout] API Response:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Pembayaran gagal diproses oleh server.');
      }

      // Simpan riwayat ID pesanan ke AsyncStorage lokal
      if (data.order_id) {
        try {
          const raw = await AsyncStorage.getItem('verse_local_orders');
          const list = raw ? JSON.parse(raw) : [];
          if (!list.includes(data.order_id)) {
            list.unshift(data.order_id);
            await AsyncStorage.setItem('verse_local_orders', JSON.stringify(list.slice(0, 50)));
          }
        } catch (storageErr) {
          console.warn('[Checkout] Failed to save local order id:', storageErr);
        }
      }

      // Bersihkan keranjang jika checkout berhasil dibuat
      if (!isBuyDirect) {
        checkoutItems.forEach(item => {
          const key = item.cartKey || item.id;
          if (key) removeFromCart(key);
        });
      }

      // Jika metode COD atau tidak ada redirectUrl Midtrans
      if (!data.redirectUrl) {
        setShowSuccessModal(true);
        return;
      }

      // Buka halaman pembayaran Midtrans Snap di in-app browser
      console.log('[Checkout] Opening Midtrans Snap URL:', data.redirectUrl);
      const browserResult = await WebBrowser.openBrowserAsync(data.redirectUrl);
      console.log('[Checkout] Browser closed with result:', browserResult);

      // Sinkronkan status pembayaran terbaru dari server/Midtrans
      try {
        const checkRes = await fetch(`${getApiBaseUrl()}/api/payment?order_id=${data.order_id}`);
        const checkData = await checkRes.json();
        console.log('[Checkout] Payment verification status:', checkData);

        if (checkData.status === 'Success') {
          setShowSuccessModal(true);
        } else if (checkData.status === 'Cancelled') {
          Alert.alert('Pembayaran Dibatalkan', 'Transaksi ini telah dibatalkan atau waktu pembayaran kadaluarsa.');
        } else {
          // Status Pending (misal transfer bank / QRIS menunggu pembayaran)
          Alert.alert(
            'Pesanan Berhasil Dibuat',
            `Kode Transaksi: ${data.order_id}\n\nStatus pesanan Anda saat ini "Menunggu Pembayaran". Silakan selesaikan pembayaran sesuai instruksi.`,
            [
              {
                text: 'Selesai',
                onPress: () => setShowSuccessModal(true),
              },
            ]
          );
        }
      } catch (err) {
        console.warn('[Checkout] Failed to sync status after browser close:', err);
        setShowSuccessModal(true);
      }
    } catch (e) {
      console.error('[Checkout] Pay Order Error:', e);
      Alert.alert('Gagal Memproses Pembayaran', e.message || 'Gagal terhubung ke server pembayaran Midtrans.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View className="flex-1 bg-surface dark:bg-[#0F172A]">
      <TopAppBar title="Checkout Pesanan" leftIcon="arrow-back" />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 140, gap: 16 }}>
        {/* Alamat Pengiriman (Jelas & Tidak Ambigu) */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowAddressModal(true)}
                  className="bg-white dark:bg-[#1E293B] p-4 rounded-[20px] border border-outlineVariant dark:border-[#334155] shadow-sm"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center gap-2">
                      <MaterialIcons name="location-pin" size={20} color="#2196F3" />
                      <Text className="font-bold text-sm text-onSurface dark:text-[#E3F2FD]">Alamat Pengiriman</Text>
                    </View>
                    <View className="flex-row items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                      <Text className="text-xs font-bold text-primary">Ubah Alamat</Text>
                      <MaterialIcons name="chevron-right" size={16} color="#2196F3" />
                    </View>
                  </View>
                  {selectedAddress ? (
                    <View className="mt-1 bg-surfaceContainerLow dark:bg-[#0F172A] p-3 rounded-[14px] border border-outlineVariant/50 dark:border-[#334155]">
                      <View className="flex-row items-center gap-2 mb-1">
                        <Text className="font-bold text-sm text-onSurface dark:text-[#E3F2FD]">{selectedAddress.name}</Text>
                        <Text className="text-xs text-outline dark:text-[#90CAF9]">({selectedAddress.phone})</Text>
                        <View className="bg-primary px-2 py-0.5 rounded">
                          <Text className="text-[10px] font-bold text-white">{selectedAddress.label}</Text>
                        </View>
                      </View>
                      <Text className="text-xs text-onSurfaceVariant dark:text-[#90CAF9] mt-1 leading-4" numberOfLines={2}>
                        {selectedAddress.detail}
                      </Text>
                    </View>
                  ) : (
                    <View className="mt-1 bg-surfaceContainerLow dark:bg-[#0F172A] p-4 rounded-[14px] border border-outlineVariant/50 dark:border-[#334155] items-center">
                      <MaterialIcons name="location-off" size={32} color="#80756C" />
                      <Text className="text-sm font-medium text-onSurfaceVariant dark:text-[#90CAF9] mt-2 text-center">
                        Belum ada alamat pengiriman
                      </Text>
                      <Text className="text-xs text-outline dark:text-[#90CAF9] mt-1 text-center">
                        Tambah alamat terlebih dahulu untuk melanjutkan checkout
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

        {/* Daftar Produk */}
        <View className="bg-white dark:bg-[#1E293B] p-4 rounded-[20px] border border-outlineVariant dark:border-[#334155] shadow-sm">
          <Text className="font-bold text-sm text-onSurface dark:text-[#E3F2FD] mb-3">
            Daftar Produk ({checkoutItems.reduce((acc, i) => acc + (i.qty || 1), 0)} Produk)
          </Text>
          <View className="gap-3">
            {checkoutItems.map((item, index) => (
              <View key={item.cartKey || index} className="flex-row items-center gap-3 bg-surfaceContainerLow dark:bg-[#0F172A] p-3 rounded-[16px]">
                <Image source={{ uri: item.image }} className="w-16 h-16 rounded-[10px]" resizeMode="contain" />
                <View className="flex-1 min-w-0">
                  <Text className="text-xs font-semibold text-outline dark:text-[#90CAF9] uppercase">{item.brand || 'Brand'}</Text>
                  <Text className="text-sm font-bold text-onSurface dark:text-[#E3F2FD]" numberOfLines={1}>{item.name}</Text>
                  <View className="flex-row items-center gap-2 mt-1">
                    {item.color && (
                      <View className="bg-surfaceContainerHigh dark:bg-[#1E293B] px-2 py-0.5 rounded">
                        <Text className="text-[10px] text-onSurfaceVariant dark:text-[#90CAF9]">{item.color}</Text>
                      </View>
                    )}
                    {(item.ram || item.rom) && (
                      <View className="bg-surfaceContainerHigh dark:bg-[#1E293B] px-2 py-0.5 rounded">
                        <Text className="text-[10px] text-onSurfaceVariant dark:text-[#90CAF9]">
                          {[item.ram, item.rom].filter(Boolean).join(' / ')}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-primary dark:text-[#90CAF9] font-black text-xs mt-1.5">
                      Rp {(item.price || 0).toLocaleString('id-ID')}
                    </Text>
                    <Text className="text-xs font-bold text-onSurfaceVariant dark:text-[#90CAF9]">
                      x{item.qty || 1}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Opsi Pengiriman */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowCourierModal(true)}
          className="bg-white dark:bg-[#1E293B] p-4 rounded-[20px] border border-outlineVariant dark:border-[#334155] shadow-sm flex-row items-center justify-between"
        >
          <View className="flex-1 mr-3">
            <View className="flex-row items-center gap-2 mb-1">
              <MaterialIcons name="local-shipping" size={20} color="#2196F3" />
              <Text className="font-bold text-sm text-onSurface dark:text-[#E3F2FD]">Opsi Pengiriman</Text>
            </View>
            <Text className="text-xs font-bold text-primary mt-1">{selectedCourier.name} - Rp {selectedCourier.price.toLocaleString('id-ID')}</Text>
            <Text className="text-[11px] text-outline dark:text-[#90CAF9] mt-0.5">{selectedCourier.estimate}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={isDark ? '#E3F2FD' : '#64748B'} />
        </TouchableOpacity>

        {/* Voucher / Promo */}
        <View className="bg-white dark:bg-[#1E293B] p-4 rounded-[20px] border border-outlineVariant dark:border-[#334155] shadow-sm">
          <View className="flex-row items-center gap-2 mb-2">
            <MaterialIcons name="local-offer" size={20} color="#2196F3" />
            <Text className="font-bold text-sm text-onSurface dark:text-[#E3F2FD]">Voucher & Promo</Text>
          </View>
          <View className="flex-row gap-2 mt-2">
            <TextInput
              placeholder="Masukkan kode voucher (coba: VERSEHEMAT)"
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              value={voucherCode}
              onChangeText={setVoucherCode}
              className="flex-1 bg-surfaceContainerLow dark:bg-[#0F172A] px-4 py-2.5 rounded-[12px] text-xs text-onSurface dark:text-[#E3F2FD] border border-outlineVariant dark:border-[#334155]"
            />
            <TouchableOpacity
              onPress={handleApplyVoucher}
              activeOpacity={0.8}
              className="bg-primary px-4 py-2.5 rounded-[12px] items-center justify-center"
            >
              <Text className="text-white font-bold text-xs">Gunakan</Text>
            </TouchableOpacity>
          </View>
          {voucherApplied && (
            <Text className="text-xs text-emerald-600 font-bold mt-2">
              Voucher berhasil digunakan! Diskon Rp 50.000 diterapkan.
            </Text>
          )}
        </View>

        {/* Metode Pembayaran */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowPaymentModal(true)}
          className="bg-white dark:bg-[#1E293B] p-4 rounded-[20px] border border-outlineVariant dark:border-[#334155] shadow-sm flex-row items-center justify-between"
        >
          <View className="flex-1 mr-3">
            <View className="flex-row items-center gap-2 mb-1">
              <MaterialIcons name="payment" size={20} color="#2196F3" />
              <Text className="font-bold text-sm text-onSurface dark:text-[#E3F2FD]">Metode Pembayaran</Text>
            </View>
            <Text className="text-xs font-bold text-primary mt-1">{selectedPayment.name}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={isDark ? '#E3F2FD' : '#64748B'} />
        </TouchableOpacity>

        {/* Rincian Pembayaran */}
        <View className="bg-white dark:bg-[#1E293B] p-4 rounded-[20px] border border-outlineVariant dark:border-[#334155] shadow-sm gap-2">
          <Text className="font-bold text-sm text-onSurface dark:text-[#E3F2FD] mb-1">Rincian Pembayaran</Text>
          <View className="flex-row justify-between">
            <Text className="text-xs text-outline dark:text-[#90CAF9]">Subtotal Produk</Text>
            <Text className="text-xs font-bold text-onSurface dark:text-[#E3F2FD]">Rp {productsSubtotal.toLocaleString('id-ID')}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-xs text-outline dark:text-[#90CAF9]">Biaya Pengiriman</Text>
            <Text className="text-xs font-bold text-onSurface dark:text-[#E3F2FD]">Rp {shippingCost.toLocaleString('id-ID')}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-xs text-outline dark:text-[#90CAF9]">Biaya Layanan</Text>
            <Text className="text-xs font-bold text-onSurface dark:text-[#E3F2FD]">Rp {adminFee.toLocaleString('id-ID')}</Text>
          </View>
          {discount > 0 && (
            <View className="flex-row justify-between">
              <Text className="text-xs text-emerald-600 font-bold">Diskon Voucher</Text>
              <Text className="text-xs font-bold text-emerald-600">-Rp {discount.toLocaleString('id-ID')}</Text>
            </View>
          )}
          <View className="h-[1px] bg-outlineVariant dark:bg-[#334155] my-2" />
          <View className="flex-row justify-between items-center">
            <Text className="font-bold text-sm text-onSurface dark:text-[#E3F2FD]">Total Pembayaran</Text>
            <Text className="text-lg font-black text-primary">Rp {totalPayment.toLocaleString('id-ID')}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar Checkout */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#1E293B] border-t border-outlineVariant dark:border-[#334155] px-6 flex-row items-center justify-between shadow-lg"
        style={{ paddingBottom: Math.max(insets.bottom, 16), paddingTop: 16, zIndex: 50 }}
      >
        <View className="flex-1">
          <Text className="text-xs text-outline dark:text-[#90CAF9] uppercase tracking-wider font-bold">Total Tagihan</Text>
          <Text className="text-xl font-black text-primary mt-0.5">
            Rp {totalPayment.toLocaleString('id-ID')}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handlePayOrder}
          disabled={isProcessing}
          activeOpacity={0.85}
          className={`bg-primary px-8 py-3.5 rounded-[16px] shadow-md flex-row items-center gap-2 ${isProcessing ? 'opacity-70' : ''}`}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <MaterialIcons name="lock" size={16} color="#FFFFFF" />
          )}
          <Text className="text-white font-bold text-base">
            {isProcessing ? 'Memproses...' : 'Bayar Sekarang'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* MODAL SUCCESS ORDER */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View className="flex-1 bg-black/60 items-center justify-center p-6">
          <View className="bg-surface dark:bg-[#1E293B] rounded-[24px] p-6 w-full max-w-sm items-center shadow-2xl">
            <View className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 items-center justify-center mb-4">
              <MaterialIcons name="check-circle" size={36} color="#10B981" />
            </View>
            <Text className="text-xl font-black text-onSurface dark:text-[#E3F2FD] text-center">Pembayaran Berhasil!</Text>
            <Text className="text-xs text-outline dark:text-[#90CAF9] text-center mt-1">
              Pesanan Anda telah dikonfirmasi dan sedang diproses oleh penjual.
            </Text>
            <View className="w-full bg-surfaceContainerLow dark:bg-[#0F172A] p-3 rounded-[16px] my-4 gap-1.5">
              <View className="flex-row justify-between">
                <Text className="text-xs text-outline">Metode Pembayaran</Text>
                <Text className="text-xs font-bold text-onSurface dark:text-[#E3F2FD]">{selectedPayment.name}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-outline">Total Tagihan</Text>
                <Text className="text-xs font-bold text-primary">Rp {totalPayment.toLocaleString('id-ID')}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                setShowSuccessModal(false);
                router.replace('/(tabs)');
              }}
              activeOpacity={0.85}
              className="bg-primary w-full py-3.5 rounded-[16px] items-center justify-center"
            >
              <Text className="text-white font-bold text-sm">Kembali ke Beranda</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL COURIER PICKER */}
      <Modal visible={showCourierModal} transparent animationType="slide">
        <Pressable className="flex-1 justify-end bg-black/50" onPress={() => setShowCourierModal(false)}>
          <Pressable className="bg-surface dark:bg-[#0F172A] rounded-t-[24px] p-6 gap-3">
            <Text className="text-lg font-bold text-onSurface dark:text-[#E3F2FD] mb-2">Pilih Opsi Pengiriman</Text>
            {couriers.map(c => (
              <TouchableOpacity
                key={c.id}
                onPress={() => {
                  setSelectedCourier(c);
                  setShowCourierModal(false);
                }}
                className={`p-4 rounded-[16px] border flex-row items-center justify-between ${selectedCourier.id === c.id ? 'border-primary bg-primary/5' : 'border-outlineVariant dark:border-[#334155]'}`}
              >
                <View>
                  <Text className="font-bold text-sm text-onSurface dark:text-[#E3F2FD]">{c.name}</Text>
                  <Text className="text-xs text-outline dark:text-[#90CAF9] mt-0.5">{c.estimate}</Text>
                </View>
                <Text className="font-bold text-sm text-primary">Rp {c.price.toLocaleString('id-ID')}</Text>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      {/* MODAL PAYMENT PICKER */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <Pressable className="flex-1 justify-end bg-black/50" onPress={() => setShowPaymentModal(false)}>
          <Pressable className="bg-surface dark:bg-[#0F172A] rounded-t-[24px] p-6 max-h-[80%]">
            <Text className="text-lg font-bold text-onSurface dark:text-[#E3F2FD] mb-4">Pilih Metode Pembayaran</Text>
            <ScrollView contentContainerStyle={{ gap: 10 }}>
              {paymentMethods.map(p => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => {
                    setSelectedPayment(p);
                    setShowPaymentModal(false);
                  }}
                  className={`p-4 rounded-[16px] border flex-row items-center gap-3 ${selectedPayment.id === p.id ? 'border-primary bg-primary/5' : 'border-outlineVariant dark:border-[#334155]'}`}
                >
                  <MaterialIcons name={p.icon} size={24} color="#2196F3" />
                  <View className="flex-1">
                    <Text className="text-xs text-outline">{p.group}</Text>
                    <Text className="font-bold text-sm text-onSurface dark:text-[#E3F2FD]">{p.name}</Text>
                  </View>
                  {selectedPayment.id === p.id && <MaterialIcons name="check-circle" size={20} color="#2196F3" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* MODAL ADDRESS PICKER */}
            <Modal visible={showAddressModal} transparent animationType="slide">
              <Pressable className="flex-1 justify-end bg-black/50" onPress={() => setShowAddressModal(false)}>
                <Pressable className="bg-surface dark:bg-[#0F172A] rounded-t-[24px] p-6 gap-3">
                  <Text className="text-lg font-bold text-onSurface dark:text-[#E3F2FD] mb-2">Pilih Alamat Pengiriman</Text>
                  {addresses.length > 0 ? (
                    addresses.map(addr => {
                      const isSelected = selectedAddress && selectedAddress.id === addr.id;
                      return (
                        <TouchableOpacity
                          key={addr.id}
                          onPress={() => {
                            setSelectedAddress(addr);
                            setShowAddressModal(false);
                          }}
                          className={`p-4 rounded-[16px] border ${isSelected ? 'border-primary bg-primary/10' : 'border-outlineVariant dark:border-[#334155] bg-surfaceContainerLow dark:bg-[#0F172A]'}`}
                        >
                          <View className="flex-row items-center justify-between mb-1">
                            <View className="flex-row items-center gap-2">
                              <Text className="font-bold text-sm text-onSurface dark:text-[#E3F2FD]">{addr.name}</Text>
                              <View className={`px-2 py-0.5 rounded ${isSelected ? 'bg-primary' : 'bg-surfaceContainerHigh'}`}>
                                <Text className={`text-[10px] font-bold ${isSelected ? 'text-white' : 'text-outline'}`}>{addr.label}</Text>
                              </View>
                            </View>
                            {isSelected && <MaterialIcons name="check-circle" size={20} color="#2196F3" />}
                          </View>
                          <Text className="text-xs text-onSurfaceVariant dark:text-[#90CAF9] mt-1" numberOfLines={2}>
                            {addr.detail}
                          </Text>
                        </TouchableOpacity>
                      );
                    })
                  ) : (
                    <View className="items-center py-6">
                      <MaterialIcons name="location-off" size={48} color="#80756C" />
                      <Text className="text-sm text-onSurfaceVariant dark:text-[#90CAF9] mt-3 text-center">
                        Belum ada alamat tersimpan
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setShowAddressModal(false);
                          router.push('/alamat-pengiriman');
                        }}
                        activeOpacity={0.8}
                        className="bg-primary px-6 py-2.5 rounded-[12px] mt-4"
                      >
                        <Text className="text-white font-bold text-xl px-10">Tambah Alamat</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </Pressable>
              </Pressable>
            </Modal>
    </View>
  );
}
