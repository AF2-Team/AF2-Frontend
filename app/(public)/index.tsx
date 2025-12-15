import Container from '@components/container';
import Land2 from 'assets/images/land2.svg';
import Logo from 'assets/images/logo-land.svg';
import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import { styled } from 'styled-components/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const GradientContainer = styled(LinearGradient).attrs(() => ({
    colors: [
        'rgba(255, 255, 255, 1) 0%',
        'rgba(188, 161, 189, 1) 25%',
        'rgba(102, 81, 108, 1) 50%',
        'rgba(66, 54, 70, 1) 75%',
        'rgba(0, 0, 0, 1) 100%',
    ],
    locations: [0, 0.25, 0.5, 0.75, 1],
}))<Partial<LinearGradientProps>>`
    flex: 1;
    width: ${screenWidth}px;
    min-height: ${screenHeight}px;
    border-radius: 30px;
    overflow: hidden;
`;

const LogoSection = styled(Container)`
    align-items: center;
    width: 332px;
`;

const StyledLogo = styled(Logo)`
    margin-top: -20px;
    width: 60%;
`;

const StyledLand2 = styled(Land2)`
    margin-top: 50px;
    margin-bottom: 20px;
`;

const LoginButton = styled(TouchableOpacity)`
    margin-top: 50px;
    background-color: #bca1bd;
    border-radius: 30px;
    height: 50px;
    width: 319px;
    justify-content: center;
    align-items: center;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.25;
    shadow-radius: 3.84px;
    elevation: 5;
`;

const ButtonText = styled.Text`
    color: #423646;
    font-family: 'Open Sans';
    font-size: 14px;
    font-weight: bold;
`;

const RegisterSection = styled(Container)`
    align-items: center;
    margin-top: 37px;
`;

const MemberText = styled.Text`
    color: #fff;
    font-family: 'Open Sans';
    font-size: 15px;
    font-weight: 400;
    text-align: center;
    width: 150px;
    margin-bottom: 8px;
`;

const RegisterText = styled.Text`
    color: #fff;
    font-family: 'Open Sans';
    font-size: 15px;
    font-weight: 700;
    text-decoration-line: underline;
`;

export default function WelcomeScreen() {
    const router = useRouter();

    const handleLoginPress = () => {
        //router.push('/screens/LoginScreen');
    };
    const handleRegisterPress = () => {
        //router.push('/screens/RegisterScreen');
    };

    return (
        <GradientContainer>
            <Container flex={1} align="center" justify="center">
                <LogoSection direction="column">
                    <StyledLogo />
                    <StyledLand2 />
                </LogoSection>

                <LoginButton onPress={handleLoginPress}>
                    <ButtonText>INICIA SESIÓN AQUI</ButtonText>
                </LoginButton>

                <RegisterSection direction="column">
                    <MemberText>¿Aún no eres miembro?</MemberText>
                    <TouchableOpacity onPress={handleRegisterPress} activeOpacity={0.7}>
                        <RegisterText>Regístrate ahora</RegisterText>
                    </TouchableOpacity>
                </RegisterSection>
            </Container>
        </GradientContainer>
    );
}
