import React, { useState } from "react";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, THEME } from "@/constants";

const ICON_CONFIG = {
  size: 24,
  like: {
    active: { name: "heart" as const, color: Colors.error },
    inactive: { name: "heart-outline" as const, color: Colors.textMuted },
  },
  comment: {
    name: "chatbox-outline" as const,
    color: Colors.textMuted,
  },
  repost: {
    name: "repeat" as const,
    color: Colors.textMuted,
  },
  favorite: {
    active: { name: "bookmark" as const, color: Colors.primary },
    inactive: {
      name: "bookmark-outline" as const,
      color: Colors.textMuted,
    },
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

interface PostFooterProps {
  onCommentPress?: () => void;
  initialLikes: number;
  initialFavorites: number;
  initialReposts: number;
  initialComments: number;
  postId: string;
  postContent?: string;
  postAuthor?: string;
  postImage?: string;
  postTags?: string[];
  postUserAvatar?: string;
}

export const PostFooter = ({
  onCommentPress,
  initialLikes,
  initialFavorites,
  initialReposts,
  initialComments,
  postId,
  postContent,
  postAuthor,
  postImage,
  postTags = [],
  postUserAvatar = null,
}: PostFooterProps) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [favoritesCount, setFavoritesCount] = useState(initialFavorites);
  const [repostsCount, setRepostsCount] = useState(initialReposts);
  const [commentsCount, setCommentsCount] = useState(initialComments);

  const totalInteractions =
    likesCount + favoritesCount + repostsCount + commentsCount;

  const handleLikePress = () => {
    setIsLiked((prev) => {
      const newState = !prev;
      setLikesCount((prevCount) => (newState ? prevCount + 1 : prevCount - 1));
      return newState;
    });
  };

  const handleFavoritePress = () => {
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
  };

  const handleRepostPress = () => {
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
  };

  const handleCommentPress = () => {
    setCommentsCount((prev) => prev + 1);

    router.push("/screens/CommentScreen");

    if (onCommentPress) {
      onCommentPress();
    }
  };

  return (
    <Container>
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
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: ${THEME.SPACING.SCREEN_HORIZONTAL}px;
  padding-vertical: ${THEME.SPACING.SM}px;
  background-color: ${Colors.background};
  border-top-width: 1px;
  border-top-color: ${Colors.primary};
`;

const NotesContainer = styled.View`
  width: 89px;
  height: 31px;
  border-width: 1px;
  border-color: ${Colors.primary};
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  background-color: ${Colors.background};
`;

const NotesText = styled.Text`
  font-size: ${THEME.TYPOGRAPHY.CAPTION}px;
  color: ${Colors.text};
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
  color: ${({ active }) => (active ? Colors.error : Colors.textMuted)};
  font-family: ${THEME.FONTS.REGULAR};
`;
