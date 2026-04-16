import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

const MENU_DATA = [
  { id: "segitiga", name: "Luas Segitiga", icon: "triangle-outline", route: "/hitung/segitiga" },
  { id: "tabung", name: "Isi Tabung", icon: "cylinder", route: "/hitung/tabung" },
  { id: "kotak", name: "Luas Persegi", icon: "square-outline", route: "/hitung/kotak" },
  { id: "lingkaran", name: "Luas Lingkaran", icon: "circle-outline", route: "/hitung/lingkaran" },
];

export default function HitungMenuScreen() {
  const iconColor = useThemeColor({}, 'text');

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Menu Hitung' }} />
      <ThemedText type="title" style={styles.header}>Kalkulator</ThemedText>

      <FlatList
        data={MENU_DATA}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <Link href={item.route as any} asChild>
            <Pressable style={styles.card}>
              <View style={[styles.iconContainer, { borderColor: iconColor }]}>
                <MaterialCommunityIcons name={item.icon as any} size={48} color={iconColor} />
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
  header: { marginBottom: 24, textAlign: 'center', marginTop: 20 },
  listContainer: { paddingBottom: 20 },
  card: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    padding: 24,
    borderRadius: 12,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: { textAlign: 'center' }
});
