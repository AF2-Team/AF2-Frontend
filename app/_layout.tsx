import LoadingScreen from '@components/LoadingScreen';
import { COLORS, PALLETE } from '@constants/colors';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { ThemeProvider } from 'styled-components/native';

const RootLayout = () => {
    const [loaded] = useFonts({
        SpaceMono: require('@fonts/SpaceMono-Regular.ttf'),
    });

    return (
        <ThemeProvider theme={{ ...COLORS, PALLETE }}>
            {!loaded ? (
                <View style={{ flex: 1 }}>
                    <Slot />
                    <StatusBar style="auto" />
                </View>
            ) : (
                <LoadingScreen />
            )}
        </ThemeProvider>
    );
};

export default RootLayout;
