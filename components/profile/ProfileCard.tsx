import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, ImageSourcePropType, TouchableOpacity } from 'react-native';
import ProfilePicture from './ProfilePicture'; 
import { AvatarShape } from '../../types/ImagePickerTypes';


const LOCAL_COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
} as const;

const LOCAL_SIZES = {
  SPACING_LG: 16,
  SPACING_SM: 8,
  SPACING_MD: 12,
  AVATAR_SIZE: 100,
  AVATAR_BORDER: 3,
  AVATAR_OFFSET: 50, 
} as const;

export interface ProfileCardProps {
  username: string;
  //displayName: string;
  bio: string;
  //profileImageUrl?: ProfilePictureProps['imageUrl']; 
  avatarSource?: ImageSourcePropType | null;
  isAvatarCircular?: boolean;
  style?: StyleProp<ViewStyle>;
  onEditAvatarPress: (currentShape: AvatarShape) => void;
}

const ProfileCard = ({
  username,
  //displayName,
  bio,
  //profileImageUrl ,
  avatarSource,
   isAvatarCircular = true, 
  style,
  onEditAvatarPress,
}: ProfileCardProps) => {

  const negativeMarginTop = LOCAL_SIZES.AVATAR_SIZE / 2;
  const avatarSizeWithBorder = LOCAL_SIZES.AVATAR_SIZE + (LOCAL_SIZES.AVATAR_BORDER * 2);

  //Determinar la forma actual para enviarla al handler
  const currentShape: AvatarShape = isAvatarCircular ? 'circle' : 'square';

  const handlePress = () => {
      onEditAvatarPress(currentShape);
  };

  return (
    <View style={[styles.cardContainer, style, { marginTop: -negativeMarginTop }]}>
      <TouchableOpacity 
      onPress={handlePress} 
      style={styles.profilePictureWrapper}
      >
      <ProfilePicture 
        //imageUrl={profileImageUrl}
        source={avatarSource}
        isCircular={isAvatarCircular}
        size={LOCAL_SIZES.AVATAR_SIZE}
        borderWidth={LOCAL_SIZES.AVATAR_BORDER}
      />


      </TouchableOpacity>
      
      {/*<View style={styles.displayNameContainer}>
        <Text style={styles.displayNameText}>{displayName}</Text>
      </View>*/}


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
  
  profilePictureWrapper: {
    marginTop: -LOCAL_SIZES.AVATAR_SIZE / 2, 
    width: LOCAL_SIZES.AVATAR_SIZE + (LOCAL_SIZES.AVATAR_BORDER * 2),
    height: LOCAL_SIZES.AVATAR_SIZE + (LOCAL_SIZES.AVATAR_BORDER * 2),
    borderRadius: (LOCAL_SIZES.AVATAR_SIZE + (LOCAL_SIZES.AVATAR_BORDER * 2)) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /*profilePicturePosition: {
    marginTop: -LOCAL_SIZES.AVATAR_SIZE / 2, 
  },*/
  
  usernameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  /*displayNameContainer: {
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
  },*/
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