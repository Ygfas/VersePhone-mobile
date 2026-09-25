import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { TopAppBar } from '../../components/TopAppBar';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TriggerContent() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface relative">
      <TopAppBar 
        title="Admin" 
        leftIcon="arrow-back" 
        onLeftPress={() => router.back()}
        rightIcon="more-vert"
      />
      
      <View className="absolute top-[80px] right-4 bg-secondaryContainer rounded-[5px] w-[224px] z-10 shadow-md elevation-4">
        <View className="p-4">
          <Text className="text-onSecondaryContainer font-bold mb-2">Options</Text>
          <Text className="text-onSecondaryContainer">Some specific options here</Text>
        </View>
      </View>
      
      <ScrollView contentContainerStyle={{ padding: 16, gap: 8, paddingTop: 40 }}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} className="flex-row items-center p-4 bg-surfaceContainerLow rounded-[10px] h-[72px]">
            <View className="w-10 h-10 rounded-full bg-primaryContainer items-center justify-center mr-4">
              <MaterialIcons name="schedule" size={24} color="#0D47A1" />
            </View>
            <View>
              <Text className="text-base text-onSurface font-medium">Histori Transaksi</Text>
              <Text className="text-sm text-onSurfaceVariant">Code transaksi</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
