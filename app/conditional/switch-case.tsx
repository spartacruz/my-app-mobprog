import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Stack } from 'expo-router';

type DayInfo = { hari: string; jenis: string; emoji: string };

export default function SwitchCaseScreen() {
    const [selected, setSelected] = useState<number | null>(null);
    const [hasil, setHasil] = useState<DayInfo | null>(null);

    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    const cekHari = (angka: number) => {
        setSelected(angka);

        let hari = '';
        let jenis = '';
        let emoji = '';

        switch (angka) {
            case 1:
                hari = 'Senin';
                jenis = 'Hari Kerja';
                emoji = '💼';
                break;
            case 2:
                hari = 'Selasa';
                jenis = 'Hari Kerja';
                emoji = '💼';
                break;
            case 3:
                hari = 'Rabu';
                jenis = 'Hari Kerja';
                emoji = '💼';
                break;
            case 4:
                hari = 'Kamis';
                jenis = 'Hari Kerja';
                emoji = '💼';
                break;
            case 5:
                hari = 'Jumat';
                jenis = 'Hari Kerja';
                emoji = '🕌';
                break;
            case 6:
                hari = 'Sabtu';
                jenis = 'Akhir Pekan';
                emoji = '🎉';
                break;
            case 7:
                hari = 'Minggu';
                jenis = 'Akhir Pekan';
                emoji = '😴';
                break;
            default:
                hari = 'Tidak diketahui';
                jenis = '-';
                emoji = '❓';
        }

        setHasil({ hari, jenis, emoji });
    };

    const isWeekend = hasil?.jenis === 'Akhir Pekan';

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ title: 'Switch-Case' }} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <ThemedText type="title" style={styles.header}>Switch-Case</ThemedText>
                <ThemedText style={styles.description}>
                    Menampilkan nama & jenis hari menggunakan Switch-Case
                </ThemedText>

                <ThemedText type="defaultSemiBold" style={styles.label}>Pilih Nomor Hari:</ThemedText>
                <View style={styles.dayGrid}>
                    {days.map((day, index) => {
                        const isActive = selected === index + 1;
                        const isWE = index >= 5;
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.dayButton,
                                    isActive && (isWE ? styles.dayButtonWeekend : styles.dayButtonActive),
                                ]}
                                onPress={() => cekHari(index + 1)}
                            >
                                <ThemedText style={[styles.dayNumber, isActive && styles.dayNumberActive]}>
                                    {index + 1}
                                </ThemedText>
                                <ThemedText style={[styles.dayText, isActive && styles.dayTextActive]}>
                                    {day}
                                </ThemedText>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {hasil !== null && (
                    <ThemedView style={[styles.resultContainer, isWeekend && styles.resultWeekend]}>
                        <ThemedText style={styles.emoji}>{hasil.emoji}</ThemedText>
                        <ThemedText type="title" style={[styles.resultHari, isWeekend ? styles.colorWeekend : styles.colorWorkday]}>
                            {hasil.hari}
                        </ThemedText>
                        <ThemedView style={[styles.badge, isWeekend ? styles.badgeWeekend : styles.badgeWorkday]}>
                            <ThemedText style={styles.badgeText}>{hasil.jenis}</ThemedText>
                        </ThemedView>
                        <ThemedText style={styles.switchInfo}>
                            switch({selected}) → case {selected}: "{hasil.hari}"
                        </ThemedText>
                    </ThemedView>
                )}
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { marginBottom: 8, textAlign: 'center', marginTop: 20 },
    description: { textAlign: 'center', marginBottom: 24, fontSize: 16, opacity: 0.7 },
    label: { marginBottom: 12 },
    dayGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 24,
    },
    dayButton: {
        width: '27%',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: 'rgba(150,150,150,0.1)',
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    dayButtonActive: {
        backgroundColor: '#0a7ea4',
        borderColor: '#0a7ea4',
    },
    dayButtonWeekend: {
        backgroundColor: '#7c3aed',
        borderColor: '#7c3aed',
    },
    dayNumber: { fontSize: 20, fontWeight: 'bold', opacity: 0.5 },
    dayNumberActive: { color: '#fff', opacity: 1 },
    dayText: { fontSize: 12, marginTop: 2, opacity: 0.7 },
    dayTextActive: { color: '#fff', opacity: 1 },
    resultContainer: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: 'rgba(10,126,164,0.1)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#0a7ea4',
        marginBottom: 20,
    },
    resultWeekend: {
        backgroundColor: 'rgba(124,58,237,0.1)',
        borderColor: '#7c3aed',
    },
    emoji: { fontSize: 48, marginBottom: 8 },
    resultHari: { marginBottom: 10 },
    colorWorkday: { color: '#0a7ea4' },
    colorWeekend: { color: '#7c3aed' },
    badge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 12,
    },
    badgeWorkday: { backgroundColor: '#0a7ea4' },
    badgeWeekend: { backgroundColor: '#7c3aed' },
    badgeText: { color: '#fff', fontWeight: 'bold' },
    switchInfo: {
        fontSize: 12,
        opacity: 0.5,
        fontFamily: 'monospace',
        marginTop: 4,
    },
});
