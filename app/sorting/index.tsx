import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { type Href, Link, Stack } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

const bubbleImg    = require('@/assets/images/bubble-sort.png');
const selectionImg = require('@/assets/images/selection-sort.png');
const insertionImg = require('@/assets/images/insertion-sort.png');
const mergeImg     = require('@/assets/images/merge-sort.png');
const quickImg     = require('@/assets/images/quick-sort.png');

const MENU_DATA: Array<{ id: string; name: string; route: Href; image: number }> = [
    { id: "bubble-sort",    name: "Bubble Sort",    route: { pathname: "/sorting/bubble-sort" },    image: bubbleImg },
    { id: "selection-sort",  name: "Selection Sort",  route: { pathname: "/sorting/selection-sort" },  image: selectionImg },
    { id: "insertion-sort",  name: "Insertion Sort",  route: { pathname: "/sorting/insertion-sort" },  image: insertionImg },
    { id: "merge-sort",      name: "Merge Sort",      route: { pathname: "/sorting/merge-sort" },      image: mergeImg },
    { id: "quick-sort",      name: "Quick Sort",      route: { pathname: "/sorting/quick-sort" },      image: quickImg },
];

export default function SortingMenuScreen() {
    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ title: 'Sorting' }} />
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