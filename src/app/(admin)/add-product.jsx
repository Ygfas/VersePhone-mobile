import React from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { TopAppBar } from '../../components/TopAppBar';
import { Button } from '../../components/Button';

export default function AddProduct() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface">
      <TopAppBar 
        title="Add Product" 
        leftIcon="arrow-back" 
        onLeftPress={() => router.back()}
      />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Text className="text-onSurfaceVariant text-sm mb-4">Add Form Product (Placeholder)</Text>
        
        <View className="border border-outline rounded-[16px] h-[56px] px-4 bg-surface justify-center mb-4">
          <TextInput placeholder="Product Name" placeholderTextColor="#4F453D" className="text-base text-onSurface" />
        </View>

        <View className="border border-outline rounded-[16px] h-[56px] px-4 bg-surface justify-center mb-4">
          <TextInput placeholder="Price" placeholderTextColor="#4F453D" className="text-base text-onSurface" keyboardType="numeric" />
        </View>

        <Button title="Save" mode="filled" onPress={() => router.back()} />
      </ScrollView>
    </View>
  );
}
