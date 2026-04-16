import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';

export default function SegitigaScreen() {
  const [alas, setAlas] = useState('');
  const [tinggi, setTinggi] = useState('');
  const [hasil, setHasil] = useState<number | null>(null);

  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  
  const hitungLuas = () => {
    const a = parseFloat(alas);
    const t = parseFloat(tinggi);
    if (!isNaN(a) && !isNaN(t)) {
      setHasil(0.5 * a * t);
    } else {
      setHasil(null);
    }
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: 'Luas Segitiga' }} />
        
        <ThemedText type="title" style={styles.header}>Luas Segitiga</ThemedText>
        <ThemedText style={styles.description}>
          Rumus: 1/2 × Alas × Tinggi
        </ThemedText>

        <ThemedText type="defaultSemiBold" style={styles.label}>Alas</ThemedText>
        <TextInput
          style={[styles.input, { color: textColor, borderColor: textColor }]}
          keyboardType="numeric"
          placeholder="Masukkan nilai alas"
          placeholderTextColor="#888"
          value={alas}
          onChangeText={setAlas}
        />

        <ThemedText type="defaultSemiBold" style={styles.label}>Tinggi</ThemedText>
        <TextInput
          style={[styles.input, { color: textColor, borderColor: textColor }]}
          keyboardType="numeric"
          placeholder="Masukkan nilai tinggi"
          placeholderTextColor="#888"
          value={tinggi}
          onChangeText={setTinggi}
        />

        <TouchableOpacity style={styles.button} onPress={hitungLuas}>
          <ThemedText style={styles.buttonText} lightColor="#fff" darkColor="#fff">Hitung</ThemedText>
        </TouchableOpacity>

        {hasil !== null && (
          <ThemedView style={styles.resultContainer}>
            <ThemedText type="subtitle">Hasil:</ThemedText>
            <ThemedText type="title" style={styles.resultText}>{hasil}</ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { marginBottom: 8, textAlign: 'center', marginTop: 20 },
  description: { textAlign: 'center', marginBottom: 24, fontSize: 16, opacity: 0.7 },
  label: { marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 30,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    borderRadius: 12,
  },
  resultText: {
    marginTop: 10,
    color: '#0a7ea4',
  }
});
