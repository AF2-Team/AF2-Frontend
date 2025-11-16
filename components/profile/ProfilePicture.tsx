
import React from 'react';
import { View, StyleSheet, Image, Platform, StyleProp, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

// ⚠️ Usaremos un componente de ícono en lugar de una imagen de archivo para el default
// Esto es más limpio para avatares por defecto.

// --- CONSTANTES LOCALES ---
const LOCAL_SIZES = {
  AVATAR_SIZE: 100,
  AVATAR_BORDER: 3,
  ICON_SIZE_MULTIPLIER: 0.6, // El ícono será el 60% del tamaño del avatar
} as const;

const LOCAL_COLORS = {
  // Color del borde del avatar
  BORDER_COLOR: '#FFFFFF', 
  // Color del fondo para el avatar por defecto (tu color primario)
  DEFAULT_BACKGROUND: '#423646', 
  // Color del ícono por defecto
  DEFAULT_ICON_COLOR: '#FFFFFF', 
  BLACK: '#000000',
} as const;


export interface ProfilePictureProps {
  // Acepta URL o URI de archivo
  imageUrl?: string | null; 
  size?: number;
  borderWidth?: number;
  style?: StyleProp<ViewStyle>;
}

const ProfilePicture = ({ 
  imageUrl, 
  size = LOCAL_SIZES.AVATAR_SIZE, 
  borderWidth = LOCAL_SIZES.AVATAR_BORDER,
  style 
}: ProfilePictureProps) => { 
  
  const imageSize = size - (borderWidth * 2); 
  const isDefault = !imageUrl;

  const containerDynamicStyle = { 
    width: size, 
    height: size, 
    borderRadius: size / 2,
    borderWidth: borderWidth,
  };

  return (
    <View 
      style={[
        styles.container, 
        containerDynamicStyle, 
        style,
        // Si es default, establecemos el fondo del color primario
        isDefault && { backgroundColor: LOCAL_COLORS.DEFAULT_BACKGROUND } 
      ]}
    >
      {isDefault ? (
        // 1. Renderizar el ícono por defecto
        <MaterialCommunityIcons
          name="account" // Ícono genérico de persona
          size={imageSize * LOCAL_SIZES.ICON_SIZE_MULTIPLIER}
          color={LOCAL_COLORS.DEFAULT_ICON_COLOR}
        />
      ) : (
        // 2. Renderizar la imagen subida por el usuario
        <Image
          source={{ uri: imageUrl }} 
          style={[styles.image, { 
            width: imageSize, 
            height: imageSize, 
            borderRadius: imageSize / 2, 
          }]}
          resizeMode="cover"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: LOCAL_COLORS.BORDER_COLOR, 
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', 
    ...Platform.select({
      ios: {
        shadowColor: LOCAL_COLORS.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  image: {
    // La imagen no tiene fondo, solo el container
    backgroundColor: 'transparent',
  }, 
});

export default ProfilePicture;