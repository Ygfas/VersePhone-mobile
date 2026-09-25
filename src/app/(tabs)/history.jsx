import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { TopAppBar } from '../../components/TopAppBar';
import { Card } from '../../components/Card';

export default function History() {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Pending', 'Success'];

  return (
    <View className="flex-1 bg-surface">
      <TopAppBar title="History" />
      
      <View className="flex-row h-[48px] border-b border-outlineVariant">
        {tabs.map((tab) => (
          <TouchableOpacity 
            key={tab}
            onPress={() => setActiveTab(tab)}
            className="flex-1 items-center justify-center relative"
          >
            <Text className={`text-sm font-medium ${activeTab === tab ? 'text-primary' : 'text-onSurfaceVariant'}`}>
              {tab}
            </Text>
            {activeTab === tab && (
              <View className="absolute bottom-0 w-16 h-[3px] bg-primary rounded-t-full" />
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Card
          headline="Card headline"
          body="Supporting text goes here."
          className="h-[140px]"
        />
        <Card
          headline="Card headline"
          body="Supporting text goes here."
          className="h-[140px]"
        />
        <Card
          headline="Card headline"
          body="Supporting text goes here."
          className="h-[140px]"
        />
      </ScrollView>
    </View>
  );
}
