import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing, FlatList, Dimensions } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { ImagePostFooter } from "../../components/ImagePostFooter";
import { UserInfoHeader } from "../../components/UserInfoHeader";
import { PostData } from "../../types/PostTypes";
import { Colors, THEME } from "@/constants";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

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
  const initialIndex = parseInt(params.initialIndex as string) || 0;

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

  const mediaUrls = post.mediaUrls || (post.mediaUrl ? [post.mediaUrl] : []);

  const [isFollowing, setIsFollowing] = useState(
    post.user.isFollowing || false,
  );
  const [likesCount, setLikesCount] = useState(post.initialLikes);
  const [favoritesCount, setFavoritesCount] = useState(post.initialFavorites);
  const [repostsCount, setRepostsCount] = useState(post.initialReposts);
  const [commentsCount, setCommentsCount] = useState(post.initialComments);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const flatListRef = useRef<FlatList>(null);

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

  useEffect(() => {
    if (initialIndex > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: initialIndex,
          animated: false,
        });
      }, 100);
    }
  }, [initialIndex]);

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

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderImageItem = ({
    item,
    index,
  }: {
    item: string;
    index: number;
  }) => (
    <ImageItem>
      <AnimatedImage
        source={{ uri: item }}
        resizeMode="contain"
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      />
    </ImageItem>
  );

  return (
    <Container>
      {/* Header con botón volver */}
      <Header>
        <BackButton activeOpacity={0.8} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.textLight} />
        </BackButton>

        {/* Indicador de imágenes múltiples */}
        {mediaUrls.length > 1 && (
          <ImageCounter>
            <ImageCounterText>
              {currentIndex + 1} / {mediaUrls.length}
            </ImageCounterText>
          </ImageCounter>
        )}
      </Header>

      {/* Contenedor de imágenes con FlatList para múltiples imágenes */}
      <ImageContainer>
        {mediaUrls.length > 0 ? (
          <AnimatedFlatList
            ref={flatListRef}
            data={mediaUrls}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            initialScrollIndex={initialIndex}
            getItemLayout={(data, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            style={{
              opacity: fadeAnim,
            }}
          />
        ) : (
          <ErrorText>No hay imagen disponible</ErrorText>
        )}
      </ImageContainer>

      {/* Footer con info y botones */}
      <AnimatedFooter style={{ opacity: fadeAnim }}>
        <UserInfoSection>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <UserInfoHeader
              user={post.user}
              createdAt={post.createdAt}
              isFollowing={isFollowing}
              onFollowChange={handleFollowChange}
              textColor={Colors.textLight}
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
            postImage={mediaUrls[0]}
          />
        </Animated.View>
      </AnimatedFooter>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${Colors.background};
`;

const Header = styled.View`
  position: absolute;
  top: ${THEME.SPACING.SCREEN_VERTICAL + THEME.SPACING.STATUS_BAR}px;
  left: ${THEME.SPACING.SCREEN_HORIZONTAL}px;
  right: ${THEME.SPACING.SCREEN_HORIZONTAL}px;
  z-index: 10;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  background-color: ${Colors.pressedOverlay};
  border-radius: ${THEME.COMMON.BORDER_RADIUS.FULL}px;
`;

const ImageCounter = styled.View`
  background-color: ${Colors.pressedOverlay};
  padding: ${THEME.SPACING.XS}px ${THEME.SPACING.SM}px;
  border-radius: ${THEME.COMMON.BORDER_RADIUS.MD}px;
`;

const ImageCounterText = styled.Text`
  color: ${Colors.textLight};
  font-size: ${THEME.TYPOGRAPHY.CAPTION}px;
  font-family: ${THEME.FONTS.SEMI_BOLD};
`;

const ImageContainer = styled.View`
  flex: 1;
  background-color: ${Colors.filterBarBackground};
`;

const ImageItem = styled.View`
  width: ${screenWidth}px;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const AnimatedImage = Animated.createAnimatedComponent(styled.Image`
  width: 100%;
  height: 100%;
`);

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const AnimatedFooter = Animated.createAnimatedComponent(styled.View`
  position: absolute;
  bottom: 0;
  left: -8;
  right: -8;
  background-color: ${Colors.filterBarBackground};
  border-top-left-radius: ${THEME.COMMON.BORDER_RADIUS.LG}px;
  border-top-right-radius: ${THEME.COMMON.BORDER_RADIUS.LG}px;
`);

const UserInfoSection = styled.View`
  padding: ${THEME.SPACING.MD}px;
  background-color: transparent;
`;

const ErrorText = styled.Text`
  color: ${Colors.textLight};
  text-align: center;
  margin-top: 100px;
  font-size: ${THEME.TYPOGRAPHY.BODY}px;
  font-family: ${THEME.FONTS.REGULAR};
`;
