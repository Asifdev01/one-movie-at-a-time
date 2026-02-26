import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ExploreScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Explore Movies</Text>
            <Text style={styles.subtitle}>Discover new releases and popular titles.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#999999',
        textAlign: 'center',
    },
});
