import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { type Href, Link, Stack } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

const MENU_DATA: Array<{ id: string; name: string; route: Href; icon: string }> = [
    { id: "zodiac-list",    name: "Daftar Zodiac",    route: { pathname: "/zodiac/zodiac-list" as any },    icon: "📋" },
    { id: "zodiac-finder",  name: "Pencarian Zodiac", route: { pathname: "/zodiac/zodiac-finder" as any },  icon: "🔮" },
];

export default function ZodiacMenuScreen() {
    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ title: 'Zodiac' }} />
            <FlatList
                data={MENU_DATA}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <Link href={item.route} asChild>
                        <Pressable style={styles.card}>
                            <View style={styles.imageContainer}>
                                <ThemedText style={styles.iconText}>{item.icon}</ThemedText>
                            </View>
                            <ThemedText type="defaultSemiBold" style={styles.nameText}>
                                {item.name}
                            </ThemedText>
                        </Pressable>
                    </Link>
                )}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    header: { marginBottom: 24, textAlign: 'center' },
    listContainer: { paddingBottom: 20 },
    card: {
        flex: 1,
        margin: 8,
        alignItems: 'center',
        backgroundColor: 'rgba(150, 150, 150, 0.1)',
        padding: 16,
        borderRadius: 12,
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        backgroundColor: '#fff',
        marginBottom: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 50,
    },
    nameText: { textAlign: 'center' }
});
