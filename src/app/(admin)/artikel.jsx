import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { TopAppBar } from '../../components/TopAppBar';
import { SearchBar } from '../../components/SearchBar';
import { Card } from '../../components/Card';
import { Button, IconButton } from '../../components/Button';

export default function Artikel() {
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
          placeholder="Search articles..." 
          trailingIcon="sync"
          mode="outlined"
        />
      </View>
      
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 80 }}>
        {[1, 2, 3, 4].map((i) => (
          <Card
            key={i}
            mode="filled"
            imagePosition="leading"
            imageUri="https://i.pinimg.com/736x/8e/64/86/8e64864296f850ef00e8f1892b2be773.jpg"
            headline="Artikel"
            body="Content"
            className="h-[96px]"
          >
            <View className="absolute right-4 top-0 bottom-0 justify-center flex-row items-center gap-2">
              <Button title="Edit" mode="tonal" size="xs" onPress={() => router.push('/(admin)/add-artikel')} />
              <Button title="Del" mode="tonal" size="xs" />
            </View>
          </Card>
        ))}
      </ScrollView>

      <View className="absolute bottom-4 right-4">
        <IconButton 
          icon="add" 
          mode="tonal" 
          size="m" 
          className="w-14 h-14 rounded-[16px] shadow-sm elevation-2"
          onPress={() => router.push('/(admin)/add-artikel')}
        />
      </View>
    </View>
  );
}
