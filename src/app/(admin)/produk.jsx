import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { TopAppBar } from '../../components/TopAppBar';
import { SearchBar } from '../../components/SearchBar';
import { Card } from '../../components/Card';
import { Button, IconButton } from '../../components/Button';

export default function Produk() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface relative">
      <TopAppBar 
        title="Admin" 
        leftIcon="notifications" 
        rightIcon="more-vert"
      />
      
      <View className="px-4 py-2">
        <SearchBar 
          placeholder="Search products..." 
          trailingIcon="sync"
          mode="outlined"
        />
      </View>
      
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 80 }}>
        <View className="flex-row gap-4 justify-between">
          <View className="flex-1 h-[272px]">
            <Card
              headline="Card headline"
              body="Supporting text goes here."
              imageUri="https://i.pinimg.com/736x/25/7a/e3/257ae37b125853599f57cf8f0052653c.jpg"
              className="h-full rounded-[10px]"
            >
              <View className="absolute bottom-2 right-2 flex-row gap-2">
                <Button title="Edit" mode="tonal" size="xs" onPress={() => router.push('/(admin)/edit-product')} />
                <Button title="Del" mode="tonal" size="xs" />
              </View>
            </Card>
          </View>
          <View className="flex-1 h-[272px]">
            <Card
              headline="Card headline"
              body="Supporting text goes here."
              imageUri="https://i.pinimg.com/736x/25/7a/e3/257ae37b125853599f57cf8f0052653c.jpg"
              className="h-full rounded-[10px]"
            >
              <View className="absolute bottom-2 right-2 flex-row gap-2">
                <Button title="Edit" mode="tonal" size="xs" onPress={() => router.push('/(admin)/edit-product')} />
                <Button title="Del" mode="tonal" size="xs" />
              </View>
            </Card>
          </View>
        </View>

        <View className="flex-row gap-4 justify-between">
          <View className="flex-1 h-[272px]">
            <Card
              headline="Card headline"
              body="Supporting text goes here."
              imageUri="https://i.pinimg.com/736x/25/7a/e3/257ae37b125853599f57cf8f0052653c.jpg"
              className="h-full rounded-[10px]"
            >
              <View className="absolute bottom-2 right-2 flex-row gap-2">
                <Button title="Edit" mode="tonal" size="xs" onPress={() => router.push('/(admin)/edit-product')} />
                <Button title="Del" mode="tonal" size="xs" />
              </View>
            </Card>
          </View>
          <View className="flex-1 h-[272px]">
            <Card
              headline="Card headline"
              body="Supporting text goes here."
              imageUri="https://i.pinimg.com/736x/25/7a/e3/257ae37b125853599f57cf8f0052653c.jpg"
              className="h-full rounded-[10px]"
            >
              <View className="absolute bottom-2 right-2 flex-row gap-2">
                <Button title="Edit" mode="tonal" size="xs" onPress={() => router.push('/(admin)/edit-product')} />
                <Button title="Del" mode="tonal" size="xs" />
              </View>
            </Card>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-4 right-4">
        <IconButton 
          icon="add" 
          mode="tonal" 
          size="m" 
          className="w-14 h-14 rounded-[16px] shadow-sm elevation-2"
          onPress={() => router.push('/(admin)/add-product')}
        />
      </View>
    </View>
  );
}
