import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

const blackImg = require('@/assets/images/black.jpg');
const orangeImg = require('@/assets/images/orange.jpg');
const yellowImg = require('@/assets/images/yellow.jpg');
const greyImg = require('@/assets/images/grey.jpg');

// Data Kelompok 9
const PROFILES_DATA = [
  { id: "user_arif", name: "Arif Budi Prasetio", image: blackImg },
  { id: "user_lisa", name: "Lisa Humairoh", image: orangeImg },
  { id: "user_labib", name: "M. Labib Royhan", image: yellowImg },
  { id: "user_yuri", name: "Yuri Iskandia Barru", image: greyImg },
];

export default function ProfilesGridScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>Kelompok 9</ThemedText>
      
      <FlatList
        data={PROFILES_DATA}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          
          <Link 
            href={{
              pathname: "/profiles/[id]" as any,
              params: { id: item.id }
            }} 
            asChild
          >
            <Pressable style={styles.card}>
              <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.image} contentFit="contain" />
              </View>
              <ThemedText type="defaultSemiBold" style={styles.nameText}>
                {item.name}
              </ThemedText>
            </Pressable>
          </Link>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { marginBottom: 24, textAlign: 'center' },
  listContainer: { paddingBottom: 20 },
  card: { 
    flex: 1, 
    margin: 8, 
    alignItems: 'center',
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    padding: 16,
    borderRadius: 12,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: { width: 80, height: 80 },
  nameText: { textAlign: 'center' }
});