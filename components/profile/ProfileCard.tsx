import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import ProfilePicture, { ProfilePictureProps } from './ProfilePicture'; 

const LOCAL_COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
} as const;

const LOCAL_SIZES = {
  SPACING_LG: 16,
  SPACING_SM: 8,
  SPACING_MD: 12,
  AVATAR_SIZE: 100,
  AVATAR_OFFSET: 50, // CLAVE DE LA SUPERPOSICIÓN
} as const;

// --- INTERFACE ---
export interface ProfileCardProps {
  username: string;
  bio: string;
  profileImageUrl?: ProfilePictureProps['imageUrl']; 
  style?: StyleProp<ViewStyle>;
}

const ProfileCard = ({
  username,
  bio,
  profileImageUrl ,
  style,
}: ProfileCardProps) => {

  const negativeMarginTop = LOCAL_SIZES.AVATAR_SIZE / 2;

  return (
    <View style={[styles.cardContainer, style, { marginTop: -negativeMarginTop }]}>
      
      <ProfilePicture 
        imageUrl={profileImageUrl}
        style={styles.profilePicturePosition} // Aplica un margen superior para "bajarlo" en la tarjeta 
      />

      <View style={styles.usernameContainer}>
        <Text style={styles.usernameText}>{username}</Text>
      </View>

      <View style={styles.bioContainer}>
        <Text style={styles.bioText} numberOfLines={4}> 
          {bio}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    padding: LOCAL_SIZES.SPACING_LG, 
    flexDirection: 'column',
    alignItems: 'center',
    gap: LOCAL_SIZES.SPACING_SM, 
    
    //position: 'relative',
    //bottom: LOCAL_SIZES.AVATAR_OFFSET, 
    
    backgroundColor: LOCAL_COLORS.WHITE, 
  },
  profilePicturePosition: {
    // Esto empuja la imagen hacia abajo DENTRO de la tarjeta.
    // Para que la imagen quede centrada, su margen superior debe ser la mitad de su tamaño.
    // Pero como la tarjeta tiene padding: LOCAL_SIZES.SPACING_LG, debemos ajustarlo.
    // Queremos que el centro de la imagen esté en el borde superior de la tarjeta (visual).
    // Por lo tanto, el margen superior debe ser la mitad del tamaño de la imagen.
    marginTop: -LOCAL_SIZES.AVATAR_SIZE / 2, 
  },
  
  usernameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: LOCAL_SIZES.SPACING_MD, 
  },
  usernameText: {
    color: LOCAL_COLORS.BLACK,
    textAlign: 'center',
    fontSize: 20, 
    fontWeight: '600',
    lineHeight: 24, 
  },
  
  bioContainer: {
    width: 243, 
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: LOCAL_SIZES.SPACING_SM,
  },
  bioText: {
    color: LOCAL_COLORS.BLACK,
    textAlign: 'center',
    fontSize: 15, 
    fontWeight: '400', 
    lineHeight: 22.5,
  },
});

export default ProfileCard;