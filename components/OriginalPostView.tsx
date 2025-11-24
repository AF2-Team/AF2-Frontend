import React from "react";
import styled from "styled-components/native";
import { Colors, THEME } from "@/constants";

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
          <UserAvatarContainer onPress={onUserPress} disabled={!onUserPress}>
            <UserAvatar
              source={
                post.user.avatarUrl
                  ? { uri: post.user.avatarUrl }
                  : defaultAvatar
              }
            />
          </UserAvatarContainer>
          <Username>{post.user.username}</Username>
        </UserHeader>
      )}

      {post.mainImage && (
        <PostImage source={{ uri: post.mainImage }} resizeMode="cover" />
      )}

      <PostContentText compact={compact}>{post.content}</PostContentText>

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
  border-color: ${Colors.border};
  border-radius: ${THEME.COMMON.BORDER_RADIUS.MD}px;
  padding: ${(props) =>
    props.compact ? THEME.SPACING.SM : THEME.SPACING.MD}px;
  margin-bottom: ${THEME.SPACING.LG}px;
  background-color: ${Colors.background};
`;

const UserHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${THEME.SPACING.SM}px;
`;

const UserAvatarContainer = styled.TouchableOpacity`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  margin-right: ${THEME.SPACING.SM}px;
  overflow: hidden;
`;

const UserAvatar = styled.Image`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${Colors.grayLight};
`;

const Username = styled.Text`
  font-size: 13px;
  color: ${Colors.text};
  font-family: ${THEME.FONTS.SEMI_BOLD};
`;

const PostImage = styled.Image`
  width: 100%;
  height: 120px;
  border-radius: ${THEME.COMMON.BORDER_RADIUS.SM}px;
  margin-bottom: ${THEME.SPACING.MD}px;
`;

const PostContentText = styled.Text<{ compact?: boolean }>`
  font-size: ${(props) => (props.compact ? 13 : 14)}px;
  color: ${Colors.text};
  line-height: ${(props) => (props.compact ? 18 : 20)}px;
  font-family: ${THEME.FONTS.REGULAR};
  margin-bottom: ${THEME.SPACING.MD}px;
`;

const ImageGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: ${THEME.SPACING.SM}px;
`;

const SmallImage = styled.Image`
  width: 48%;
  height: 100px;
  border-radius: ${THEME.COMMON.BORDER_RADIUS.SM}px;
`;

const WideImage = styled.Image`
  width: 100%;
  height: 60px;
  margin-top: ${THEME.SPACING.SM}px;
  border-radius: ${THEME.COMMON.BORDER_RADIUS.SM}px;
`;
