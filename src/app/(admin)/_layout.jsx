import { Tabs } from 'expo-router';
import { NavigationBar } from '../../components/NavigationBar';

export default function AdminLayout() {
  return (
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
  );
}
