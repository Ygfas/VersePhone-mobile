import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { TopAppBar } from '../components/TopAppBar';
import { Button } from '../components/Button';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function SignUp() {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  return (
    <View className="flex-1 bg-surface">
      <TopAppBar 
        title="Sign Up" 
        leftIcon="arrow-back" 
        onLeftPress={() => router.back()}
      />
      
      <TouchableOpacity className="absolute top-[28px] right-4" onPress={() => router.push('/login')}>
        <Text className="text-xs text-primary font-medium">Login</Text>
      </TouchableOpacity>
      
      <View className="p-4 mt-8 flex-1 items-center">
        <View className="w-full mb-4">
          <View className="flex-row items-center border border-outline rounded-[16px] h-[56px] px-4 bg-surface">
            <MaterialIcons name="person" size={24} color="#4F453D" className="mr-3" />
            <TextInput 
              placeholder="Name of Username" 
              placeholderTextColor="#4F453D"
              className="flex-1 text-base text-onSurface"
            />
          </View>
        </View>

        <View className="w-full mb-4">
          <View className="flex-row items-center border border-outline rounded-[16px] h-[56px] px-4 bg-surface">
            <MaterialIcons name="numbers" size={24} color="#4F453D" className="mr-3" />
            <TextInput 
              placeholder="Nomor seluler" 
              placeholderTextColor="#4F453D"
              className="flex-1 text-base text-onSurface"
            />
          </View>
        </View>

        <View className="w-full mb-4">
          <View className="flex-row items-center border border-outline rounded-[16px] h-[56px] px-4 bg-surface">
            <MaterialIcons name="mail" size={24} color="#4F453D" className="mr-3" />
            <TextInput 
              placeholder="Email" 
              placeholderTextColor="#4F453D"
              className="flex-1 text-base text-onSurface"
            />
          </View>
        </View>

        <View className="w-full mb-4">
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

        <View className="w-full mb-6 flex-row items-center">
          <TouchableOpacity 
            onPress={() => setIsChecked(!isChecked)}
            className={`w-[18px] h-[18px] border-2 rounded-[2px] items-center justify-center mr-2 ${isChecked ? 'bg-primary border-primary' : 'border-onSurfaceVariant'}`}
          >
            {isChecked && <MaterialIcons name="check" size={14} color="#FFFFFF" />}
          </TouchableOpacity>
          <Text className="text-base text-onSurface">I agree</Text>
        </View>

        <Button 
          title="Sign Up" 
          icon="login" 
          mode="filled" 
          className="w-full mb-6" 
          onPress={() => router.push('/login')}
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
