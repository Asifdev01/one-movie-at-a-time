import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ChoiceScreen() {
    const router = useRouter();

    return (
        <LinearGradient
            colors={['#000000', '#434343']}
            style={styles.container}
        >
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Choose how you want to watch</Text>
                    <Text style={styles.subtitle}>Answer a few quick questions for a personalized recommendation, or explore our handpicked developer collection.
                    </Text>
                </View>

                <View style={styles.cardsContainer}>
                    <TouchableOpacity
                        style={styles.cardShadow}
                        onPress={() => router.push('/screens/moodscreen')}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#22C1C3', '#FDBB2D']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.card}
                        >
                            <View style={styles.cardContent}>
                                <View style={styles.iconContainer}>
                                    <Image source={require('@/assets/images/thinking-2.png')}
                                        style={styles.icon} />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.cardTitle}>Quick Movie Match</Text>
                                    <Text style={styles.cardSubtitle}>Find your perfect film</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>

                    <Text style={styles.orText}>or</Text>

                    <TouchableOpacity
                        style={styles.cardShadow}
                        onPress={() => router.push('/screens/devchoice')}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#00c6fb', '#005bea']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.card}
                        >
                            <View style={[styles.cardContent, styles.devCardContent]}>
                                <View style={styles.iconContainer}>
                                    <Image source={require('@/assets/images/dev-abstract.png')}
                                        style={styles.icon}
                                    />
                                </View>
                                <View style={styles.devTextContainer}>
                                    <Text style={styles.cardTitle}>Developer's</Text>
                                    <Text style={styles.cardTitle}>Picks</Text>
                                    <Text style={styles.cardSubtitle}>Curated selections</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
        paddingTop: 80,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 35,
        fontWeight: '700',
        color: '#FFFFFF',
        lineHeight: 35,
        letterSpacing: 1,
        marginTop: 20,
    },
    subtitle: {
        fontSize: 15,
        color: '#615f5fff',
        marginTop: 15,
        lineHeight: 24,
    },
    sparkle: {
        fontSize: 24,
        position: 'absolute',
        right: 20,
        top: 0,
    },
    cardsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardShadow: {
        width: '100%',
        marginVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
    },
    card: {
        width: '100%',
        backgroundColor: '#FF6500',
        borderRadius: 24,
        padding: 24,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    devCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 100,
        height: 100,

        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    icon: {
        width: 200,
        height: 200,
    },
    textContainer: {
        marginLeft: 25,
        flex: 1,
        justifyContent: 'center',

    },
    devTextContainer: {
        flex: 1,
        marginLeft: 25,
    },
    cardTitle: {
        fontSize: 25,
        fontWeight: '700',
        lineHeight: 24,
        color: '#FFFFFF',


    },
    cardSubtitle: {
        fontSize: 13,
        marginTop: 4,
        color: '#dfdfdf',

    },
    orText: {
        fontSize: 16,
        color: '#dfdfdf',
        marginVertical: 8,
        fontWeight: '500',
    },

});