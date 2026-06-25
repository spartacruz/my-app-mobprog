import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { initDatabase } from '@/lib/database';

import { AuthProvider, useAuth } from '@/lib/auth-context';
import { useRouter, useSegments } from 'expo-router';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isLoggedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === 'login';

    if (!isLoggedIn && !inAuthGroup) {
      // Jika belum login dan tidak di halaman login, redirect ke login
      router.replace('/login');
    } else if (isLoggedIn && inAuthGroup) {
      // Jika sudah login dan ada di halaman login, redirect ke tabs
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, segments]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false, title: 'Login' }} />
        <Stack.Screen name="admin" options={{ title: 'Management User', presentation: 'modal' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initDatabase()
      .then(() => setDbReady(true))
      .catch((err) => {
        console.error('❌ Gagal inisialisasi database:', err);
        // Tetap render app meski DB gagal, agar tidak blank screen
        setDbReady(true);
      });
  }, []);

  if (!dbReady) {
    return null; // Tunggu sampai database siap
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
