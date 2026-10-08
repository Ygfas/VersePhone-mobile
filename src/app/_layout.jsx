import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useEffect } from 'react';
import { useColorScheme } from 'nativewind';
import { useThemeMode } from '../store/theme-store';
import '../global.css';

export default function RootLayout() {
  const isDark = useThemeMode();
  const { setColorScheme } = useColorScheme();
  useEffect(() => { setColorScheme(isDark ? 'dark' : 'light'); }, [isDark, setColorScheme]);
  return (
    <View className={isDark ? 'dark flex-1' : 'flex-1'} style={{ flex: 1 }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ 
              headerShown: false, 
              animation: 'slide_from_right',
              cardStyle: { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }
            }}>
              <Stack.Screen name="(tabs)" options={{ cardStyle: { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' } }} />
                          <Stack.Screen name="(admin)" options={{ cardStyle: { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' } }} />
              <Stack.Screen name="loading" options={{ animation: 'fade' }} />
              <Stack.Screen name="detail" options={{ 
                animation: 'slide_from_right',
                cardStyle: { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }
              }} />
              <Stack.Screen name="liked-trigger" options={{ animation: 'fade' }} />
              <Stack.Screen name="login" options={{ 
                animation: 'slide_from_right',
                cardStyle: { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }
              }} />
              <Stack.Screen name="signup" options={{ 
                animation: 'slide_from_right',
                cardStyle: { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }
              }} />
              <Stack.Screen name="more-sign" options={{ 
                animation: 'slide_from_right',
                cardStyle: { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }
              }} />
              <Stack.Screen name="payment" options={{ 
                animation: 'slide_from_right',
                cardStyle: { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }
              }} />
            </Stack>
    </View>
  );
}
