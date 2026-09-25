import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { TopAppBar } from '../../components/TopAppBar';
import { Button } from '../../components/Button';

export default function AddLaporan() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface">
      <TopAppBar 
        title="Add Laporan" 
        leftIcon="arrow-back" 
        onLeftPress={() => router.back()}
      />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Text className="text-onSurfaceVariant text-sm mb-4">Add Form Laporan (Placeholder)</Text>
        <Button title="Save" mode="filled" onPress={() => router.back()} />
      </ScrollView>
    </View>
  );
}
