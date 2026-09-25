import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { IconButton, Button } from '../components/Button';
import { Card } from '../components/Card';

export default function Detail() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface pt-12">
      {/* Top App Bar equivalent */}
      <View className="flex-row items-center px-4 mb-4">
        <IconButton icon="arrow-back" size="m" onPress={() => router.back()} className="mr-2" />
        <View className="flex-1 items-end">
          <IconButton icon="share" size="s" />
        </View>
      </View>
      
      <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }}>
        <Card
          mode="filled"
          imagePosition="leading"
          imageUri="https://i.pinimg.com/736x/ec/af/f5/ecaff525c3f4e996bb93563082a7bc67.jpg"
          headline="Product name"
          body="Detail"
          className="h-[244px] rounded-[10px]"
        >
          <View className="absolute top-4 right-4">
            <IconButton icon="bookmark" mode="outlined" size="s" />
          </View>
          <View className="absolute bottom-4 right-4 w-[108px]">
            <Button title="Buy" icon="shopping-cart" mode="filled" size="s" />
          </View>
        </Card>

        <View className="bg-surfaceContainerHigh rounded-[28px] h-[500px] p-6">
          <Text className="text-base text-onSurface font-medium">Detail Spek</Text>
        </View>
      </ScrollView>
    </View>
  );
}
