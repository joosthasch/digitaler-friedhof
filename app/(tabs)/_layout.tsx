import { Tabs } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <>
      <StatusBar 
        barStyle={colors.statusBar} 
        backgroundColor={colors.statusBarBackground} 
      />
      <SafeAreaView 
        style={{ flex: 1, backgroundColor: colors.surface }} // This will now update with theme
        edges={['bottom']}
      >
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textTertiary,
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            tabBarStyle: {
              backgroundColor: colors.surface,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Gedenkseiten',
              headerTitleAlign: 'center',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="heart" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="create"
            options={{
              title: 'Erstellen',
              headerTitleAlign: 'center',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="add-circle" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Einstellungen',
              headerTitleAlign: 'center',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="settings" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </SafeAreaView>
    </>
  );
}