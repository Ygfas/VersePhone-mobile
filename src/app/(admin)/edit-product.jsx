import React from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { TopAppBar } from '../../components/TopAppBar';
import { Button } from '../../components/Button';

export default function EditProduct() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface">
      <TopAppBar 
        title="Edit Product" 
        leftIcon="arrow-back" 
        onLeftPress={() => router.back()}
      />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Text className="text-onSurfaceVariant text-sm mb-4">Edit Form Product (Placeholder)</Text>
        
        <View className="border border-outline rounded-[16px] h-[56px] px-4 bg-surface justify-center mb-4">
          <TextInput placeholder="Product Name" value="Example Product" placeholderTextColor="#4F453D" className="text-base text-onSurface" />
        </View>

        <Button title="Save Changes" mode="filled" onPress={() => router.back()} />
      </ScrollView>
    </View>
  );
}
