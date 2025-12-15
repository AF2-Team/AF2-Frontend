import Container from '@components/container';
import { Slot } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PublicLayout() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
            <Container flex={1} bgColor="black" align="flex-start" justify="flex-start">
                <Slot />
            </Container>
        </SafeAreaView>
    );
}
