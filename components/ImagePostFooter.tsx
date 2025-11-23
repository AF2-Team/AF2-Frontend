import React, { useState, useCallback } from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

// Definición de colores basada en tu referencia visual
const COLOR_BACKGROUND = '#423646';
const COLOR_LIGHT_TEXT = '#faf7f7';
const ICON_SIZE = 24;

// Configuración centralizada de íconos
const ICON_CONFIG = {
  size: ICON_SIZE,
  comment: {
    name: 'chatbubble-outline' as const,
    color: COLOR_LIGHT_TEXT
  },
  repost: {
    name: 'arrow-redo-outline' as const, 
    color: COLOR_LIGHT_TEXT
  },
  favorite: {
    active: { name: 'star' as const, color: COLOR_LIGHT_TEXT },
    inactive: { name: 'star-outline' as const, color: COLOR_LIGHT_TEXT }
  },
  like: {
    active: { name: 'heart' as const, color: COLOR_LIGHT_TEXT },
    inactive: { name: 'heart-outline' as const, color: COLOR_LIGHT_TEXT }
  }
} as const;

// Helper function para íconos con estados
const getIconConfig = (type: 'favorite' | 'like', isActive: boolean) => {
  const config = ICON_CONFIG[type];
  return 'active' in config ? (isActive ? config.active : config.inactive) : config;
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
}) => {
  // Estado unificado para mejor consistencia
  const [interactions, setInteractions] = useState({
    liked: false,
    favorited: false,
    likes: initialLikes,
    favorites: initialFavorites,
    reposts: initialReposts
  });

  const [comments] = useState(initialComments);
  const totalNotes = comments;

  // Handlers optimizados con useCallback
  const handleLike = useCallback(() => {
    setInteractions(prev => ({
      ...prev,
      liked: !prev.liked,
      likes: prev.liked ? prev.likes - 1 : prev.likes + 1
    }));
    onLikePress?.();
  }, [onLikePress]);

  const handleFavorite = useCallback(() => {
    setInteractions(prev => ({
      ...prev,
      favorited: !prev.favorited,
      favorites: prev.favorited ? prev.favorites - 1 : prev.favorites + 1
    }));
    onFavoritePress?.();
  }, [onFavoritePress]);

  const handleRepost = useCallback(() => {
    setInteractions(prev => ({
      ...prev,
      reposts: prev.reposts + 1
    }));
    onRepostPress?.();
  }, [onRepostPress]);

  return (
    <FooterContainer>
      {/* Sección de Notas (Comentarios) */}
      <NotesButton onPress={onCommentPress}>
        <NotesText>{totalNotes}</NotesText>
        <NotesLabel>notas</NotesLabel>
      </NotesButton>

      {/* Íconos de Interacción */}
      <IconsContainer>
        {/* Comentarios */}
        <FooterIcon onPress={onCommentPress}>
          <Ionicons
            name={ICON_CONFIG.comment.name}
            color={ICON_CONFIG.comment.color}
            size={ICON_CONFIG.size}
          />
        </FooterIcon>

        {/* Repost */}
        <FooterIcon onPress={handleRepost}>
          <Ionicons
            name={ICON_CONFIG.repost.name}
            color={ICON_CONFIG.repost.color}
            size={ICON_CONFIG.size}
          />
        </FooterIcon>

        {/* Favorito (Estrella) */}
        <FooterIcon onPress={handleFavorite}>
          <Ionicons
            {...getIconConfig('favorite', interactions.favorited)}
            size={ICON_CONFIG.size}
          />
        </FooterIcon>

        {/* Like (Corazón) */}
        <FooterIcon onPress={handleLike}>
          <Ionicons
            {...getIconConfig('like', interactions.liked)}
            size={ICON_CONFIG.size}
          />
        </FooterIcon>
      </IconsContainer>
    </FooterContainer>
  );
};

// 💅 Estilos (se mantienen igual - perfectos)

const FooterContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 18px;
  background-color: ${COLOR_BACKGROUND};
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
`;

const NotesButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: ${COLOR_LIGHT_TEXT};
  border-radius: 20px;
  padding: 3px 12px;
`;

const NotesText = styled.Text`
  color: ${COLOR_LIGHT_TEXT};
  font-weight: 700;
  margin-right: 5px;
`;

const NotesLabel = styled.Text`
  color: ${COLOR_LIGHT_TEXT};
  font-size: 13px;
`;

const IconsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

const FooterIcon = styled.TouchableOpacity`
  padding: 6px;
};
