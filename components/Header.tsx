import React from 'react';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';

// Importar assets
const logo = require('../assets/images/logo.png');
const defaultAvatar = require('../assets/images/default_avatar.png');

interface HeaderProps {
  currentUser?: {
    avatarUrl?: string;
    username?: string;
  };
  activeTabIndex: number;
  onTabChange: (index: number) => void;
}

// Dimensiones exactas del indicador
const INDICATOR_WIDTH = 26.95;
const INDICATOR_HEIGHT = 2.82;

export const Header = ({ 
  currentUser, 
  activeTabIndex,
  onTabChange
}: HeaderProps) => {
  const router = useRouter();
  const indicatorPosition = useSharedValue(0);

  // Array para almacenar los layouts de cada tab
  const tabLayouts = React.useRef([
    { width: 0, x: 0 }, // Inicio
    { width: 0, x: 0 }  // Etiquetas
  ]);

  const tabs = ['Inicio', 'Etiquetas'];
  
  // Función que se ejecuta cuando se renderiza cada tab
  const handleLayout = (event: any, index: number) => {
    const { width, x } = event.nativeEvent.layout;
    tabLayouts.current[index] = { width, x };
    
    // Si es la pestaña activa, actualizamos la posición del indicador
    if (index === activeTabIndex) {
      updateIndicatorPosition(index);
    }
  };

  // Función para calcular y actualizar la posición del indicador
  const updateIndicatorPosition = (index: number) => {
    const activeLayout = tabLayouts.current[index];
    
    // Si no hemos medido el layout, salimos
    if (activeLayout.width === 0) return;
    
    // Cálculo preciso: centro del tab - mitad del ancho del indicador
    const newPosition = 
      activeLayout.x + 
      (activeLayout.width / 2) - 
      (INDICATOR_WIDTH / 2);
    
    indicatorPosition.value = withTiming(newPosition, {
      duration: 200
    });
  };

  // Actualizar la posición cuando cambia la pestaña activa
  React.useEffect(() => {
    updateIndicatorPosition(activeTabIndex);
  }, [activeTabIndex]);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }]
    };
  });

  const handleProfilePress = () => {
    router.push('/screens/profile');
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        {/* Logo */}
        <LogoContainer>
          <Logo source={logo} />
        </LogoContainer>

        {/* Tabs con medición de layout */}
        <TabsContainer>
          {tabs.map((tab, index) => (
            <Tab 
              key={tab}
              onLayout={(event) => handleLayout(event, index)}
              active={activeTabIndex === index}
              onPress={() => onTabChange(index)}
            >
              <TabText active={activeTabIndex === index}>
                {tab}
              </TabText>
            </Tab>
          ))}
          {/* Indicador con posición calculada dinámicamente */}
          <TabIndicator style={indicatorStyle} />
        </TabsContainer>

        {/* Avatar */}
        <AvatarContainer>
          <AvatarButton onPress={handleProfilePress}>
            <Avatar 
              source={currentUser?.avatarUrl ? { uri: currentUser.avatarUrl } : defaultAvatar}
            />
          </AvatarButton>
        </AvatarContainer>
      </HeaderContent>
    </HeaderContainer>
  );
};

// Styled Components
const HeaderContainer = styled.View`
  width: 100%;
  height: 181px;
  background-color: #423646;
  justify-content: flex-end;
  padding-bottom: 20px;
  padding-top: 50px; // Para el notch
`;

const HeaderContent = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 15px;
`;

const LogoContainer = styled.View`
  flex: 1;
  align-items: flex-start;
`;

const Logo = styled.Image`
  width: 40px;
  height: 40px;
  resize-mode: contain;
`;

const TabsContainer = styled.View`
  flex: 2;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Tab = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  align-items: center;
  padding-vertical: 8px;
`;

const TabText = styled.Text<{ active: boolean }>`
  font-family: 'OpenSans-Bold';
  font-size: 16px;
  color: ${({ active }) => active ? '#FFFFFF' : '#ADADAD'};
  margin-bottom: 8px;
`;

const TabIndicator = styled(Animated.View)`
  position: absolute;
  bottom: 0;
  height: ${INDICATOR_HEIGHT}px;
  width: ${INDICATOR_WIDTH}px;
  background-color: #BCA1BD;
  border-radius: ${INDICATOR_HEIGHT / 2}px;
`;

const AvatarContainer = styled.View`
  flex: 1;
  align-items: flex-end;
`;

const AvatarButton = styled.TouchableOpacity``;

const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  resize-mode: cover;
`;
