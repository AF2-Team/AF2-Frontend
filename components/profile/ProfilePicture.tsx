
import React from 'react';
import { View, StyleSheet, Image, Platform, StyleProp, ViewStyle, ImageSourcePropType } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

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
  //imageUrl?: string | null; 
  //source acepta URL ({uri: string}), local (number del require()), o null/undefined.
  source?: ImageSourcePropType | null;
  size?: number;
  borderWidth?: number;
  style?: StyleProp<ViewStyle>;
}

const ProfilePicture = ({ 
  //imageUrl, 
  source,
  size = LOCAL_SIZES.AVATAR_SIZE, 
  borderWidth = LOCAL_SIZES.AVATAR_BORDER,
  style 
}: ProfilePictureProps) => { 
  
  const imageSize = size - (borderWidth * 2); 
  //const isDefault = !imageUrl;
  const isDefaultIconFallback = !source;

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
        isDefaultIconFallback && { backgroundColor: LOCAL_COLORS.DEFAULT_BACKGROUND }
        //isDefault && { backgroundColor: LOCAL_COLORS.DEFAULT_BACKGROUND } 
      ]}
    >
      {isDefaultIconFallback ? (
        // Renderizar el ícono por defecto
        <MaterialCommunityIcons
          name="account" 
          size={imageSize * LOCAL_SIZES.ICON_SIZE_MULTIPLIER}
          color={LOCAL_COLORS.DEFAULT_ICON_COLOR}
        />
      ) : (
        // Renderizar la imagen subida por el usuario
        <Image
          source={source!} 
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
    /*...Platform.select({
      ios: {
        shadowColor: LOCAL_COLORS.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),*/
  },
  image: {
    // La imagen no tiene fondo, solo el container
    backgroundColor: 'transparent',
  }, 
});

export default ProfilePicture;