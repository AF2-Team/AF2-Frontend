import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, ImageSourcePropType } from 'react-native';
import ProfilePicture from './ProfilePicture'; 

const LOCAL_COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
} as const;

const LOCAL_SIZES = {
  SPACING_LG: 16,
  SPACING_SM: 8,
  SPACING_MD: 12,
  AVATAR_SIZE: 100,
  AVATAR_OFFSET: 50, 
} as const;

export interface ProfileCardProps {
  username: string;
  displayName: string;
  bio: string;
  //profileImageUrl?: ProfilePictureProps['imageUrl']; 
  avatarSource?: ImageSourcePropType | null;
  style?: StyleProp<ViewStyle>;
}

const ProfileCard = ({
  username,
  displayName,
  bio,
  //profileImageUrl ,
  avatarSource,
  style,
}: ProfileCardProps) => {

  const negativeMarginTop = LOCAL_SIZES.AVATAR_SIZE / 2;

  return (
    <View style={[styles.cardContainer, style, { marginTop: -negativeMarginTop }]}>
      
      <ProfilePicture 
        //imageUrl={profileImageUrl}
        source={avatarSource}
        style={styles.profilePicturePosition} // Aplica un margen superior para bajarlo en la tarjeta 
      />

      <View style={styles.displayNameContainer}>
        <Text style={styles.displayNameText}>{displayName}</Text>
      </View>


      <View style={styles.usernameContainer}>
        <Text style={styles.usernameText}>@{username}</Text>
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
    marginTop: -LOCAL_SIZES.AVATAR_SIZE / 2, 
  },
  
  usernameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayNameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2, 
  },
  displayNameText: {
    color: LOCAL_COLORS.BLACK,
    textAlign: 'center',
    fontSize: 20, 
    fontWeight: '600',
    lineHeight: 24, 
  },
  usernameText: {
    color: '#616161',
    textAlign: 'center',
    fontSize: 15, 
    fontWeight: '400',
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