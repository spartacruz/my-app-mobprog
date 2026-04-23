import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { type Href, Link, Stack } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

type MenuItem = { id: string; name: string; route: Href };

const MENU_DATA = [
  { id: 'single', name: 'Single Choice Question', route: './single-que' },
  { id: 'multiple', name: 'Multiple Choice Question', route: './multiple-que' },
] satisfies MenuItem[];

export default function QuesionerScreen() {
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Quesioner' }} />
      <ThemedText type="title" style={styles.header}>Quesioner</ThemedText>

      <FlatList
        data={MENU_DATA}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <Link href={item.route} asChild>
            <Pressable style={styles.card}>
              <View style={styles.labelContainer}>
                <ThemedText type="defaultSemiBold" style={styles.nameText}>
                  {item.name}
                </ThemedText>
              </View>
            </Pressable>
          </Link>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { marginBottom: 24, textAlign: 'center', marginTop: 8 },
  listContainer: { paddingBottom: 20 },
  card: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    padding: 24,
    borderRadius: 12,
  },
  labelContainer: { alignItems: 'center' },
  nameText: { textAlign: 'center' },
});