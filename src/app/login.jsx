import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { TopAppBar } from '../components/TopAppBar';
import { Button } from '../components/Button';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Login() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface">
      <TopAppBar 
        title="Login" 
        leftIcon="arrow-back" 
        onLeftPress={() => router.back()}
      />
      
      <TouchableOpacity className="absolute top-[28px] right-4" onPress={() => router.push('/signup')}>
        <Text className="text-xs text-primary font-medium">Sign Up</Text>
      </TouchableOpacity>
      
      <View className="p-4 mt-8 flex-1 items-center">
        <View className="w-full mb-6">
          <View className="flex-row items-center border border-outline rounded-[16px] h-[56px] px-4 bg-surface">
            <MaterialIcons name="person" size={24} color="#4F453D" className="mr-3" />
            <TextInput 
              placeholder="Email or Username" 
              placeholderTextColor="#4F453D"
              className="flex-1 text-base text-onSurface"
            />
          </View>
        </View>

        <View className="w-full mb-8">
          <View className="flex-row items-center border border-outline rounded-[16px] h-[56px] px-4 bg-surface">
            <MaterialIcons name="vpn-key" size={24} color="#4F453D" className="mr-3" />
            <TextInput 
              placeholder="Password" 
              placeholderTextColor="#4F453D"
              secureTextEntry
              className="flex-1 text-base text-onSurface"
            />
          </View>
        </View>

        <Button 
          title="Login" 
          icon="login" 
          mode="filled" 
          className="w-full mb-6" 
          onPress={() => router.replace('/')}
        />

        <Text className="text-base text-onSurface mb-6">Or</Text>

        <Button 
          title="Google" 
          mode="outlined" 
          className="w-full" 
          onPress={() => router.push('/overview')}
        />
      </View>
    </View>
  );
}
