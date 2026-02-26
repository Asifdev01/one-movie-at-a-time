import React, { useEffect, useState, useCallback, memo } from 'react'
import {
    StyleSheet, Text, View, TouchableOpacity,
    ActivityIndicator, FlatList, TextInput,
} from 'react-native'
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

const formatCategory = (key: string) =>
    key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, c => c.toUpperCase())
        .trim();

const MovieItem = memo(({ movie, onPress }: { movie: Movie; onPress: (m: Movie) => void }) => (
    <TouchableOpacity style={styles.movieCard} onPress={() => onPress(movie)}>
        <Image
            source={{ uri: movie.poster_url }}
            style={styles.moviePoster}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
        />
        <Text style={styles.movieTitle} numberOfLines={2}>{movie.title}</Text>
    </TouchableOpacity>
));

const CategoryList = memo(({ category, movies, onMoviePress, onCategoryPress }: {
    category: string;
    movies: Movie[];
    onMoviePress: (m: Movie) => void;
    onCategoryPress: (category: string, movies: Movie[]) => void;
}) => {
    const uniqueMovies = movies.filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i);

    const renderMovie = useCallback(({ item }: { item: Movie }) => (
        <MovieItem movie={item} onPress={onMoviePress} />
    ), [onMoviePress]);

    return (
        <View style={styles.categoryCard}>
            <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => onCategoryPress(category, uniqueMovies)}
                activeOpacity={0.7}
            >
                <Text style={styles.categoryTitle}>{formatCategory(category)}</Text>
                <Text style={styles.categoryChevron}>›</Text>
            </TouchableOpacity>
            <FlatList
                horizontal
                data={uniqueMovies}
                renderItem={renderMovie}
                keyExtractor={item => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                initialNumToRender={4}
                windowSize={3}
                removeClippedSubviews
            />
        </View>
    );
});

