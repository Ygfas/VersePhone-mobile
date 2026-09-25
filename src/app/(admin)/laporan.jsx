import React from 'react';
import { View, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { TopAppBar } from '../../components/TopAppBar';
import { Button } from '../../components/Button';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Laporan() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface">
      <TopAppBar 
        title="Admin" 
        leftIcon="notifications" 
        rightIcon="more-vert"
      />
      
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 80 }}>
        <View className="flex-row justify-between items-center z-10">
          <View className="flex-row items-center border border-outline rounded-lg h-10 px-3 bg-surface flex-1 mr-2">
            <MaterialIcons name="calendar-today" size={16} color="#4F453D" className="mr-2" />
            <TextInput placeholder="Start Date" className="flex-1 text-sm" editable={false} value="Today" />
          </View>
          <View className="flex-row items-center border border-outline rounded-lg h-10 px-3 bg-surface flex-1 mr-2">
            <MaterialIcons name="calendar-today" size={16} color="#4F453D" className="mr-2" />
            <TextInput placeholder="End Date" className="flex-1 text-sm" editable={false} value="Today" />
          </View>
          <View className="flex-row gap-1">
            <Button title="Apply" mode="filled" size="xs" />
            <Button title="Reset" mode="tonal" size="xs" />
          </View>
        </View>

        <View className="flex-row gap-4 h-[152px]">
          <View className="flex-1 bg-surfaceContainerHigh rounded-[10px]" />
          <View className="flex-1 bg-surfaceContainerHigh rounded-[10px]" />
          <View className="flex-1 bg-surfaceContainerHigh rounded-[10px]" />
        </View>

        <View className="h-[332px] bg-secondaryContainer rounded-[10px]" />
      </ScrollView>

      <View className="absolute bottom-4 right-4">
        {/* Split button simplified */}
        <View className="flex-row rounded-full overflow-hidden shadow-sm elevation-2 bg-primary items-center h-[40px]">
          <Button title="Print" icon="print" mode="filled" size="s" className="rounded-none bg-primary border-r border-onPrimary/20" />
          <Button icon="arrow-drop-down" mode="filled" size="s" className="rounded-none bg-primary w-10 px-0 items-center justify-center" />
        </View>
      </View>
    </View>
  );
}
