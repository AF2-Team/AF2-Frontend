// components/ImagePostFooter.tsx
import React, { useState } from "react";
import styled from "styled-components/native";

const commentIcon = require("../assets/images/messageImage.png");
const repostIcon = require("../assets/images/repostImage.png");
const favoriteIcon = require("../assets/images/favoriteImage_outline.png");
const favoriteFilledIcon = require("../assets/images/favoriteImage_filled.png");
const likeIcon = require("../assets/images/likeImage_outline.png");
const likeFilledIcon = require("../assets/images/likeImagen_filled.png");

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
  const [likes, setLikes] = useState(initialLikes);
  const [favorites, setFavorites] = useState(initialFavorites);
  const [reposts, setReposts] = useState(initialReposts);
  const [comments] = useState(initialComments);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    if (onLikePress) onLikePress();
  };

  const handleFavorite = () => {
    setFavorited(!favorited);
    setFavorites((prev) => (favorited ? prev - 1 : prev + 1));
    if (onFavoritePress) onFavoritePress();
  };

  return (
    <FooterContainer>
      <NotesButton>
        <NotesText>{comments}</NotesText>
        <NotesLabel>notas</NotesLabel>
      </NotesButton>

      <IconsContainer>
        <FooterIcon onPress={onCommentPress}>
          <IconImage source={commentIcon} />
        </FooterIcon>

        <FooterIcon onPress={onRepostPress}>
          <IconImage source={repostIcon} />
        </FooterIcon>

        <FooterIcon onPress={handleFavorite}>
          <IconImage source={favorited ? favoriteFilledIcon : favoriteIcon} />
        </FooterIcon>

        <FooterIcon onPress={handleLike}>
          <IconImage source={liked ? likeFilledIcon : likeIcon} />
        </FooterIcon>
      </IconsContainer>
    </FooterContainer>
  );
};

// 💅 Estilos
const FooterContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 18px;
  background-color: #423646;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
`;

const NotesButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: #faf7f7;
  border-radius: 20px;
  padding: 3px 12px;
`;

const NotesText = styled.Text`
  color: #faf7f7;
  font-weight: 700;
  margin-right: 5px;
`;

const NotesLabel = styled.Text`
  color: #faf7f7;
  font-size: 13px;
`;

const IconsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

const FooterIcon = styled.TouchableOpacity`
  padding: 6px;
`;

const IconImage = styled.Image`
  width: 24px;
  height: 24px;
  tint-color: #faf7f7;
`;
