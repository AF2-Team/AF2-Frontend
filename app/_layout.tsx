import LoadingScreen from '@components/loading-screen';
import { COLORS, PALLETE } from '@constants/colors';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components/native';

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('@fonts/SpaceMono-Regular.ttf'),
    });

    if (!loaded) return <LoadingScreen />;

    return (
        <ThemeProvider theme={{ ...COLORS, PALLETE }}>
            <StatusBar style="dark" backgroundColor="white" />
            <SafeAreaView>
                <Slot />
            </SafeAreaView>
        </ThemeProvider>
    );
}
