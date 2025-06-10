import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { UserProvider } from './contexts/UserContext';

export default function Layout() {
  const router = useRouter();

  return (
    <UserProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screens/EventListScreenCopy"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screens/CalendarScreen"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="view/detail"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </UserProvider>
  );
} 