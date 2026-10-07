import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useThemeMode } from '../store/theme-store';

// Size mappings for M3 Expressive Scale
const sizes = {
  xs: { height: 'h-[32px]', px: 'px-3', text: 'text-xs', icon: 18 },
  s: { height: 'h-[40px]', px: 'px-4', text: 'text-sm', icon: 20 },
  m: { height: 'h-[56px]', px: 'px-6', text: 'text-base', icon: 24 },
  l: { height: 'h-[96px]', px: 'px-8', text: 'text-lg', icon: 28 },
  xl: { height: 'h-[136px]', px: 'px-10', text: 'text-xl', icon: 32 },
};

export const Button = ({
  title,
  icon,
  mode = 'filled', // filled, tonal, outlined
  size = 'm', // xs, s, m, l, xl
  onPress,
  className = '',
}) => {
  const s = sizes[size] || sizes.m;

  // Background and border styles based on mode
  let baseStyle = `flex-row items-center justify-center rounded-full ${s.height} ${s.px}`;
  let textStyle = `font-medium ml-2 ${s.text}`;
  let iconColor = '#FFFFFF';

  if (mode === 'filled') {
    baseStyle += ' bg-primary';
    textStyle += ' text-onPrimary';
    iconColor = '#FFFFFF';
  } else if (mode === 'tonal') {
    baseStyle += ' bg-secondaryContainer';
    textStyle += ' text-onSecondaryContainer';
    iconColor = '#0D47A1';
  } else if (mode === 'outlined') {
    baseStyle += ' border border-outline dark:border-[#334155] bg-transparent';
    textStyle += ' text-primary';
    iconColor = '#2196F3';
  }

  // Adjust if no title (icon only)
  if (!title) {
    baseStyle += ` px-0 w-[${s.height.replace('h-', '')}]`; // make it a circle roughly
  }

  return (
    <TouchableOpacity onPress={onPress} className={`${baseStyle} ${className}`} activeOpacity={0.8}>
      {icon && <MaterialIcons name={icon} size={s.icon} color={iconColor} />}
      {title && <Text className={textStyle}>{title}</Text>}
    </TouchableOpacity>
  );
};

export const IconButton = ({ icon, mode = 'standard', size = 'm', onPress, className = '' }) => {
  const s = sizes[size] || sizes.m;
  const isDark = useThemeMode();
  let baseStyle = `items-center justify-center rounded-full ${s.height}`;
  let iconColor = isDark ? '#2196F3' : '#0D47A1';

  // Override size for width to make a circle
  const wClass = s.height.replace('h-', 'w-');
  baseStyle += ` ${wClass}`;

  if (mode === 'filled') {
    baseStyle += ' bg-primary';
    iconColor = '#FFFFFF';
  } else if (mode === 'tonal') {
    baseStyle += ' bg-secondaryContainer dark:bg-[#1E293B]';
    iconColor = isDark ? '#E3F2FD' : '#0D47A1';
  } else if (mode === 'outlined') {
    baseStyle += ' border border-outline dark:border-[#334155] bg-transparent';
    iconColor = '#2196F3';
  } else {
    // standard - transparent
    baseStyle += ' bg-transparent';
  }

  return (
    <TouchableOpacity onPress={onPress} className={`${baseStyle} ${className}`} activeOpacity={0.8}>
      <MaterialIcons name={icon} size={s.icon} color={iconColor} />
    </TouchableOpacity>
  );
};
