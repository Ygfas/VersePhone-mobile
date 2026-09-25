import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export const TopAppBar = ({ 
  title, 
  leftIcon, 
  onLeftPress,
  rightIcon,
  onRightPress,
  rightIcon2,
  onRightPress2,
  mode = 'small', // small, medium, large
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleLeftPress = onLeftPress || (() => router.back());

  const containerClass = `bg-surface px-4 flex-row items-center justify-between ${
    mode === 'small' ? 'h-[64px]' : mode === 'medium' ? 'h-[112px] items-start pt-4' : 'h-[152px] items-start pt-4'
  }`;

  return (
    <View className="bg-surface" style={{ paddingTop: insets.top }}>
      <View className={containerClass}>
        <View className="flex-row items-center">
          {leftIcon && (
            <TouchableOpacity onPress={handleLeftPress} className="w-12 h-12 items-center justify-center rounded-full mr-2">
              <MaterialIcons name={leftIcon} size={28} color="#0D47A1" />
            </TouchableOpacity>
          )}
          {mode === 'small' && title && (
            <Text className="text-xl font-medium text-onSurface">{title}</Text>
          )}
        </View>
        
        <View className="flex-row items-center">
          {rightIcon2 && (
            <TouchableOpacity onPress={onRightPress2} className="w-12 h-12 items-center justify-center rounded-full mr-2">
              <MaterialIcons name={rightIcon2} size={28} color="#0D47A1" />
            </TouchableOpacity>
          )}
          {rightIcon && (
            <TouchableOpacity onPress={onRightPress} className="w-12 h-12 items-center justify-center rounded-full">
              <MaterialIcons name={rightIcon} size={28} color="#0D47A1" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {mode !== 'small' && title && (
        <View className={`px-4 pb-4 ${mode === 'large' ? 'mt-auto' : ''}`}>
          <Text className={`${mode === 'large' ? 'text-4xl' : 'text-3xl'} font-normal text-onSurface`}>
            {title}
          </Text>
        </View>
      )}
    </View>
  );
};
