import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function ZodiacListScreen() {
    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ title: 'Daftar Zodiac' }} />
            <ThemedText type="title" style={styles.header}>Daftar Zodiac</ThemedText>
            <ThemedText>Fitur ini masih dalam tahap pengembangan.</ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        marginBottom: 16,
    },
});
