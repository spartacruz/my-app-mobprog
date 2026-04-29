import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
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
        <ThemedText type="title">Welcome!{"\n"}Mobile App Kel. 9</ThemedText>
        <HelloWave />
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
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Minggu 2: Profile Kelompok</ThemedText>
        <Link href="/profiles">
          <ThemedText type="defaultSemiBold" style={{ color: '#0a7ea4' }}>
            Lihat Daftar Profile -&gt;
          </ThemedText>
        </Link>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Minggu 3: Kalkulator Bangun Ruang</ThemedText>
        <Link href="/hitung">
          <ThemedText type="defaultSemiBold" style={{ color: '#0a7ea4' }}>
            Buka Kalkulator -&gt;
          </ThemedText>
        </Link>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Minggu 4: Quesioner & Pooling</ThemedText>
        {/* @ts-ignore */}
        <Link href={"/quesioner" as any}>
          <ThemedText type="defaultSemiBold" style={{ color: '#0a7ea4' }}>
            Buka Quesioner & Pooling -&gt;
          </ThemedText>
        </Link>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Minggu 5: Percabangan</ThemedText>
        {/* @ts-ignore */}
        <Link href={"/conditional" as any}>
          <ThemedText type="defaultSemiBold" style={{ color: '#0a7ea4' }}>
            Buka Fitur Percabangan -&gt;
          </ThemedText>
        </Link>
      </ThemedView>

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
