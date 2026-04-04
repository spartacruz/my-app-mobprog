import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const blackImg = require('@/assets/images/blackImg.png');
const orangeImg = require('@/assets/images/orangeImg.png');
const yellowImg = require('@/assets/images/yellowImg.png');
const greyImg = require('@/assets/images/greyImg.png');

// 2. PERBARUI DATA DENGAN YOUTUBE VIDEO ID
const DETAIL_DATA: Record<string, any> = {
  "user_arif": {
    name: "Arif Budi Prasetio",
    role: "Mahasiswa Universitas Al Azhar",
    image: blackImg,
    description: "Fokus pada pengembangan antarmuka dan integrasi API untuk aplikasi Android.",
    hobbies: ["Coding", "Gaming"],
    youtubeVideoId: "dQw4w9WgXcQ" 
  },
  "user_lisa": {
    name: "Lisa Humairoh",
    role: "Mahasiswa Universitas Al Azhar",
    image: orangeImg,
    description: "Mahasiswa semester 6 yang suka mengeksplorasi desain antarmuka dan arsitektur aplikasi. Tertarik juga dengan fotografi analog.",
    hobbies: ["Photography", "Reading"],
    youtubeVideoId: "si=X49tqkiELYD9-AXm" // https://youtu.be/8Gqnohf1HQ8?si=X49tqkiELYD9-AXm
  },
  "user_labib": {
    name: "M. Labib Royhan Hadi",
    role: "Mahasiswa Universitas Al Azhar",
    image: yellowImg,
    description: "Bertanggung jawab dalam merancang struktur database dan memastikan backend berjalan lancar.",
    hobbies: ["Music", "Badminton"],
    youtubeVideoId: "si=Xjpfy5boaSnFcmRp" // Ganti dengan ID video asli
  },
  "user_yuri": {
    name: "Yuri Iskandia Barru",
    role: "Mahasiswa Universitas Al Azhar",
    image: greyImg,
    description: "Menganalisis kebutuhan sistem dan memastikan alur aplikasi sesuai dengan tujuan project.",
    hobbies: ["Traveling", "Movies"],
    youtubeVideoId: "VideoID_Yuri" // Ganti dengan ID video asli
  }
};

// Ambil lebar layar untuk mengatur ukuran video agar pas
const { width: screenWidth } = Dimensions.get('window');
// Hitung tinggi video berdasarkan rasio 16:9 agar tidak terpotong
const videoHeight = (screenWidth - 48) * (9 / 16); 

export default function ProfileDetailScreen() {
  const { id } = useLocalSearchParams(); 
  const user = DETAIL_DATA[id as string];

  if (!user) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText type="title">Profile tidak ditemukan!</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ThemedView style={styles.container}>
        <View style={styles.imageWrapper}>
          <Image source={user.image} style={styles.image} contentFit="contain" />
        </View>
        
        <ThemedText type="title" style={styles.name}>{user.name}</ThemedText>
        <ThemedText type="subtitle" style={styles.role}>{user.role}</ThemedText>
        
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold">Tentang:</ThemedText>
          <ThemedText style={styles.paragraph}>{user.description}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold">Hobi:</ThemedText>
          {user.hobbies.map((hobi: string, index: number) => (
            <ThemedText key={index} style={styles.bulletPoint}>• {hobi}</ThemedText>
          ))}
        </ThemedView>

        {/* 3. TAMBAHKAN KODE UNTUK MENAMPILKAN VIDEO */}
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={{ marginBottom: 12 }}>
            Video Update (YouTube):
          </ThemedText>
          {user.youtubeVideoId ? (
            <View style={[styles.videoContainer, { height: videoHeight }]}>
              <WebView
                javaScriptEnabled={true}
                domStorageEnabled={true}
                // Pastikan menggunakan URL /embed/ID
                source={{ uri: `https://www.youtube.com/embed/${user.youtubeVideoId}` }}
                style={styles.video}
              />
            </View>
          ) : (
            <ThemedText style={{ fontStyle: 'italic', color: '#888' }}>
              Video belum tersedia untuk anggota ini.
            </ThemedText>
          )}
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

// --- Tambahkan Styles Baru di Bawah ---
const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: { flex: 1, padding: 24, alignItems: 'center' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    // Shadow untuk Android (Elevation)
    elevation: 5,
  },
  image: { width: 100, height: 100 },
  name: { textAlign: 'center', marginBottom: 4 },
  role: { textAlign: 'center', color: '#666', marginBottom: 24 },
  section: { width: '100%', marginBottom: 20, backgroundColor: 'rgba(150, 150, 150, 0.05)', padding: 16, borderRadius: 12 },
  paragraph: { marginTop: 8, lineHeight: 24 },
  bulletPoint: { marginTop: 4, marginLeft: 8 },
  
  // -- Styles untuk Video --
  videoContainer: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden', // Biar sudut video ikut tumpul
    backgroundColor: '#000', // Warna background saat loading
  },
  video: {
    flex: 1,
    backgroundColor: 'transparent'
  }
});