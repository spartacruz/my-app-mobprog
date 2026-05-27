import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function LoopScreen() {
  // 1. 20 Bilangan Bulat (For)
  const bilanganBulat = [];
  for (let i = 1; i <= 20; i++) {
    bilanganBulat.push(i);
  }

  // 2. 20 Bilangan Ganjil (While)
  const bilanganGanjil = [];
  let countGanjil = 0;
  let nGanjil = 1;
  while (countGanjil < 20) {
    bilanganGanjil.push(nGanjil);
    nGanjil += 2;
    countGanjil++;
  }

  // 3. 20 Bilangan Fibonacci (Do-While)
  const bilanganFibo = [];
  let countFibo = 0;
  let f1 = 0;
  let f2 = 1;
  do {
    bilanganFibo.push(f1);
    const f3 = f1 + f2;
    f1 = f2;
    f2 = f3;
    countFibo++;
  } while (countFibo < 20);

  // 4. Hitung 20 Bilangan Prima (FOR)
  const bilanganPrima = [];
  for (let numPrima = 2; bilanganPrima.length < 20; numPrima++) {
    let isPrime = true;
    for (let i = 2; i <= Math.sqrt(numPrima); i++) {
      if (numPrima % i === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) bilanganPrima.push(numPrima);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Perulangan (Loop)</Text>

      <View style={styles.section}>
        <Text style={styles.subtitle}>1. Hitung 20 Bilangan Bulat (FOR)</Text>
        <Text style={styles.text}>{bilanganBulat.join(', ')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>2. Hitung 20 Bilangan Ganjil (WHILE)</Text>
        <Text style={styles.text}>{bilanganGanjil.join(', ')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>3. Hitung 20 Bilangan Fibonacci (DO-WHILE)</Text>
        <Text style={styles.text}>{bilanganFibo.join(', ')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>4. Hitung 20 Bilangan Prima (FOR)</Text>
        <Text style={styles.text}>{bilanganPrima.join(', ')}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  note: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#888',
    marginBottom: 8,
  }
});
