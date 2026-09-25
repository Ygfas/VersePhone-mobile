import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { TopAppBar } from '../../components/TopAppBar';
import { Button, IconButton } from '../../components/Button';

export default function More() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <View className="flex-1 bg-surface">
      <TopAppBar title="Account" />
      
      <View className="p-4 items-center">
        {/* Connected button group style for Login / Sign Up */}
        <View className="flex-row mt-4">
          <View className="mr-[3px]">
            <Button 
              title="Login" 
              mode="filled" 
              onPress={() => router.push('/login')} 
              className="rounded-r-lg" // M3 connected group inner corner
            />
          </View>
          <View>
            <Button 
              title="Sign Up" 
              mode="outlined" 
              onPress={() => router.push('/signup')} 
              className="rounded-l-lg" // M3 connected group inner corner
            />
          </View>
        </View>
      </View>

      <View className="absolute bottom-[96px] right-4">
        {/* FAB toggle */}
        <IconButton 
          icon={isDarkMode ? 'dark-mode' : 'wb-sunny'} 
          mode={isDarkMode ? 'filled' : 'tonal'} 
          size="m" 
          onPress={() => setIsDarkMode(!isDarkMode)} 
          className="w-10 h-10 rounded-[12px]" // Small FAB
        />
      </View>
    </View>
  );
}
