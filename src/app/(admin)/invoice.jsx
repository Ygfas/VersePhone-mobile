import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { TopAppBar } from '../../components/TopAppBar';
import { SearchBar } from '../../components/SearchBar';

export default function Invoice() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface">
      <TopAppBar 
        title="Admin" 
        leftIcon="notifications" 
        rightIcon="more-vert"
      />
      
      <View className="px-4 py-2">
        <SearchBar 
          placeholder="Search invoices..." 
          trailingIcon="sync"
          mode="outlined"
        />
      </View>
      
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View className="h-[332px] bg-surfaceContainerHigh rounded-[10px]" />
        <View className="h-[60px] bg-surfaceContainerHigh rounded-[10px]" />
      </ScrollView>
    </View>
  );
}
