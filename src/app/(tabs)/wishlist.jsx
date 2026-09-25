import React from 'react';
import { View, ScrollView } from 'react-native';
import { TopAppBar } from '../../components/TopAppBar';
import { Card } from '../../components/Card';
import { IconButton } from '../../components/Button';

export default function Wishlist() {
  return (
    <View className="flex-1 bg-surface">
      <TopAppBar title="Wishlist" />
      
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Card
          mode="filled"
          imagePosition="leading"
          imageUri="https://i.pinimg.com/736x/ec/af/f5/ecaff525c3f4e996bb93563082a7bc67.jpg"
          headline="product 1"
          body="detail minimaze"
          className="h-[168px]"
        >
          <View className="absolute bottom-4 right-4">
            <IconButton icon="bookmark" mode="filled" size="s" />
          </View>
        </Card>

        <Card
          mode="filled"
          imagePosition="leading"
          imageUri="https://i.pinimg.com/736x/ec/af/f5/ecaff525c3f4e996bb93563082a7bc67.jpg"
          headline="product 2"
          body="detail minimaze"
          className="h-[168px]"
        >
          <View className="absolute bottom-4 right-4">
            <IconButton icon="bookmark" mode="filled" size="s" />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}
