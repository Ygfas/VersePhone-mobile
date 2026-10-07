import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Image, Text, TouchableOpacity, Modal, Pressable, FlatList, useWindowDimensions, Animated, InteractionManager } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useVideoPlayer, VideoView } from 'expo-video';
import { getApiBaseUrl } from '../../lib/api';
import ImageWithFallback from '../../components/ImageWithFallback';
import { setCurrentArticle } from '../../store/article-view';
import { setCurrentPromo } from '../../store/promo-view';
import { useThemeMode } from '../../store/theme-store';
import { useTranslatedText } from '../../store/language-store';

// --- SUB-COMPONENT CARD VIDEO (Grid Thumbnail - Auto-play & Muted) ---
function VideoGridCard({ videoSrc, onPress }) {
  const [status, setStatus] = useState('loading');
  const player = useVideoPlayer(videoSrc, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  // Jaga video agar tetap berputar terus tanpa berhenti (auto replay jika selesai/pause)
  useEffect(() => {
    player.play();
    const subStatus = player.addListener('statusChange', (s) => {
      setStatus(s.status);
      if (s.status === 'readyToPlay' || s.status === 'paused') {
        player.play();
      }
    });

    const subEnd = player.addListener('playToEnd', () => {
      player.replay();
    });

    return () => {
      subStatus.remove();
      subEnd.remove();
    };
  }, [player]);

  const isBuffering = status === 'loading' || status === 'idle';

  return (
    <TouchableOpacity
      style={{ width: '48.5%' }}
      className="aspect-video bg-surfaceContainerHighest dark:bg-[#334155] rounded-md items-center justify-center relative overflow-hidden"
      onPress={onPress}
      activeOpacity={0.8}
    >
      {isBuffering && <Skeleton className="absolute inset-0 rounded-none z-10" />}

      <VideoView
        style={{ width: '100%', height: '100%' }}
        player={player}
        nativeControls={false}
        contentFit="cover"
      />
      {!isBuffering && (
        <View className="absolute inset-0 items-center justify-center bg-black/20 pointer-events-none" />
      )}
    </TouchableOpacity>
  );
}

// --- POPUP MODAL VIDEO (Suara Aktif / Unmuted) ---
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
      <View className="px-3 flex-row flex-wrap justify-center gap-2 z-0 shadow-md bg-slate-300 dark:bg-[#1E293B] py-4">
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

// --- SKELETON SHIMMER (placeholder saat konten masih load) ---
function Skeleton({ className = '' }) {
  const pulse = useRef(new Animated.Value(0.5)).current;

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

// --- ARTICLE SLIDER COMPONENT ---
function ArticleSlider({ articles, onArticlePress, loading, error }) {
  const isDarkMode = useThemeMode();
  const { width } = useWindowDimensions();
  const CARD_WIDTH = width - 32;
  const tReadMore = useTranslatedText('Baca selengkapnya');

  if (loading) {
    return (
      <View className="px-4 flex-row gap-3">
        {[1, 2].map((i) => (
          <View
            key={i}
            style={{ width: (CARD_WIDTH - 12) / 2 }}
            className="bg-surfaceContainerLow dark:bg-[#1E293B] rounded-[12px] overflow-hidden pb-4"
          >
            <Skeleton className="w-full h-[200px]" />
            <View className="p-4 gap-2.5">
              <Skeleton className="w-3/4 h-5" />
              <Skeleton className="w-full h-3.5" />
              <Skeleton className="w-2/3 h-3.5" />
              <Skeleton className="w-24 h-4 mt-1" />
            </View>
          </View>
        ))}
      </View>
    );
  }

  if (error) {
    return (
      <View className="px-4 py-2">
        <Text className="text-red-500 dark:text-red-300 text-sm">{error}</Text>
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
          className="bg-surfaceContainerLow dark:bg-[#1E293B] rounded-[12px] overflow-hidden elevation-2 shadow-sm"
        >
          <ImageWithFallback uri={item.image} style={{ width: '100%', height: 200 }} />
          <View className="p-4">
            <Text className="text-onSurface dark:text-[#E3F2FD] font-bold text-base mb-1" numberOfLines={2}>{item.title}</Text>
            <Text className="text-onSurfaceVariant dark:text-[#90CAF9] text-sm" numberOfLines={2}>{item.summary}</Text>
            <View className="flex-row items-center mt-3">
                          <MaterialIcons name="menu-book" size={14} color={isDarkMode ? "#90CAF9" : "#4F453D"} />
                          <Text className="text-onSurfaceVariant dark:text-[#90CAF9] text-xs ml-1">{tReadMore}</Text>
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
  const isDarkMode = useThemeMode();
  const { height: screenHeight } = useWindowDimensions();
  const scrollY = useRef(new Animated.Value(0)).current;
  const pillStickyThreshold = screenHeight * 0.75 - (insets.top + 60);
  const [showNotif, setShowNotif] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [popupData, setPopupData] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);

    // Translated strings
    const tSearch = useTranslatedText('Cari produk...');
    const tNotif = useTranslatedText('Notifikasi');
    const tNotifItem = useTranslatedText('Notifikasi');
    const tNotifBody = useTranslatedText('Pesanan Anda sedang diproses. Harap menunggu konfirmasi dari penjual.');
    const tTips = useTranslatedText('Tips: semua produk bergaransi resmi 1 tahun & bisa dikembalikan 7 hari. Gunakan filter untuk penawaran terbaik.');
    const tBrand = useTranslatedText('Brand');
    const tArticle = useTranslatedText('Artikel');
    const tReadMore = useTranslatedText('Baca selengkapnya');
    const tPopupTitle = useTranslatedText('Promo Spesial Minggu Ini');
    const tPopupBody = useTranslatedText('Gratis ongkir se-Indonesia + cashback hingga 5% untuk semua smartphone. Berlaku sampai akhir bulan — jangan sampai kehabisan!');
    const tProductName = useTranslatedText('Nama Produk');
    const tClose = useTranslatedText('Tutup');
    const tDetailInfo = useTranslatedText('Detail informasi akan ditampilkan di sini.');
    const tSearchHistory = useTranslatedText('Pencarian sebelumnya');
    const tLoadArticleFail = useTranslatedText('Gagal memuat artikel dari server');
    const tConnectFail = useTranslatedText('Gagal terhubung ke server API artikel');
    const tClickDetail = useTranslatedText('Klik untuk membaca detail artikel ini.');

    // Manfaat berbelanja (info chips)
    const benefits = [
      { icon: 'local-shipping', label: useTranslatedText('Gratis Ongkir') },
      { icon: 'verified', label: useTranslatedText('Garansi Resmi') },
      { icon: 'savings', label: useTranslatedText('Cashback 5%') },
      { icon: 'payments', label: useTranslatedText('Bisa COD') },
    ];

  // Buka halaman detail promo (seperti halaman artikel)
  const openPromo = (p) => {
    setCurrentPromo(p);
    router.push(`/promo/${p.id}`);
  };

  // --- STATE DATA ARTIKEL DARI DATABASE ENDPOINT ---
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [articlesError, setArticlesError] = useState(null);

  // MEMANGGIL ENDPOINT API ARTIKEL NEXT.JS
  useEffect(() => {
    // Tunda fetch sampai layar selesai animasi/interaksi pertama,
    // supaya render awal cepat dan aplikasi tidak terasa berat.
    const task = InteractionManager.runAfterInteractions(() => {
      fetchArticles();
    });
    return () => task.cancel();
  }, []);

  // --- STATE DATA IKLAN/PROMO DARI DATABASE ENDPOINT ---
  const [iklan, setIklan] = useState([]);
  const [iklanLoading, setIklanLoading] = useState(true);

  // MEMANGGIL ENDPOINT API IKLAN NEXT.JS (tabel iklan_random)
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      fetchIklan();
    });
    return () => task.cancel();
  }, []);

  const fetchIklan = async () => {
    try {
      setIklanLoading(true);
      const API_URL = getApiBaseUrl();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(`${API_URL}/api/iklan`, { signal: controller.signal });
      clearTimeout(timeout);
      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        // Kolom DB: id_iklan, gambar (sudah base64 data-URI dari API), title, text
        const mapped = data.map((item, idx) => ({
          id: item?.id_iklan ?? idx,
          title: item?.title ?? 'Promo',
          body: item?.text ?? '',
          image: item?.gambar ?? null,
        }));
        setIklan(mapped);
      }
    } catch (e) {
      // Gagal ambil iklan -> blok promo tidak dirender, aplikasi tetap jalan
    } finally {
      setIklanLoading(false);
    }
  };

  const fetchArticles = async () => {
    try {
      setArticlesLoading(true);
      // Host API otomatis mengikuti host dev server (WiFi / hotspot) — lihat lib/api.js
      const API_URL = getApiBaseUrl();
      // Timeout 10 detik: fetch yang menggantung tidak membekukan UI
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(`${API_URL}/api/artikel`, { signal: controller.signal });
      clearTimeout(timeout);
      const data = await response.json();

      if (response.ok) {
        // Mapping kolom dari tabel database ke properti yang dibutuhkan UI.
        // Dibuat kebal: data aneh (angka, null, response bukan array) ditangani
        // per item — tidak akan membuat aplikasi crash.
        const mappedArticles = (Array.isArray(data) ? data : []).map((item) => {
          try {
            const rawImage = item?.gambar_artikel || item?.gambar || item?.image;
            // Gambar yang sudah punya skema (http(s)://, data:, file:, content:)
            // dibiarkan apa adanya. Hanya path relatif ("/uploads/...") yang
            // disambung jadi URL absolut.
            const image =
              typeof rawImage === 'string' && rawImage.trim()
                ? /^(https?:\/\/|data:|file:|content:)/i.test(rawImage.trim())
                  ? rawImage.trim()
                  : `${API_URL}${rawImage.trim().startsWith('/') ? '' : '/'}${rawImage.trim()}`
                : null;

            return {
              id: item?.id_artikel || item?.id,
              title: item?.judul_artikel || item?.judul || item?.title,
              summary: item?.ringkasan_artikel || item?.ringkasan || item?.summary || tClickDetail,
              body: item?.isi_artikel || item?.konten || item?.isi || item?.body,
              image,
            };
          } catch {
            // Satu baris data bermasalah -> dilewati, bukan crash
            return {
              id: null,
              title: item?.judul_artikel || item?.judul || item?.title || 'Artikel',
              summary: '',
              body: '',
              image: null,
            };
          }
        });
        setArticles(mappedArticles);
      } else {
              setArticlesError(tLoadArticleFail);
            }
          } catch (err) {
            console.error('Error fetching articles:', err);
            setArticlesError(tConnectFail);
          } finally {
            setArticlesLoading(false);
          }
        };

  // Pop up iklan promo otomatis (sekali, 5 detik setelah halaman terbuka)
  useEffect(() => {
    const t = setTimeout(() => {
      setPopupData({
        image: 'https://i.pinimg.com/736x/25/7a/e3/257ae37b125853599f57cf8f0052653c.jpg',
        text: 'Promo Spesial Minggu Ini',
        body: 'Gratis ongkir se-Indonesia + cashback hingga 5% untuk semua smartphone. Berlaku sampai akhir bulan — jangan sampai kehabisan!',
      });
    }, 5000);
    return () => clearTimeout(t);
  }, []);

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
    <View className="flex-1 bg-surface dark:bg-[#0F172A] relative">

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
              outputRange: isDarkMode ? ['rgba(15,23,42,0)', 'rgba(15,23,42,0.97)'] : ['rgba(254,248,244,0)', 'rgba(254,248,244,0.97)'],
              extrapolate: 'clamp',
            }),
          },
        ]}
      >
        <View className="flex-1 flex-row items-center bg-surfaceContainerHigh dark:bg-[#1E293B] rounded-full h-[44px] px-4">
                  <MaterialIcons name="search" size={20} color={isDarkMode ? "#90CAF9" : "#4F453D"} />
                  <TouchableOpacity
                    className="flex-1 ml-2"
                    onPress={() => {
                      setShowSearchHistory(!showSearchHistory);
                      setShowNotif(false);
                    }}
                  >
                    <Text className="text-onSurfaceVariant dark:text-[#90CAF9] text-sm">{tSearch}</Text>
                  </TouchableOpacity>
          {showSearchHistory && (
            <TouchableOpacity onPress={() => setShowSearchHistory(false)}>
              <MaterialIcons name="close" size={18} color={isDarkMode ? "#90CAF9" : "#4F453D"} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          className="w-11 h-11 rounded-full bg-surfaceContainerHigh dark:bg-[#1E293B] items-center justify-center"
          onPress={() => {
            setShowNotif(!showNotif);
            setShowSearchHistory(false);
          }}
        >
          <MaterialIcons name="notifications" size={24} color={isDarkMode ? "#E3F2FD" : "#0D47A1"} />
        </TouchableOpacity>
      </Animated.View>

      {/* PILLS + TIPS ABSOLUTE - hanya muncul saat scroll sampai pill (nempel di bawah header) */}
      <Animated.View
        style={{
          position: 'absolute',
          top: insets.top + 60,
          left: 0,
          right: 0,
          zIndex: 40,
          opacity: scrollY.interpolate({
            inputRange: [pillStickyThreshold - 32, pillStickyThreshold],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
          transform: [
            {
              translateY: scrollY.interpolate({
                inputRange: [pillStickyThreshold - 32, pillStickyThreshold],
                outputRange: [-12, 0],
                extrapolate: 'clamp',
              }),
            },
          ],
        }}
      >
        <View className="bg-surface dark:bg-[#0F172A] px-4 py-4 border-b border-outlineVariant dark:border-[#1E293B]">
          <View className="flex-row flex-wrap justify-center gap-2 mb-3">
                      {benefits.map((b) => (
                        <View
                          key={b.label}
                          className="flex-row items-center bg-surfaceContainerLow dark:bg-[#1E293B] rounded-full px-3 py-2"
                        >
                          <MaterialIcons name={b.icon} size={16} color={isDarkMode ? '#90CAF9' : '#0D47A1'} />
                          <Text className="text-xs text-onSurface dark:text-[#E3F2FD] font-medium ml-1.5">{b.label}</Text>
                        </View>
                      ))}
                    </View>
                    <View className="w-full items-center">
                      <View className="bg-primaryContainer dark:bg-[#1E293B] rounded-[12px] px-4 py-2.5 flex-row items-center max-w-[90%]">
                        <MaterialIcons name="lightbulb" size={16} color={isDarkMode ? '#90CAF9' : '#0D47A1'} />
                        <Text className="flex-1 text-xs text-onSurface dark:text-[#E3F2FD] ml-2 leading-4 text-center">
                          {tTips}
                        </Text>
                      </View>
                    </View>
        </View>
      </Animated.View>

      {/* SEARCH HISTORY OVERLAY */}
      {showSearchHistory && (
              <View className="absolute left-4 right-4 bg-surfaceContainerHigh dark:bg-[#1E293B] rounded-[16px] shadow-md elevation-4 z-50 overflow-hidden"
                style={{ top: insets.top + 64 }}
              >
                {[1, 2, 3].map((i) => (
                  <View key={i} className="flex-row items-center p-4 border-b border-outlineVariant dark:border-[#334155]">
                    <View className="w-9 h-9 rounded-full bg-surfaceContainer dark:bg-[#1E293B] items-center justify-center mr-3">
                      <MaterialIcons name="schedule" size={20} color={isDarkMode ? "#90CAF9" : "#4F453D"} />
                    </View>
                    <Text className="flex-1 text-sm text-onSurface dark:text-[#E3F2FD]">{tSearchHistory} {i}</Text>
                    <TouchableOpacity>
                      <MaterialIcons name="close" size={18} color={isDarkMode ? "#90CAF9" : "#4F453D"} />
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
              className="bg-surface dark:bg-[#0F172A] mx-4 rounded-[24px] overflow-hidden elevation-4"
              style={{ marginTop: insets.top + 16 }}
            >
              <View className="flex-row items-center justify-between px-5 py-4 border-b border-outlineVariant dark:border-[#334155]">
                              <Text className="text-lg font-bold text-onSurface dark:text-[#E3F2FD]">{tNotif}</Text>
                              <TouchableOpacity
                                className="w-9 h-9 rounded-full bg-surfaceContainerHigh dark:bg-[#1E293B] items-center justify-center"
                                onPress={() => setShowNotif(false)}
                              >
                                <MaterialIcons name="close" size={20} color={isDarkMode ? "#E3F2FD" : "#1F1B18"} />
                              </TouchableOpacity>
                            </View>

                            <ScrollView style={{ maxHeight: 500 }} contentContainerStyle={{ padding: 16, gap: 8 }}>
                              {[1, 2, 3, 4, 5].map((i) => (
                                <TouchableOpacity
                                  key={i}
                                  className="flex-row items-center p-4 bg-surfaceContainerLow dark:bg-[#1E293B] rounded-[16px]"
                                >
                                  <View className="w-11 h-11 rounded-full bg-primaryContainer dark:bg-[#334155] items-center justify-center mr-4">
                                    <MaterialIcons name="notifications" size={22} color="#8B5000" />
                                  </View>
                                  <View className="flex-1">
                                    <Text className="text-sm font-bold text-onSurface dark:text-[#E3F2FD] mb-0.5">{tNotifItem} {i}</Text>
                                    <Text className="text-xs text-onSurfaceVariant dark:text-[#90CAF9]" numberOfLines={2}>{tNotifBody}</Text>
                                  </View>
                                  <Text className="text-xs text-onSurfaceVariant dark:text-[#90CAF9] ml-2">2j</Text>
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

                    {/* FLOW PILLS - posisi normal di bawah carousel, fade saat sampai header */}
                    <Animated.View
                      style={{
                        opacity: scrollY.interpolate({
                          inputRange: [pillStickyThreshold - 32, pillStickyThreshold],
                          outputRange: [1, 0],
                          extrapolate: 'clamp',
                        }),
                      }}
                    >
                      <View className="bg-surface dark:bg-[#0F172A] px-4 py-4 border-b border-outlineVariant dark:border-[#1E293B]">
                        <View className="flex-row flex-wrap justify-center gap-2 mb-3">
                                    {benefits.map((b) => (
                                      <View
                                        key={b.label}
                                        className="flex-row items-center bg-surfaceContainerLow dark:bg-[#1E293B] rounded-full px-3 py-2"
                                      >
                                        <MaterialIcons name={b.icon} size={16} color={isDarkMode ? '#90CAF9' : '#0D47A1'} />
                                        <Text className="text-xs text-onSurface dark:text-[#E3F2FD] font-medium ml-1.5">{b.label}</Text>
                                      </View>
                                    ))}
                                  </View>
                                  <View className="w-full items-center">
                                    <View className="bg-primaryContainer dark:bg-[#1E293B] rounded-[12px] px-4 py-2.5 flex-row items-center max-w-[90%]">
                                      <MaterialIcons name="lightbulb" size={16} color={isDarkMode ? '#90CAF9' : '#0D47A1'} />
                                      <Text className="flex-1 text-xs text-onSurface dark:text-[#E3F2FD] ml-2 leading-4 text-center">
                                        {tTips}
                                      </Text>
                                    </View>
                                  </View>
                      </View>
                    </Animated.View>

                    {/* VIDEO GRID */}
                    <VideoGrid onSelectVideo={(src) => setSelectedVideo(src)} />

        {iklanLoading ? (
          <View className="px-4 mb-10 flex-row gap-4 z-0 h-[210px]">
            <Skeleton className="flex-1 h-full rounded-[20px]" />
            <View className="flex-1 gap-4 h-full">
              <Skeleton className="flex-1 rounded-[20px]" />
              <Skeleton className="flex-1 rounded-[20px]" />
            </View>
          </View>
        ) : iklan.length > 0 ? (
          <View className="px-4 mb-10 flex-row gap-4 z-0">
            {iklan[0] ? (
              <TouchableOpacity
                className="flex-1 bg-surfaceContainerLow dark:bg-[#1E293B] rounded-[20px] overflow-hidden shadow-sm elevation-1"
                onPress={() => openPromo(iklan[0])}
              >
                <Image
                  source={{ uri: iklan[0].image }}
                  className="w-full flex-1 object-cover"
                />
                <View className="p-3">
                  <Text className="text-sm font-medium text-onSurface dark:text-[#E3F2FD]">
                    {iklan[0].title}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View className="flex-1" />
            )}

            <View className="flex-1 gap-4">
              {iklan[1] ? (
                <TouchableOpacity
                  className="bg-surfaceContainerLow dark:bg-[#1E293B] rounded-[20px] overflow-hidden shadow-sm elevation-1"
                  onPress={() => openPromo(iklan[1])}
                >
                  <Image
                    source={{ uri: iklan[1].image }}
                    className="w-full h-[80px] object-cover"
                  />
                  <View className="p-3">
                    <Text className="text-sm font-medium text-onSurface dark:text-[#E3F2FD]">
                      {iklan[1].title}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View className="flex-1 bg-surfaceContainerLow dark:bg-[#1E293B] rounded-[20px]" />
              )}

              {iklan[2] ? (
                <TouchableOpacity
                  className="bg-surfaceContainerLow dark:bg-[#1E293B] rounded-[20px] overflow-hidden shadow-sm elevation-1"
                  onPress={() => openPromo(iklan[2])}
                >
                  <Image
                    source={{ uri: iklan[2].image }}
                    className="w-full h-[80px] object-cover"
                  />
                  <View className="p-3">
                    <Text className="text-sm font-medium text-onSurface dark:text-[#E3F2FD]">
                      {iklan[2].title}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View className="flex-1 bg-surfaceContainerLow dark:bg-[#1E293B] rounded-[20px]" />
              )}
            </View>
          </View>
        ) : null}

        {/* HOME 3 CONTENT BRAND */}
                <View className="relative h-[120px] bg-surfaceContainerHigh dark:bg-[#1E293B] mb-12 justify-center z-0">
                  <Text className="text-base text-onSurface dark:text-[#E3F2FD] absolute top-3 left-4 font-bold">{tBrand}</Text>

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
                <Text className="text-xs font-semibold text-onSurface dark:text-[#E3F2FD] text-center">
                  {brand.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="px-4 items-end mb-4 z-0">
          <TouchableOpacity className="w-12 h-12 rounded-full bg-surface dark:bg-[#0F172A] border border-outlineVariant dark:border-[#334155] items-center justify-center">
            <MaterialIcons name="filter-list" size={20} color={isDarkMode ? "#90CAF9" : "#4F453D"} />
          </TouchableOpacity>
        </View>

        <View className="px-4 flex-row flex-wrap justify-between gap-y-4 mb-4 z-0">
          {[1, 2, 3, 4].map((i) => (
            <TouchableOpacity
              key={i}
              style={{ width: '48%' }}
              className="bg-surface dark:bg-[#0F172A] border border-outlineVariant dark:border-[#334155] rounded-[8px] overflow-hidden elevation-1 shadow-sm"
              onPress={() => router.push('/detail')}
            >
              <Image
                source={{ uri: 'https://i.pinimg.com/736x/ec/af/f5/ecaff525c3f4e996bb93563082a7bc67.jpg' }}
                className="w-full h-[160px] object-cover"
              />
              <View className="p-3">
                              <Text className="text-onSurface dark:text-[#E3F2FD] font-bold text-sm mb-1" numberOfLines={2}>{tProductName} {i}</Text>
                              <Text className="text-primary dark:text-[#90CAF9] font-bold text-sm">Rp 1.500.000</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ARTIKEL ACCORDION SLIDER (AMBIL DATA DARI ENDPOINT DB) */}
                <View className="mb-10 z-0">
                  <Text className="px-4 mb-3 text-onSurface dark:text-[#E3F2FD] font-bold text-base">{tArticle}</Text>
                  <ArticleSlider
                    articles={articles}
                    loading={articlesLoading}
                    error={articlesError}
                    onArticlePress={(a) => {
                      setCurrentArticle(a);
                      router.push(`/artikel/${a.id ?? 'x'}`);
                    }}
                  />
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
                  <View className="bg-surface dark:bg-[#0F172A] rounded-[20px] overflow-hidden w-full max-w-[400px]">
                    {popupData && (
                      <ImageWithFallback uri={popupData?.image} style={{ width: '100%', height: 220 }} />
                    )}
                    <ScrollView style={{ maxHeight: 280 }} contentContainerStyle={{ padding: 20 }}>
                      <Text className="text-xl font-bold text-onSurface dark:text-[#E3F2FD] mb-3">{tPopupTitle}</Text>
                      <Text className="text-sm text-onSurfaceVariant dark:text-[#90CAF9] leading-6">
                        {tPopupBody}
                      </Text>
                    </ScrollView>
                    <View className="px-5 pb-5">
                      <TouchableOpacity
                        className="bg-primary rounded-full py-3 items-center"
                        onPress={() => setPopupData(null)}
                      >
                        <Text className="text-white font-bold text-sm">{tClose}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Pressable>
              </Pressable>
            </Modal>
    </View>
  );
}