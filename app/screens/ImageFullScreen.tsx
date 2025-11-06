import React, { useState, useEffect, useRef, useCallback } from "react";
import { Animated, Easing } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import styled from "styled-components/native";
import { ImagePostFooter } from "../../components/ImagePostFooter";
import { UserInfoHeader } from "../../components/UserInfoHeader";
import { PostData } from "../../types/PostTypes";

const backArrow = require("../../assets/images/back_arrow.png");

export default function ImageFullScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const post = JSON.parse(params.post as string) as PostData;

  const [isFollowing, setIsFollowing] = useState(
    post.user.isFollowing || false,
  );
  const [likesCount, setLikesCount] = useState(post.initialLikes);
  const [favoritesCount, setFavoritesCount] = useState(post.initialFavorites);
  const [repostsCount, setRepostsCount] = useState(post.initialReposts);
  const [commentsCount, setCommentsCount] = useState(post.initialComments);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  /** 🔹 Animaciones **/
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleFollowChange = useCallback(
    (userId: string, isFollowing: boolean) => {
      setIsFollowing(isFollowing);
    },
    [],
  );

  const handleLikePress = useCallback(() => {
    setIsLiked((prev) => {
      const newState = !prev;
      setLikesCount((prevCount) => (newState ? prevCount + 1 : prevCount - 1));
      return newState;
    });
  }, []);

  const handleFavoritePress = useCallback(() => {
    setIsFavorited((prev) => {
      const newState = !prev;
      setFavoritesCount((prevCount) =>
        newState ? prevCount + 1 : prevCount - 1,
      );
      return newState;
    });
  }, []);

  const handleRepostPress = useCallback(() => {
    setRepostsCount((prev) => prev + 1);
  }, []);

  const handleCommentPress = useCallback(() => {
    router.push(`/screens/comments/${post.id}`);
  }, [router, post.id]);

  return (
    <Container>
      {/* 🔹 Header con botón volver */}
      <Header>
        <BackButton activeOpacity={0.8} onPress={handleBack}>
          <BackArrow source={backArrow} />
        </BackButton>
      </Header>

      {/* 🔹 Imagen con fade-in + scale */}
      <ImageContainer>
        {post.mediaUrl && (
          <AnimatedImage
            source={{ uri: post.mediaUrl }}
            resizeMode="contain"
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }}
          />
        )}
      </ImageContainer>

      {/* 🔹 Footer con info y botones */}
      <AnimatedFooter style={{ opacity: fadeAnim }}>
        <UserInfoSection>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <UserInfoHeader
              user={post.user}
              createdAt={post.createdAt}
              isFollowing={isFollowing}
              onFollowChange={handleFollowChange}
              textColor="#FFFFFF"
            />
          </Animated.View>
        </UserInfoSection>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <ImagePostFooter
            initialLikes={likesCount}
            initialFavorites={favoritesCount}
            initialReposts={repostsCount}
            initialComments={commentsCount}
            onCommentPress={handleCommentPress}
            onRepostPress={handleRepostPress}
            onFavoritePress={handleFavoritePress}
            onLikePress={handleLikePress}
          />
        </Animated.View>
      </AnimatedFooter>
    </Container>
  );
}

/* 💅 Estilos (igual que los tuyos) */
const Container = styled.View`
  flex: 1;
  background-color: #918991;
`;

const Header = styled.View`
  position: absolute;
  top: 50px;
  left: 20px;
  z-index: 10;
`;

const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.25);
  border-radius: 20px;
`;

const BackArrow = styled.Image`
  width: 24px;
  height: 24px;
  tint-color: #ffffff;
`;

const ImageContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const AnimatedImage = Animated.createAnimatedComponent(styled.Image`
  width: 100%;
  height: 100%;
`);

const AnimatedFooter = Animated.createAnimatedComponent(styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`);

const UserInfoSection = styled.View`
  padding: 16px;
  background-color: transparent;
`;
