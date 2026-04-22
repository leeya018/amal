import React, { type ReactNode } from 'react';
import { Text, type TextProps, I18nManager } from 'react-native';

interface TypographyProps extends TextProps {
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  color?: string;
}

const variantClasses: Record<string, string> = {
  h1: 'text-3xl font-bold text-calm-text',
  h2: 'text-2xl font-bold text-calm-text',
  h3: 'text-xl font-medium text-calm-text',
  body: 'text-base text-gray-700',
  caption: 'text-sm text-gray-500',
  label: 'text-sm font-medium text-calm-muted',
};

export function Typography({
  children,
  variant = 'body',
  className = '',
  ...rest
}: TypographyProps) {
  const textAlign = I18nManager.isRTL ? 'right' : 'left';
  return (
    <Text
      className={`${variantClasses[variant]} ${className}`}
      style={{ textAlign }}
      {...rest}
    >
      {children}
    </Text>
  );
}
