import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  title,
  variant = 'primary',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const containerClasses = [
    'rounded-2xl px-6 py-3.5 items-center justify-center flex-row gap-2',
    fullWidth ? 'w-full' : '',
    variant === 'primary' ? 'bg-primary-600' : '',
    variant === 'secondary' ? 'bg-calm-surface border border-calm-border' : '',
    variant === 'ghost' ? 'bg-transparent' : '',
    variant === 'danger' ? 'bg-danger' : '',
    disabled || loading ? 'opacity-50' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const textClasses = [
    'font-medium text-base',
    variant === 'primary' ? 'text-white' : '',
    variant === 'secondary' ? 'text-calm-text' : '',
    variant === 'ghost' ? 'text-primary-600' : '',
    variant === 'danger' ? 'text-white' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <TouchableOpacity
      className={containerClasses}
      disabled={disabled || loading}
      activeOpacity={0.75}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#fff' : '#7c3aed'}
        />
      ) : null}
      <Text className={textClasses}>{title}</Text>
    </TouchableOpacity>
  );
}
