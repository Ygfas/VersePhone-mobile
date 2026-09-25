import { Tabs } from 'expo-router';
import { NavigationBar } from '../../components/NavigationBar';

export default function TabLayout() {
  return (
    <Tabs 
      tabBar={() => <NavigationBar isAdmin={false} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="wishlist" />
      <Tabs.Screen name="history" />
      <Tabs.Screen name="more" />
    </Tabs>
  );
}
