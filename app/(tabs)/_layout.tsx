import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;
}

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#7c3aed',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e9d5ff',
          paddingBottom: 6,
          height: 62,
        },
        tabBarLabelStyle: {
          fontFamily: 'Rubik-Medium',
          fontSize: 11,
        },
        sceneStyle: { backgroundColor: '#faf5ff' },
      }}
    >
      <Tabs.Screen
        name="sos"
        options={{
          title: t('sos.tabTitle'),
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔴" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="agent"
        options={{
          title: t('agent.tabTitle'),
          tabBarIcon: ({ focused }) => <TabIcon emoji="💬" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="todos"
        options={{
          title: t('todos.tabTitle'),
          tabBarIcon: ({ focused }) => <TabIcon emoji="📋" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
