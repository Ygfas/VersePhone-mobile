import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Image, Text, TouchableOpacity, Modal, Pressable, FlatList, useWindowDimensions, Animated, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useVideoPlayer, VideoView } from 'expo-video';

// --- SUB-COMPONENT CARD VIDEO (Grid Thumbnail - Auto-play & Muted) ---
function VideoGridCard({ videoSrc, onPress }) {
  const player = useVideoPlayer(videoSrc, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  return (
    <TouchableOpacity
      style={{ width: '48.5%' }}
      className="aspect-video bg-surfaceContainerHighest rounded-md items-center justify-center relative overflow-hidden"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <VideoView
        style={{ width: '100%', height: '100%' }}
        player={player}
        nativeControls={false}
        contentFit="cover"
      />
      <View className="absolute inset-0 items-center justify-center bg-black/20 pointer-events-none" />
    </TouchableOpacity>
  );
}

// --- SUB-COMPONENT POPUP MODAL VIDEO (Suara Aktif / Unmuted) ---
function VideoModalPopup({ videoSrc, onClose }) {
  const player = useVideoPlayer(videoSrc, (player) => {
    player.loop = true;
    player.muted = false;
    player.play();
  });

  return (
    <Modal animationType="fade" transparent={true} visible={true} onRequestClose={onClose}>
      <Pressable
        className="flex-1 bg-black/80 items-center justify-center p-4"
        onPress={onClose}
      >
        <Pressable
          className="w-full max-w-lg aspect-video bg-black rounded-xl overflow-hidden justify-center items-center relative"
          onPress={(e) => e.stopPropagation()}
        >
          <VideoView
            style={{ width: '100%', height: '100%' }}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
            nativeControls={true}
            contentFit="contain"
          />
          <TouchableOpacity
            className="absolute top-3 right-3 p-1.5 rounded-full z-10"
            onPress={onClose}
          >
            <MaterialIcons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// --- CONTAINER VIDEO GRID ---
const VideoGrid = ({ onSelectVideo }) => {
  const videoList = [
    { id: 1, src: require('../../../assets/video/vivo.mp4') },
    { id: 2, src: require('../../../assets/video/samsung.mp4') },
    { id: 3, src: require('../../../assets/video/apple.mp4') },
    { id: 4, src: require('../../../assets/video/xiaomi.mp4') },
  ];

  return (
    <View className="flex">
      <View className="px-3 flex-row flex-wrap justify-center gap-2 z-0 shadow-md bg-slate-300 py-4">
        {videoList.map((item) => (
          <VideoGridCard
            key={item.id}
            videoSrc={item.src}
            onPress={() => onSelectVideo(item.src)}
          />
        ))}
      </View>
    </View>
  );
};

// --- AUTO BANNER CAROUSEL ---
function AutoBannerCarousel({ data }) {
  const { width, height: screenHeight } = useWindowDimensions();
  const CAROUSEL_HEIGHT = screenHeight * 0.75;
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef(null);

  const loopData = [...data, ...data, ...data];
  const MID_OFFSET = data.length;

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: MID_OFFSET, animated: false });
    }, 50);
    startTimer();
    return () => clearTimer();
  }, []);

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startTimer = () => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev + 1;
        const absIndex = MID_OFFSET + (next % data.length);
        flatListRef.current?.scrollToIndex({ index: absIndex, animated: true });
        return next % data.length;
      });
    }, 10000);
  };

  const onScrollEnd = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const rawIndex = Math.round(offsetX / width);
    const realIndex = rawIndex % data.length;
    setActiveIndex(realIndex);

    if (rawIndex < data.length || rawIndex >= data.length * 2) {
      const targetIndex = data.length + realIndex;
      flatListRef.current?.scrollToIndex({ index: targetIndex, animated: false });
    }
    startTimer();
  };

  return (
    <View style={{ width, height: CAROUSEL_HEIGHT, marginBottom: 16 }}>
      <FlatList
        ref={flatListRef}
        data={loopData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, i) => `${item.id}-${i}`}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        onMomentumScrollEnd={onScrollEnd}
        onScrollBeginDrag={clearTimer}
        renderItem={({ item }) => (
          <View style={{ width, height: CAROUSEL_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={typeof item.image === 'string' ? { uri: item.image } : item.image}
              style={{ width, height: CAROUSEL_HEIGHT }}
              resizeMode="cover"
            />
          </View>
        )}
      />
      <View style={{
        position: 'absolute', bottom: 10,
        flexDirection: 'row', alignSelf: 'center', gap: 6,
      }}>
        {data.map((_, i) => (
          <View
            key={i}
            style={{
              width: activeIndex === i ? 20 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: activeIndex === i ? '#fff' : 'rgba(255,255,255,0.5)',
            }}
          />
        ))}
      </View>
    </View>
  );
}

