import { Stack } from 'expo-router';
import React from 'react';
import SortingVisualizer, { type SortAlgorithm, type SortOrder, type SortStep } from './_sorting-visualizer';

const bubbleSortAlgorithm: SortAlgorithm = (arr: number[], order: SortOrder): SortStep[] => {
    const steps: SortStep[] = [];
    const a = [...arr];
    const n = a.length;
    const sorted: number[] = [];

    steps.push({ array: [...a], sorted: [], message: 'Array awal' });

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - 1 - i; j++) {
            // Compare
            steps.push({
                array: [...a],
                comparing: [j, j + 1],
                sorted: [...sorted],
                message: `Bandingkan index ${j} (${a[j]}) dan index ${j + 1} (${a[j + 1]})`,
            });

            const shouldSwap = order === 'asc' ? a[j] > a[j + 1] : a[j] < a[j + 1];
            if (shouldSwap) {
                // Swap
                [a[j], a[j + 1]] = [a[j + 1], a[j]];
                swapped = true;
                steps.push({
                    array: [...a],
                    swapping: [j, j + 1],
                    sorted: [...sorted],
                    message: `Tukar index ${j} dan index ${j + 1}`,
                });
            }
        }
        sorted.push(n - 1 - i);
        steps.push({
            array: [...a],
            sorted: [...sorted],
            message: `Pass ${i + 1} selesai - elemen index ${n - 1 - i} sudah di posisi akhir`,
        });
        if (!swapped) break;
    }

    // Mark all sorted
    const allSorted = Array.from({ length: n }, (_, i) => i);
    steps.push({ array: [...a], sorted: allSorted, message: 'Sorting selesai!' });
    return steps;
};

export default function BubbleSortScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Bubble Sort' }} />
            <SortingVisualizer
                title="Bubble Sort"
                description="Membandingkan elemen bersebelahan dan menukarnya jika urutannya salah. Proses diulang hingga tidak ada pertukaran."
                algorithm={bubbleSortAlgorithm}
            />
        </>
    );
}
