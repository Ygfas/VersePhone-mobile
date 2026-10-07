import { Tabs } from 'expo-router';
import { NavigationBar } from '../../components/NavigationBar';
import { View } from 'react-native';
import { useThemeMode } from '../../store/theme-store';

export default function TabLayout() {
  const isDark = useThemeMode();
  return (
    <View className={isDark ? 'dark flex-1' : 'flex-1'} style={{ flex: 1, backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }}>
      <Tabs
        tabBar={() => <NavigationBar isAdmin={false} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="wishlist" />
        <Tabs.Screen name="history" />
        <Tabs.Screen name="more" />
      </Tabs>
    </View>
  );
}
