import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

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
  let containerStyle = 'flex-row items-center h-[56px] px-4 rounded-full ';
  
  if (mode === 'outlined') {
    containerStyle += 'border border-outline bg-surface';
  } else {
    containerStyle += 'bg-surfaceContainerHigh';
  }

  return (
    <View className={`${containerStyle} ${className}`}>
      <TouchableOpacity onPress={onSearchPress} className="mr-3">
        <MaterialIcons name="search" size={24} color="#0D47A1" />
      </TouchableOpacity>
      
      <TextInput
        className="flex-1 text-base text-onSurface"
        placeholder={placeholder}
        placeholderTextColor="#4F453D"
        value={value}
        onChangeText={onChangeText}
      />
      
      {trailingIcon && (
        <TouchableOpacity onPress={onTrailingPress} className="ml-3">
          <MaterialIcons name={trailingIcon} size={24} color="#4F453D" />
        </TouchableOpacity>
      )}
    </View>
  );
};