// --- ARTICLE SLIDER COMPONENT ---
function ArticleSlider({ articles, onArticlePress, loading, error }) {
  const { width } = useWindowDimensions();
  const CARD_WIDTH = width - 32;

  if (loading) {
    return (
      <View className="p-6 items-center justify-center">
        <ActivityIndicator size="large" color="#0D47A1" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="px-4 py-2">
        <Text className="text-red-500 text-sm">{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      horizontal
      data={articles}
      keyExtractor={(item, index) => item.id ? String(item.id) : String(index)}
      showsHorizontalScrollIndicator={false}
      snapToInterval={CARD_WIDTH + 12}
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => onArticlePress(item)}
          style={{ width: CARD_WIDTH }}
          className="bg-surfaceContainerLow rounded-[12px] overflow-hidden elevation-2 shadow-sm"
        >
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={{ width: '100%', height: 200 }}
              resizeMode="cover"
            />
          ) : (
            <View style={{ width: '100%', height: 200 }} className="bg-surfaceContainerHighest items-center justify-center">
              <Text className="text-xs text-onSurfaceVariant">Tidak ada gambar</Text>
            </View>
          )}
          <View className="p-4">
            <Text className="text-onSurface font-bold text-base mb-1" numberOfLines={2}>{item.title}</Text>
            <Text className="text-onSurfaceVariant text-sm" numberOfLines={2}>{item.summary}</Text>
            <View className="flex-row items-center mt-3">
              <MaterialIcons name="menu-book" size={14} color="#4F453D" />
              <Text className="text-onSurfaceVariant text-xs ml-1">Baca selengkapnya</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showNotif, setShowNotif] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // --- STATE DATA ARTIKEL DARI DATABASE ENDPOINT ---
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [articlesError, setArticlesError] = useState(null);

  // MEMANGGIL ENDPOINT API ARTIKEL NEXT.JS
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setArticlesLoading(true);
      // Menggunakan IPv4 Address Laptop Anda (192.168.1.9)
      const API_URL = process.env.EXPO_PUBLIC_API_URL2;
      const response = await fetch(`${API_URL}/api/artikel`);
      const data = await response.json();

      if (response.ok) {
        // Mapping kolom dari tabel database ke properti yang dibutuhkan UI
        const mappedArticles = data.map((item) => ({
          id: item.id_artikel || item.id,
          title: item.judul_artikel || item.judul || item.title,
          summary: item.ringkasan_artikel || item.ringkasan || item.summary || 'Klik untuk membaca detail artikel ini.',
          body: item.isi_artikel || item.konten || item.isi || item.body,
          image: item.gambar_artikel || item.gambar || item.image,
        }));
        setArticles(mappedArticles);
      } else {
        setArticlesError('Gagal memuat artikel dari server');
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      setArticlesError('Gagal terhubung ke server API artikel');
    } finally {
      setArticlesLoading(false);
    }
  };

  const carouselData = [
    { id: 1, image: require('../../../assets/thumbnail/xiaomi1.jpg') },
    { id: 2, image: require('../../../assets/thumbnail/samsung1.jpg') },
    { id: 3, image: require('../../../assets/thumbnail/ip1.jpg') },
    { id: 4, image: require('../../../assets/thumbnail/vivo1.jpg') },
    { id: 5, image: require('../../../assets/thumbnail/oppo1.jpg') },
    { id: 6, image: require('../../../assets/thumbnail/iqoo1.jpg') },
    { id: 7, image: require('../../../assets/thumbnail/infinix1.jpg') },
  ];

  const brandList = [
    { id: 1, name: 'Apple', logo: require('../../../assets/brand/iphone.jpg') },
    { id: 2, name: 'Samsung', logo: require('../../../assets/brand/samsung.jpg') },
    { id: 3, name: 'Xiaomi', logo: require('../../../assets/brand/xiaomi.jpg') },
    { id: 4, name: 'Vivo', logo: require('../../../assets/brand/vivo.jpg') },
    { id: 5, name: 'Oppo', logo: require('../../../assets/brand/oppo.jpg') },
    { id: 6, name: 'Realme', logo: require('../../../assets/brand/realme.jpg') },
    { id: 7, name: 'poco', logo: require('../../../assets/brand/poco.png') },
    { id: 8, name: 'Asus', logo: require('../../../assets/brand/tecno.jpg') },
  ];

  return (
    <View className="flex-1 bg-surface relative">

      {/* ===== FLOATING HEADER ===== */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            paddingTop: insets.top + 8,
            paddingBottom: 8,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            backgroundColor: scrollY.interpolate({
              inputRange: [screenHeight * 0.3, screenHeight * 0.5],
              outputRange: ['rgba(254,248,244,0)', 'rgba(254,248,244,0.97)'],
              extrapolate: 'clamp',
            }),
          },
        ]}
      >
        <View className="flex-1 flex-row items-center bg-surfaceContainerHigh rounded-full h-[44px] px-4">
          <MaterialIcons name="search" size={20} color="#4F453D" />
          <TouchableOpacity
            className="flex-1 ml-2"
            onPress={() => {
              setShowSearchHistory(!showSearchHistory);
              setShowNotif(false);
            }}
          >
            <Text className="text-onSurfaceVariant text-sm">Cari produk...</Text>
          </TouchableOpacity>
          {showSearchHistory && (
            <TouchableOpacity onPress={() => setShowSearchHistory(false)}>
              <MaterialIcons name="close" size={18} color="#4F453D" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          className="w-11 h-11 rounded-full bg-surfaceContainerHigh items-center justify-center"
          onPress={() => {
            setShowNotif(!showNotif);
            setShowSearchHistory(false);
          }}
        >
          <MaterialIcons name="notifications" size={24} color="#0D47A1" />
        </TouchableOpacity>
      </Animated.View>

      {/* SEARCH HISTORY OVERLAY */}
      {showSearchHistory && (
        <View className="absolute left-4 right-4 bg-surfaceContainerHigh rounded-[16px] shadow-md elevation-4 z-50 overflow-hidden"
          style={{ top: insets.top + 64 }}
        >
          {[1, 2, 3].map((i) => (
            <View key={i} className="flex-row items-center p-4 border-b border-outlineVariant">
              <View className="w-9 h-9 rounded-full bg-surfaceContainer items-center justify-center mr-3">
                <MaterialIcons name="schedule" size={20} color="#4F453D" />
              </View>
              <Text className="flex-1 text-sm text-onSurface">Pencarian sebelumnya {i}</Text>
              <TouchableOpacity>
                <MaterialIcons name="close" size={18} color="#4F453D" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* NOTIFICATION FULL-SCREEN MODAL */}
      <Modal visible={showNotif} transparent animationType="fade">
        <Pressable
          className="flex-1 bg-black/50"
          onPress={() => setShowNotif(false)}
        >
          <Pressable onPress={() => { }}>
            <View
              className="bg-surface mx-4 rounded-[24px] overflow-hidden elevation-4"
              style={{ marginTop: insets.top + 16 }}
            >
              <View className="flex-row items-center justify-between px-5 py-4 border-b border-outlineVariant">
                <Text className="text-lg font-bold text-onSurface">Notifikasi</Text>
                <TouchableOpacity
                  className="w-9 h-9 rounded-full bg-surfaceContainerHigh items-center justify-center"
                  onPress={() => setShowNotif(false)}
                >
                  <MaterialIcons name="close" size={20} color="#1F1B18" />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 500 }} contentContainerStyle={{ padding: 16, gap: 8 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TouchableOpacity
                    key={i}
                    className="flex-row items-center p-4 bg-surfaceContainerLow rounded-[16px]"
                  >
                    <View className="w-11 h-11 rounded-full bg-primaryContainer items-center justify-center mr-4">
                      <MaterialIcons name="notifications" size={22} color="#8B5000" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-onSurface mb-0.5">Notifikasi {i}</Text>
                      <Text className="text-xs text-onSurfaceVariant" numberOfLines={2}>Pesanan Anda sedang diproses. Harap menunggu konfirmasi dari penjual.</Text>
                    </View>
                    <Text className="text-xs text-onSurfaceVariant ml-2">2j</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* MAIN SCROLL CONTENT */}
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* AUTO BANNER CAROUSEL */}
        <AutoBannerCarousel data={carouselData} />

        {/* VIDEO GRID */}
        <VideoGrid onSelectVideo={(src) => setSelectedVideo(src)} />

        {/* HOME 2 CONTENT */}
        <View className="mb-6 z-0" />

        <View className="px-4 mb-10 flex-row gap-4 z-0">
          <TouchableOpacity
            className="flex-1 bg-surfaceContainerLow rounded-[20px] overflow-hidden shadow-sm elevation-1"
            onPress={() => setPopupData({ image: 'https://i.pinimg.com/736x/fe/8b/4f/fe8b4f05c091e9fd9807deac9b314f11.jpg', text: 'Main Promotion' })}
          >
            <Image
              source={{ uri: 'https://i.pinimg.com/736x/fe/8b/4f/fe8b4f05c091e9fd9807deac9b314f11.jpg' }}
              className="w-full flex-1 object-cover"
            />
            <View className="p-3">
              <Text className="text-sm font-medium text-onSurface">Main Promotion</Text>
            </View>
          </TouchableOpacity>

          <View className="flex-1 gap-4">
            <TouchableOpacity
              className="bg-surfaceContainerLow rounded-[20px] overflow-hidden shadow-sm elevation-1"
              onPress={() => setPopupData({ image: 'https://i.pinimg.com/736x/25/7a/e3/257ae37b125853599f57cf8f0052653c.jpg', text: 'Secondary Promo' })}
            >
              <Image
                source={{ uri: 'https://i.pinimg.com/736x/25/7a/e3/257ae37b125853599f57cf8f0052653c.jpg' }}
                className="w-full h-[80px] object-cover"
              />
              <View className="p-3">
                <Text className="text-sm font-medium text-onSurface">Secondary Promo</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-surfaceContainerLow rounded-[20px] overflow-hidden shadow-sm elevation-1"
              onPress={() => setPopupData({ image: 'https://i.pinimg.com/736x/25/7a/e3/257ae37b125853599f57cf8f0052653c.jpg', text: 'Special Offer' })}
            >
              <Image
                source={{ uri: 'https://i.pinimg.com/736x/25/7a/e3/257ae37b125853599f57cf8f0052653c.jpg' }}
                className="w-full h-[80px] object-cover"
              />
              <View className="p-3">
                <Text className="text-sm font-medium text-onSurface">Special Offer</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ARTIKEL ACCORDION SLIDER (AMBIL DATA DARI ENDPOINT DB) */}
        <View className="mb-10 z-0">
          <Text className="px-4 mb-3 text-onSurface font-bold text-base">Artikel</Text>
          <ArticleSlider
            articles={articles}
            loading={articlesLoading}
            error={articlesError}
            onArticlePress={(a) => setPopupData({ image: a.image, text: a.title, body: a.body })}
          />
        </View>

        {/* HOME 3 CONTENT BRAND */}
        <View className="relative h-[120px] bg-surfaceContainerHigh mb-12 justify-center z-0">
          <Text className="text-base text-onSurface absolute top-3 left-4 font-bold">Brand</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="absolute bottom-2 w-full"
            contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
          >
            {brandList.map((brand) => (
              <TouchableOpacity
                key={brand.id}
                activeOpacity={0.8}
                className="items-center"
              >
                <View className="w-16 h-16 rounded-full bg-[#FFFF] items-center justify-center p-3 shadow-md elevation-2 mb-1.5">
                  <Image
                    source={brand.logo}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </View>
                <Text className="text-xs font-semibold text-onSurface text-center">
                  {brand.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="px-4 items-end mb-4 z-0">
          <TouchableOpacity className="w-12 h-12 rounded-full bg-surface border border-outlineVariant items-center justify-center">
            <MaterialIcons name="filter-list" size={20} color="#4F453D" />
          </TouchableOpacity>
        </View>

        <View className="px-4 flex-row flex-wrap justify-between gap-y-4 mb-4 z-0">
          {[1, 2, 3, 4].map((i) => (
            <TouchableOpacity
              key={i}
              style={{ width: '48%' }}
              className="bg-surface border border-outlineVariant rounded-[8px] overflow-hidden elevation-1 shadow-sm"
              onPress={() => router.push('/detail')}
            >
              <Image
                source={{ uri: 'https://i.pinimg.com/736x/ec/af/f5/ecaff525c3f4e996bb93563082a7bc67.jpg' }}
                className="w-full h-[160px] object-cover"
              />
              <View className="p-3">
                <Text className="text-onSurface font-bold text-sm mb-1" numberOfLines={2}>Nama Produk {i}</Text>
                <Text className="text-primary font-bold text-sm">Rp 1.500.000</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </Animated.ScrollView>

      {/* MODAL POPUP VIDEO */}
      {selectedVideo && (
        <VideoModalPopup
          videoSrc={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* POPUP MODAL PROMO/ARTICLE */}
      <Modal visible={!!popupData} transparent animationType="fade">
        <Pressable
          className="flex-1 bg-black/60 items-center justify-center p-4"
          onPress={() => setPopupData(null)}
        >
          <Pressable onPress={() => { }}>
            <View className="bg-surface rounded-[20px] overflow-hidden w-full max-w-[400px]">
              {popupData?.image && (
                <Image source={{ uri: popupData?.image }} style={{ width: '100%', height: 220 }} resizeMode="cover" />
              )}
              <ScrollView style={{ maxHeight: 280 }} contentContainerStyle={{ padding: 20 }}>
                <Text className="text-xl font-bold text-onSurface mb-3">{popupData?.text}</Text>
                <Text className="text-sm text-onSurfaceVariant leading-6">
                  {popupData?.body ?? 'Detail informasi akan ditampilkan di sini.'}
                </Text>
              </ScrollView>
              <View className="px-5 pb-5">
                <TouchableOpacity
                  className="bg-primary rounded-full py-3 items-center"
                  onPress={() => setPopupData(null)}
                >
                  <Text className="text-white font-bold text-sm">Tutup</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}