import React, { useState, useRef, useEffect } from 'react';
// Tambahkan Image di sini
import { View, ScrollView, Text, TouchableOpacity, Image, Modal, Pressable, Share, Linking, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { createURL } from 'expo-linking';
import * as Clipboard from 'expo-clipboard';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWishlist, addToWishlist, removeFromWishlist } from '../store/wishlist';
import { useThemeMode } from '../store/theme-store';
import { useTranslatedText } from '../store/language-store';
import { IconButton, Button } from '../components/Button';
import { Card } from '../components/Card';

export default function Detail() {
  const isDark = useThemeMode();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedColor, setSelectedColor] = useState('Blue');
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  // Animasi bottom sheet (smooth, custom ease)
  const sheetAnim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const SHEET_H = 620;

  useEffect(() => {
    if (showShare) {
      Animated.parallel([
        Animated.timing(sheetAnim, { toValue: 1, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(backdropAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    }
  }, [showShare]);

  const closeShare = () => {
    Animated.parallel([
      Animated.timing(sheetAnim, { toValue: 0, duration: 220, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
      Animated.timing(backdropAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setShowShare(false));
  };

  // Snackbar dengan aksi undo
  const [snackbar, setSnackbar] = useState(null); // { message, undoAction }
    const snackAnim = useRef(new Animated.Value(0)).current;
    const snackTimer = useRef(null);

    // Translated strings
    const tBrandName = useTranslatedText('Brand Name');
    const tProductName = useTranslatedText('Product Name Ultra');
    const tSelectColor = useTranslatedText('Select Color:');
    const tBuy = useTranslatedText('Buy');
    const tDetailSpec = useTranslatedText('Detail Spek');
    const tShareProduct = useTranslatedText('Bagikan Produk');
    const tCopyLink = useTranslatedText('Salin Tautan');
    const tCopied = useTranslatedText('Tersalin!');
    const tShareOthers = useTranslatedText('Lainnya');
    const tRemovedWishlist = useTranslatedText('Dihapus dari wishlist');
    const tAddedWishlist = useTranslatedText('Ditambahkan ke wishlist');
    const tUndo = useTranslatedText('Batal');

  const hideSnackbar = () => {
    if (snackTimer.current) clearTimeout(snackTimer.current);
    Animated.timing(snackAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() =>
      setSnackbar(null)
    );
  };

  const showSnackbar = (message, undoAction) => {
    if (snackTimer.current) clearTimeout(snackTimer.current);
    snackAnim.setValue(0);
    setSnackbar({ message, undoAction });
    Animated.timing(snackAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    snackTimer.current = setTimeout(hideSnackbar, 3000);
  };

  // Data produk untuk dibagikan
  const productName = 'Product Name Ultra';
  const productVariant = '12GB/256GB';
  const productPrice = 'Rp 21.999.000';
  const productImage = 'https://i.pinimg.com/736x/ec/af/f5/ecaff525c3f4e996bb93563082a7bc67.jpg';

  // Wishlist (tersimpan = bookmark bold, bisa dihapus)
  const WISHLIST_ID = 'detail-product-ultra';
  const wishlist = useWishlist();
  const saved = wishlist.some((i) => i.id === WISHLIST_ID);

  const toggleWishlist = () => {
      const item = {
        id: WISHLIST_ID,
        brand: 'Brand Name',
        name: productName,
        ram: productVariant,
        price: productPrice,
        image: productImage,
      };

      if (saved) {
        removeFromWishlist(WISHLIST_ID);
        showSnackbar(tRemovedWishlist, () => addToWishlist(item));
      } else {
        addToWishlist(item);
        showSnackbar(tAddedWishlist, () => removeFromWishlist(WISHLIST_ID));
      }
    };

  // Tautan saat ini untuk mengakses produk (deep link Expo)
  const getShareUrl = () => createURL('/detail');
  const getShareText = () => `Cek produk ini: ${productName} ${productVariant} - ${productPrice}`;

  // Link khusus platform; null berarti fallback ke share sheet native
  const buildPlatformUri = (platform) => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(getShareText());

    switch (platform) {
      case 'whatsapp':
        return `https://wa.me/?text=${text}`;
      case 'telegram':
        return `https://t.me/share/url?url=${url}&text=${text}`;
      case 'x':
        return `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      case 'line':
        return `https://line.me/R/msg/text/?${text}`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
      case 'pinterest':
        return `https://pinterest.com/pin/create/button/?url=${url}&description=${text}`;
      case 'reddit':
        return `https://www.reddit.com/submit?url=${url}&title=${text}`;
      case 'email':
        return `mailto:?subject=${encodeURIComponent(`${productName} - ${productPrice}`)}&body=${encodeURIComponent(`${getShareText()} ${getShareUrl()}`)}`;
      default:
        // Instagram, TikTok, Snapchat dsb. tanpa web-intent -> fallback share sheet native
        return null;
    }
  };

  const handlePlatformShare = async (platform) => {
    const uri = buildPlatformUri(platform);
    const fallback = () => Share.share({ message: getShareText(), url: getShareUrl() });

    try {
      if (uri) {
        await Linking.openURL(uri);
      } else {
        await fallback();
      }
      closeShare();
    } catch {
      // Aplikasi target tidak terpasang -> share sheet native
      await fallback();
      closeShare();
    }
  };

  const handleMoreShare = () => {
    Share.share({ message: getShareText(), url: getShareUrl() });
    closeShare();
  };

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(`${getShareText()} ${getShareUrl()}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareApps = [
    { id: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp', bg: '#25D366' },
    { id: 'telegram', label: 'Telegram', icon: 'telegram-plane', bg: '#26A5E4' },
    { id: 'x', label: 'X', icon: 'twitter', bg: '#000000' },
    { id: 'facebook', label: 'Facebook', icon: 'facebook', bg: '#1877F2' },
    { id: 'instagram', label: 'Instagram', icon: 'instagram', bg: '#E4405F' },
    { id: 'tiktok', label: 'TikTok', icon: 'tiktok', bg: '#010101' },
    { id: 'line', label: 'LINE', icon: 'line', bg: '#06C755' },
    { id: 'linkedin', label: 'LinkedIn', icon: 'linkedin', bg: '#0A66C2' },
    { id: 'pinterest', label: 'Pinterest', icon: 'pinterest', bg: '#E60023' },
    { id: 'snapchat', label: 'Snapchat', icon: 'snapchat', bg: '#FFFC00', iconColor: '#111111' },
    { id: 'reddit', label: 'Reddit', icon: 'reddit-alien', bg: '#FF4500' },
    { id: 'email', label: 'Email', icon: 'envelope', bg: '#EA4335' },
  ];

  const colors = [
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Black', hex: '#1E293B' },
    { name: 'Silver', hex: '#94A3B8' },
  ];

  const specs = [
    { label: 'Brand', value: 'Samsung' },
    { label: 'Model', value: 'Galaxy S24 Ultra' },
    { label: 'Processor', value: 'Snapdragon 8 Gen 3' },
    { label: 'RAM', value: '12 GB' },
    { label: 'ROM / Storage', value: '256 GB' },
    { label: 'Layar', value: '6.8 inch Dynamic AMOLED 2X' },
    { label: 'Kamera Utama', value: '200 MP + 50 MP + 12 MP + 10 MP' },
    { label: 'Baterai', value: '5000 mAh (Fast Charging 45W)' },
    { label: 'Sistem Operasi', value: 'Android 14, One UI 6.1' },
  ];

  return (
    <View className="flex-1 bg-surface dark:bg-[#0F172A] pt-12">
      {/* Top App Bar */}
      <View className="flex-row items-center px-4 mb-4">
        <IconButton icon="arrow-back" size="m" onPress={() => router.back()} className="mr-2" />
        <View className="flex-1 items-end">
          <IconButton icon="share" size="s" onPress={() => setShowShare(true)} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24, gap: 20 }} className="mx-4">

        {/* Card Produk - Diakalin dengan menghapus imageUri dan memakai Image murni */}
        <Card
          mode="filled"
          className="h-[260px] rounded-[10px] overflow-hidden bg-white dark:bg-[#1E293B] relative border border-blue-500 dark:border-[#334155]"
        >
          {/* GAMBAR: Tambahkan bottom: 0 agar benar-benar ditarik pas ke tepi bawah */}
          <Image
            source={{ uri: "https://i.pinimg.com/736x/ec/af/f5/ecaff525c3f4e996bb93563082a7bc67.jpg" }}
            style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '33.33%', height: '100%' }}
            resizeMode="cover"
          />

          {/* KONTEN TEKS: Diberi marginLeft 33.33% agar mulai setelah gambar, dan lebarnya 66.67% (2/3) */}
          <View style={{ marginLeft: '33.33%', width: '66.67%' }} className="h-full p-3 justify-between pr-4">
            <View>
              <Text className="text-xs text-outline dark:text-[#E3F2FD] font-semibold tracking-wider uppercase">
                              {tBrandName}
                            </Text>
                            <Text className="text-lg text-onSurface dark:text-[#E3F2FD] font-bold mt-0.5" numberOfLines={1}>
                              {tProductName}
                            </Text>

              <View className="flex-row items-center mt-2 gap-2">
                <View className="py-0.5 rounded">
                  <Text className="text-xs text-onSurfaceVariant dark:text-[#90CAF9] font-medium">12GB/256GB</Text>
                </View>
              </View>

              {/* Harga Produk */}
              <Text className="text-xl font-bold text-primary dark:text-[#90CAF9] mt-2">Rp 21.999.000</Text>

              {/* Select Color (3 Warna) */}
                            <View className="mt-3">
                              <Text className="text-xs text-outline dark:text-[#E3F2FD] mb-1.5 font-medium">{tSelectColor}</Text>
                <View className="flex-row items-center gap-2">
                  {colors.map((c) => {
                    const isSelected = selectedColor === c.name;

                    return (
                      <TouchableOpacity
                        key={c.name}
                        onPress={() => setSelectedColor(c.name)}
                        // Wrapper menjadi pill (bg-slate-200 dark:bg-slate-700) hanya saat dipilih
                        className={`flex-row items-center rounded-full ${isSelected ? 'bg-slate-200 dark:bg-slate-700 p-1 pr-3' : 'p-1'
                          }`}
                      >
                        {/* Lingkaran Warna */}
                        <View
                          style={{ backgroundColor: c.hex }}
                          className={`w-6 h-6 rounded-full border-2 ${isSelected ? 'border-white' : 'border-transparent'
                            }`}
                        />

                        {/* LABEL NAMA WARNA */}
                        {isSelected && (
                          <Text className="text-sm font-bold text-slate-700 dark:text-[#E3F2FD] ml-1.5">
                            {c.name}
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Tombol Sementara (Buy) */}
                        <View className="w-[108px] mb-2">
                          <Button title={tBuy} icon="shopping-cart" mode="filled" size="s" />
                        </View>
          </View>

          {/* Tombol Bookmark: tersimpan = filled bold, bisa dihapus */}
          <View className="absolute top-3 right-3">
            <IconButton
              icon={saved ? 'bookmark' : 'bookmark-outline'}
              mode={saved ? 'filled' : 'standard'}
              size="s"
              onPress={toggleWishlist}
            />
          </View>
        </Card>

        {/* Judul Detail Spek di luar/di atas Box */}
                <View className="mt-2">
                  <Text className="text-lg text-onSurface dark:text-[#E3F2FD] font-bold mb-3">{tDetailSpec}</Text>

          {/* Box Container Spek */}
          <View className="bg-surfaceContainerHigh dark:bg-[#1E293B] rounded-[10px] p-3">
            {specs.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <View
                  key={index}
                  className={`flex-row justify-between items-center py-3 ${isEven ? 'bg-surfaceContainerHigh dark:bg-[#1E293B]' : 'bg-blue-200 dark:bg-[#1E3A5F]'
                    }`}
                >
                  <Text className="text-sm font-medium text-blue-500 dark:text-[#90CAF9] flex-1 p-2">{item.label}</Text>
                  <Text className="text-sm font-semibold text-onSurface dark:text-[#E3F2FD] flex-1 text-right p-2">
                    {item.value}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* ===== BOTTOM SHEET SHARE ===== */}
      <Modal
        visible={showShare}
        transparent
        animationType="none"
        onRequestClose={closeShare}
      >
        <Pressable className="flex-1 justify-end" onPress={closeShare}>
          {/* Backdrop fade */}
          <Animated.View
            className="absolute inset-0 bg-black/50"
            style={{ opacity: backdropAnim }}
          />

          {/* Sheet geser dari bawah, nempel penuh di tepi bawah */}
          <Animated.View
            className="bg-surface dark:bg-[#0F172A] rounded-t-[24px] px-6 pt-3"
            style={{
              paddingBottom: insets.bottom + 16,
              transform: [
                {
                  translateY: sheetAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [SHEET_H, 0],
                  }),
                },
              ],
            }}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              {/* Handle */}
              <View className="w-10 h-1 rounded-full bg-slate-300 dark:bg-[#1E293B] self-center mb-4" />

              {/* Header */}
                            <View className="flex-row items-center justify-between mb-4">
                              <Text className="text-lg font-bold text-onSurface dark:text-[#E3F2FD]">{tShareProduct}</Text>
                <TouchableOpacity
                  onPress={closeShare}
                  className="w-9 h-9 rounded-full bg-surfaceContainerHigh dark:bg-[#1E293B] items-center justify-center"
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="close" size={20} color={isDark ? "#E3F2FD" : "#1F1B18"} />
                </TouchableOpacity>
              </View>

              {/* Preview Produk */}
              <View className="flex-row items-center bg-surfaceContainerLow dark:bg-[#1E293B] rounded-[16px] p-3">
                <Image
                  source={{ uri: productImage }}
                  className="w-12 h-12 rounded-[10px] bg-surfaceContainerHighest dark:bg-[#334155] object-cover"
                />
                <View className="flex-1 ml-3">
                  <Text className="text-sm font-bold text-onSurface dark:text-[#E3F2FD]" numberOfLines={1}>
                    {productName} {productVariant}
                  </Text>
                  <Text className="text-sm font-bold text-primary dark:text-[#90CAF9] mt-0.5">
                    {productPrice}
                  </Text>
                </View>
              </View>

              {/* Grid Platform (12 platform, bisa discroll) */}
              <Text className="text-xs text-onSurfaceVariant dark:text-[#90CAF9] font-semibold mt-5 mb-3">
                Bagikan ke
              </Text>
              <ScrollView
                style={{ maxHeight: 264 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                {shareApps.map((app) => (
                  <TouchableOpacity
                    key={app.id}
                    className="w-[22%] items-center mb-2"
                    activeOpacity={0.8}
                    onPress={() => handlePlatformShare(app.id)}
                  >
                    <View
                      className="w-14 h-14 rounded-full items-center justify-center shadow-sm elevation-2"
                      style={{ backgroundColor: app.bg }}
                    >
                      <FontAwesome5
                        name={app.icon}
                        size={24}
                        color={app.iconColor || '#FFFFFF'}
                      />
                    </View>
                    <Text className="text-[10px] text-onSurfaceVariant dark:text-[#90CAF9] text-center mt-1.5" numberOfLines={1}>
                      {app.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Aksi */}
              <View className="flex-row gap-2 mt-5">
                <TouchableOpacity
                  onPress={handleCopyLink}
                  activeOpacity={0.8}
                  className="flex-1 bg-primary rounded-full h-11 items-center justify-center flex-row"
                >
                  <MaterialIcons
                                      name={copied ? 'check' : 'link'}
                                      size={18}
                                      color="#FFFFFF"
                                    />
                                    <Text className="text-white font-bold text-sm ml-1.5">
                                      {copied ? tCopied : tCopyLink}
                                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleMoreShare}
                  activeOpacity={0.8}
                  className="flex-1 border border-outline dark:border-[#334155] rounded-full h-11 items-center justify-center flex-row"
                >
                  <MaterialIcons name="share" size={18} color="#2196F3" />
                                    <Text className="text-primary dark:text-[#90CAF9] font-bold text-sm ml-1.5">{tShareOthers}</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    {/* ===== SNACKBAR (UNDO WISHLIST) ===== */}
      {snackbar && (
        <Animated.View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: insets.bottom + 16,
            opacity: snackAnim,
            transform: [
              {
                translateY: snackAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [24, 0],
                }),
              },
            ],
          }}
        >
          <View className="bg-[#1F1B18] rounded-[8px] px-4 py-3 flex-row items-center shadow-md elevation-4">
            <Text className="text-white text-sm flex-1 mr-3">{snackbar.message}</Text>
            <TouchableOpacity
              onPress={() => {
                snackbar.undoAction?.();
                hideSnackbar();
              }}
              activeOpacity={0.8}
            >
              <Text className="text-[#90CAF9] dark:text-[#E3F2FD] font-bold text-sm">{tUndo}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}