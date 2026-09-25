import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { TopAppBar } from '../../components/TopAppBar';

export default function Overview() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface">
      <TopAppBar 
        title="Admin" 
        leftIcon="notifications" 
        onLeftPress={() => router.push('/(admin)/trigger-content')}
        rightIcon="more-vert"
        onRightPress={() => router.push('/(admin)/trigger-content')}
      />
      
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 24 }}>
        <View className="flex-row gap-4 h-[128px]">
          <View className="flex-1 bg-secondaryContainer rounded-[10px]" />
          <View className="flex-1 bg-secondaryContainer rounded-[10px]" />
        </View>

        <View className="flex-row gap-4 h-[128px]">
          <View className="flex-1 bg-secondaryContainer rounded-[10px]" />
          <View className="flex-1 bg-secondaryContainer rounded-[10px]" />
        </View>

        <View className="h-[220px] bg-surfaceContainerHigh rounded-[28px]" />
        
        <View className="h-[188px] bg-tertiaryContainer rounded-[28px]" />
      </ScrollView>
    </View>
  );
}
