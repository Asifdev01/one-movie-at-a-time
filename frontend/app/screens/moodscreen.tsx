import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get("window");

export default function MoodScreen() {
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState(1);
    const [mood, setMood] = useState("");
    const [platform, setPlatform] = useState("");

    const handleNext = () => {
        if (currentStep < 2) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleContinue = () => {
        router.push({
            pathname: "/screens/resultscreen" as any,
            params: {
                mood,
                time: "160",
                platforms: platform,
            },
        });
    };

    const OptionCard = ({ title, subtitle, emoji, selected, onPress, gradient }: any) => (
        <TouchableOpacity
            style={[styles.card, selected && styles.cardSelected]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <LinearGradient
                colors={selected ? gradient : ['#1a1a1a', '#1a1a1a']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
            >
                <View style={styles.cardContent}>
                    <View style={styles.textContainer}>
                        <Text style={styles.cardTitle}>{title}</Text>
                        <Text style={styles.cardSubtitle}>{subtitle}</Text>
                    </View>
                    <View style={styles.emojiContainer}>
                        <Text style={styles.emoji}>{emoji}</Text>
                    </View>
                </View>
                {selected && <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                </View>}
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${(currentStep / 2) * 100}%` }]} />
                </View>
                <Text style={styles.progressText}>Step {currentStep} of 2</Text>
            </View>

            {/* Step 1: Mood Selection */}
            {currentStep === 1 && (
                <View style={styles.stepContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.stepLabel}>STEP 1</Text>
                        <Text style={styles.question}>How are you feeling?</Text>
                        <Text style={styles.subtitle}>Choose the mood that matches your vibe</Text>
                    </View>

                    <View style={styles.optionsContainer}>
                        <OptionCard
                            title="Happy"
                            subtitle="Cheerful & uplifting content"
                            emoji="😊"
                            gradient={['#6561e5ff', '#f5f5f5']}
                            selected={mood === "Happy"}
                            onPress={() => setMood("Happy")}
                        />

                        <OptionCard
                            title="Intense"
                            subtitle="Thrilling & action-packed"
                            emoji="🔥"
                            gradient={['#79431cff', '#f14444ff']}
                            selected={mood === "Intense"}
                            onPress={() => setMood("Intense")}
                        />

                        <OptionCard
                            title="Dark"
                            subtitle="Mysterious & suspenseful"
                            emoji="🌙"
                            gradient={['#062d53ff', '#522929ff']}
                            selected={mood === "Dark"}
                            onPress={() => setMood("Dark")}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.nextButton, !mood && styles.buttonDisabled]}
                        onPress={handleNext}
                        disabled={!mood}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={mood ? ['#FF6500', '#FF8534'] : ['#2a2a2a', '#2a2a2a']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.buttonGradient}
                        >
                            <Text style={[styles.buttonText, !mood && styles.buttonTextDisabled]}>
                                Continue
                            </Text>
                            <Text style={styles.arrow}>→</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            )}

            {currentStep === 2 && (
                <View style={styles.stepContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.stepLabel}>STEP 2</Text>
                        <Text style={styles.question}>Choose your platform</Text>
                        <Text style={styles.subtitle}>Where do you want to watch?</Text>
                    </View>

                    <View style={styles.optionsContainer}>
                        <OptionCard
                            title="Prime Video"
                            subtitle="Amazon Prime Video"
                            emoji="📺"
                            gradient={['#00A8E1', '#00C9FF']}
                            selected={platform === "Prime"}
                            onPress={() => setPlatform("Prime")}
                        />

                        <OptionCard
                            title="Netflix"
                            subtitle="Netflix streaming"
                            emoji="🎬"
                            gradient={['#E50914', '#B20710']}
                            selected={platform === "Netflix"}
                            onPress={() => setPlatform("Netflix")}
                        />

                        <OptionCard
                            title="All Platforms"
                            subtitle="Search everywhere"
                            emoji="🌟"
                            gradient={['#8B5CF6', '#6366F1']}
                            selected={platform === "Both"}
                            onPress={() => setPlatform("Both")}
                        />
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={handleBack}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.backButtonText}>← Back</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.pickButton, !platform && styles.buttonDisabled]}
                            onPress={handleContinue}
                            disabled={!platform}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={platform ? ['#FF6500', '#FF8534'] : ['#2a2a2a', '#2a2a2a']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.buttonGradient}
                            >
                                <Text style={[styles.buttonText, !platform && styles.buttonTextDisabled]}>
                                    Find My Movie
                                </Text>
                                <Text style={styles.arrow}>✨</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0a0a0a",
    },
    progressContainer: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
    },
    progressBar: {
        height: 4,
        backgroundColor: "#1a1a1a",
        borderRadius: 2,
        overflow: "hidden",
        marginBottom: 12,
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#FF6500",
        borderRadius: 2,
    },
    progressText: {
        fontSize: 12,
        color: "#666",
        fontWeight: "500",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    stepContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 40,
    },
    headerContainer: {
        marginBottom: 32,
    },
    stepLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: "#FF6500",
        marginBottom: 12,
        letterSpacing: 2,
    },
    question: {
        fontSize: 32,
        fontWeight: "700",
        color: "#FFFFFF",
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: "#888",
        fontWeight: "400",
    },
    optionsContainer: {
        flex: 1,
    },
    card: {
        borderRadius: 20,
        marginBottom: 16,
        overflow: "hidden",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    cardSelected: {
        elevation: 8,
        shadowOpacity: 0.5,
        shadowRadius: 12,
    },
    cardGradient: {
        padding: 24,
        borderWidth: 2,
        borderColor: "transparent",
        borderRadius: 20,
    },
    cardContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    textContainer: {
        flex: 1,
        paddingRight: 16,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#FFFFFF",
        marginBottom: 6,
        letterSpacing: -0.3,
    },
    cardSubtitle: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.7)",
        fontWeight: "400",
    },
    emojiContainer: {
        width: 64,
        height: 64,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    emoji: {
        fontSize: 36,
    },
    checkmark: {
        position: "absolute",
        top: 16,
        right: 16,
        width: 28,
        height: 28,
        backgroundColor: "#10B981",
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    checkmarkText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
    nextButton: {
        borderRadius: 16,
        overflow: "hidden",
        marginTop: 8,
    },
    pickButton: {
        flex: 1,
        borderRadius: 16,
        overflow: "hidden",
        marginLeft: 12,
    },
    backButton: {
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 16,
        backgroundColor: "#1a1a1a",
        borderWidth: 1,
        borderColor: "#2a2a2a",
        alignItems: "center",
        justifyContent: "center",
    },
    backButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonGradient: {
        paddingVertical: 18,
        paddingHorizontal: 24,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
        letterSpacing: 0.3,
    },
    buttonTextDisabled: {
        color: "#666",
    },
    arrow: {
        fontSize: 18,
        color: "#FFFFFF",
    },
    buttonRow: {
        flexDirection: "row",
        marginTop: 8,
    },
});