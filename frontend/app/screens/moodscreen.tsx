import React, { useState, useRef, useCallback } from "react";
import {
    View, Text, TouchableOpacity, StyleSheet,
    Animated, ScrollView, Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

// ── Data ──────────────────────────────────────────────────────────────────────

const MOODS = [
    { id: "Happy", label: "Happy", subtitle: "Cheerful & uplifting content", emoji: "😄", colors: ["#4f46e5", "#7c3aed"] as const },
    { id: "Sad", label: "Sad", subtitle: "Emotional & touching stories", emoji: "😢", colors: ["#1e3a5f", "#2563eb"] as const },
    { id: "Angry", label: "Angry", subtitle: "Intense & fiery energy", emoji: "😤", colors: ["#7f1d1d", "#dc2626"] as const },
    { id: "Normal", label: "Normal", subtitle: "Just browsing, anything goes", emoji: "😐", colors: ["#1a1a2e", "#16213e"] as const },
];

const GENRES = [
    { id: "Happy", label: "Happy", emoji: "😊" },
    { id: "Peace", label: "Peace", emoji: "☮️" },
    { id: "Sad", label: "Sad", emoji: "😢" },
    { id: "Intense", label: "Intense", emoji: "🔥" },
    { id: "Action", label: "Action", emoji: "💥" },
    { id: "Dark", label: "Dark", emoji: "🌑" },
    { id: "Thriller", label: "Thriller", emoji: "😰" },
    { id: "Suspense", label: "Suspense", emoji: "🕵️" },
    { id: "Crime", label: "Crime", emoji: "🔫" },
    { id: "Calm", label: "Calm", emoji: "🌊" },
    { id: "Journey", label: "Journey / Travel", emoji: "🗺️" },
];

// ── Animated Mood Card (single-select) ────────────────────────────────────────

const MoodCard = React.memo(({ item, selected, onPress }: {
    item: typeof MOODS[0];
    selected: boolean;
    onPress: () => void;
}) => {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Animated.sequence([
            Animated.timing(scale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
            Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
        ]).start();
        onPress();
    };

    return (
        <Animated.View style={[{ transform: [{ scale }] }, styles.cardWrap]}>
            <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={styles.cardTouch}>
                <LinearGradient
                    colors={selected ? item.colors : ["#141414", "#1e1e1e"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.moodCard, selected && styles.moodCardSelected]}
                >
                    <View style={styles.moodCardContent}>
                        <View style={styles.moodTextBlock}>
                            <Text style={styles.moodLabel}>{item.label}</Text>
                            <Text style={styles.moodSubtitle}>{item.subtitle}</Text>
                        </View>
                        <View style={[styles.emojiBox, selected && styles.emojiBoxSelected]}>
                            <Text style={styles.emojiText}>{item.emoji}</Text>
                        </View>
                    </View>
                    {selected && (
                        <View style={styles.checkDot}>
                            <Text style={styles.checkDotText}>✓</Text>
                        </View>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
});

// ── Animated Genre Chip (multi-select) ────────────────────────────────────────

const GenreChip = React.memo(({ item, selected, onPress }: {
    item: typeof GENRES[0];
    selected: boolean;
    onPress: () => void;
}) => {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Animated.sequence([
            Animated.timing(scale, { toValue: 0.93, duration: 70, useNativeDriver: true }),
            Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
        ]).start();
        onPress();
    };

    return (
        <Animated.View style={{ transform: [{ scale }], margin: 5 }}>
            <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
                <LinearGradient
                    colors={selected ? ["#FF6500", "#FF8534"] : ["#1a1a1a", "#242424"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.genreChip, selected && styles.genreChipSelected]}
                >
                    <Text style={styles.genreEmoji}>{item.emoji}</Text>
                    <Text style={[styles.genreLabel, selected && styles.genreLabelSelected]}>
                        {item.label}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
});

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function MoodScreen() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [mood, setMood] = useState("");
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

    // Fade animation for step transitions
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0.5)).current;  // 50% at step 1

    const fadeToStep = useCallback((nextStep: number) => {
        Animated.sequence([
            Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
        ]).start(() => {
            setStep(nextStep);
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
                Animated.timing(progressAnim, {
                    toValue: nextStep === 1 ? 0.5 : 1,
                    duration: 350,
                    useNativeDriver: false,
                }),
            ]).start();
        });
    }, [fadeAnim, progressAnim]);

    const handleNext = () => {
        if (step === 1 && mood) fadeToStep(2);
    };

    const handleBack = () => {
        if (step === 2) fadeToStep(1);
    };

    const toggleGenre = useCallback((id: string) => {
        setSelectedGenres(prev =>
            prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
        );
    }, []);

    const handleFindMovie = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.push({
            pathname: "/screens/resultscreen" as any,
            params: {
                mood,
                genres: selectedGenres.join(","),
                time: "160",
                platforms: "Prime",
            },
        });
    };

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    return (
        <View style={styles.container}>
            {/* ── Header / progress ── */}
            <View style={styles.topBar}>
                <Text style={styles.stepLabel}>STEP {step} OF 2</Text>
                <View style={styles.progressTrack}>
                    <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
                </View>
            </View>

            {/* ── Step content with fade ── */}
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                {step === 1 ? (
                    /* ── Step 1: Mood ── */
                    <View style={styles.stepInner}>
                        <View style={styles.header}>
                            <Text style={styles.heading}>How are you feeling?</Text>
                            <Text style={styles.subheading}>Choose the mood that matches your vibe</Text>
                        </View>

                        <View style={styles.moodList}>
                            {MOODS.map(item => (
                                <MoodCard
                                    key={item.id}
                                    item={item}
                                    selected={mood === item.id}
                                    onPress={() => setMood(item.id)}
                                />
                            ))}
                        </View>

                        <TouchableOpacity
                            style={[styles.btn, !mood && styles.btnDisabled]}
                            onPress={handleNext}
                            disabled={!mood}
                            activeOpacity={0.85}
                        >
                            <LinearGradient
                                colors={mood ? ["#FF6500", "#FF8040"] : ["#222", "#222"]}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                style={styles.btnGradient}
                            >
                                <Text style={[styles.btnText, !mood && styles.btnTextOff]}>Continue</Text>
                                <Text style={styles.btnArrow}>→</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                ) : (
                    /* ── Step 2: Genre ── */
                    <View style={styles.stepInner}>
                        <View style={styles.header}>
                            <Text style={styles.heading}>Pick a genre</Text>
                            <Text style={styles.subheading}>What kind of story are you in the mood for?</Text>
                        </View>

                        <ScrollView
                            contentContainerStyle={styles.genreGrid}
                            showsVerticalScrollIndicator={false}
                        >
                            {GENRES.map(item => (
                                <GenreChip
                                    key={item.id}
                                    item={item}
                                    selected={selectedGenres.includes(item.id)}
                                    onPress={() => toggleGenre(item.id)}
                                />
                            ))}
                        </ScrollView>

                        <View style={styles.btnRow}>
                            <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.8}>
                                <Text style={styles.backBtnText}>← Back</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.findBtn, !selectedGenres.length && styles.btnDisabled]}
                                onPress={handleFindMovie}
                                disabled={!selectedGenres.length}
                                activeOpacity={0.85}
                            >
                                <LinearGradient
                                    colors={selectedGenres.length ? ["#FF6500", "#FF8040"] : ["#222", "#222"]}
                                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                    style={styles.btnGradient}
                                >
                                    <Text style={[styles.btnText, !selectedGenres.length && styles.btnTextOff]}>
                                        Find My Movie ✨
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Animated.View>
        </View>
    );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0a0a0a" },

    // Progress bar
    topBar: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16 },
    stepLabel: { fontSize: 11, fontWeight: "700", color: "#FF6500", letterSpacing: 2, marginBottom: 10 },
    progressTrack: { height: 4, backgroundColor: "#1e1e1e", borderRadius: 2, overflow: "hidden" },
    progressFill: { height: 4, backgroundColor: "#FF6500", borderRadius: 2 },

    // Content wrapper
    content: { flex: 1 },
    stepInner: { flex: 1, paddingHorizontal: 20, paddingBottom: 32 },

    // Header
    header: { marginBottom: 24 },
    heading: { fontSize: 30, fontWeight: "800", color: "#fff", letterSpacing: -0.5, marginBottom: 6 },
    subheading: { fontSize: 15, color: "#666", fontWeight: "400" },

    // Mood cards
    moodList: { flex: 1, justifyContent: "center", gap: 12 },
    cardWrap: { borderRadius: 20 },
    cardTouch: { borderRadius: 20, overflow: "hidden" },
    moodCard: {
        padding: 20, borderRadius: 20,
        borderWidth: 1.5, borderColor: "#222",
    },
    moodCardSelected: { borderColor: "rgba(255,255,255,0.25)" },
    moodCardContent: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    moodTextBlock: { flex: 1, paddingRight: 12 },
    moodLabel: { fontSize: 22, fontWeight: "700", color: "#fff", marginBottom: 4 },
    moodSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.6)" },
    emojiBox: {
        width: 58, height: 58, borderRadius: 14,
        backgroundColor: "rgba(255,255,255,0.08)",
        justifyContent: "center", alignItems: "center",
    },
    emojiBoxSelected: { backgroundColor: "rgba(255,255,255,0.18)" },
    emojiText: { fontSize: 30 },
    checkDot: {
        position: "absolute", top: 12, right: 12,
        width: 24, height: 24, borderRadius: 12,
        backgroundColor: "#10b981",
        justifyContent: "center", alignItems: "center",
    },
    checkDotText: { color: "#fff", fontSize: 13, fontWeight: "800" },

    // Genre chips
    genreGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", paddingVertical: 8 },
    genreChip: {
        flexDirection: "row", alignItems: "center", gap: 6,
        paddingVertical: 12, paddingHorizontal: 18,
        borderRadius: 100, borderWidth: 1.5, borderColor: "#2a2a2a",
    },
    genreChipSelected: { borderColor: "#FF6500" },
    genreEmoji: { fontSize: 18 },
    genreLabel: { fontSize: 14, fontWeight: "600", color: "#888" },
    genreLabelSelected: { color: "#fff" },

    // Buttons
    btn: { borderRadius: 16, overflow: "hidden", marginTop: 12 },
    btnGradient: {
        paddingVertical: 17, paddingHorizontal: 24,
        flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8,
    },
    btnText: { color: "#fff", fontSize: 17, fontWeight: "700", letterSpacing: 0.3 },
    btnArrow: { color: "#fff", fontSize: 18 },
    btnDisabled: { opacity: 0.45 },
    btnTextOff: { color: "#555" },

    // Bottom button row (step 2)
    btnRow: { flexDirection: "row", gap: 12, marginTop: 16 },
    backBtn: {
        paddingVertical: 17, paddingHorizontal: 20,
        borderRadius: 16, backgroundColor: "#181818",
        borderWidth: 1, borderColor: "#2a2a2a",
        justifyContent: "center", alignItems: "center",
    },
    backBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" },
    findBtn: { flex: 1, borderRadius: 16, overflow: "hidden" },
});