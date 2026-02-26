import React, { useMemo } from 'react';
import {
    StyleSheet, Text, View, FlatList,
    TouchableOpacity, Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const COLUMN_GAP = 12;
const H_PAD = 16;
const CARD_WIDTH = (width - H_PAD * 2 - COLUMN_GAP) / 2;

// ── Types ─────────────────────────────────────────────────────────────────────

interface Movie {
    id: number;
    title: string;
    rating: number;
    runtime: number | string;
    genre: string;
    poster_url: string;
    overview: string;
    trailer_url: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** "horrorAndChills" → "Horror And Chills" */
const formatCategory = (key: string) =>
    key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()).trim();

// ── Sub-components ────────────────────────────────────────────────────────────

const MovieCard = ({ movie, onPress }: { movie: Movie; onPress: (m: Movie) => void }) => (
    <TouchableOpacity style={styles.card} onPress={() => onPress(movie)} activeOpacity={0.8}>
        <Image
            source={{ uri: movie.poster_url }}
            style={styles.poster}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
        />
        <View style={styles.cardInfo}>
            <Text style={styles.movieTitle} numberOfLines={2}>{movie.title}</Text>
            <View style={styles.ratingRow}>
                <Text style={styles.star}>⭐</Text>
                <Text style={styles.rating}>
                    {typeof movie.rating === 'number' ? movie.rating.toFixed(1) : movie.rating}
                </Text>
            </View>
        </View>
    </TouchableOpacity>
);

// ── Screen ────────────────────────────────────────────────────────────────────

export default function CategoryScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Movies are passed as a JSON string to avoid param size issues
    const movies: Movie[] = useMemo(() => {
        try {
            return JSON.parse(params.movies as string) as Movie[];
        } catch {
            return [];
        }
    }, [params.movies]);

    const categoryKey = params.category as string;
    const displayTitle = formatCategory(categoryKey);

    const renderItem = ({ item }: { item: Movie }) => (
        <MovieCard
            movie={item}
            onPress={movie =>
                router.push({
                    pathname: '/screens/movieresult' as any,
                    params: { movie: JSON.stringify(movie) },
                })
            }
        />
    );

    const ListHeader = () => (
        <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.heading}>{displayTitle}</Text>
            <Text style={styles.countLabel}>{movies.length} titles</Text>
        </View>
    );

    return (
        <LinearGradient colors={['#09203f', '#0a1628']} style={styles.gradient}>
            <FlatList
                data={movies}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                ListHeaderComponent={ListHeader}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                initialNumToRender={8}
                windowSize={5}
                removeClippedSubviews
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No movies in this category.</Text>
                    </View>
                }
            />
        </LinearGradient>
    );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    gradient: { flex: 1 },

    listContent: {
        paddingHorizontal: H_PAD,
        paddingBottom: 40,
    },

    // Header
    headerContainer: {
        paddingTop: 60,
        paddingBottom: 20,
    },
    backBtn: {
        marginBottom: 16,
        alignSelf: 'flex-start',
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 10,
    },
    backText: {
        color: '#aac4e0',
        fontSize: 14,
        fontWeight: '600',
    },
    heading: {
        fontSize: 30,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 0.3,
        marginBottom: 4,
    },
    countLabel: {
        color: '#5f7a96',
        fontSize: 13,
    },

    // Grid
    row: {
        justifyContent: 'space-between',
        marginBottom: COLUMN_GAP,
    },
    card: {
        width: CARD_WIDTH,
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: '#111d2e',
    },
    poster: {
        width: '100%',
        aspectRatio: 2 / 3,
        backgroundColor: '#1a2535',
    },
    cardInfo: {
        padding: 8,
    },
    movieTitle: {
        color: '#e0e8f0',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 4,
        lineHeight: 18,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    star: { fontSize: 11 },
    rating: {
        color: '#f5a623',
        fontSize: 12,
        fontWeight: '700',
    },

    // Empty
    empty: { flex: 1, alignItems: 'center', paddingTop: 60 },
    emptyText: { color: '#4a6070', fontSize: 15 },
});
