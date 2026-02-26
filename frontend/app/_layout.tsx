import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';

// Wake up the Render backend the moment the app loads (free tier sleeps after inactivity)
const pingServer = () => {
  fetch('https://one-movie-at-a-time.onrender.com/api/movies/ping').catch(() => { });
};

export const unstable_settings = {
  anchor: '(tabs)',
};


const PureBlackTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#000000',
    card: '#000000',
    surface: '#000000',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => { pingServer(); }, []);

  return (
    <ThemeProvider value={PureBlackTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#000000' },
          animation: 'slide_from_right',
          animationDuration: 250,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="screens/homescreen" />
        <Stack.Screen name="screens/choicescreen" />
        <Stack.Screen name="screens/moodscreen" />
        <Stack.Screen name="screens/resultscreen" />
        <Stack.Screen name="screens/devchoice" />
        <Stack.Screen name="screens/movieresult" />
        <Stack.Screen name="screens/categoryscreen" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
