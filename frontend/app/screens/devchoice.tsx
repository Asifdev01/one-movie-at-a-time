import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState, useCallback, memo } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { Image } from 'expo-image'
import axios from 'axios'

interface Movie {
    id: number;
    title: string;
    rating: number;
    runtime: number;
    genre: string;
    poster_url: string;
    overview: string;
    trailer_url: string | null;
}

interface Collections {
    [key: string]: Movie[];
}

const MovieItem = memo(({ movie, onPress }: { movie: Movie, onPress: (movie: Movie) => void }) => (
    <TouchableOpacity
        style={styles.movieCard}
        onPress={() => onPress(movie)}
    >
        <Image
            source={{ uri: movie.poster_url }}
            style={styles.moviePoster}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
        />
        <Text style={styles.movieTitle} numberOfLines={2}>
            {movie.title}
        </Text>
    </TouchableOpacity>
));

const CategoryList = memo(({ category, movies, onMoviePress }: { category: string, movies: Movie[], onMoviePress: (movie: Movie) => void }) => {
    const renderMovie = useCallback(({ item }: { item: Movie }) => (
        <MovieItem movie={item} onPress={onMoviePress} />
    ), [onMoviePress]);

    const keyExtractor = useCallback((item: Movie) => item.id.toString(), []);

    return (
        <View style={styles.categoryCard}>
            <Text style={styles.categoryTitle}>
                {category.replace(/([A-Z])/g, " $1").trim()}
            </Text>
            <FlatList
                horizontal
                data={movies}
                renderItem={renderMovie}
                keyExtractor={keyExtractor}
                showsHorizontalScrollIndicator={false}
                initialNumToRender={4}
                windowSize={3}
                removeClippedSubviews={true}
            />
        </View>
    );
});

const DevChoice = () => {
    const router = useRouter();
    const [collections, setCollections] = useState<Collections>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                setLoading(true);
                const response = await axios.get("https://one-movie-at-a-time.onrender.com/api/movies/movie-collections");
                setCollections(response.data);
                setError(null);
            } catch (err: any) {
                console.error("[DevChoice] Fetch error:", err.message);
                setError("Failed to load developer picks. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchCollections();
    }, []);

    const handleMoviePress = useCallback((movie: Movie) => {
        router.push({
            pathname: "/screens/movieresult" as any,
            params: { movie: JSON.stringify(movie) }
        });
    }, [router]);

    const renderCategory = useCallback(({ item: category }: { item: string }) => (
        <CategoryList
            category={category}
            movies={collections[category]}
            onMoviePress={handleMoviePress}
        />
    ), [collections, handleMoviePress]);

    const keyExtractor = useCallback((item: string) => item, []);

    if (loading) {
        return (
            <LinearGradient colors={['#09203f', '#0f223aff']} style={styles.gradient}>
                <View style={[styles.container, styles.centerContent]}>
                    <ActivityIndicator size="large" color="#0486ce" />
                    <Text style={styles.loadingText}>Loading Boss's Favorites...</Text>
                </View>
            </LinearGradient>
        );
    }

    if (error) {
        return (
            <LinearGradient colors={['#09203f', '#0f223aff']} style={styles.gradient}>
                <View style={[styles.container, styles.centerContent]}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
                        <Text style={styles.retryButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        );
    }

    const categories = Object.keys(collections);

    return (
        <LinearGradient
            colors={['#09203f', '#0f223aff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.title}>Developer's Picks</Text>
                        <Text style={styles.subtitle}>Curated selections by the BOSS</Text>
                    </View>
                    <View style={styles.iconWrapper}>
                        <View style={styles.iconContainer}>
                            <Image
                                source={require('@/assets/images/doraemon-nobg.png')}
                                style={styles.icon}
                                contentFit="contain"
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.divider} />

                <FlatList
                    data={categories}
                    renderItem={renderCategory}
                    keyExtractor={keyExtractor}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={3}
                    windowSize={5}
                    removeClippedSubviews={true}
                />
            </View>
        </LinearGradient>
    )
}

export default DevChoice

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingTop: 80,
        paddingHorizontal: 10,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#ffffff',
        marginTop: 15,
        fontSize: 16,
    },
    errorText: {
        color: '#ff4444',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        paddingHorizontal: 25,
        paddingVertical: 12,
        backgroundColor: '#0486ce',
        borderRadius: 15,
    },
    retryButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    headerTextContainer: {
        flex: 1,
        paddingRight: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 14,
        color: '#b0b0b0',
        marginTop: 6,
        lineHeight: 20,
    },
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 70,
        height: 70,
        backgroundColor: 'rgba(4, 134, 206, 0.4)',
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    icon: {
        width: 55,
        height: 55,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginTop: 25,
        marginBottom: 10,
    },
    scrollContent: {
        paddingVertical: 20,
    },
    categoryCard: {
        marginBottom: 35,
    },
    categoryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 15,
        marginLeft: 5,
        textTransform: 'capitalize',
    },
    horizontalScroll: {
        flexDirection: 'row',
    },
    movieCard: {
        width: 120,
        marginRight: 15,
    },
    moviePoster: {
        width: '100%',
        height: 180,
        borderRadius: 16,
        backgroundColor: '#1a1a1a',
    },
    movieTitle: {
        fontSize: 13,
        color: '#ffffff',
        marginTop: 8,
        fontWeight: '500',
        textAlign: 'center',
    },
})