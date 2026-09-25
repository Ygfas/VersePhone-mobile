import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { IconButton } from '../components/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Payment() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-2">
        <IconButton 
          icon="arrow-back" 
          mode="tonal" 
          size="m" 
          onPress={() => router.back()} 
          className="self-start" 
        />
      </View>
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-xl text-onSurface font-medium">Payment Information</Text>
      </View>
    </View>
  );
}
