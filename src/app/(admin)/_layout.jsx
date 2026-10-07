import { Tabs } from 'expo-router';
import { NavigationBar } from '../../components/NavigationBar';
import { View } from 'react-native';
import { useThemeMode } from '../../store/theme-store';

export default function AdminLayout() {
  const isDark = useThemeMode();
  return (
    <View className={isDark ? 'dark flex-1' : 'flex-1'} style={{ flex: 1, backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }}>
      <Tabs
        tabBar={() => <NavigationBar isAdmin={true} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="overview" />
        <Tabs.Screen name="invoice" />
        <Tabs.Screen name="produk" />
        <Tabs.Screen name="artikel" />
        <Tabs.Screen name="laporan" />
      </Tabs>
    </View>
  );
}
