import { Stack } from 'expo-router';
import React from 'react';
import SortingVisualizer, { type SortAlgorithm, type SortOrder, type SortStep } from './_sorting-visualizer';

const selectionSortAlgorithm: SortAlgorithm = (arr: number[], order: SortOrder): SortStep[] => {
    const steps: SortStep[] = [];
    const a = [...arr];
    const n = a.length;
    const sorted: number[] = [];

    steps.push({ array: [...a], sorted: [], message: 'Array awal' });

    for (let i = 0; i < n - 1; i++) {
        let targetIdx = i; // min for asc, max for desc

        for (let j = i + 1; j < n; j++) {
            // Compare current target with j
            steps.push({
                array: [...a],
                comparing: [targetIdx, j],
                sorted: [...sorted],
                message: `Cari ${order === 'asc' ? 'minimum' : 'maximum'}: bandingkan index ${targetIdx} (${a[targetIdx]}) dengan index ${j} (${a[j]})`,
            });

            const shouldUpdate = order === 'asc' ? a[j] < a[targetIdx] : a[j] > a[targetIdx];
            if (shouldUpdate) {
                targetIdx = j;
            }
        }

        if (targetIdx !== i) {
            [a[i], a[targetIdx]] = [a[targetIdx], a[i]];
            steps.push({
                array: [...a],
                swapping: [i, targetIdx],
                sorted: [...sorted],
                message: `Tukar index ${i} dengan index ${targetIdx} (${order === 'asc' ? 'min' : 'max'} ditemukan)`,
            });
        }

        sorted.push(i);
        steps.push({
            array: [...a],
            sorted: [...sorted],
            message: `Elemen index ${i} sudah di posisi akhir (${a[i]})`,
        });
    }

    sorted.push(n - 1);
    steps.push({ array: [...a], sorted: [...sorted], message: 'Sorting selesai!' });
    return steps;
};

export default function SelectionSortScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Selection Sort' }} />
            <SortingVisualizer
                title="Selection Sort"
                description="Mencari elemen terkecil (atau terbesar) dari bagian yang belum terurut, lalu menempatkannya di posisi yang benar."
                algorithm={selectionSortAlgorithm}
            />
        </>
    );
}
