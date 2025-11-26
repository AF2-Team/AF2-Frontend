import { Colors, THEME } from "@/constants";
import { useRouter } from "expo-router";
import React from "react";
import { default as styled } from "styled-components/native";
import { PostData } from "../types/PostTypes";
import { PostFooter } from "./PostFooter";
import { PostHeader } from "./PostHeader";

interface PostProps {
  post: PostData;
  onFollowChange?: (userId: string, isFollowing: boolean) => void;
  onCommentPress?: () => void;
  onOptionsPress?: () => void;
  onHashtagPress?: (hashtag: string) => void;
  onNotInterested?: (postId: string) => void;
}

export const Post = ({
  post,
  onFollowChange,
  onCommentPress,
  onOptionsPress,
  onHashtagPress,
  onNotInterested,
}: PostProps) => {
  const router = useRouter();

  const handleImagePress = (imageIndex: number = 0) => {
    const mediaUrls = post.mediaUrls || (post.mediaUrl ? [post.mediaUrl] : []);

    if (mediaUrls.length > 0) {
      router.push({
        pathname: "/screens/ImageFullScreen",
        params: {
          post: JSON.stringify(post),
          initialIndex: imageIndex,
        },
      });
    }
  };

  const renderMedia = () => {
    // Soporte tanto para mediaUrls (array) como mediaUrl (string) para compatibilidad
    const mediaUrls = post.mediaUrls || (post.mediaUrl ? [post.mediaUrl] : []);

    if (mediaUrls.length === 0) {
      return null;
    }

    // Una sola imagen - mostrar full width
    if (mediaUrls.length === 1) {
      return (
        <MediaContainer>
          <TouchableOpacity onPress={() => handleImagePress(0)}>
            <PostImage source={{ uri: mediaUrls[0] }} />
          </TouchableOpacity>
        </MediaContainer>
      );
    }

    // Múltiples imágenes - mostrar en grid
    return (
      <MediaContainer>
        <MediaGrid totalImages={mediaUrls.length}>
          {mediaUrls.slice(0, 4).map((url, index) => (
            <GridImageContainer
              key={index}
              totalImages={mediaUrls.length}
              index={index}
            >
              <TouchableOpacity onPress={() => handleImagePress(index)}>
                <GridImage source={{ uri: url }} />
                {index === 3 && mediaUrls.length > 4 && (
                  <Overlay>
                    <OverlayText>+{mediaUrls.length - 4}</OverlayText>
                  </Overlay>
                )}
              </TouchableOpacity>
            </GridImageContainer>
          ))}
        </MediaGrid>
      </MediaContainer>
    );
  };

  return (
    <PostContainer>
      <PostHeader
        user={post.user}
        createdAt={post.createdAt}
        isFollowing={post.isFollowing}
        onFollowChange={onFollowChange}
        onOptionsPress={onOptionsPress}
        postId={post.id}
        postContent={post.content}
        onNotInterested={onNotInterested}
      />

      <ContentContainer>
        <ContentText>{post.content}</ContentText>
      </ContentContainer>

      {renderMedia()}

      {post.hashtags && post.hashtags.length > 0 && (
        <HashtagsContainer>
          {post.hashtags.map((hashtag, index) => (
            <HashtagButton
              key={index}
              onPress={() => onHashtagPress?.(hashtag)}
            >
              <Hashtag>#{hashtag}</Hashtag>
            </HashtagButton>
          ))}
        </HashtagsContainer>
      )}

      <PostFooter
        onCommentPress={onCommentPress}
        initialLikes={post.initialLikes}
        initialFavorites={post.initialFavorites}
        initialReposts={post.initialReposts}
        initialComments={post.initialComments}
        postId={post.id}
        postContent={post.content}
        postAuthor={post.user.username}
      />
    </PostContainer>
  );
};

const PostContainer = styled.View`
  background-color: ${Colors.background};
  margin-bottom: ${THEME.SPACING.SM}px;
  border-bottom-width: 1px;
  border-bottom-color: ${Colors.grayMedium};
`;

const ContentContainer = styled.View`
  padding: 0 ${THEME.SPACING.MD}px ${THEME.SPACING.SM}px ${THEME.SPACING.MD}px;
`;

const ContentText = styled.Text`
  font-size: ${THEME.TYPOGRAPHY.BODY}px;
  line-height: 22px;
  color: ${Colors.text};
  font-family: ${THEME.FONTS.REGULAR};
`;

const MediaContainer = styled.View`
  padding: 0 0 ${THEME.SPACING.SM}px 0;
  margin: 0 ${THEME.SPACING.MD}px;
`;

const PostImage = styled.Image`
  width: 100%;
  height: 200px;
  border-radius: ${THEME.COMMON.BORDER_RADIUS.MD}px;
  resize-mode: cover;
`;

const MediaGrid = styled.View<{ totalImages: number }>`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 2px;
`;

const GridImageContainer = styled.View<{ totalImages: number; index: number }>`
  ${({ totalImages, index }) => {
    switch (totalImages) {
      case 2:
        return `
          width: 49.5%;
          aspect-ratio: 1;
        `;
      case 3:
        if (index === 0) {
          return `
            width: 66%;
            aspect-ratio: 1.5;
          `;
        } else {
          return `
            width: 33%;
            aspect-ratio: 1;
          `;
        }
      case 4:
      default:
        return `
          width: 49.5%;
          aspect-ratio: 1;
        `;
    }
  }}
`;

const GridImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: ${THEME.COMMON.BORDER_RADIUS.MD}px;
  resize-mode: cover;
`;

const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: ${THEME.COMMON.BORDER_RADIUS.MD}px;
  justify-content: center;
  align-items: center;
`;

const OverlayText = styled.Text`
  color: ${Colors.textLight};
  font-size: ${THEME.TYPOGRAPHY.TITLE}px;
  font-family: ${THEME.FONTS.BOLD};
`;

const HashtagsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0 ${THEME.SPACING.MD}px ${THEME.SPACING.SM}px ${THEME.SPACING.MD}px;
`;

const HashtagButton = styled.TouchableOpacity`
  margin-right: ${THEME.SPACING.SM}px;
  margin-bottom: ${THEME.SPACING.XS}px;
`;

const Hashtag = styled.Text`
  color: ${Colors.textMuted};
  font-size: ${THEME.TYPOGRAPHY.CAPTION}px;
  font-family: ${THEME.FONTS.SEMI_BOLD};
`;

const TouchableOpacity = styled.TouchableOpacity``;
