import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useThemeMode } from '../store/theme-store';

export const SearchBar = ({
  placeholder = '',
  value,
  onChangeText,
  onSearchPress,
  onTrailingPress,
  trailingIcon = 'close',
  mode = 'outlined', // outlined, filled
  className = ''
}) => {
  const isDark = useThemeMode();
  const searchCol = isDark ? '#90CAF9' : '#0D47A1';
  const trailCol = isDark ? '#9CA3AF' : '#4F453D';
  let containerStyle = 'flex-row items-center h-[56px] px-4 rounded-full ';
  
  if (mode === 'outlined') {
    containerStyle += 'border border-outline dark:border-[#334155] bg-surface dark:bg-[#0F172A]';
  } else {
    containerStyle += 'bg-surfaceContainerHigh dark:bg-[#1E293B]';
  }

  return (
    <View className={`${containerStyle} ${className}`}>
      <TouchableOpacity onPress={onSearchPress} className="mr-3">
        <MaterialIcons name="search" size={24} color={searchCol} />
      </TouchableOpacity>
      
      <TextInput
        className="flex-1 text-base text-onSurface dark:text-[#E3F2FD]"
        placeholder={placeholder}
        placeholderTextColor="#4F453D"
        value={value}
        onChangeText={onChangeText}
      />
      
      {trailingIcon && (
        <TouchableOpacity onPress={onTrailingPress} className="ml-3">
          <MaterialIcons name={trailingIcon} size={24} color={trailCol} />
        </TouchableOpacity>
      )}
    </View>
  );
};
