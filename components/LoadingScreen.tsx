import { Dimensions, Image, ImageSourcePropType, View } from 'react-native';
import { styled } from 'styled-components/native';
import Container from './container';

interface IVDot {
    scale: number;
}

const { width: screenWidth } = Dimensions.get('window');

export default function LoadingScreen() {
    const dots = [{ scale: 0.8 }, { scale: 1 }, { scale: 0.8 }];

    return (
        <Container>
            <VLogo source={require('@assets/images/2.png') as ImageSourcePropType} resizeMode="contain" />
            <Container direction="row">
                {dots.map(({ scale }: IVDot, index) => (
                    <VDot key={index} scale={scale} />
                ))}
            </Container>
        </Container>
    );
}

const VLogo = styled(Image)`
    width: ${screenWidth * 0.6}px;
    height: ${screenWidth * 0.6}px;
`;
const VDot = styled(View)<IVDot>`
    width: 12px;
    height: 12px;
    border-radius: 6px;
    background-color: red;
    /*background-color: THEME.COLORS.secondary;
    margin-right: THEME.SPACING.XS;
    margin-left: THEME.SPACING.XS;*/
`;
