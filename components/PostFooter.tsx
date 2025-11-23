import React, { useState } from "react";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const COLOR_DARK_PRIMARY = "#423646";
const COLOR_TEXT_SECONDARY = "#687076";
const COLOR_WHITE = "#fff";

const ICON_CONFIG = {
  size: 24,
  like: {
    active: { name: "heart" as const, color: COLOR_DARK_PRIMARY },
    inactive: { name: "heart-outline" as const, color: COLOR_TEXT_SECONDARY },
  },
  comment: {
    name: "chatbox-outline" as const,
    color: COLOR_TEXT_SECONDARY,
  },
  repost: {
    name: "repeat" as const,
    color: COLOR_TEXT_SECONDARY,
  },
  favorite: {
    active: { name: "bookmark" as const, color: COLOR_DARK_PRIMARY },
    inactive: {
      name: "bookmark-outline" as const,
      color: COLOR_TEXT_SECONDARY,
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
  postTags?: string[]; // Nuevo prop para los tags
  postUserAvatar?: string; // Nuevo prop para el avatar del autor
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
  postTags = [], // Valor por defecto
  postUserAvatar = null, // Valor por defecto
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
      // Aquí iría la lógica de API para registrar el like
      return newState;
    });
  };

  const handleFavoritePress = () => {
    setIsFavorite((prev) => {
      const newState = !prev;
      setFavoritesCount((prevCount) =>
        newState ? prevCount + 1 : prevCount - 1,
      );
      // Aquí iría la lógica de API para registrar el favorito
      return newState;
    });
  };

  const handleRepostPress = () => {
    setRepostsCount((prev) => prev + 1);

    // Navegar a la pantalla de Repost con todos los datos del post
    router.push({
      pathname: "/screens/create-repost",
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
        {/* Botón de Like */}
        <IconButton onPress={handleLikePress}>
          <Ionicons
            {...getIconConfig("like", isLiked)}
            size={ICON_CONFIG.size}
          />
          <CountText>{likesCount}</CountText>
        </IconButton>

        {/* Botón de Comentario */}
        <IconButton onPress={handleCommentPress}>
          <Ionicons
            name={ICON_CONFIG.comment.name}
            color={ICON_CONFIG.comment.color}
            size={ICON_CONFIG.size}
          />
          <CountText>{commentsCount}</CountText>
        </IconButton>

        {/* Botón de Repost */}
        <IconButton onPress={handleRepostPress}>
          <Ionicons
            name={ICON_CONFIG.repost.name}
            color={ICON_CONFIG.repost.color}
            size={ICON_CONFIG.size}
          />
          <CountText>{repostsCount}</CountText>
        </IconButton>

        {/* Botón de Favorito */}
        <IconButton onPress={handleFavoritePress}>
          <Ionicons
            {...getIconConfig("favorite", isFavorite)}
            size={ICON_CONFIG.size}
          />
          <CountText>{favoritesCount}</CountText>
        </IconButton>
      </InteractionsContainer>
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 15px;
  padding-vertical: 10px;
  background-color: ${COLOR_WHITE};
  border-top-width: 1px;
  border-top-color: ${COLOR_DARK_PRIMARY};
`;

const NotesContainer = styled.View`
  width: 89px;
  height: 31px;
  border-width: 1px;
  border-color: ${COLOR_DARK_PRIMARY};
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  background-color: ${COLOR_WHITE};
`;

const NotesText = styled.Text`
  font-size: 15px;
  color: ${COLOR_DARK_PRIMARY};
  font-weight: 500;
`;

const InteractionsContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const IconButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-left: 15px;
  padding: 5px;
`;

const CountText = styled.Text`
  margin-left: 5px;
  font-size: 14px;
  color: ${COLOR_TEXT_SECONDARY};
`;
