import React from "react";
import styled from "styled-components/native";
import { View, Image, TouchableOpacity } from "react-native";

const COLORS = {
  primary: "#1291EB",
  borderGray: "#D1D5DB",
  textDark: "#4B4B4B",
  textLight: "#333333",
  white: "#FFFFFF",
  grayLight: "#E0E0E0",
  grayMedium: "#9CA3AF",
  grayDark: "#D1D5DB",
};

const SIZES = {
  avatar: {
    small: 24,
    medium: 32,
    large: 48,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 10,
    lg: 16,
  },
};

const defaultAvatar = require("../assets/images/default_avatar.png");

interface PostData {
  id: string;
  user: {
    username: string;
    avatarUrl: string | null;
  };
  content: string;
  tags: string[];
  mainImage: string | null;
}

interface OriginalPostViewProps {
  post: PostData;
  showUserInfo?: boolean;
  compact?: boolean;
  onUserPress?: () => void;
}

export const OriginalPostView: React.FC<OriginalPostViewProps> = ({
  post,
  showUserInfo = true,
  compact = false,
  onUserPress,
}) => {
  return (
    <Container compact={compact}>
      {showUserInfo && (
        <UserHeader>
          {/* ✅ Usamos TouchableOpacity como contenedor del Avatar para manejar el onPress */}
          <UserAvatarContainer onPress={onUserPress} disabled={!onUserPress}>
            <UserAvatar
              source={
                post.user.avatarUrl
                  ? { uri: post.user.avatarUrl }
                  : defaultAvatar
              }
              style={{
                width: SIZES.avatar.small,
                height: SIZES.avatar.small,
                borderRadius: SIZES.avatar.small / 2,
              }}
            />
          </UserAvatarContainer>
          <Username>{post.user.username}</Username>
        </UserHeader>
      )}

      {post.mainImage && (
        <PostImage source={{ uri: post.mainImage }} resizeMode="cover" />
      )}

      <PostContentText compact={compact}>{post.content}</PostContentText>

      {/* Grid de imágenes para simular la complejidad de la referencia */}
      <ImageGrid>
        <SmallImage
          source={{
            uri: "https://placehold.co/150x100/9CA3AF/FFFFFF?text=Ojo",
          }}
          resizeMode="cover"
        />
        <SmallImage
          source={{
            uri: "https://placehold.co/150x100/9CA3AF/FFFFFF?text=Espiral",
          }}
          resizeMode="cover"
        />
        <WideImage
          source={{
            uri: "https://placehold.co/300x100/D1D5DB/FFFFFF?text=Fondo",
          }}
          resizeMode="cover"
        />
      </ImageGrid>
    </Container>
  );
};

const Container = styled.View<{ compact?: boolean }>`
  border-width: 1px;
  border-color: ${COLORS.borderGray};
  border-radius: ${SIZES.borderRadius.medium}px;
  padding: ${(props) =>
    props.compact ? SIZES.spacing.sm : SIZES.spacing.md}px;
  margin-bottom: ${SIZES.spacing.lg}px;
  background-color: ${COLORS.white};
`;

const UserHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${SIZES.spacing.sm}px;
`;

const UserAvatarContainer = styled.TouchableOpacity`
  width: ${SIZES.avatar.small}px;
  height: ${SIZES.avatar.small}px;
  border-radius: ${SIZES.avatar.small / 2}px;
  margin-right: ${SIZES.spacing.sm}px;
  overflow: hidden;
`;

const UserAvatar = styled.Image`
  background-color: ${COLORS.grayLight};
`;

const Username = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${COLORS.textDark};
  font-family: "OpenSans-SemiBold", "System";
`;

const PostImage = styled.Image`
  width: 100%;
  height: 120px;
  border-radius: ${SIZES.borderRadius.small}px;
  margin-bottom: ${SIZES.spacing.md}px;
`;

const PostContentText = styled.Text<{ compact?: boolean }>`
  font-size: ${(props) => (props.compact ? 13 : 14)}px;
  color: ${COLORS.textLight};
  line-height: ${(props) => (props.compact ? 18 : 20)}px;
  font-family: "OpenSans-Regular", "System";
  margin-bottom: ${SIZES.spacing.md}px;
`;

const ImageGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: ${SIZES.spacing.sm}px;
`;

const SmallImage = styled.Image`
  width: 48%;
  height: 100px;
  border-radius: ${SIZES.borderRadius.small}px;
`;

const WideImage = styled.Image`
  width: 100%;
  height: 60px;
  margin-top: ${SIZES.spacing.sm}px;
  border-radius: ${SIZES.borderRadius.small}px;
`;
