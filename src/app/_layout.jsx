import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Image, Animated, Dimensions } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { useColorScheme } from 'nativewind';
import { useThemeMode } from '../store/theme-store';
import * as SplashScreen from 'expo-splash-screen';
import '../global.css';

SplashScreen.preventAutoHideAsync();

function CustomSplash({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(progress, { toValue: 1, duration: 1500, useNativeDriver: false }),
        Animated.timing(progress, { toValue: 0, duration: 1500, useNativeDriver: false }),
      ])
    ).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 400, useNativeDriver: true }).start(onFinish);
    }, 3000);
  }, []);

  return (
    <Animated.View className="flex-1 items-center justify-center bg-[#f9f9f9]" style={{ opacity: fadeAnim }}>
      <Image 
        source={require('../../assets/images/logo-verse.png')} 
        style={{ width: 256, height: 256 }}
        resizeMode="contain"
      />
      <Text className="text-dark text-2xl font-bold mt-4">VERSEPHONE</Text>
      
      <View className="w-48 h-1 mt-8 bg-gray-100 rounded-full overflow-hidden">
        <Animated.View 
          className="h-full bg-blue-900"
          style={{
            width: '40%',
            transform: [{
              translateX: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 150]
              })
            }]
          }}
        />
      </View>
    </Animated.View>
  );
}

export default function RootLayout() {
  const isDark = useThemeMode();
  const { setColorScheme } = useColorScheme();
  const [appReady, setAppReady] = useState(false);
  const [splashFinished, setSplashFinished] = useState(false);

  useEffect(() => {
    setColorScheme(isDark ? 'dark' : 'light');
    const prepare = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setAppReady(true);
      await SplashScreen.hideAsync();
    };
    prepare();
  }, [isDark, setColorScheme]);

  if (!splashFinished) {
    return <CustomSplash onFinish={() => setSplashFinished(true)} />;
  }

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
              <Stack.Screen name="search" options={{ 
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
                            <Stack.Screen name="cart" options={{ 
                              animation: 'slide_from_right',
                              cardStyle: { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }
                            }} />
                            <Stack.Screen name="checkout" options={{ 
                              animation: 'slide_from_right',
                              cardStyle: { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }
                            }} />
                            <Stack.Screen name="alamat-pengiriman" options={{ 
                                            animation: 'slide_from_right',
                                            cardStyle: { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }
                                          }} />
                                          <Stack.Screen name="pilih-lokasi-peta" options={{ 
                                            animation: 'slide_from_right',
                                            cardStyle: { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }
                                          }} />
                          </Stack>
    </View>
  );
}
