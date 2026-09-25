import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export default function Loading() {
  return (
    <View className="flex-1 bg-surface items-center justify-center">
      <View className="w-[182px] h-[180px] bg-primary rounded-[28px] items-center justify-center p-4 shadow-sm elevation-1">
        <ActivityIndicator size="large" color="#FFFFFF" className="mb-4" />
        <Text className="text-white text-[28px] font-normal">Loading..</Text>
      </View>
    </View>
  );
}