export default function DevChoice() {
    const router = useRouter();
    const [collections, setCollections] = useState<Collections>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchCollections = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get(
                'https://one-movie-at-a-time.onrender.com/api/movies/movie-collections',
                { timeout: 30000 }
            );
            const data = res.data;
            if (!data || Object.keys(data).length === 0) {
                setError('Received empty data from server. Please try again.');
            } else {
                setCollections(data);
            }
        } catch (err: any) {
            setError('Failed to load picks. Check your connection.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCollections(); }, [fetchCollections]);

    const handleMoviePress = useCallback((movie: Movie) => {
        router.push({
            pathname: '/screens/movieresult' as any,
            params: { movie: JSON.stringify(movie) },
        });
    }, [router]);

    const handleCategoryPress = useCallback((category: string, movies: Movie[]) => {
        router.push({
            pathname: '/screens/categoryscreen' as any,
            params: { category, movies: JSON.stringify(movies) },
        });
    }, [router]);

    const filteredCategories = Object.keys(collections).filter(key =>
        formatCategory(key).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const gridItems = searchQuery.length > 0
        ? filteredCategories.flatMap(cat =>
            (collections[cat] || [])
                .filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i)
                .map(movie => ({ movie, category: cat }))
        ).filter((item, i, arr) =>
            arr.findIndex(x => x.movie.id === item.movie.id) === i
        )
        : [];

    const renderCategory = useCallback(({ item }: { item: string }) => (
        <CategoryList
            category={item}
            movies={collections[item]}
            onMoviePress={handleMoviePress}
            onCategoryPress={handleCategoryPress}
        />
    ), [collections, handleMoviePress, handleCategoryPress]);

    const renderGridItem = useCallback(({ item }: { item: { movie: Movie; category: string } }) => (
        <TouchableOpacity
            style={styles.gridCard}
            onPress={() => handleMoviePress(item.movie)}
            activeOpacity={0.8}
        >
            <Image
                source={{ uri: item.movie.poster_url }}
                style={styles.gridPoster}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
            />
            <Text style={styles.gridTitle} numberOfLines={2}>{item.movie.title}</Text>
        </TouchableOpacity>
    ), [handleMoviePress]);

    if (loading) {
        return (
            <LinearGradient colors={['#09203f', '#0f223a']} style={styles.gradient}>
                <View style={[styles.container, styles.center]}>
                    <ActivityIndicator size="large" color="#0486ce" />
                    <Text style={styles.loadingText}>Loading Boss's Favorites...</Text>
                </View>
            </LinearGradient>
        );
    }

    if (error) {
        return (
            <LinearGradient colors={['#09203f', '#0f223a']} style={styles.gradient}>
                <View style={[styles.container, styles.center]}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchCollections}>
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#09203f', '#0f223a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
            <View style={styles.container}>

                <View style={styles.header}>
                    <View style={styles.headerText}>
                        <Text style={styles.title}>Developer's Picks</Text>
                        <Text style={styles.subtitle}>Curated selections by the BOSS</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <Image
                            source={require('@/assets/images/doraemon-nobg.png')}
                            style={styles.icon}
                            contentFit="contain"
                        />
                    </View>
                </View>

                <View style={styles.searchBar}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search categories..."
                        placeholderTextColor="#55677a"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType="search"
                        autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Text style={styles.clearBtn}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.divider} />

                {filteredCategories.length === 0 ? (
                    <View style={styles.center}>
                        <Text style={styles.noResults}>
                            {searchQuery.length > 0 ? 'No categories match your search' : 'No categories loaded'}
                        </Text>
                        {searchQuery.length === 0 && (
                            <TouchableOpacity style={[styles.retryButton, { marginTop: 16 }]} onPress={fetchCollections}>
                                <Text style={styles.retryButtonText}>Retry</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : searchQuery.length > 0 ? (
                    <>
                        <Text style={styles.gridResultLabel}>
                            {gridItems.length} movie{gridItems.length !== 1 ? 's' : ''} in {filteredCategories.length} categor{filteredCategories.length !== 1 ? 'ies' : 'y'}
                        </Text>
                        <FlatList
                            data={gridItems}
                            renderItem={renderGridItem}
                            keyExtractor={item => item.movie.id.toString()}
                            numColumns={3}
                            contentContainerStyle={styles.gridContent}
                            columnWrapperStyle={styles.gridRow}
                            showsVerticalScrollIndicator={false}
                            initialNumToRender={12}
                            windowSize={5}
                            removeClippedSubviews
                        />
                    </>
                ) : (
                    <FlatList
                        data={filteredCategories}
                        renderItem={renderCategory}
                        keyExtractor={item => item}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={3}
                        windowSize={5}
                        removeClippedSubviews
                    />
                )}
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    container: { flex: 1, paddingTop: 80, paddingHorizontal: 12 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: '#fff', marginTop: 15, fontSize: 16 },
    errorText: { color: '#ff4444', fontSize: 16, textAlign: 'center', marginBottom: 20 },
    retryButton: { backgroundColor: '#0486ce', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 14 },
    retryButtonText: { color: '#fff', fontWeight: 'bold' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
    headerText: { flex: 1, paddingRight: 10 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#fff', letterSpacing: 0.5 },
    subtitle: { fontSize: 14, color: '#b0b0b0', marginTop: 4 },
    iconContainer: {
        width: 64, height: 64,
        backgroundColor: 'rgba(4,134,206,0.35)',
        borderRadius: 32,
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    },
    icon: { width: 50, height: 50 },
    searchBar: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 16, borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 14, paddingVertical: 10,
        marginBottom: 6,
    },
    searchIcon: { fontSize: 16, marginRight: 10 },
    searchInput: { flex: 1, color: '#fff', fontSize: 15 },
    clearBtn: { color: '#778', fontSize: 16, paddingLeft: 8 },
    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: 10 },
    noResults: { color: '#556', fontSize: 15 },
    listContent: { paddingVertical: 10, paddingBottom: 30 },
    categoryCard: { marginBottom: 30 },
    categoryHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, marginLeft: 4 },
    categoryTitle: { fontSize: 19, fontWeight: '700', color: '#fff' },
    categoryChevron: { fontSize: 24, color: '#4a6a88', marginRight: 4 },
    movieCard: { width: 115, marginRight: 14 },
    moviePoster: { width: '100%', height: 170, borderRadius: 14, backgroundColor: '#1a2535' },
    movieTitle: { fontSize: 12, color: '#ccc', marginTop: 7, fontWeight: '500', textAlign: 'center' },
    gridResultLabel: { color: '#7a8fa6', fontSize: 13, marginBottom: 10, marginLeft: 2 },
    gridContent: { paddingBottom: 30 },
    gridRow: { justifyContent: 'space-between', marginBottom: 14 },
    gridCard: { width: '31%' },
    gridPoster: { width: '100%', aspectRatio: 2 / 3, borderRadius: 12, backgroundColor: '#1a2535' },
    gridTitle: { fontSize: 11, color: '#ccc', marginTop: 5, fontWeight: '500', textAlign: 'center' },
})