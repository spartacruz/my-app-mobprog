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
    question: 'Pilih provinsi yang berada di Pulau Jawa.',
    options: ['Jawa Barat', 'Kalimantan Selatan', 'Jawa Tengah', 'Bali', 'Jawa Timur'],
    correctIndices: [0, 2, 4],
  },
  {
    id: 'mc2',
    question: 'Pilih makanan khas Indonesia.',
    options: ['Rendang', 'Sushi', 'Sate', 'Pizza', 'Gado-gado'],
    correctIndices: [0, 1, 4],
  },
  {
    id: 'mc3',
    question: 'Pilih pahlawan nasional Indonesia.',
    options: ['R.A. Kartini', 'Soekarno', 'Mahathir Mohamad', 'Cut Nyak Dien', 'Lee Kuan Yew'],
    correctIndices: [0, 1, 3],
  },
];

export default function MultipleChoiceScreen() {
  const [selectedMulti, setSelectedMulti] = useState<Record<string, number[]>>({});
  const [validatedQuestions, setValidatedQuestions] = useState<Record<string, boolean>>({});

  const handleMultiSelect = (
    questionId: string,
    optionIndex: number,
    correctCount: number
  ) => {
    setSelectedMulti((prev) => {
      const currentSelections = prev[questionId] ?? [];
      const isAlreadySelected = currentSelections.includes(optionIndex);
      const nextSelections = isAlreadySelected
        ? currentSelections.filter((index) => index !== optionIndex)
        : [...currentSelections, optionIndex];
      const shouldValidate = nextSelections.length >= correctCount;

      setValidatedQuestions((prevValidated) => ({
        ...prevValidated,
        [questionId]: shouldValidate,
      }));

      return { ...prev, [questionId]: nextSelections };
    });
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Pilihan Ganda (Multiple Choices)' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.header}>Pertanyaan Pilihan Ganda</ThemedText>

        {multiChoiceQuestions.map((question) => {
          const selectedIndices = selectedMulti[question.id] ?? [];
          const isValidated = validatedQuestions[question.id] === true;
          const isCorrect =
            isValidated &&
            selectedIndices.length === question.correctIndices.length &&
            selectedIndices.every((index) => question.correctIndices.includes(index));
          const correctAnswers = question.correctIndices
            .map((index) => question.options[index])
            .join(', ');

          return (
            <View key={question.id} style={styles.questionCard}>
              <ThemedText type="defaultSemiBold" style={styles.questionText}>
                {question.question}
              </ThemedText>

              {question.options.map((option, index) => {
                const isSelected = selectedIndices.includes(index);

                return (
                  <Pressable
                    key={`${question.id}-${index}`}
                    onPress={() =>
                      handleMultiSelect(question.id, index, question.correctIndices.length)
                    }
                    style={({ pressed }) => [
                      styles.optionButton,
                      styles.optionRow,
                      isSelected && styles.optionSelected,
                      pressed && styles.optionPressed,
                    ]}
                  >
                    <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                      {isSelected ? (
                        <ThemedText style={styles.checkmark}>v</ThemedText>
                      ) : null}
                    </View>
                    <ThemedText style={styles.optionText}>{option}</ThemedText>
                  </Pressable>
                );
              })}

              {isValidated && (
                isCorrect ? (
                  <ThemedText style={[styles.feedbackText, styles.correctText]}>Kamu Benar!</ThemedText>
                ) : (
                  <ThemedText style={[styles.feedbackText, styles.incorrectText]}>
                    Salah! Jawaban Yang Benar: {correctAnswers}
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
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    borderColor: '#0a7ea4',
    backgroundColor: 'rgba(10, 126, 164, 0.18)',
  },
  checkmark: {
    fontSize: 12,
    color: '#0a7ea4',
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
