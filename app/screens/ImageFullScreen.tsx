import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing, Text } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { ImagePostFooter } from "../../components/ImagePostFooter";
import { UserInfoHeader } from "../../components/UserInfoHeader";
import { PostData } from "../../types/PostTypes";

const COLORS = {
  background: "#918991",
  white: "#FFFFFF",
  semiTransparent: "rgba(255, 255, 255, 0.25)",
} as const;

const ANIMATION_CONFIG = {
  fade: {
    duration: 400,
    easing: Easing.out(Easing.ease),
  },
  spring: {
    friction: 6,
    tension: 50,
  },
} as const;

export default function ImageFullScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const postString = params.post;

  if (!postString || typeof postString !== "string") {
    return (
      <Container>
        <ErrorText>No se pudo cargar la información del post.</ErrorText>
      </Container>
    );
  }

  let post: PostData;
  try {
    post = JSON.parse(postString);
  } catch (e) {
    console.error("Error parsing post JSON:", e);
    return (
      <Container>
        <ErrorText>Error: El formato de los datos es incorrecto.</ErrorText>
      </Container>
    );
  }

  const [isFollowing, setIsFollowing] = useState(
    post.user.isFollowing || false,
  );
  const [likesCount, setLikesCount] = useState(post.initialLikes);
  const [favoritesCount, setFavoritesCount] = useState(post.initialFavorites);
  const [repostsCount, setRepostsCount] = useState(post.initialReposts);
  const [commentsCount, setCommentsCount] = useState(post.initialComments);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_CONFIG.fade.duration,
        easing: ANIMATION_CONFIG.fade.easing,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: ANIMATION_CONFIG.spring.friction,
        tension: ANIMATION_CONFIG.spring.tension,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleBack = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.back();
    });
  }, [router, fadeAnim, scaleAnim]);

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
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
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
              textColor={COLORS.white}
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
            postId={post.id}
            postContent={post.content}
            postAuthor={post.user.username}
            postImage={post.mediaUrl}
          />
        </Animated.View>
      </AnimatedFooter>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${COLORS.background};
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
  background-color: ${COLORS.semiTransparent};
  border-radius: 20px;
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

const ErrorText = styled.Text`
  color: ${COLORS.white};
  text-align: center;
  margin-top: 100px;
  font-size: 16px;
  font-family: "OpenSans-Regular";
`;
