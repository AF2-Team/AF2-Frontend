import React from 'react';
import {StyleSheet, ScrollView, SafeAreaView, StatusBar, View, ImageSourcePropType} from 'react-native';

import HeaderProfile from '../../components/profile/ProfileHeader';
import ProfileCard from '../../components/profile/ProfileCard';
import ProfileTabs from '../../components/profile/ProfileTabs'; 

const LOCAL_AVATAR: ImageSourcePropType = require('../../assets/images/default_avatar.png'); 
const LOCAL_COVER: ImageSourcePropType= require('../../assets/images/brokenhours-cover.jpg');

const MOCK_USER_DATA = {
  username: 'broken-hours',
  displayName: 'Broken Hours',
  bio: "Todos los cerebos del mundo son impotentes contra cualquier estupidez que esé de moda - Fontaine -",
  
  coverImageUrl: null, // Viene de la API/Red
  profileImageUrl: null, // Viene de la API/Red

  // Usamos URLs de prueba para simular imágenes subidas por el usuario
 /*coverImageUrl: 'https://picsum.photos/seed/profile-cover/600/210', 
  profileImageUrl: 'https://picsum.photos/seed/profile-avatar/100/100', */
};


const APP_COLORS = {
  PRIMARY: '#423646', // Tu color principal
  BACKGROUND: '#F5F5F5'
};

const finalAvatarSource = MOCK_USER_DATA.profileImageUrl
        ? { uri: MOCK_USER_DATA.profileImageUrl } 
        : LOCAL_AVATAR;                           

const finalCoverSource = MOCK_USER_DATA.coverImageUrl
        ? { uri: MOCK_USER_DATA.coverImageUrl }
        : LOCAL_COVER;
const ProfileUserScreen: React.FC = () => {
  
  const handleTabChange = (tabId: string) => {
    console.log(`Pestaña cambiada a: ${tabId}`);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: APP_COLORS.PRIMARY }]}>
     <StatusBar barStyle="light-content" backgroundColor={APP_COLORS.PRIMARY} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/*HEADER (Cargará la imagen por MOCK_USER_DATA.coverImageUrl) */}
        <HeaderProfile 
          coverSource={finalCoverSource}
          onPressBack={() => console.log('Back')}
          onPressSettings={() => console.log('Settings')}
        />
        
        <View style={styles.contentWrapper}>
          {/*CARD (Cargará la imagen por MOCK_USER_DATA.profileImageUrl) */}
        <ProfileCard
          username={MOCK_USER_DATA.username}
          displayName={MOCK_USER_DATA.displayName}
          bio={MOCK_USER_DATA.bio}
          avatarSource={finalAvatarSource}
        />

        {/* TABS */}
        <ProfileTabs onTabChange={handleTabChange} />
        </View>
        

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5', 
  },
  scrollView: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    // Aquí definimos el color de fondo del resto de la pantalla.
    backgroundColor: APP_COLORS.BACKGROUND, 
  },
});

export default ProfileUserScreen;