import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

const POLLING_OPTIONS = [
  { id: 'badminton', label: 'Badminton' },
  { id: 'catur', label: 'Chess' },
  { id: 'padel', label: 'Padel' },
  { id: 'basket', label: 'Basketball' },
  { id: 'lari', label: 'Marathon Running' },
];

const INITIAL_VOTES = [2, 1, 3, 4, 0];

export default function PollingScreen() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [votes, setVotes] = useState<number[]>(INITIAL_VOTES);

  const totalVotes = votes.reduce((sum, value) => sum + value, 0);

  const handleSelect = (index: number) => {
    if (selectedIndex !== null) {
      return;
    }

    setSelectedIndex(index);
    setVotes((prev) => prev.map((value, i) => (i === index ? value + 1 : value)));
  };

  const handleReset = () => {
    setSelectedIndex(null);
    setVotes(INITIAL_VOTES);
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Polling' }} />
      <ThemedText type="title" style={styles.header}>Polling Hobi Olahraga</ThemedText>

      {selectedIndex !== null && (
        <View style={styles.confirmSection}>
          <ThemedText style={styles.confirmText}>
            Pilihan kamu: {POLLING_OPTIONS[selectedIndex]?.label}
          </ThemedText>
          <Pressable onPress={handleReset} style={styles.resetButton}>
            <ThemedText style={styles.resetButtonText}>Reset Pilihan</ThemedText>
          </Pressable>
        </View>
      )}

      <FlatList
        data={POLLING_OPTIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => {
          const percentage = totalVotes > 0 ? (votes[index] / totalVotes) * 100 : 0;
          const isSelected = selectedIndex === index;

          return (
            <Pressable
              onPress={() => handleSelect(index)}
              disabled={selectedIndex !== null}
              style={({ pressed }) => [
                styles.optionRow,
                isSelected && styles.optionSelected,
                pressed && selectedIndex === null && styles.optionPressed,
              ]}
            >
              <View style={styles.optionHeader}>
                <ThemedText type="defaultSemiBold" style={styles.optionLabel}>
                  {item.label}
                </ThemedText>
                {isSelected && (
                  <ThemedText style={styles.selectedBadge}>Pilihan kamu</ThemedText>
                )}
              </View>

              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${percentage}%` }]} />
              </View>

              <View style={styles.voteMeta}>
                <ThemedText style={styles.voteText}>{votes[index]} suara</ThemedText>
                <ThemedText style={styles.voteText}>{percentage.toFixed(1)}%</ThemedText>
              </View>
            </Pressable>
          );
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { marginBottom: 24, textAlign: 'center', marginTop: 8 },
  confirmSection: { alignItems: 'center', marginBottom: 16 },
  confirmText: { textAlign: 'center', marginBottom: 8 },
  resetButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(10, 126, 164, 0.12)',
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  resetButtonText: { color: '#0a7ea4' },
  listContainer: { paddingBottom: 20 },
  optionRow: {
    marginBottom: 16,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  optionSelected: {
    borderColor: '#0a7ea4',
    backgroundColor: 'rgba(10, 126, 164, 0.12)',
  },
  optionPressed: { opacity: 0.8 },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  optionLabel: { fontSize: 16 },
  selectedBadge: {
    fontSize: 12,
    color: '#0a7ea4',
  },
  progressTrack: {
    height: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0a7ea4',
  },
  voteMeta: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  voteText: { fontSize: 12 },
});