import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Keyboard,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────
export type SortOrder = 'asc' | 'desc';

export interface SortStep {
    array: number[];
    comparing?: [number, number];   // indices being compared
    swapping?: [number, number];    // indices being swapped
    sorted?: number[];              // indices already in final position
    message: string;
}

export type SortAlgorithm = (arr: number[], order: SortOrder) => SortStep[];

// ─── Props ────────────────────────────────────────────────────
interface Props {
    title: string;
    description: string;
    algorithm: SortAlgorithm;
}

// ─── Constants ────────────────────────────────────────────────
const MAX_NUMBERS = 10;
const ANIMATION_SPEED = 600; // ms per step
const BAR_COLORS = {
    default: '#0a7ea4',
    comparing: '#f59e0b',
    swapping: '#ef4444',
    sorted: '#22c55e',
};

// ─── Component ────────────────────────────────────────────────
export default function SortingVisualizer({ title, description, algorithm }: Props) {
    const textColor = useThemeColor({}, 'text');

    // State
    const [inputText, setInputText] = useState('');
    const [numbers, setNumbers] = useState<number[]>([]);
    const [order, setOrder] = useState<SortOrder>('asc');
    const [steps, setSteps] = useState<SortStep[]>([]);
    const [currentStepIdx, setCurrentStepIdx] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSorted, setIsSorted] = useState(false);

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const stepsRef = useRef<SortStep[]>([]);
    const currentStepRef = useRef(-1);

    // Keep refs in sync
    useEffect(() => {
        stepsRef.current = steps;
    }, [steps]);
    useEffect(() => {
        currentStepRef.current = currentStepIdx;
    }, [currentStepIdx]);

    // Current display state
    const currentStep: SortStep | null =
        currentStepIdx >= 0 && currentStepIdx < steps.length
            ? steps[currentStepIdx]
            : null;
    const displayArray = currentStep ? currentStep.array : numbers;

    // ── Input handling ────────────────────────────────────────
    const parseInput = (text: string): number[] => {
        return text
            .split(/[\s,]+/)
            .map((s) => parseInt(s, 10))
            .filter((n) => !isNaN(n))
            .slice(0, MAX_NUMBERS);
    };

    const handleInputDone = () => {
        const parsed = parseInput(inputText);
        setNumbers(parsed);
        resetVisualization();
        Keyboard.dismiss();
    };

    const generateRandom = () => {
        const arr: number[] = [];
        for (let i = 0; i < MAX_NUMBERS; i++) {
            arr.push(Math.floor(Math.random() * 99) + 1);
        }
        setNumbers(arr);
        setInputText(arr.join(', '));
        resetVisualization();
    };

    // ── Sorting ───────────────────────────────────────────────
    const startSort = () => {
        if (numbers.length < 2) return;
        const generatedSteps = algorithm([...numbers], order);
        setSteps(generatedSteps);
        setCurrentStepIdx(0);
        setIsPlaying(true);
        setIsSorted(false);
    };

    const resetVisualization = () => {
        stopPlayback();
        setSteps([]);
        setCurrentStepIdx(-1);
        setIsSorted(false);
    };

    const resetSameNumbers = () => {
        resetVisualization();
    };

    const resetNewNumbers = () => {
        setNumbers([]);
        setInputText('');
        resetVisualization();
    };

    // ── Playback ──────────────────────────────────────────────
    const stopPlayback = useCallback(() => {
        setIsPlaying(false);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const playNextStep = useCallback(() => {
        const nextIdx = currentStepRef.current + 1;
        if (nextIdx >= stepsRef.current.length) {
            setIsPlaying(false);
            setIsSorted(true);
            return;
        }
        setCurrentStepIdx(nextIdx);
        timerRef.current = setTimeout(playNextStep, ANIMATION_SPEED);
    }, []);

    useEffect(() => {
        if (isPlaying && steps.length > 0) {
            timerRef.current = setTimeout(playNextStep, ANIMATION_SPEED);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isPlaying, steps, playNextStep]);

    const togglePause = () => {
        if (isPlaying) {
            stopPlayback();
        } else if (currentStepIdx < steps.length - 1) {
            setIsPlaying(true);
        }
    };

    const stepForward = () => {
        if (currentStepIdx < steps.length - 1) {
            stopPlayback();
            setCurrentStepIdx((prev) => prev + 1);
        } else if (currentStepIdx === steps.length - 1) {
            setIsSorted(true);
        }
    };

    const stepBackward = () => {
        if (currentStepIdx > 0) {
            stopPlayback();
            setCurrentStepIdx((prev) => prev - 1);
            setIsSorted(false);
        }
    };

    // ── Bar rendering ─────────────────────────────────────────
    const maxVal = Math.max(...(displayArray.length > 0 ? displayArray : [1]));

    const getBarColor = (index: number): string => {
        if (!currentStep) return BAR_COLORS.default;
        if (currentStep.sorted?.includes(index)) return BAR_COLORS.sorted;
        if (currentStep.swapping?.includes(index)) return BAR_COLORS.swapping;
        if (currentStep.comparing?.includes(index)) return BAR_COLORS.comparing;
        return BAR_COLORS.default;
    };

    // ── Render ────────────────────────────────────────────────
    return (
        <ThemedView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                onScrollBeginDrag={Keyboard.dismiss}
            >
                {/* Header */}
                <ThemedText type="title" style={styles.header}>{title}</ThemedText>
                <ThemedText style={styles.description}>{description}</ThemedText>

                {/* Input Section */}
                <ThemedText type="defaultSemiBold" style={styles.label}>
                    Masukkan {MAX_NUMBERS} angka (pisahkan dengan koma):
                </ThemedText>
                <TextInput
                    style={[styles.input, { color: textColor, borderColor: textColor }]}
                    placeholder="Contoh: 5, 3, 8, 1, 9, 2, 7, 4, 6, 10"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmitEditing={handleInputDone}
                />

                <View style={styles.row}>
                    <TouchableOpacity style={styles.btnSecondary} onPress={handleInputDone}>
                        <ThemedText style={styles.btnSecondaryText}>Gunakan Input</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnPrimary} onPress={generateRandom}>
                        <ThemedText style={styles.btnPrimaryText} lightColor="#fff" darkColor="#fff">
                            🎲 Random
                        </ThemedText>
                    </TouchableOpacity>
                </View>

                {/* Order Toggle */}
                {numbers.length > 0 && (
                    <View style={styles.orderContainer}>
                        <ThemedText type="defaultSemiBold" style={styles.label}>Urutan:</ThemedText>
                        <View style={styles.row}>
                            <TouchableOpacity
                                style={[styles.orderBtn, order === 'asc' && styles.orderBtnActive]}
                                onPress={() => { setOrder('asc'); resetVisualization(); }}
                            >
                                <ThemedText
                                    style={order === 'asc' ? styles.orderBtnActiveText : styles.orderBtnText}
                                    lightColor={order === 'asc' ? '#fff' : undefined}
                                    darkColor={order === 'asc' ? '#fff' : undefined}
                                >
                                    ↑ Ascending
                                </ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.orderBtn, order === 'desc' && styles.orderBtnActive]}
                                onPress={() => { setOrder('desc'); resetVisualization(); }}
                            >
                                <ThemedText
                                    style={order === 'desc' ? styles.orderBtnActiveText : styles.orderBtnText}
                                    lightColor={order === 'desc' ? '#fff' : undefined}
                                    darkColor={order === 'desc' ? '#fff' : undefined}
                                >
                                    ↓ Descending
                                </ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Bar Visualization */}
                {displayArray.length > 0 && (
                    <View style={styles.vizContainer}>
                        <ThemedText type="defaultSemiBold" style={styles.vizLabel}>
                            {currentStep ? currentStep.message : 'Array awal'}
                        </ThemedText>
                        <View style={styles.barsRow}>
                            {displayArray.map((val, idx) => {
                                const heightPercent = (val / maxVal) * 100;
                                return (
                                    <View key={idx} style={styles.barWrapper}>
                                        <ThemedText style={styles.barValue}>{val}</ThemedText>
                                        <View
                                            style={[
                                                styles.bar,
                                                {
                                                    height: `${Math.max(heightPercent, 8)}%`,
                                                    backgroundColor: getBarColor(idx),
                                                },
                                            ]}
                                        />
                                        <ThemedText style={styles.barIndex}>{idx}</ThemedText>
                                    </View>
                                );
                            })}
                        </View>

                        {/* Legend */}
                        <View style={styles.legendRow}>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: BAR_COLORS.comparing }]} />
                                <ThemedText style={styles.legendText}>Comparing</ThemedText>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: BAR_COLORS.swapping }]} />
                                <ThemedText style={styles.legendText}>Swapping</ThemedText>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: BAR_COLORS.sorted }]} />
                                <ThemedText style={styles.legendText}>Sorted</ThemedText>
                            </View>
                        </View>

                        {/* Step counter */}
                        {steps.length > 0 && (
                            <ThemedText style={styles.stepCounter}>
                                Step {currentStepIdx + 1} / {steps.length}
                            </ThemedText>
                        )}
                    </View>
                )}

                {/* Control Buttons */}
                {numbers.length >= 2 && (
                    <View style={styles.controlSection}>
                        {steps.length === 0 && !isSorted && (
                            <TouchableOpacity style={styles.btnSort} onPress={startSort}>
                                <ThemedText style={styles.btnSortText} lightColor="#fff" darkColor="#fff">
                                    ▶ Mulai Sort
                                </ThemedText>
                            </TouchableOpacity>
                        )}

                        {steps.length > 0 && (
                            <View style={styles.playbackRow}>
                                <TouchableOpacity style={styles.playBtn} onPress={stepBackward}>
                                    <ThemedText style={styles.playBtnText}>⏮</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.playBtn} onPress={togglePause}>
                                    <ThemedText style={styles.playBtnText}>
                                        {isPlaying ? '⏸' : '▶'}
                                    </ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.playBtn} onPress={stepForward}>
                                    <ThemedText style={styles.playBtnText}>⏭</ThemedText>
                                </TouchableOpacity>
                            </View>
                        )}

                        {isSorted && (
                            <ThemedView style={styles.doneContainer}>
                                <ThemedText type="subtitle" style={styles.doneText}>
                                    Sorting selesai!
                                </ThemedText>
                            </ThemedView>
                        )}

                        {(steps.length > 0 || isSorted) && (
                            <View style={styles.resetRow}>
                                <TouchableOpacity style={styles.btnReset} onPress={resetSameNumbers}>
                                    <ThemedText style={styles.btnResetText}>Reset (Angka Sama)</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btnResetNew} onPress={resetNewNumbers}>
                                    <ThemedText style={styles.btnResetNewText} lightColor="#fff" darkColor="#fff">
                                        Ganti Angka
                                    </ThemedText>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </ThemedView>
    );
}

