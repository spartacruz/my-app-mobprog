import { Stack } from 'expo-router';
import React from 'react';
import SortingVisualizer, { type SortAlgorithm, type SortOrder, type SortStep } from './_sorting-visualizer';

const quickSortAlgorithm: SortAlgorithm = (arr: number[], order: SortOrder): SortStep[] => {
    const steps: SortStep[] = [];
    const a = [...arr];
    const n = a.length;
    const sorted: Set<number> = new Set();

    steps.push({ array: [...a], sorted: [], message: 'Array awal' });

    function partition(low: number, high: number): number {
        const pivot = a[high];
        steps.push({
            array: [...a],
            comparing: [high, high],
            sorted: [...sorted],
            message: `Pivot dipilih: index ${high} (${pivot})`,
        });

        let i = low - 1;

        for (let j = low; j < high; j++) {
            steps.push({
                array: [...a],
                comparing: [j, high],
                sorted: [...sorted],
                message: `Bandingkan index ${j} (${a[j]}) dengan pivot (${pivot})`,
            });

            const shouldSwap = order === 'asc' ? a[j] < pivot : a[j] > pivot;
            if (shouldSwap) {
                i++;
                if (i !== j) {
                    [a[i], a[j]] = [a[j], a[i]];
                    steps.push({
                        array: [...a],
                        swapping: [i, j],
                        sorted: [...sorted],
                        message: `Tukar index ${i} (${a[i]}) dengan index ${j} (${a[j]})`,
                    });
                }
            }
        }

        // Place pivot
        i++;
        if (i !== high) {
            [a[i], a[high]] = [a[high], a[i]];
            steps.push({
                array: [...a],
                swapping: [i, high],
                sorted: [...sorted],
                message: `Tempatkan pivot di index ${i}`,
            });
        }

        sorted.add(i);
        steps.push({
            array: [...a],
            sorted: [...sorted],
            message: `Pivot ${a[i]} sudah di posisi akhir (index ${i})`,
        });

        return i;
    }

    function quickSort(low: number, high: number) {
        if (low >= high) {
            if (low === high) sorted.add(low);
            return;
        }

        steps.push({
            array: [...a],
            comparing: [low, high],
            sorted: [...sorted],
            message: `Proses sub-array [${low}..${high}]`,
        });

        const pi = partition(low, high);
        quickSort(low, pi - 1);
        quickSort(pi + 1, high);
    }

    quickSort(0, n - 1);

    const allSorted = Array.from({ length: n }, (_, i) => i);
    steps.push({ array: [...a], sorted: allSorted, message: 'Sorting selesai!' });
    return steps;
};

export default function QuickSortScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Quick Sort' }} />
            <SortingVisualizer
                title="Quick Sort"
                description="Memilih elemen pivot, mempartisi array sehingga elemen lebih kecil di kiri dan lebih besar di kanan, lalu mengurutkan secara rekursif."
                algorithm={quickSortAlgorithm}
            />
        </>
    );
}
