import { Image, StyleSheet, Platform, View } from 'react-native';
import { Link } from 'expo-router';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/lib/auth-context';

export default function HomeScreen() {
  const { currentUser, logout } = useAuth();

  const hasAccess = (feature: string) => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    return currentUser.permissions.includes(feature);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome, {currentUser?.username}!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView>
        <ThemedText style={{ color: '#0a7ea4', textDecorationLine: 'underline', marginBottom: 15 }} onPress={logout}>
          Logout
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Minggu 1: Instalasi</ThemedText>
        <ThemedText>
          Kelompok 9 (Android){"\n"}
          1.  Arif Budi Prasetio{"\n"}
          2.  Lisa Humairoh{"\n"}
          3.  Muhammad Labib Royhan Hadi{"\n"}
          4.  Yuri Iskandia Barru
        </ThemedText>
      </ThemedView>

      {hasAccess('profiles') && (
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Minggu 2: Profile Kelompok</ThemedText>
          <Link href="/profiles">
            <ThemedText type="defaultSemiBold" style={{ color: '#0a7ea4' }}>
              Lihat Daftar Profile -&gt;
            </ThemedText>
          </Link>
        </ThemedView>
      )}

      {hasAccess('hitung') && (
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Minggu 3: Kalkulator Bangun Ruang</ThemedText>
          <Link href="/hitung">
            <ThemedText type="defaultSemiBold" style={{ color: '#0a7ea4' }}>
              Buka Kalkulator -&gt;
            </ThemedText>
          </Link>
        </ThemedView>
      )}

      {hasAccess('quesioner') && (
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Minggu 4: Quesioner & Pooling</ThemedText>
          {/* @ts-ignore */}
          <Link href={"/quesioner" as any}>
            <ThemedText type="defaultSemiBold" style={{ color: '#0a7ea4' }}>
              Buka Quesioner & Pooling -&gt;
            </ThemedText>
          </Link>
        </ThemedView>
      )}

      {hasAccess('conditional') && (
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Minggu 5: Percabangan</ThemedText>
          {/* @ts-ignore */}
          <Link href={"/conditional" as any}>
            <ThemedText type="defaultSemiBold" style={{ color: '#0a7ea4' }}>
              Buka Fitur Percabangan -&gt;
            </ThemedText>
          </Link>
        </ThemedView>
      )}

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Minggu 6: UTS</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Minggu 7: Latihan Algoritma Pencabangan (Elearning)</ThemedText>
      </ThemedView>

      {hasAccess('loop') && (
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Minggu 8: Perulangan (Loop)</ThemedText>
          {/* @ts-ignore */}
          <Link href={"/loop" as any}>
            <ThemedText type="defaultSemiBold" style={{ color: '#0a7ea4' }}>
              Buka Fitur Perulangan -&gt;
            </ThemedText>
          </Link>
        </ThemedView>
      )}

      {hasAccess('sorting') && (
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Minggu 9: Sorting</ThemedText>
          {/* @ts-ignore */}
          <Link href={"/sorting" as any}>
            <ThemedText type="defaultSemiBold" style={{ color: '#0a7ea4' }}>
              Buka Fitur Sorting -&gt;
            </ThemedText>
          </Link>
        </ThemedView>
      )}

      {hasAccess('zodiac') && (
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Minggu 10: Zodiac Finder 🔮</ThemedText>
          {/* @ts-ignore */}
          <Link href={"/zodiac" as any}>
            <ThemedText type="defaultSemiBold" style={{ color: '#0a7ea4' }}>
              Buka Zodiac Finder -&gt;
            </ThemedText>
          </Link>
        </ThemedView>
      )}

      {hasAccess('admin') && (
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle" style={{ color: '#e53935' }}>Minggu 12: Management User</ThemedText>
          <ThemedText>Fitur khusus Super Admin untuk mengatur permission.</ThemedText>
          {/* @ts-ignore */}
          <Link href={"/admin" as any}>
            <ThemedText type="defaultSemiBold" style={{ color: '#e53935' }}>
              Buka Management User -&gt;
            </ThemedText>
          </Link>
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
