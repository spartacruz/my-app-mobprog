import { Stack } from 'expo-router';
import React from 'react';
import SortingVisualizer, { type SortAlgorithm, type SortOrder, type SortStep } from './_sorting-visualizer';

const insertionSortAlgorithm: SortAlgorithm = (arr: number[], order: SortOrder): SortStep[] => {
    const steps: SortStep[] = [];
    const a = [...arr];
    const n = a.length;

    steps.push({ array: [...a], sorted: [0], message: 'Array awal - elemen pertama dianggap sudah terurut' });

    for (let i = 1; i < n; i++) {
        const key = a[i];
        let j = i - 1;

        steps.push({
            array: [...a],
            comparing: [i, j],
            sorted: Array.from({ length: i }, (_, k) => k),
            message: `Ambil elemen index ${i} (${key}) untuk disisipkan`,
        });

        const shouldShift = (valJ: number) =>
            order === 'asc' ? valJ > key : valJ < key;

        while (j >= 0 && shouldShift(a[j])) {
            steps.push({
                array: [...a],
                comparing: [j, j + 1],
                sorted: Array.from({ length: i }, (_, k) => k),
                message: `Geser index ${j} (${a[j]}) ke kanan`,
            });
            a[j + 1] = a[j];
            steps.push({
                array: [...a],
                swapping: [j, j + 1],
                sorted: Array.from({ length: i }, (_, k) => k),
                message: `Index ${j} digeser ke index ${j + 1}`,
            });
            j--;
        }
        a[j + 1] = key;

        const sortedSoFar = Array.from({ length: i + 1 }, (_, k) => k);
        steps.push({
            array: [...a],
            sorted: sortedSoFar,
            message: `Sisipkan ${key} di index ${j + 1} - ${i + 1} elemen pertama terurut`,
        });
    }

    const allSorted = Array.from({ length: n }, (_, i) => i);
    steps.push({ array: [...a], sorted: allSorted, message: 'Sorting selesai!' });
    return steps;
};

export default function InsertionSortScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Insertion Sort' }} />
            <SortingVisualizer
                title="Insertion Sort"
                description="Mengambil elemen satu per satu dan menyisipkannya di posisi yang tepat dalam bagian yang sudah terurut."
                algorithm={insertionSortAlgorithm}
            />
        </>
    );
}
