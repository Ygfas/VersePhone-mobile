import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export const Card = ({
  headline,
  body,
  imageUri,
  mode = 'filled', // filled, elevated, outlined
  onPress,
  className = '',
  imagePosition = 'top', // top, leading, background
  children
}) => {
  let baseStyle = 'rounded-[20px] overflow-hidden';
  if (mode === 'filled') {
    baseStyle += ' bg-surfaceContainerHighest dark:bg-[#334155]';
  } else if (mode === 'elevated') {
    baseStyle += ' bg-surfaceContainerLow dark:bg-[#1E293B] shadow-sm elevation-1';
  } else if (mode === 'outlined') {
    baseStyle += ' border border-outlineVariant dark:border-[#334155] bg-surface dark:bg-[#0F172A]';
  }

  const renderContent = () => {
    if (imagePosition === 'background') {
      return (
        <View className="flex-1 relative">
          <Image source={{ uri: imageUri }} className="absolute inset-0 w-full h-full object-cover" />
          <View className="absolute inset-0 bg-black/40" /> {/* Scrim */}
          <View className="flex-1 p-5 justify-end">
            {headline && <Text className="text-white text-lg font-bold mb-1">{headline}</Text>}
            {body && <Text className="text-white/80 text-sm">{body}</Text>}
            {children}
          </View>
        </View>
      );
    }

    if (imagePosition === 'leading') {
      return (
        <View className="flex-1 flex-row">
          {imageUri && (
            <Image source={{ uri: imageUri }} className="w-[100px] h-full object-cover" />
          )}
          <View className="flex-1 p-5 justify-center relative">
            {headline && <Text className="text-onSurface dark:text-[#E3F2FD] text-lg font-bold mb-1">{headline}</Text>}
            {body && <Text className="text-onSurfaceVariant dark:text-[#90CAF9] text-sm">{body}</Text>}
            {children}
          </View>
        </View>
      );
    }

    // Default: top
    return (
      <View className="flex-1">
        {imageUri && (
          <Image source={{ uri: imageUri }} className="w-full h-[128px] object-cover rounded-t-[20px]" />
        )}
        <View className="p-5 flex-1 relative justify-center">
          {headline && <Text className="text-onSurface dark:text-[#E3F2FD] text-lg font-bold mb-1 text-center">{headline}</Text>}
          {body && <Text className="text-onSurfaceVariant dark:text-[#90CAF9] text-sm text-center">{body}</Text>}
          {children}
        </View>
      </View>
    );
  };

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} className={`${baseStyle} ${className}`} activeOpacity={0.9}>
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <View className={`${baseStyle} ${className}`}>
      {renderContent()}
    </View>
  );
};
