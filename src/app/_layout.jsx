import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../global.css';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(admin)" />
        <Stack.Screen name="loading" options={{ animation: 'fade' }} />
        <Stack.Screen name="detail" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="liked-trigger" options={{ animation: 'fade' }} />
        <Stack.Screen name="login" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="signup" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="more-sign" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="payment" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </>
  );
}
