import React, { useState } from 'react';
import {
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  StatusBar, 
  View, 
  ImageSourcePropType,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import styled from 'styled-components/native';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileCard from '../../components/profile/ProfileCard';
import ProfileTabs from '../../components/profile/ProfileTabs'; 
import ImageEditOptionsSheet from '../../components/ImageEditOptionsSheet';
import ImageEditHeader from '../../components/ImageEditHeader';
import { AvatarShape, ImageCropType, ImagePickerState } from '@/types/ImagePickerTypes';
import { PostUser } from '@/types/PostTypes';


// Usar Omit para limpiar la interfaz base de las propiedades para pasar props con ImageSourcePropType
type PostUserWithoutAvatar = Omit<PostUser, 'avatarUrl' | 'isFollowing'>;

interface ProfileData extends PostUserWithoutAvatar {
  // Asumo displayName es necesario para el perfil completo.
  displayName: string;
  bio: string;
  coverUrl: ImageSourcePropType | null; 
  avatarUrl: ImageSourcePropType | null; 
}

// Constantes de Importación Local
const LOCAL_AVATAR: ImageSourcePropType = require('../../assets/images/default_avatar.png'); 
const LOCAL_COVER: ImageSourcePropType= require('../../assets/images/brokenhours-cover.jpg');

const APP_COLORS = {
  PRIMARY: '#423646', 
  BACKGROUND: '#F5F5F5'
};

const { width, height } = Dimensions.get('window');



const ProfileUserScreen: React.FC = () => {

  // MOCK DATA DE USUARIO CON IMÁGENES LOCALES
  const [userProfile, setUserProfile] = useState<ProfileData>({
    id: 'user_123',
    username: 'broken-hours',
    displayName: 'Broken Hours', // Añadido para que el card pueda mostrarlo
    bio: 'Todos los cerebros del mundo son impotentes contra cualquier estupidez que ese de moda - Fontaine -', 
    avatarUrl: LOCAL_AVATAR, 
    coverUrl: LOCAL_COVER,
    avatarShape: 'circle',
  });

  // Estado de las imagenes
  const [imagePickerState, setImagePickerState] = useState<ImagePickerState>({
    isVisible: false,
    type: null,
    currentImageUri: null,
    selectedImageUri: null, 
    avatarShape: userProfile.avatarShape,
  });

  const handleClose = () => {
    // Cierra el modal y resetea la imagen temporal seleccionada
    setImagePickerState(prevState => ({ ...prevState, isVisible: false, selectedImageUri: null }));
  };

  const handleImageSelected = (uri: string, type: ImageCropType) => {
    // Guarda la URI seleccionada de la galería/cámara
    setImagePickerState(prevState => ({
      ...prevState,
      selectedImageUri: uri,
      type: type,
    }));
  };

  const handleShapeChange = (shape: AvatarShape) => {
    // Cambia la forma en la previsualización
    setImagePickerState(prevState => ({
      ...prevState,
      avatarShape: shape,
    }));
  };

  const handleSave = () => {
    const { type, selectedImageUri, avatarShape } = imagePickerState;
    
    // Si no hay nueva imagen seleccionada, solo cerramos.
    if (!selectedImageUri) {
        handleClose();
        return;
    }

    const newImageSource = { uri: selectedImageUri };

    // El selectedImageUri es siempre una string (URI de la nueva imagen)
    if (type === 'avatar') {
        setUserProfile(prev => ({ 
            ...prev, 
            avatarUrl: newImageSource,
            avatarShape: avatarShape 
        }));
    } else if (type === 'cover') {
        // Usar 'coverUrl' para actualizar la imagen de cabecera
        setUserProfile(prev => ({ ...prev, coverUrl: newImageSource })); 
    }
    handleClose(); 
  };
  
  // Handlers para el Modal

  const handleEditCoverOpen = () => {
    // 🔑 CORRECCIÓN: Si el valor es 'number' (require()), no es una URI, usamos null
    const uriString = typeof userProfile.coverUrl === 'string' ? userProfile.coverUrl : null;

    setImagePickerState({
        isVisible: true,
        type: 'cover',
        currentImageUri: uriString,
        selectedImageUri: null,
        avatarShape: userProfile.avatarShape, 
    });
  };

  const handleEditAvatarOpen = (currentShape: AvatarShape) => {
    // Si el valor es 'number' (require()), no es una URI, usamos null
    const uriString = typeof userProfile.avatarUrl === 'string' ? userProfile.avatarUrl : null;

    setImagePickerState({
        isVisible: true,
        type: 'avatar',
        currentImageUri: uriString,
        selectedImageUri: null,
        avatarShape: currentShape,
    });
  };

  // Previsualización de la imagen: usa la seleccionada, si no, usa la actual.
  const displayUri = imagePickerState.selectedImageUri || imagePickerState.currentImageUri;
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
       
       {/* PROFILE HEADER */}
       <ProfileHeader
         coverSource={userProfile.coverUrl}
         onEditCoverPress={handleEditCoverOpen} 
         onPressBack={() => console.log('Back')}
         onPressSettings={() => console.log('Settings')}
       />
       
       <View style={styles.contentWrapper}>
         {/* PROFILE CARD */}
         <ProfileCard
           username={userProfile.username}
           //displayName={userProfile.displayName} 
           bio={userProfile.bio}
           avatarSource={userProfile.avatarUrl} 
           isAvatarCircular={userProfile.avatarShape === 'circle'}
           onEditAvatarPress={handleEditAvatarOpen} 
         />

         {/* TABS */}
         <ProfileTabs onTabChange={handleTabChange} />
       </View>
       
     </ScrollView>

     {/* Edicion de las imagenes*/}
     <Modal
        animationType="fade"
        transparent={true}
        visible={imagePickerState.isVisible}
        onRequestClose={handleClose}
      >
        <PreviewOverlayBackground>
            
            {/* header con el titulo de la imagen y opcion de guardar el cambio */}
            {imagePickerState.type && (
              <HeaderContainer>
                <ImageEditHeader
                    type={imagePickerState.type}
                    onClose={handleClose} 
                    onSave={handleSave} 
                />
              </HeaderContainer>
            )}

            
            <TouchableWithoutFeedback onPress={handleClose}>
               
                    <ModalBlocker />
                
            </TouchableWithoutFeedback>

            {/*Previsualizacion de la imagen */}
            <PreviewContainer>
                {/* Renderiza el placeholder (o la imagen seleccionada) SOLO si hay una URI válida */}
                {displayUri && typeof displayUri === 'string' && imagePickerState.type === 'avatar' ? (
                    <PreviewAvatar
                        source={{ uri: displayUri }} 
                        isCircle={imagePickerState.avatarShape === 'circle'}
                    />
                ) : (
                    displayUri && typeof displayUri === 'string' && (
                     <PreviewHeaderImage
                        source={{ uri: displayUri }} 
                     />
                    )
                )}
            </PreviewContainer>

            {/*Opciones de edicion de imagenes */}
            <ImageEditOptionsSheet
                isVisible={imagePickerState.isVisible}
                type={imagePickerState.type}
                avatarShape={imagePickerState.avatarShape}
                onClose={handleClose}
                onImageSelected={handleImageSelected}
                onShapeChange={handleShapeChange}
                onSave={handleSave}
            />

        </PreviewOverlayBackground>
      </Modal>

    </SafeAreaView>
  );
};



const PreviewOverlayBackground = styled.View`
  flex: 1;
  background-color: transparent; 
  justify-content: flex-start; 
`;
const HeaderContainer = styled.View`
  position: absolute; 
  top: 0;
  left: 0;
  right: 0;
  z-index: 50; 
`;

const ModalBlocker = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0; 
  background-color: rgba(0, 0, 0, 0.7); 
  z-index: 0;
`;

const PreviewContainer = styled.View`
  position: absolute;
  top: ${height * 0.3}px; 
  left: 0;
  right: 0;
  align-items: center;
  z-index: 1000; 
`;

const PreviewAvatar = styled.Image<{ isCircle: boolean }>`
  width: 200px;
  height: 200px;
  border-radius: ${props => props.isCircle ? '100px' : '0px'};
  border-width: 5px;
  border-color: #fff;
  resize-mode: cover;
`;

const PreviewHeaderImage = styled.Image`
  width: ${width * 0.9}px;
  height: ${width * 0.5}px;
  border-radius: 10px;
  border-width: 5px;
  border-color: #fff;
  resize-mode: cover;
`;


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: APP_COLORS.BACKGROUND, 
  },
  scrollView: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: APP_COLORS.BACKGROUND, 
  },
});

export default ProfileUserScreen;