import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, ScrollView, Text, TouchableOpacity, TextInput, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getApiBaseUrl } from '../lib/api';
import ImageWithFallback from '../components/ImageWithFallback';
import { useThemeMode } from '../store/theme-store';
import { useWishlist, addToWishlist, removeFromWishlist } from '../store/wishlist';
import { addSearchHistory } from '../store/search-history';

function Skeleton({ className = '' }) {
  const [pulse] = useState(() => new Animated.Value(0.5));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.5, duration: 350, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={{ opacity: pulse }}
      className={`bg-slate-200 dark:bg-slate-700 rounded-[8px] ${className}`}
    />
  );
}

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isDarkMode = useThemeMode();
  const { q } = useLocalSearchParams();

  const [query, setQuery] = useState(typeof q === 'string' ? q : '');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const wishlistIds = new Set(useWishlist().map((w) => w.id));

  useEffect(() => {
    if (typeof q === 'string') {
      setQuery(q);
    }
  }, [q]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const API_URL = getApiBaseUrl();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(`${API_URL}/api/product`, { signal: controller.signal });
      clearTimeout(timeout);
      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        const mappedProducts = data.map((item) => {
          try {
            const rawImage = item?.gambar;
            const image = typeof rawImage === 'string' && rawImage.trim()
              ? `data:image/jpeg;base64,${rawImage.trim()}`
              : null;
            const jenis = item?.jenis || item?.nama || '';
            const slug = jenis.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            return {
              id: item?.id_produk,
              brand: item?.nama || 'Brand',
              name: jenis || 'Product',
              price: parseFloat(item?.harga || 0) * 1000000,
              stock: item?.stok ?? 0,
              image,
              slug,
            };
          } catch {
            return null;
          }
        }).filter(Boolean);
        setProducts(mappedProducts);
      } else {
        setError('Gagal memuat produk dari server');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Gagal terhubung ke server API produk');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return products;
    const qLower = query.toLowerCase().trim();
    return products.filter((p) => {
      const matchBrand = p.brand?.toLowerCase().includes(qLower);
      const matchName = p.name?.toLowerCase().includes(qLower);
      return matchBrand || matchName;
    });
  }, [products, query]);

  const handleSearchSubmit = () => {
    const trimmed = query.trim();
    if (trimmed) {
      addSearchHistory(trimmed);
    }
  };

  return (
    <View className="flex-1 bg-surface dark:bg-[#0F172A]">
      {/* HEADER */}
      <View
        style={{ paddingTop: insets.top + 8, paddingBottom: 10 }}
        className="px-4 flex-row items-center gap-3 border-b border-outlineVariant dark:border-[#1E293B] bg-surface dark:bg-[#0F172A]"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-surfaceContainerHigh dark:bg-[#1E293B] items-center justify-center"
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={22} color={isDarkMode ? '#E3F2FD' : '#0D47A1'} />
        </TouchableOpacity>

        <View className="flex-1 flex-row items-center bg-surfaceContainerHigh dark:bg-[#1E293B] rounded-full h-[44px] px-3">
          <MaterialIcons name="search" size={20} color={isDarkMode ? '#90CAF9' : '#4F453D'} />
          <TextInput
            className="flex-1 ml-2 text-sm text-onSurface dark:text-[#E3F2FD] py-0"
            placeholder="Cari brand atau jenis produk..."
            placeholderTextColor={isDarkMode ? '#90CAF9' : '#80756C'}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            autoFocus={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialIcons name="close" size={18} color={isDarkMode ? '#90CAF9' : '#4F453D'} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* QUERY INFO */}
        <View className="px-4 py-3 flex-row justify-between items-center">
          <Text className="text-xs text-onSurfaceVariant dark:text-[#90CAF9]">
            {query.trim()
              ? `Hasil pencarian untuk "${query}"`
              : 'Semua Produk'}
          </Text>
          {!loading && (
            <Text className="text-xs text-onSurfaceVariant dark:text-[#90CAF9]">
              {filteredProducts.length} produk
            </Text>
          )}
        </View>

        {/* PRODUCTS GRID */}
        <View className="px-4 flex-row flex-wrap justify-between gap-y-4">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <View
                key={`skeleton-${i}`}
                className="bg-surface dark:bg-[#0F172A] border border-outlineVariant dark:border-[#334155] rounded-[12px] overflow-hidden w-[48%]"
              >
                <View className="w-full h-[180px] bg-white dark:bg-[#1E293B] items-center justify-center">
                  <Skeleton className="w-full h-full rounded-none" />
                </View>
                <View className="p-3 gap-2">
                  <Skeleton className="w-3/4 h-4" />
                  <Skeleton className="w-1/2 h-4" />
                  <Skeleton className="w-1/3 h-3" />
                  <Skeleton className="w-1/2 h-3" />
                </View>
              </View>
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const wishId = `product-${product.id}`;
              const isWish = wishlistIds.has(wishId);
              return (
                <View
                  key={product.id}
                  className="bg-surface dark:bg-[#0F172A] border border-outlineVariant dark:border-[#334155] rounded-[12px] overflow-hidden elevation-1 shadow-sm w-[48%]"
                >
                  <View className="w-full h-[180px] bg-white dark:bg-[#1E293B] relative overflow-hidden">
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => router.push(`/detail?slug=${product.slug}`)}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <ImageWithFallback
                        uri={product.image}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="contain"
                        className="bg-white"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        const item = {
                          id: wishId,
                          brand: product.brand,
                          name: product.name,
                          price: `Rp ${product.price.toLocaleString('id-ID')}`,
                          image: product.image,
                        };
                        if (isWish) removeFromWishlist(wishId);
                        else addToWishlist(item);
                      }}
                      activeOpacity={0.8}
                      className={`absolute top-2 right-2 w-8 h-8 rounded-full items-center justify-center ${
                        isWish ? 'bg-primary' : 'bg-white/90 border border-outlineVariant'
                      }`}
                    >
                      <MaterialIcons
                        name={isWish ? 'favorite' : 'favorite-border'}
                        size={16}
                        color={isWish ? '#FFFFFF' : '#0D47A1'}
                      />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => router.push(`/detail?slug=${product.slug}`)}
                    className="p-3 gap-1.5"
                  >
                    <Text className="text-xs text-onSurfaceVariant dark:text-[#90CAF9] font-medium">
                      {product.brand}
                    </Text>
                    <Text className="text-onSurface dark:text-[#E3F2FD] font-bold text-sm" numberOfLines={2}>
                      {product.name}
                    </Text>
                    <Text className="text-primary dark:text-[#90CAF9] font-bold text-sm">
                      Rp {product.price.toLocaleString('id-ID')}
                    </Text>
                    <Text className="text-xs text-onSurfaceVariant dark:text-[#90CAF9]">
                      Stok: {product.stock} unit
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <View className="w-full px-4 py-16 items-center justify-center">
              <MaterialIcons name="search-off" size={48} color={isDarkMode ? '#90CAF9' : '#80756C'} />
              <Text className="text-onSurface dark:text-[#E3F2FD] font-bold text-base mt-3 text-center">
                Produk Tidak Ditemukan
              </Text>
              <Text className="text-onSurfaceVariant dark:text-[#90CAF9] text-xs text-center mt-1 max-w-[250px]">
                {error || `Tidak ada produk yang cocok dengan "${query}". Coba cari berdasarkan brand (Samsung, Apple) atau jenis produk.`}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
