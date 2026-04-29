import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { type Href, Link, Stack } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

const calcImg = require('@/assets/images/calculation.png');


const MENU_DATA: Array<{ id: string; name: string; route: Href; image: number }> = [
    { id: "maxmin", name: "Max & Min", route: { pathname: "/conditional/maxmin" }, image: calcImg },
    // Penggunaan Nested IF
    // Penggunaan Switch-Case
    // Penggunaan diskon menggunakan Switch-case


];

export default function ConditionalMenuScreen() {
    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ title: 'Percabangan' }} />
            <FlatList
                data={MENU_DATA}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (

                    <Link href={item.route} asChild>
                        <Pressable style={styles.card}>
                            <View style={styles.imageContainer}>
                                <Image source={item.image} style={styles.image} contentFit="contain" />
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
    image: { width: 80, height: 80 },
    nameText: { textAlign: 'center' }
});