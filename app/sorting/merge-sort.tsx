import { Stack } from 'expo-router';
import React from 'react';
import SortingVisualizer, { type SortAlgorithm, type SortOrder, type SortStep } from './_sorting-visualizer';

const mergeSortAlgorithm: SortAlgorithm = (arr: number[], order: SortOrder): SortStep[] => {
    const steps: SortStep[] = [];
    const a = [...arr];
    const n = a.length;
    const sorted: Set<number> = new Set();

    steps.push({ array: [...a], sorted: [], message: 'Array awal' });

    // We operate on the actual array `a` using index ranges
    function merge(left: number, mid: number, right: number) {
        const leftArr = a.slice(left, mid + 1);
        const rightArr = a.slice(mid + 1, right + 1);

        steps.push({
            array: [...a],
            comparing: [left, right],
            sorted: [...sorted],
            message: `Merge: sub-array [${left}..${mid}] dan [${mid + 1}..${right}]`,
        });

        let i = 0, j = 0, k = left;

        while (i < leftArr.length && j < rightArr.length) {
            const leftIdx = left + i;
            const rightIdx = mid + 1 + j;

            steps.push({
                array: [...a],
                comparing: [leftIdx, rightIdx],
                sorted: [...sorted],
                message: `Bandingkan ${leftArr[i]} (dari kiri) dengan ${rightArr[j]} (dari kanan)`,
            });

            const pickLeft = order === 'asc'
                ? leftArr[i] <= rightArr[j]
                : leftArr[i] >= rightArr[j];

            if (pickLeft) {
                a[k] = leftArr[i];
                i++;
            } else {
                a[k] = rightArr[j];
                j++;
            }

            steps.push({
                array: [...a],
                swapping: [k, k],
                sorted: [...sorted],
                message: `Tempatkan ${a[k]} di index ${k}`,
            });
            k++;
        }

        while (i < leftArr.length) {
            a[k] = leftArr[i];
            steps.push({
                array: [...a],
                swapping: [k, k],
                sorted: [...sorted],
                message: `Salin sisa kiri: ${a[k]} di index ${k}`,
            });
            i++;
            k++;
        }

        while (j < rightArr.length) {
            a[k] = rightArr[j];
            steps.push({
                array: [...a],
                swapping: [k, k],
                sorted: [...sorted],
                message: `Salin sisa kanan: ${a[k]} di index ${k}`,
            });
            j++;
            k++;
        }

        // If this is the final merge, mark all as sorted
        if (left === 0 && right === n - 1) {
            for (let idx = 0; idx < n; idx++) sorted.add(idx);
        }
    }

    function mergeSort(left: number, right: number) {
        if (left >= right) return;

        const mid = Math.floor((left + right) / 2);

        steps.push({
            array: [...a],
            comparing: [left, right],
            sorted: [...sorted],
            message: `Bagi array [${left}..${right}] menjadi [${left}..${mid}] dan [${mid + 1}..${right}]`,
        });

        mergeSort(left, mid);
        mergeSort(mid + 1, right);
        merge(left, mid, right);
    }

    mergeSort(0, n - 1);

    const allSorted = Array.from({ length: n }, (_, i) => i);
    steps.push({ array: [...a], sorted: allSorted, message: 'Sorting selesai!' });
    return steps;
};

export default function MergeSortScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Merge Sort' }} />
            <SortingVisualizer
                title="Merge Sort"
                description="Membagi array menjadi dua bagian secara rekursif, mengurutkan masing-masing, lalu menggabungkan kembali."
                algorithm={mergeSortAlgorithm}
            />
        </>
    );
}
