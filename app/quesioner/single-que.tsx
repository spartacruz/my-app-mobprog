import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

type SingleChoiceQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
};

const singleChoiceQuestions: SingleChoiceQuestion[] = [
  {
    id: 'sc1',
    question: 'Ibu kota Indonesia adalah?',
    options: ['Konoha', 'DKI Jakarta', 'IKN', 'Beijing', 'Bangkok'],
    correctIndex: 1,
  },
  {
    id: 'sc2',
    question: 'Ibu kota Prancis adalah?',
    options: ['Paris', 'Roma', 'Berlin', 'Madrid', 'Lisbon'],
    correctIndex: 0,
  },
  {
    id: 'sc3',
    question: 'Ibu kota Australia adalah?',
    options: ['Sydney', 'Melbourne', 'Canberra', 'Perth', 'Brisbane'],
    correctIndex: 2,
  },
];

export default function SingleChoiceScreen() {
  const [selectedSingle, setSelectedSingle] = useState<Record<string, number | null>>({});

  const handleSingleSelect = (questionId: string, optionIndex: number) => {
    setSelectedSingle((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Satu Pilihan (Single Choice)' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.header}>Pertanyaan Satu Pilihan</ThemedText>

        {singleChoiceQuestions.map((question) => {
          const selectedIndex = selectedSingle[question.id];
          const isAnswered = selectedIndex !== null && selectedIndex !== undefined;
          const isCorrect = isAnswered && selectedIndex === question.correctIndex;

          return (
            <View key={question.id} style={styles.questionCard}>
              <ThemedText type="defaultSemiBold" style={styles.questionText}>
                {question.question}
              </ThemedText>

              {question.options.map((option, index) => (
                <Pressable
                  key={`${question.id}-${index}`}
                  onPress={() => handleSingleSelect(question.id, index)}
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
                  <ThemedText style={[styles.feedbackText, styles.correctText]}>Kamu Benar!</ThemedText>
                ) : (
                  <ThemedText style={[styles.feedbackText, styles.incorrectText]}>
                    Salah. Jawaban Yang Benar Adalah: {question.options[question.correctIndex]}
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
