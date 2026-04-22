import React, { type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: ReactNode;
  padded?: boolean;
}

export function Card({ children, padded = true, className = '', ...rest }: CardProps) {
  return (
    <View
      className={`bg-calm-surface rounded-2xl border border-calm-border shadow-sm ${padded ? 'p-4' : ''} ${className}`}
      {...rest}
    >
      {children}
    </View>
  );
}
