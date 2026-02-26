import React, { useEffect, useState, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Types for better safety
interface Movie {
    id: number;
    title: string;
    genre: string;
    runtime: string | number;
    rating: number;
    poster_url: string;
    overview: string;
}

export default function ResultScreen() {
    const { mood, time, platforms } = useLocalSearchParams();
    const router = useRouter();

    // We use a ref to track shown IDs. This persists across re-renders
    // and doesn't trigger a re-render when updated, which is perfect for getMovie dependencies.
    const shownMovieIds = useRef<number[]>([]);

    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);

    const getMovie = useCallback(async () => {
        setLoading(true);
        setError(null);
        setImageError(false);

        try {
            console.log("[ResultScreen] Fetching recommendation...", {
                mood,
                time,
                platforms,
                exclude: shownMovieIds.current
            });

            const response = await axios.post(
                "https://one-movie-at-a-time.onrender.com/api/movies/recommend",
                {
                    mood: mood || "Happy",
                    time: parseInt(time as string) || 160,
                    platforms: Array.isArray(platforms) ? platforms : [platforms || "Prime"],
                    exclude: shownMovieIds.current
                },
                { timeout: 30000 }
            );

            console.log("[ResultScreen] Data received:", response.data);

            if (response.data && response.data.title) {
                // Add this movie to our "shown" list so we don't see it again
                if (response.data.id && !shownMovieIds.current.includes(response.data.id)) {
                    shownMovieIds.current.push(response.data.id);
                }
                setMovie(response.data);
            } else {
                setMovie(null);
            }
        } catch (err: any) {
            console.error("[ResultScreen] API Error:", err.message);
            setError("Failed to connect to the server. Please check your connection.");
        } finally {
            setLoading(false);
        }
    }, [mood, time, platforms]);

    useEffect(() => {
        getMovie();
    }, [getMovie]);

    const handleRetry = useCallback(() => router.back(), [router]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#FF6500" />
                <Text style={styles.loadingText}>Finding your perfect movie...</Text>
            </View>
        );
    }

    if (error || !movie) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error || "No more movies matched your selection"}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                    <Text style={styles.retryButtonText}>Go Back & Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>MY RECOMMENDATION</Text>

                <View style={styles.posterContainer}>
                    {movie.poster_url && !imageError ? (
                        <Image
                            source={{ uri: movie.poster_url }}
                            style={styles.poster}
                            contentFit="cover"
                            transition={300}
                            onError={(e) => {
                                console.warn("[ResultScreen] Image load failed:", movie.poster_url);
                                setImageError(true);
                            }}
                        />
                    ) : (
                        <View style={[styles.poster, styles.posterFallback]}>
                            <Text style={styles.fallbackEmoji}>🎬</Text>
                            <Text style={styles.fallbackText}>{movie.title}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.movieTitle} numberOfLines={1}>{movie.title}</Text>

                    <View style={styles.badgeRow}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{movie.genre}</Text>
                        </View>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{movie.runtime} {typeof movie.runtime === 'number' ? 'min' : ''}</Text>
                        </View>
                    </View>

                    <Text style={styles.overviewText} numberOfLines={3} ellipsizeMode="tail">
                        {movie.overview}
                    </Text>

                    <View style={styles.ratingBox}>
                        <Text style={styles.ratingIcon}>⭐</Text>
                        <Text style={styles.ratingText}>
                            {typeof movie.rating === 'number' ? movie.rating.toFixed(1) : movie.rating}/10
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={getMovie}
                    disabled={loading}
                    activeOpacity={0.7}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "Loading..." : "🎲 Try Another"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    card: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: '#1a1a1a',
        borderRadius: 24,
        padding: 18,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 8,
    },
    loadingText: {
        color: '#888',
        marginTop: 12,
        fontSize: 14,
    },
    errorText: {
        color: '#ff4444',
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#333',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 14,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    title: {
        fontSize: 10,
        fontWeight: '800',
        color: '#FF6500',
        letterSpacing: 2,
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    posterContainer: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 8,
    },
    poster: {
        width: 260,
        height: 370,
        borderRadius: 16,
        backgroundColor: '#2a2a2a',
    },
    posterFallback: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderWidth: 2,
        borderColor: '#333',
        borderStyle: 'dashed',
    },
    fallbackEmoji: {
        fontSize: 40,
        marginBottom: 8,
    },
    fallbackText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    infoContainer: {
        width: '100%',
        marginTop: 12,
        alignItems: 'center',
    },
    movieTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 6,
    },
    badgeRow: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 10,
    },
    badge: {
        backgroundColor: '#333',
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    badgeText: {
        color: '#aaa',
        fontSize: 10,
        fontWeight: '600',
    },
    overviewText: {
        fontSize: 13,
        color: '#888',
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 12,
        paddingHorizontal: 5,
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 101, 0, 0.1)',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    ratingIcon: {
        fontSize: 14,
        marginRight: 4,
    },
    ratingText: {
        color: '#FF6500',
        fontSize: 14,
        fontWeight: '800',
    },
    button: {
        marginTop: 15,
        backgroundColor: "#FFD700",
        paddingVertical: 12,
        borderRadius: 14,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        fontWeight: "bold",
        fontSize: 15,
        color: "#000",
    },
});
