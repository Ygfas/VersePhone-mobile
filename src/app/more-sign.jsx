import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { TopAppBar } from '../components/TopAppBar';
import { Button, IconButton } from '../components/Button';
import { NavigationBar } from '../components/NavigationBar';

export default function MoreSign() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <View className="flex-1 bg-surface">
      <TopAppBar title="Account" />
      
      <View className="p-4 flex-1">
        <View className="flex-row items-center mb-2">
          <IconButton icon="account-circle" mode="outlined" size="l" className="w-[64px] h-[64px] mr-4" />
          <Text className="text-[28px] text-onSurface font-normal flex-1">Username</Text>
          <Button title="Logout" icon="exit-to-app" mode="filled" size="xs" onPress={() => router.replace('/login')} className="w-[88px] h-[32px] rounded-[16px]" />
        </View>
        <Text className="text-base text-onSurface text-center">email addres</Text>
      </View>

      <View className="absolute bottom-[96px] right-4">
        {/* FAB toggle */}
        <IconButton 
          icon={isDarkMode ? 'dark-mode' : 'wb-sunny'} 
          mode={isDarkMode ? 'filled' : 'tonal'} 
          size="m" 
          onPress={() => setIsDarkMode(!isDarkMode)} 
          className="w-10 h-10 rounded-[12px]"
        />
      </View>

      <NavigationBar isAdmin={false} />
    </View>
  );
}
