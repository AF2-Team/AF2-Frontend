import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';

const heartOutline = require('../assets/images/heart_outline.png');
const heartFilled = require('../assets/images/heart_filled.png');
const commentIcon = require('../assets/images/comment.png');
const repostIcon = require('../assets/images/repost.png');
const favoriteOutline = require('../assets/images/favorite_outline.png');
const favoriteFilled = require('../assets/images/favorite_filled.png');

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
  postImage 
}: PostFooterProps) => {
  const router = useRouter();
  
  // Estados individuales para cada tipo de interacción
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [favoritesCount, setFavoritesCount] = useState(initialFavorites);
  const [repostsCount, setRepostsCount] = useState(initialReposts);
  const [commentsCount, setCommentsCount] = useState(initialComments);

  // Calcular el total de interacciones
  const totalInteractions = likesCount + favoritesCount + repostsCount + commentsCount;

  const handleLikePress = () => {
    setIsLiked(prev => {
      const newState = !prev;
      setLikesCount(prevCount => newState ? prevCount + 1 : prevCount - 1);
      // Llamada a la API para like
      return newState;
    });
  };

  const handleFavoritePress = () => {
    setIsFavorite(prev => {
      const newState = !prev;
      setFavoritesCount(prevCount => newState ? prevCount + 1 : prevCount - 1);
      // Llamada a la API para favorito
      return newState;
    });
  };

  const handleRepostPress = () => {
    setRepostsCount(prev => prev + 1);
    router.push({
      pathname: '/screens/create-repost',
      params: { 
        postId,
        postContent,
        postAuthor,
        postImage,
      }
    });
  };

  const handleCommentPress = () => {
    setCommentsCount(prev => prev + 1);
    if (onCommentPress) {
      onCommentPress();
    }
  };

  return (
    <Container>
      {/* Contador de Notas (Total de interacciones) - No es presionable */}
      <NotesContainer>
        <NotesText>
          {totalInteractions} {totalInteractions === 1 ? 'nota' : 'notas'}
        </NotesText>
      </NotesContainer>

      {/* Botones de interacción */}
      <InteractionsContainer>
        <IconButton onPress={handleLikePress}>
          <Icon source={isLiked ? heartFilled : heartOutline} />
          <CountText>{likesCount}</CountText>
        </IconButton>

        <IconButton onPress={handleCommentPress}>
          <Icon source={commentIcon} />
          <CountText>{commentsCount}</CountText>
        </IconButton>

        <IconButton onPress={handleRepostPress}>
          <Icon source={repostIcon} />
          <CountText>{repostsCount}</CountText>
        </IconButton>

        <IconButton onPress={handleFavoritePress}>
          <Icon source={isFavorite ? favoriteFilled : favoriteOutline} />
          <CountText>{favoritesCount}</CountText>
        </IconButton>
      </InteractionsContainer>
    </Container>
  );
};

// Styled Components
const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 15px;
  padding-vertical: 10px;
  background-color: #fff;
  border-top-width: 1px;
  border-top-color: #423646;
`;

const NotesContainer = styled.View`
  width: 89px;
  height: 31px;
  border-width: 1px;
  border-color: #423646;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

const NotesText = styled.Text`
  font-size: 15px;
  color: #423646;
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

const Icon = styled.Image`
  width: 24px;
  height: 24px;
  resize-mode: contain;
`;

const CountText = styled.Text`
  margin-left: 5px;
  font-size: 14px;
  color: #687076;
`;
