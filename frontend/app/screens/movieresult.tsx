import React, { useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert, Dimensions } from "react-native";
import { Image } from 'expo-image';
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function MovieDetailScreen() {
    const route = useRoute<any>();
    const movie = route.params.movie ? (typeof route.params.movie === 'string' ? JSON.parse(route.params.movie) : route.params.movie) : null;

    const handleTrailerPress = useCallback(() => {
        if (movie?.trailer_url) {
            Linking.openURL(movie.trailer_url);
        } else {
            Alert.alert("Not Available", "Trailer not available for this movie.");
        }
    }, [movie?.trailer_url]);

    if (!movie) return null;

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.backdropContainer}>
                <Image
                    source={{ uri: movie.poster_url }}
                    style={styles.backdrop}
                    contentFit="cover"
                    blurRadius={20}
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)', '#000']}
                    style={styles.gradient}
                />
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.posterCard}>
                    <Image
                        source={{ uri: movie.poster_url }}
                        style={styles.poster}
                        contentFit="cover"
                        transition={300}
                    />
                    <View style={styles.posterShadow} />
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{movie.title}</Text>

                    <View style={styles.ratingContainer}>
                        <View style={styles.ratingBadge}>
                            <Text style={styles.ratingIcon}>⭐</Text>
                            <Text style={styles.ratingText}>{movie.rating}</Text>
                            <Text style={styles.ratingOutOf}>/10</Text>
                        </View>
                    </View>
                    <View style={styles.overviewContainer}>
                        <Text style={styles.overviewLabel}>Synopsis</Text>
                        <Text style={styles.overview}>{movie.overview}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.primaryButton, !movie.trailer_url && styles.disabledButton]}
                            onPress={handleTrailerPress}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.playIcon}>▶</Text>
                            <Text style={styles.primaryButtonText}>Watch Trailer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    scrollContent: {
        paddingBottom: 40,
    },
    backdropContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height * 0.5,
        overflow: 'hidden',
    },
    backdrop: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
    },
    contentContainer: {
        paddingTop: 100,
        alignItems: "center",
        paddingHorizontal: 20,
    },
    posterCard: {
        position: 'relative',
        marginBottom: 30,
    },
    poster: {
        width: width * 0.6,
        height: width * 0.85,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    posterShadow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 20,
        },
        shadowOpacity: 0.8,
        shadowRadius: 30,
        elevation: 20,
    },
    infoContainer: {
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: "900",
        color: "#fff",
        marginBottom: 16,
        textAlign: "center",
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    ratingContainer: {
        marginBottom: 30,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 215, 0, 0.3)',
    },
    ratingIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    ratingText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFD700",
    },
    ratingOutOf: {
        fontSize: 16,
        color: "#FFD700",
        opacity: 0.7,
        marginLeft: 2,
    },
    overviewContainer: {
        width: '100%',
        marginBottom: 30,
    },
    overviewLabel: {
        fontSize: 18,
        fontWeight: "700",
        color: "#fff",
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    overview: {
        fontSize: 16,
        color: "#ccc",
        lineHeight: 24,
        textAlign: "left",
        letterSpacing: 0.3,
    },
    buttonContainer: {
        width: '100%',
        gap: 12,
    },
    primaryButton: {
        backgroundColor: "#0486ce",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
        shadowColor: "#0486ce",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 10,
    },
    playIcon: {
        color: "#fff",
        fontSize: 18,
        marginRight: 10,
    },
    primaryButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    disabledButton: {
        backgroundColor: "#333",
        opacity: 0.5,
        shadowOpacity: 0,
    },
});