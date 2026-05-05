import { useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Stack } from 'expo-router';

export default function NestedIfScreen() {
    const [harga, setHarga] = useState('');
    const [hasil, setHasil] = useState<{
        pembelian: number;
        persenDiskon: number;
        nilaiDiskon: number;
        totalBayar: number;
        keterangan: string;
    } | null>(null);
    const [error, setError] = useState('');

    const textColor = useThemeColor({}, 'text');

    const hitungDiskon = () => {
        const h = parseFloat(harga.replace(/[^0-9]/g, ''));

        if (isNaN(h) || h <= 0) {
            setError('Masukkan jumlah pembelian yang valid!');
            setHasil(null);
            return;
        }
        setError('');

        let persenDiskon = 0;
        let keterangan = '';

        if (h > 1500000) {
            persenDiskon = 30;
            keterangan = 'Pembelian > Rp 1.500.000';
        } else {
            if (h >= 1000000) {
                persenDiskon = 20;
                keterangan = 'Pembelian Rp 1.000.000 – Rp 1.500.000';
            } else {
                if (h >= 500000) {
                    persenDiskon = 10;
                    keterangan = 'Pembelian Rp 500.000 – Rp 999.999';
                } else {
                    persenDiskon = 0;
                    keterangan = 'Pembelian < Rp 500.000';
                }
            }
        }

        const nilaiDiskon = (h * persenDiskon) / 100;
        const totalBayar = h - nilaiDiskon;

        setHasil({ pembelian: h, persenDiskon, nilaiDiskon, totalBayar, keterangan });
        Keyboard.dismiss();
    };

    const formatRupiah = (angka: number) =>
        'Rp ' + angka.toLocaleString('id-ID');

    const diskonColor: Record<number, string> = {
        30: '#22c55e',
        20: '#3b82f6',
        10: '#f59e0b',
        0: '#9ca3af',
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedView style={styles.container}>
                <Stack.Screen options={{ title: 'Nested IF - Diskon' }} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <ThemedText type="title" style={styles.header}>Nested IF</ThemedText>
                    <ThemedText style={styles.description}>
                        Penentuan diskon pembelian menggunakan Nested IF
                    </ThemedText>

                    <ThemedText type="defaultSemiBold" style={styles.label}>
                        Jumlah Pembelian (Rp)
                    </ThemedText>
                    <TextInput
                        style={[styles.input, { color: textColor, borderColor: textColor }]}
                        placeholder="Contoh: 1500000"
                        placeholderTextColor="#888"
                        keyboardType="numeric"
                        value={harga}
                        onChangeText={setHarga}
                    />

                    {error !== '' && (
                        <ThemedText style={styles.errorText}>{error}</ThemedText>
                    )}

                    <TouchableOpacity style={styles.button} onPress={hitungDiskon}>
                        <ThemedText style={styles.buttonText} lightColor="#fff" darkColor="#fff">
                            Hitung Diskon
                        </ThemedText>
                    </TouchableOpacity>

                    {hasil !== null && (
                        <ThemedView style={[styles.resultContainer, { borderColor: diskonColor[hasil.persenDiskon] }]}>
                            <ThemedText style={styles.keteranganText}>{hasil.keterangan}</ThemedText>

                            <ThemedText
                                type="title"
                                style={[styles.diskonBadge, { color: diskonColor[hasil.persenDiskon] }]}
                            >
                                Diskon {hasil.persenDiskon}%
                            </ThemedText>

                            <View style={styles.divider} />

                            <View style={styles.row}>
                                <ThemedText style={styles.rowLabel}>Nilai Pembelian</ThemedText>
                                <ThemedText style={styles.rowValue}>{formatRupiah(hasil.pembelian)}</ThemedText>
                            </View>
                            <View style={[styles.row, styles.diskonRow]}>
                                <ThemedText style={[styles.rowLabel, { color: '#ef4444' }]}>
                                    Diskon ({hasil.persenDiskon}%)
                                </ThemedText>
                                <ThemedText style={[styles.rowValue, { color: '#ef4444' }]}>
                                    - {formatRupiah(hasil.nilaiDiskon)}
                                </ThemedText>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.row}>
                                <ThemedText type="defaultSemiBold" style={[styles.rowLabel, { color: diskonColor[hasil.persenDiskon] }]}>
                                    Harus Dibayar
                                </ThemedText>
                                <ThemedText type="defaultSemiBold" style={[styles.rowValue, { color: diskonColor[hasil.persenDiskon], fontSize: 18 }]}>
                                    {formatRupiah(hasil.totalBayar)}
                                </ThemedText>
                            </View>
                        </ThemedView>
                    )}

                    {/* Tabel ketentuan diskon */}
                    <ThemedView style={styles.infoBox}>
                        <ThemedText type="defaultSemiBold" style={styles.infoTitle}>📋 Ketentuan Diskon</ThemedText>
                        {[
                            { range: '> Rp 1.500.000', diskon: '30%', color: '#22c55e' },
                            { range: 'Rp 1.000.000 – Rp 1.500.000', diskon: '20%', color: '#3b82f6' },
                            { range: 'Rp 500.000 – Rp 999.999', diskon: '10%', color: '#f59e0b' },
                            { range: '< Rp 500.000', diskon: '0%', color: '#9ca3af' },
                        ].map((item, i) => (
                            <View key={i} style={styles.infoRow}>
                                <ThemedText style={styles.infoRange}>{item.range}</ThemedText>
                                <ThemedText style={[styles.infoDiskon, { color: item.color }]}>{item.diskon}</ThemedText>
                            </View>
                        ))}
                    </ThemedView>
                </ScrollView>
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
        marginBottom: 8,
        fontSize: 16,
    },
    errorText: { color: '#ef4444', marginBottom: 12, fontSize: 13 },
    button: {
        backgroundColor: '#0a7ea4',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 4,
    },
    buttonText: { fontSize: 18, fontWeight: 'bold' },
    resultContainer: {
        marginTop: 24,
        padding: 20,
        borderRadius: 16,
        borderWidth: 2,
        backgroundColor: 'rgba(150,150,150,0.08)',
        marginBottom: 4,
    },
    keteranganText: { textAlign: 'center', opacity: 0.6, marginBottom: 8, fontSize: 13 },
    diskonBadge: { textAlign: 'center', marginBottom: 16 },
    divider: { height: 1, backgroundColor: 'rgba(150,150,150,0.3)', marginVertical: 10 },
    row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
    diskonRow: { marginBottom: 2 },
    rowLabel: { fontSize: 15, opacity: 0.85 },
    rowValue: { fontSize: 15, fontWeight: '600' },
    infoBox: {
        marginTop: 20,
        padding: 16,
        backgroundColor: 'rgba(150,150,150,0.08)',
        borderRadius: 12,
        marginBottom: 20,
    },
    infoTitle: { marginBottom: 12, fontSize: 15 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
    infoRange: { flex: 3, opacity: 0.8, fontSize: 13 },
    infoDiskon: { flex: 1, textAlign: 'right', fontWeight: 'bold' },
});
