import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

type MultiChoiceQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndices: number[];
};

const multiChoiceQuestions: MultiChoiceQuestion[] = [
  {
    id: 'mc1',
    question: 'Pilih komponen yang ada di proyek ini.',
    options: ['ThemedView', 'ParallaxScrollView', 'FancyCard', 'HelloWave', 'MagicTile'],
    correctIndices: [0, 1, 3],
  },
  {
    id: 'mc2',
    question: 'Bagian fitur apa saja yang ada di aplikasi?',
    options: ['Profile', 'Kalkulator', 'Chatting', 'Quesioner', 'Music Player'],
    correctIndices: [0, 1, 3],
  },
  {
    id: 'mc3',
    question: 'File yang termasuk folder app/ adalah?',
    options: ['_layout.tsx', 'index.tsx', 'theme.ts', 'modal.tsx', 'README.md'],
    correctIndices: [0, 1, 3],
  },
];

export default function MultipleChoiceScreen() {
  const [selectedMulti, setSelectedMulti] = useState<Record<string, number | null>>({});

  const handleMultiSelect = (questionId: string, optionIndex: number) => {
    setSelectedMulti((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Multiple Choice' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.header}>Multiple Choice Question</ThemedText>

        {multiChoiceQuestions.map((question) => {
          const selectedIndex = selectedMulti[question.id];
          const isAnswered = selectedIndex !== null && selectedIndex !== undefined;
          const isCorrect = isAnswered && question.correctIndices.includes(selectedIndex);
          const correctAnswers = question.correctIndices
            .map((index) => question.options[index])
            .join(', ');

          return (
            <View key={question.id} style={styles.questionCard}>
              <ThemedText type="defaultSemiBold" style={styles.questionText}>
                {question.question}
              </ThemedText>

              {question.options.map((option, index) => (
                <Pressable
                  key={`${question.id}-${index}`}
                  onPress={() => handleMultiSelect(question.id, index)}
                  style={({ pressed }) => [
                    styles.optionButton,
                    selectedIndex === index && styles.optionSelected,
                    pressed && styles.optionPressed,
                  ]}
                >
                  <ThemedText style={styles.optionText}>{option}</ThemedText>
                </Pressable>
              ))}

              {isAnswered && (
                isCorrect ? (
                  <ThemedText style={[styles.feedbackText, styles.correctText]}>Correct</ThemedText>
                ) : (
                  <ThemedText style={[styles.feedbackText, styles.incorrectText]}>
                    Incorrect. Correct answers: {correctAnswers}
                  </ThemedText>
                )
              )}
            </View>
          );
        })}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  scrollContent: { paddingBottom: 32 },
  header: { marginBottom: 16, textAlign: 'center', marginTop: 8 },
  questionCard: {
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  questionText: { marginBottom: 12 },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    marginBottom: 8,
  },
  optionSelected: {
    borderColor: '#0a7ea4',
    backgroundColor: 'rgba(10, 126, 164, 0.12)',
  },
  optionPressed: {
    opacity: 0.75,
  },
  optionText: { fontSize: 14 },
  feedbackText: { marginTop: 8 },
  correctText: { color: '#2e7d32' },
  incorrectText: { color: '#c62828' },
});
