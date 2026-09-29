import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { TopAppBar } from '../components/TopAppBar';
import { Button } from '../components/Button';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="flex-1 bg-surface">
      <TopAppBar
        title="Login"
        leftIcon="arrow-back"
        onLeftPress={() => router.back()}
      />

      <TouchableOpacity className="absolute top-[28px] right-4" onPress={() => router.push('/signup')}>
        <Text className="text-xl mt-7 text-primary font-medium">Sign Up</Text>
      </TouchableOpacity>

      <View className="p-4 mt-8 flex-1 items-center">
        {/* INPUT USERNAME */}
        <View className="w-full mb-6">
          <Text className="text-xl font-medium text-black m-2">Name atau Username</Text>
          <View className="flex-row items-center border border-outline rounded-full h-[56px] px-4 bg-surface">
            <MaterialIcons name="person" size={24} color="#4F453D" style={{ marginRight: 12 }} />
            <TextInput
              className="flex-1 text-base text-onSurface"
              placeholder="Masukkan Nama atau Username"
              placeholderTextColor="#79747E"
            />
          </View>
        </View>

        {/* INPUT PASSWORD */}
        <View className="w-full mb-4">
          <Text className="text-xl font-medium text-black m-2">Password</Text>
          <View className="flex-row items-center border border-outline rounded-full h-[56px] px-4 bg-surface">
            <MaterialIcons name="vpn-key" size={24} color="#4F453D" style={{ marginRight: 12 }} />
            <TextInput
              secureTextEntry={!showPassword}
              className="flex-1 text-base text-onSurface"
              placeholder="Masukkan Password"
              placeholderTextColor="#79747E"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={22}
                color="#4F453D"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* SARAN LOGIN */}
        <View className="w-full mb-4 px-2">
          <Text className="text-xs text-onSurfaceVariant">
            Gunakan akun terdaftar atau pastikan data Anda sudah benar sebelum masuk.
          </Text>
        </View>

        {/* TOMBOL LOGIN */}
        <Button
          title="Login"
          mode="filled"
          className="w-full mb-2"
          onPress={() => router.replace('/')}
        />

        <Text className="text-base text-onSurface mb-2">Or</Text>

        {/* TOMBOL GOOGLE DENGAN IKON FONTAWESOME BERWARNA */}
        <TouchableOpacity
          className="w-full flex-row items-center justify-center border border-outline rounded-full h-[48px] bg-surface"
          onPress={() => router.push('/overview')}
          activeOpacity={0.8}
        >
          <FontAwesome name="google" size={18} color="#EA4335" style={{ marginRight: 8 }} />
          <Text className="text-onSurface font-medium text-base">Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}