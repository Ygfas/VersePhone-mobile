import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Card } from './Card';

export const Carousel = ({ 
  data = [], 
  mode = 'multi-browse', // multi-browse, uncontained, hero
  onCardPress 
}) => {
  // Determine card width based on mode
  const getCardWidth = (index) => {
    if (mode === 'uncontained') return 180;
    if (mode === 'hero') return index === 0 ? 300 : 180;
    // multi-browse default
    return index === 0 ? 240 : 160;
  };

  const getCardHeight = () => {
    if (mode === 'hero') return 240;
    if (mode === 'uncontained') return 220;
    return 200; // multi-browse
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingVertical: 8 }}
    >
      {data.map((item, index) => (
        <View key={item.id || index} style={{ width: getCardWidth(index), height: getCardHeight() }}>
          <Card
            headline={item.title}
            imageUri={item.image}
            imagePosition="background"
            onPress={() => onCardPress && onCardPress(item)}
            className="flex-1"
          />
        </View>
      ))}
    </ScrollView>
  );
};
