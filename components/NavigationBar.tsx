import React from 'react';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';

// Importar los íconos
const homeIcon = require('../assets/images/homeIcon.png');
const searchIcon = require('../assets/images/searchIcon.png');
const notificationIcon = require('../assets/images/notificationIcon.png');
const messageIcon = require('../assets/images/messageIcon.png');

export const NavigationBar = () => {
  const router = useRouter();

  const navigateTo = (screen: string) => {
    router.push(`/screens/${screen}`);
  };

  return (
    <Container>
      <NavButton onPress={() => navigateTo('home')}>
        <Icon source={homeIcon} />
      </NavButton>

      <NavButton onPress={() => navigateTo('search')}>
        <Icon source={searchIcon} />
      </NavButton>

      <NavButton onPress={() => navigateTo('notifications')}>
        <Icon source={notificationIcon} />
      </NavButton>

      <NavButton onPress={() => navigateTo('messages')}>
        <Icon source={messageIcon} />
      </NavButton>
    </Container>
  );
};

// Styled Components
const Container = styled.View`
  width: 142px;
  height: 87px;
  background-color: #423646;
  border-radius: 12px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  bottom: 20px;
  align-self: center;
  padding-horizontal: 10px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

const NavButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.1);
`;

const Icon = styled.Image`
  width: 24px;
  height: 24px;
  resize-mode: contain;
`;
