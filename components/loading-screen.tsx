import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, Image, ImageSourcePropType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'styled-components/native';
import Container from './container';

interface VDotProps {
    delay: number; // Retraso de inicio de la animación (en ms)
    size?: number;
}

const { width: screenWidth } = Dimensions.get('window');

// Definir los ajustes de escalonamiento de tiempo para cada punto (en milisegundos)
const DURATION = 200; // Tanto para subir como para bajar
const dotSettings = [{ delay: 0 }, { delay: DURATION - 150 }, { delay: DURATION * 2 - 150 }];
const NUM_DOTS = dotSettings.length;

const AnimatableDot: React.FC<VDotProps> = ({ delay, size = 12 }) => {
    // 1. Valor inicial de escala (1.0)
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Definir la secuencia de subir y bajar (el "rebote")
        const reboundSequence = Animated.sequence([
            // Subir la escala (a 1.4)
            Animated.timing(scaleAnim, {
                toValue: 1.4,
                duration: DURATION,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            // Regresar la escala normal
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: DURATION,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ]);

        // Tiempo Total del Ciclo = (Duración del rebote) * (Número de puntos)
        const totalLoopTime = DURATION * 2 * NUM_DOTS; // 600ms * 3 = 1800ms
        // Tiempo usado hasta el final del rebote: delay de inicio + 600ms
        const usedTime = delay + DURATION * 2;
        // Tiempo restante necesario para que el ciclo dure 1800ms
        const remainingDelay = totalLoopTime - usedTime;

        // Definir el ciclo completo: Retraso inicial -> Rebote -> Retraso de relleno
        const animationCycle = Animated.sequence([
            Animated.delay(delay), // Retraso para escalonamiento
            reboundSequence, // Animación de rebote (600ms)
            Animated.delay(remainingDelay), // Retraso de relleno para el loop
        ]);

        // 3. Iniciar el loop infinito
        const loop = Animated.loop(animationCycle);
        loop.start();

        // 4. Limpiar al desmontar el componente
        return () => loop.stop();
    }, [scaleAnim, delay]);

    // Estilo que usa el valor animado para la transformación
    const animatedStyle = {
        transform: [{ scale: scaleAnim }],
    };

    return <VDot size={size} style={animatedStyle} />;
};

const LoadingScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'red' }}>
            <Container align="center" justify="center" flex={1} bgColor="white">
                <VLogo source={require('@assets/images/2.png') as ImageSourcePropType} resizeMode="contain" />
                <Container direction="row" justify="center" align="center" gap="15px">
                    {dotSettings.map(({ delay }, index) => (
                        <AnimatableDot key={index} delay={delay} />
                    ))}
                </Container>
            </Container>
        </SafeAreaView>
    );
};

const VLogo = styled(Image)`
    width: ${screenWidth * 0.6}px;
    height: ${screenWidth * 0.6}px;
    margin-bottom: 20px;
`;
const VDot = styled(Animated.View)<{ size: number }>`
    width: ${(props) => props.size}px;
    height: ${(props) => props.size}px;
    border-radius: ${(props) => props.size / 2}px;
    background-color: red;
`;

export default LoadingScreen;
