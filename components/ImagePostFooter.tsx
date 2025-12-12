import React, { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, THEME } from "@/constants";

const ICON_SIZE = 25;

const ICON_CONFIG = {
  size: ICON_SIZE,
  like: {
    active: { name: "heart" as const, color: Colors.error },
    inactive: { name: "heart-outline" as const, color: Colors.textLight },
  },
  comment: {
    name: "chatbox-outline" as const,
    color: Colors.textLight,
  },
  repost: {
    name: "arrow-redo-outline" as const,
    color: Colors.textLight,
  },
  favorite: {
    active: { name: "star" as const, color: Colors.textLight },
    inactive: { name: "star-outline" as const, color: Colors.textLight },
  },
  message: {
    name: "mail-outline" as const,
    color: Colors.textLight,
  },
} as const;

const getIconConfig = (type: "like" | "favorite", isActive: boolean) => {
  const config = ICON_CONFIG[type];
  return "active" in config
    ? isActive
      ? config.active
      : config.inactive
    : config;
};

interface ImagePostFooterProps {
  initialLikes: number;
  initialFavorites: number;
  initialReposts: number;
  initialComments: number;
  onCommentPress?: () => void;
  onRepostPress?: () => void;
  onFavoritePress?: () => void;
  onLikePress?: () => void;
  onMessagePress?: () => void;
  postId?: string;
  postContent?: string;
  postAuthor?: string;
  postImage?: string;
  postTags?: string[];
  postUserAvatar?: string;
}

export const ImagePostFooter: React.FC<ImagePostFooterProps> = ({
  initialLikes,
  initialFavorites,
  initialReposts,
  initialComments,
  onCommentPress,
  onRepostPress,
  onFavoritePress,
  onLikePress,
  onMessagePress,
  postId = "",
  postContent = "",
  postAuthor = "",
  postImage = "",
  postTags = [],
  postUserAvatar = null,
}) => {
  const router = useRouter();

  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [favoritesCount, setFavoritesCount] = useState(initialFavorites);
  const [repostsCount, setRepostsCount] = useState(initialReposts);
  const [commentsCount, setCommentsCount] = useState(initialComments);

  const totalInteractions =
    likesCount + favoritesCount + repostsCount + commentsCount;

  const handleLikePress = useCallback(() => {
    setIsLiked((prev) => {
      const newState = !prev;
      setLikesCount((prevCount) => (newState ? prevCount + 1 : prevCount - 1));
      return newState;
    });
    onLikePress?.();
  }, [onLikePress]);

  const handleFavoritePress = useCallback(() => {
    setIsFavorite((prev) => {
      const newState = !prev;
      setFavoritesCount((prevCount) =>
        newState ? prevCount + 1 : prevCount - 1,
      );

      console.log(
        `Post ${postId} ${newState ? "agregado a" : "eliminado de"} favoritos`,
      );

      return newState;
    });
    onFavoritePress?.();
  }, [onFavoritePress, postId]);

  const handleRepostPress = useCallback(() => {
    setRepostsCount((prev) => prev + 1);

    router.push({
      pathname: "/screens/RepostScreen",
      params: {
        postId,
        postContent,
        postAuthor,
        postImage,
        originalPost: JSON.stringify({
          id: postId,
          user: {
            username: postAuthor,
            avatarUrl: postUserAvatar,
          },
          content: postContent,
          tags: postTags,
          mainImage: postImage,
        }),
      },
    });

    onRepostPress?.();
  }, [
    onRepostPress,
    router,
    postId,
    postContent,
    postAuthor,
    postImage,
    postTags,
    postUserAvatar,
  ]);

  const handleCommentPress = (postId: string) => {
    router.push({
      pathname: "/screens/CommentScreen",
      params: { postId },
    });
  };
  
  return (
    <FooterContainer>
      <NotesContainer>
        <NotesText>
          {totalInteractions} {totalInteractions === 1 ? "nota" : "notas"}
        </NotesText>
      </NotesContainer>

      <InteractionsContainer>
        <IconButton onPress={handleLikePress}>
          <Ionicons
            {...getIconConfig("like", isLiked)}
            size={ICON_CONFIG.size}
          />
          <CountText active={isLiked}>{likesCount}</CountText>
        </IconButton>

        <IconButton onPress={handleCommentPress}>
          <Ionicons
            name={ICON_CONFIG.comment.name}
            color={ICON_CONFIG.comment.color}
            size={ICON_CONFIG.size}
          />
          <CountText>{commentsCount}</CountText>
        </IconButton>

        <IconButton onPress={handleRepostPress}>
          <Ionicons
            name={ICON_CONFIG.repost.name}
            color={ICON_CONFIG.repost.color}
            size={ICON_CONFIG.size}
          />
          <CountText>{repostsCount}</CountText>
        </IconButton>

        <IconButton onPress={handleFavoritePress}>
          <Ionicons
            {...getIconConfig("favorite", isFavorite)}
            size={ICON_CONFIG.size}
          />
          <CountText active={isFavorite}>{favoritesCount}</CountText>
        </IconButton>
      </InteractionsContainer>
    </FooterContainer>
  );
};

// Estilos (mantenemos los mismos)
const FooterContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${THEME.SPACING.MD}px ${THEME.SPACING.MD}px ${THEME.SPACING.XL}px;
  background-color: ${Colors.primary};
  border-top-left-radius: ${THEME.COMMON.BORDER_RADIUS.MD}px;
  border-top-right-radius: ${THEME.COMMON.BORDER_RADIUS.MS}px;
  min-height: 110px;
`;

const NotesContainer = styled.View`
  width: 89px;
  height: 31px;
  border-width: 1.5px;
  border-color: ${Colors.textLight};
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  background-color: transparent;
`;

const NotesText = styled.Text`
  font-size: ${THEME.TYPOGRAPHY.CAPTION}px;
  color: ${Colors.textLight};
  font-family: ${THEME.FONTS.SEMI_BOLD};
`;

const InteractionsContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const IconButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-left: ${THEME.SPACING.MD}px;
  padding: ${THEME.SPACING.XS}px;
`;

const CountText = styled.Text<{ active?: boolean }>`
  margin-left: ${THEME.SPACING.XS}px;
  font-size: ${THEME.TYPOGRAPHY.SMALL}px;
  color: ${({ active }) => (active ? Colors.error : Colors.textLight)};
  font-family: ${THEME.FONTS.REGULAR};
`;
