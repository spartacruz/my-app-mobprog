import { useState } from 'react';
import { Keyboard, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Stack } from 'expo-router';

export default function MaxMinScreen() {
    const [angka1, setAngka1] = useState('');
    const [angka2, setAngka2] = useState('');
    const [hasil, setHasil] = useState<string | null>(null);

    const textColor = useThemeColor({}, 'text');

    const cekNilai = () => {
        const a = parseFloat(angka1);
        const b = parseFloat(angka2);

        if (isNaN(a) || isNaN(b)) {
            setHasil('Masukkan angka yang valid!');
            return;
        }

        if (a > b) {
            setHasil(`Nilai maksimal: ${a}\nNilai minimal: ${b}`);
        } else if (b > a) {
            setHasil(`Nilai maksimal: ${b}\nNilai minimal: ${a}`);
        } else {
            setHasil(`Kedua nilai sama: ${a}`);
        }

        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedView style={styles.container}>
                <Stack.Screen options={{ title: 'Max & Min' }} />

                <ThemedText type="title" style={styles.header}>IF - Max &amp; Min</ThemedText>
                <ThemedText style={styles.description}>
                    Mencari nilai maksimal dan minimal dari dua angka
                </ThemedText>

                <ThemedText type="defaultSemiBold" style={styles.label}>Angka 1</ThemedText>
                <TextInput
                    style={[styles.input, { color: textColor, borderColor: textColor }]}
                    placeholder="Masukkan angka 1"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    value={angka1}
                    onChangeText={setAngka1}
                />

                <ThemedText type="defaultSemiBold" style={styles.label}>Angka 2</ThemedText>
                <TextInput
                    style={[styles.input, { color: textColor, borderColor: textColor }]}
                    placeholder="Masukkan angka 2"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    value={angka2}
                    onChangeText={setAngka2}
                />

                <TouchableOpacity style={styles.button} onPress={cekNilai}>
                    <ThemedText style={styles.buttonText} lightColor="#fff" darkColor="#fff">
                        Cek Nilai
                    </ThemedText>
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
        textAlign: 'center',
    },
});