import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { IconButton, Button } from '../components/Button';
import { Card } from '../components/Card';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { T } from '../store/language-store';

export default function LikedTrigger() {
  const router = useRouter();
  const [showSnackbar, setShowSnackbar] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSnackbar(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-surface dark:bg-[#0F172A] pt-12 relative">
      <View className="flex-row items-center px-4 mb-4">
        <IconButton icon="arrow-back" mode="tonal" size="m" onPress={() => router.back()} className="mr-2" />
        <View className="flex-1 items-end">
          <IconButton icon="share" mode="tonal" size="s" />
        </View>
      </View>
      
      <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }}>
        <Card
          mode="filled"
          imagePosition="leading"
          imageUri="https://i.pinimg.com/736x/ec/af/f5/ecaff525c3f4e996bb93563082a7bc67.jpg"
          headline="Nama Produk"
          body="Detail"
          className="h-[244px] rounded-[10px]"
        >
          <View className="absolute top-4 right-4">
            <IconButton icon="bookmark" mode="outlined" size="s" />
          </View>
          <View className="absolute bottom-4 right-4 w-[108px]">
            <Button title="Beli" icon="shopping-cart" mode="filled" size="s" />
          </View>
        </Card>

        <View className="bg-surfaceContainerHigh dark:bg-[#1E293B] rounded-[28px] h-[500px] p-6 relative">
          <Text className="text-base text-onSurface dark:text-[#E3F2FD] font-medium"><T>Detail Spek</T></Text>
          
          {showSnackbar && (
            <View className="absolute bottom-4 left-4 right-4 bg-inverseSurface h-12 rounded-lg flex-row items-center justify-between px-4">
              <Text className="text-inverseOnSurface text-sm"><T>Tersimpan</T></Text>
              <Button title="Batal" mode="outlined" size="xs" onPress={() => setShowSnackbar(false)} className="border-0" />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