// ─── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 100 },
    header: { marginBottom: 8, textAlign: 'center', marginTop: 10 },
    description: { textAlign: 'center', marginBottom: 24, fontSize: 14, opacity: 0.7 },
    label: { marginBottom: 8 },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
    },
    row: { flexDirection: 'row', gap: 10, marginBottom: 12 },
    btnPrimary: {
        flex: 1,
        backgroundColor: '#0a7ea4',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    btnPrimaryText: { fontSize: 15, fontWeight: '600' },
    btnSecondary: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#0a7ea4',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    btnSecondaryText: { fontSize: 15, fontWeight: '600', color: '#0a7ea4' },

    // Order
    orderContainer: { marginBottom: 16 },
    orderBtn: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#0a7ea4',
        alignItems: 'center',
    },
    orderBtnActive: { backgroundColor: '#0a7ea4', borderColor: '#0a7ea4' },
    orderBtnText: { fontSize: 14, color: '#0a7ea4' },
    orderBtnActiveText: { fontSize: 14, fontWeight: '600' },

    // Visualization
    vizContainer: {
        backgroundColor: 'rgba(150, 150, 150, 0.08)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    vizLabel: { textAlign: 'center', marginBottom: 70, fontSize: 13 },
    barsRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        height: 180,
        gap: 4,
    },
    barWrapper: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
    barValue: { fontSize: 11, marginBottom: 4, fontWeight: '600' },
    bar: { width: '70%', borderRadius: 4, minHeight: 8 },
    barIndex: { fontSize: 10, marginTop: 4, opacity: 0.5 },

    // Legend
    legendRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 12, gap: 16 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    legendDot: { width: 10, height: 10, borderRadius: 5 },
    legendText: { fontSize: 11, opacity: 0.7 },
    stepCounter: { textAlign: 'center', marginTop: 8, fontSize: 12, opacity: 0.6 },

    // Controls
    controlSection: { marginTop: 4 },
    btnSort: {
        backgroundColor: '#22c55e',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
    },
    btnSortText: { fontSize: 18, fontWeight: 'bold' },
    playbackRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 16,
    },
    playBtn: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(10, 126, 164, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playBtnText: { fontSize: 22 },

    doneContainer: {
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        marginBottom: 16,
    },
    doneText: { color: '#22c55e' },

    resetRow: { flexDirection: 'row', gap: 10 },
    btnReset: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#f59e0b',
        alignItems: 'center',
    },
    btnResetText: { fontSize: 14, fontWeight: '600', color: '#f59e0b' },
    btnResetNew: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#6366f1',
        alignItems: 'center',
    },
    btnResetNewText: { fontSize: 14, fontWeight: '600' },
});
