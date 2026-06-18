import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getAllZodiacs, ZodiacRecord } from '@/lib/zodiac-repository';
import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

export default function ZodiacListScreen() {
    const [zodiacs, setZodiacs] = useState<ZodiacRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchZodiacs() {
            try {
                const data = await getAllZodiacs();
                setZodiacs(data);
            } catch (error) {
                console.error("Gagal mengambil data zodiak:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchZodiacs();
    }, []);

    const renderItem = ({ item }: { item: ZodiacRecord }) => (
        <View style={[styles.cardWrapper, { borderColor: item.warna }]}>
            <View style={[styles.cardBanner, { backgroundColor: item.warna }]}>
                <Image
                    source={item.gambar}
                    style={styles.zodiacImage}
                    contentFit="contain"
                />
                <View style={styles.cardInfo}>
                    <ThemedText style={styles.symbolText}>{item.simbol}</ThemedText>
                    <ThemedText
                        style={styles.zodiacName}
                        lightColor="#fff"
                        darkColor="#fff"
                    >
                        {item.nama_zodiak}
                    </ThemedText>
                    <ThemedText style={styles.dateRange} lightColor="rgba(255,255,255,0.9)" darkColor="rgba(255,255,255,0.9)">
                        {item.tanggal_mulai} – {item.tanggal_selesai}
                    </ThemedText>
                </View>
            </View>
        </View>
    );

    return (
        <ThemedView style={styles.root}>
            <Stack.Screen options={{ title: 'Daftar Zodiac' }} />

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#0a7ea4" />
                </View>
            ) : (
                <FlatList
                    data={zodiacs}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItem}
                    ListHeaderComponent={
                        <View style={styles.headerSection}>
                            <ThemedText style={styles.starRow}>✦ ✦ ✦</ThemedText>
                            <ThemedText type="title" style={styles.pageTitle}>
                                Daftar Zodiac
                            </ThemedText>
                            <ThemedText style={styles.pageSubtitle}>
                                Kenali 12 rasi bintang beserta simbol dan waktunya
                            </ThemedText>
                        </View>
                    }
                />
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    // Header
    headerSection: { alignItems: 'center', marginVertical: 20 },
    starRow: { fontSize: 18, letterSpacing: 8, opacity: 0.5, marginBottom: 6 },
    pageTitle: { textAlign: 'center', fontSize: 28, fontWeight: 'bold' },
    pageSubtitle: {
        textAlign: 'center', fontSize: 14, opacity: 0.6, marginTop: 6, paddingHorizontal: 20, marginBottom: 12
    },
    // Card
    cardWrapper: {
        borderRadius: 16,
        borderWidth: 2,
        overflow: 'hidden',
        marginBottom: 16,
    },
    cardBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 16,
    },
    zodiacImage: {
        width: 70,
        height: 70,
        borderRadius: 35
    },
    cardInfo: {
        flex: 1
    },
    symbolText: {
        fontSize: 24,
        color: 'rgba(255,255,255,0.85)',
        lineHeight: 30
    },
    zodiacName: {
        fontSize: 22,
        fontWeight: 'bold',
        lineHeight: 28
    },
    dateRange: {
        marginTop: 4,
        fontSize: 13
    },
});
