import React, { useState, useCallback, useEffect } from "react";
import { FlatList, ActivityIndicator, RefreshControl } from "react-native";
import styled from "styled-components/native";
import { useRouter } from "expo-router";
import { Post } from "./Post";
import { PostData } from "../types/PostTypes";

// Datos mock - reemplaza con la API real
const mockPosts: PostData[] = [
  {
    id: "1",
    user: {
      id: "user1",
      username: "the-preachersdauther",
      avatarUrl: null,
      avatarShape: "circle",
      isFollowing: false,
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    content: `#losser\n\nbabygirl\n\ngirlhood is a spectrum`,
    hashtags: ["losser", "babygirl", "girlhood", "spectrum"],
    initialLikes: 3,
    initialFavorites: 1,
    initialReposts: 2,
    initialComments: 4,
  },
  {
    id: "2",
    user: {
      id: "user2",
      username: "slu",
      avatarUrl: null,
      avatarShape: "square",
      isFollowing: true,
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    content: `Explorando nuevos horizontes en el desarrollo frontend.`,
    hashtags: ["reactnative", "typescript", "frontend"],
    initialLikes: 8,
    initialFavorites: 2,
    initialReposts: 1,
    initialComments: 3,
  },
  {
    id: "3",
    user: {
      id: "user3",
      username: "creative_writer",
      avatarUrl: null,
      avatarShape: "circle",
      isFollowing: false,
    },
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    content: `Acabo de descubrir algo increíble en mi viaje de autodescubrimiento.`,
    hashtags: ["autodescubrimiento", "viaje", "crecimiento"],
    initialLikes: 15,
    initialFavorites: 3,
    initialReposts: 5,
    initialComments: 7,
  },
  {
    id: "4",
    user: {
      id: "user4",
      username: "photo_lover",
      avatarUrl: null,
      avatarShape: "circle",
      isFollowing: false,
    },
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    content: `Un atardecer que capturé hoy. ¿No es maravilloso?`,
    hashtags: ["atardecer", "fotografía", "naturaleza"],
    initialLikes: 25,
    initialFavorites: 5,
    initialReposts: 3,
    initialComments: 12,
    mediaUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
];

export const Feed = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async (isRefresh = false) => {
    if (!isRefresh) {
      setLoading(true);
    }
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPosts(mockPosts);
    } catch (err) {
      console.error("Error loading posts:", err);
      setError("No se pudieron cargar las publicaciones");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPosts(true);
  }, [loadPosts]);

  const handleFollowChange = (userId: string, isFollowing: boolean) => {
    console.log(`Usuario ${userId} - Seguir: ${isFollowing}`);

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.user.id === userId
          ? {
              ...post,
              user: { ...post.user, isFollowing },
              isFollowing,
            }
          : post,
      ),
    );
  };

  const handleCommentPress = (postId: string) => {
    router.push(`/screens/comments/${postId}`);
  };

  const handleOptionsPress = (postId: string) => {
    console.log(`Abrir opciones del post: ${postId}`);
  };

  const handleHashtagPress = (hashtag: string) => {
    router.push(`/screens/search?hashtag=${encodeURIComponent(hashtag)}`);
  };

  const renderPost = ({ item }: { item: PostData }) => (
    <Post
      post={item}
      onFollowChange={handleFollowChange}
      onCommentPress={() => handleCommentPress(item.id)}
      onOptionsPress={() => handleOptionsPress(item.id)}
      onHashtagPress={handleHashtagPress}
    />
  );

  const renderEmptyComponent = () => {
    if (loading) {
      return (
        <LoadingContainer>
          <ActivityIndicator size="large" color="#423646" />
          <LoadingText>Cargando publicaciones...</LoadingText>
        </LoadingContainer>
      );
    }

    if (error) {
      return (
        <EmptyContainer>
          <ErrorText>¡Ups! Algo salió mal</ErrorText>
          <ErrorSubText>{error}</ErrorSubText>
          <RetryButton onPress={() => loadPosts()}>
            <RetryButtonText>Reintentar</RetryButtonText>
          </RetryButton>
        </EmptyContainer>
      );
    }

    return (
      <EmptyContainer>
        <EmptyText>No hay publicaciones aún</EmptyText>
        <EmptySubText>Sé el primero en compartir algo</EmptySubText>
      </EmptyContainer>
    );
  };

  if (loading && !refreshing && posts.length === 0) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#423646" />
        <LoadingText>Cargando publicaciones...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
          flexGrow: posts.length === 0 ? 1 : 0,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#423646"]}
            tintColor="#423646"
          />
        }
        ListEmptyComponent={renderEmptyComponent}
      />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 50px;
`;

const LoadingText = styled.Text`
  margin-top: 16px;
  font-size: 16px;
  color: #687076;
`;

const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 50px;
  min-height: 300px;
`;

const EmptyText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #423646;
  margin-bottom: 8px;
  text-align: center;
`;

const EmptySubText = styled.Text`
  font-size: 14px;
  color: #687076;
  text-align: center;
`;

const ErrorText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #ff6b6b;
  margin-bottom: 8px;
  text-align: center;
`;

const ErrorSubText = styled.Text`
  font-size: 14px;
  color: #687076;
  text-align: center;
  margin-bottom: 20px;
`;

const RetryButton = styled.TouchableOpacity`
  background-color: #423646;
  padding: 12px 24px;
  border-radius: 8px;
`;

const RetryButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
`;
