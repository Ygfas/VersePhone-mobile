import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TopAppBar } from '../../components/TopAppBar';
import ImageWithFallback from '../../components/ImageWithFallback';
import { useCurrentArticle } from '../../store/article-view';
import { T } from '../../store/language-store';

// Halaman khusus Detail Artikel (dibuka dari: kartu artikel di Home)
export default function ArticlePage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const article = useCurrentArticle();

  if (!article) {
    return (
      <View className="flex-1 bg-surface dark:bg-[#0F172A]">
        <TopAppBar title="Artikel" leftIcon="arrow-back" onLeftPress={() => router.back()} />
        <View className="flex-1 items-center justify-center p-6">
          <MaterialIcons name="article" size={48} color="#90CAF9" />
          <Text className="text-sm text-onSurfaceVariant dark:text-[#90CAF9] dark:text-[#E3F2FD] mt-3 text-center">
            <T>Artikel tidak ditemukan. Kembali ke beranda untuk memilih artikel.</T>
          </Text>
        </View>
      </View>
    );
  }

  const safeBody =
    typeof article.body === 'string' && article.body.trim()
      ? article.body
      : 'Detail artikel belum tersedia.';

  return (
    <View className="flex-1 bg-surface dark:bg-[#0F172A]">
      <TopAppBar title="Artikel" leftIcon="arrow-back" onLeftPress={() => router.back()} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Gambar besar artikel (expo-image, aman untuk data URI base64) */}
        <ImageWithFallback uri={article.image} style={{ width: '100%', height: 240 }} />

        <View className="px-4 pt-5">
          <Text className="text-2xl font-bold text-onSurface dark:text-[#E3F2FD] leading-8">{article.title}</Text>

          {article.summary ? (
            <Text className="text-sm text-onSurfaceVariant dark:text-[#90CAF9] dark:text-[#E3F2FD] mt-3 leading-5">
              {article.summary}
            </Text>
          ) : null}

          <View className="h-px bg-outlineVariant my-5" />

          <Text className="text-[15px] text-onSurface dark:text-[#E3F2FD] leading-7">{safeBody}</Text>
        </View>
      </ScrollView>
    </View>
  );
}