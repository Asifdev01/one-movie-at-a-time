import { Link, useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const IntroScreen: React.FC = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    // Navigate to the main app (index tab)
    console.log('Let\'s Watch pressed');
    // For now, staying on the same screen as we are in (tabs)/index
    // But we could navigate to a modal or another screen if defined
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />



      <View style={styles.imagesContainer}>
        <View style={[styles.imageWrapper, styles.leftImage]}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop' }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={[styles.imageWrapper, styles.centerImage]}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=700&fit=crop' }}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={styles.playButtonWrapper}>
            <View style={styles.playButton}>
              <View style={styles.playIcon} />
            </View>
          </View>
        </View>

        <View style={[styles.imageWrapper, styles.rightImage]}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop' }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>DISCOVER{'\n'}CINEMA LIKE NEVER{'\n'}BEFORE</Text>
        <Text style={styles.subtitle}>
          Curated recommendations, trending hits, and timeless classics —
          all in one place.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Link href="/screens/choicescreen" asChild>
          <TouchableOpacity
            style={styles.button}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Let's Watch</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  imagesContainer: {
    height: height * 0.5,
    marginTop: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'absolute',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  leftImage: {
    width: width * 0.35,
    height: height * 0.3,
    left: -10,
    top: 40,
    transform: [{ rotate: '-8deg' }],
  },
  centerImage: {
    width: width * 0.4,
    height: height * 0.4,
    zIndex: 2,
  },
  rightImage: {
    width: width * 0.35,
    height: height * 0.3,
    right: -10,
    top: 40,
    transform: [{ rotate: '8deg' }],
  },
  image: {
    width: '100%',
    height: '100%',
  },
  playButtonWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  playIcon: {
    width: 0,
    height: 0,
    marginLeft: 4,
    borderLeftWidth: 16,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: '#FFFFFF',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  textContainer: {
    paddingHorizontal: 30,
    marginTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: 40,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 30,
  },
  button: {
    backgroundColor: '#FF6500',
    paddingVertical: 18,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#FF6500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default IntroScreen;