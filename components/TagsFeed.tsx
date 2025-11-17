import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl
} from "react-native";
import styled from "styled-components/native";
import { PostData } from "../types/PostTypes.ts";
import { Post } from "./Post";
import { TagFilterBar } from "./TagFilterBar";
import { TagFilterModal } from "./TagFilterModal";

// Datos mock para etiquetas seguidas
const mockFollowedTags = [
  { id: "1", name: "spn", postCount: 42 },
  { id: "2", name: "flowers", postCount: 28 },
  { id: "3", name: "renmick", postCount: 15 },
  { id: "4", name: "art", postCount: 36 },
  { id: "5", name: "photography", postCount: 52 },
];

// Datos mock para posts filtrados por etiquetas
const mockTagPosts: PostData[] = [
  {
    id: "tag1",
    user: {
      id: "user5",
      username: "archivetherot",
      avatarUrl: null,
      avatarShape: "circle",
      isFollowing: false,
    },
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    content: `#ANNIHILATION\n\n"Ghost bird, do you love me?" he whispered once in the dark, before he left for his expedition training, even though he was the ghost.\n"Ghost bird, do you need me?"`,
    hashtags: ["ANNIHILATION", "ghostbird", "scifi"],
    initialLikes: 8,
    initialFavorites: 3,
    initialReposts: 2,
    initialComments: 5,
  },
  {
    id: "tag2",
    user: {
      id: "user6",
      username: "booklover42",
      avatarUrl: null,
      avatarShape: "circle",
      isFollowing: true,
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    content: `Just finished #spn season finale. My heart can't take this! #WinchesterBrothers`,
    hashtags: ["spn", "WinchesterBrothers", "finale"],
    initialLikes: 15,
    initialFavorites: 2,
    initialReposts: 4,
    initialComments: 8,
  },
  {
    id: "tag3",
    user: {
      id: "user7",
      username: "nature_lover",
      avatarUrl: null,
      avatarShape: "circle",
      isFollowing: false,
    },
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    content: `Beautiful #flowers from my garden today. Spring is finally here! 🌸 #nature #photography`,
    hashtags: ["flowers", "spring", "garden", "nature", "photography"],
    initialLikes: 23,
    initialFavorites: 5,
    initialReposts: 3,
    initialComments: 12,
    mediaUrl:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "tag4",
    user: {
      id: "user8",
      username: "art_enthusiast",
      avatarUrl: null,
      avatarShape: "circle",
      isFollowing: false,
    },
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    content: `Working on some new #art pieces. The creative process is fascinating! #renmick`,
    hashtags: ["art", "renmick", "creative"],
    initialLikes: 18,
    initialFavorites: 4,
    initialReposts: 2,
    initialComments: 7,
  },
];

export const TagsFeed = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [followedTags, setFollowedTags] = useState(mockFollowedTags);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showTagFilterModal, setShowTagFilterModal] = useState(false);

  const selectedTagsCount = selectedTags.length;

  // Obtener las etiquetas seguidas como array de strings para el modal
  const followedTagNames = mockFollowedTags.map((tag) => tag.name);

  const loadTagPosts = useCallback(
    async (isRefresh = false) => {
      if (!isRefresh) {
        setLoading(true);
      }
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        let filteredPosts = mockTagPosts;
        if (selectedTags.length > 0) {
          filteredPosts = mockTagPosts.filter((post) =>
            selectedTags.some((selectedTag) =>
              post.hashtags.some(
                (tag) => tag.toLowerCase() === selectedTag.toLowerCase(),
              ),
            ),
          );
        }

        setPosts(filteredPosts);
      } catch (err) {
        console.error("Error loading tag posts:", err);
        setError("No se pudieron cargar las publicaciones");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedTags],
  );

  useEffect(() => {
    loadTagPosts();
  }, [loadTagPosts]);

  const handleTagFilterPress = () => {
    setShowTagFilterModal(true);
  };

  const handleCloseTagFilterModal = () => {
    setShowTagFilterModal(false);
  };

  const handleApplyTagFilter = (selectedTagsFromModal: string[]) => {
    setSelectedTags(selectedTagsFromModal);
    setShowTagFilterModal(false);
    // El feed se actualizará automáticamente por el useEffect que depende de selectedTags
  };

  const handleManageTagsPress = () => {
    console.log("Navegar a pantalla de gestión de etiquetas");
    router.push("/screens/manage-tags");
  };

  const handleTagPress = (tagName: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagName)) {
        return prev.filter((tag) => tag !== tagName);
      } else {
        return [...prev, tagName];
      }
    });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTagPosts(true);
  }, [loadTagPosts]);

  const handleFollowChange = (userId: string, isFollowing: boolean) => {
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

  const handleNotInterested = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  const handleCommentPress = (postId: string) => {
    router.push(`/screens/comments/${postId}`);
  };

  const handleOptionsPress = (postId: string) => {
    console.log(`Abrir opciones del post: ${postId}`);
  };

  const handleHashtagPress = (hashtag: string) => {
    console.log(`Buscar hashtag: ${hashtag}`);
  };

  const renderPost = ({ item }: { item: PostData }) => (
    <Post
      post={item}
      onFollowChange={handleFollowChange}
      onCommentPress={() => handleCommentPress(item.id)}
      onOptionsPress={() => handleOptionsPress(item.id)}
      onHashtagPress={handleHashtagPress}
      onNotInterested={handleNotInterested}
    />
  );

  const renderHeader = () => (
    <HeaderContainer>
      <TagFilterBar
        onTagFilterPress={handleTagFilterPress}
        onManageTagsPress={handleManageTagsPress}
        selectedTagsCount={selectedTagsCount}
      />

      <FilterSection>
        <FollowedTagsSection>
          <TagsHeader>
            <TagsTitle>Etiquetas que sigues</TagsTitle>
            {selectedTagsCount > 0 && (
              <ClearFilterButton onPress={() => setSelectedTags([])}>
                <ClearFilterText>Limpiar filtros</ClearFilterText>
              </ClearFilterButton>
            )}
          </TagsHeader>

          <TagsScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 5 }}
          >
            {followedTags.map((tag) => (
              <TagItem
                key={tag.id}
                onPress={() => handleTagPress(tag.name)}
                isSelected={selectedTags.includes(tag.name)}
              >
                <TagName isSelected={selectedTags.includes(tag.name)}>
                  #{tag.name}
                </TagName>
                <TagCount>{tag.postCount}</TagCount>
              </TagItem>
            ))}
          </TagsScrollView>
        </FollowedTagsSection>
      </FilterSection>

      {posts.length > 0 && (
        <PostsTitle>
          {selectedTagsCount > 0
            ? `Publicaciones con ${selectedTagsCount} etiqueta${selectedTagsCount > 1 ? "s" : ""}`
            : `Publicaciones recientes`}
        </PostsTitle>
      )}
    </HeaderContainer>
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
          <RetryButton onPress={() => loadTagPosts()}>
            <RetryButtonText>Reintentar</RetryButtonText>
          </RetryButton>
        </EmptyContainer>
      );
    }

    return (
      <EmptyContainer>
        <EmptyText>
          {selectedTagsCount > 0
            ? `No hay publicaciones con las etiquetas seleccionadas`
            : `No hay publicaciones para tus etiquetas`}
        </EmptyText>
        <EmptySubText>
          {selectedTagsCount > 0
            ? `Intenta con otras etiquetas o limpia los filtros`
            : `Sigue más etiquetas para ver contenido`}
        </EmptySubText>
        {selectedTagsCount > 0 && (
          <ClearFilterButton onPress={() => setSelectedTags([])}>
            <ClearFilterText>Limpiar filtros</ClearFilterText>
          </ClearFilterButton>
        )}
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
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
      />

      <TagFilterModal
        visible={showTagFilterModal}
        onClose={handleCloseTagFilterModal}
        onApply={handleApplyTagFilter}
        followedTags={followedTagNames}
        selectedTags={selectedTags}
      />
    </Container>
  );
};

// Estilos
const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const HeaderContainer = styled.View`
  background-color: #ffffff;
`;

const FilterSection = styled.View`
  margin-bottom: 16px;
  padding: 16px 15px 8px 15px;
`;

const FollowedTagsSection = styled.View`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #e9ecef;
`;

const TagsHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const TagsTitle = styled.Text`
  font-family: "OpenSans-SemiBold";
  font-size: 14px;
  color: #423646;
`;

const ClearFilterButton = styled.TouchableOpacity`
  padding: 6px 12px;
  background-color: #6c757d;
  border-radius: 16px;
`;

const ClearFilterText = styled.Text`
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
`;

const TagsScrollView = styled.ScrollView`
  flex-grow: 0;
`;

const TagItem = styled.TouchableOpacity<{ isSelected: boolean }>`
  background-color: ${({ isSelected }) => (isSelected ? "#423646" : "#ffffff")};
  padding: 8px 12px;
  border-radius: 16px;
  margin-right: 8px;
  border: 1px solid ${({ isSelected }) => (isSelected ? "#423646" : "#dee2e6")};
  min-width: 80px;
  align-items: center;
`;

const TagName = styled.Text<{ isSelected: boolean }>`
  font-family: "OpenSans-Bold";
  font-size: 13px;
  color: ${({ isSelected }) => (isSelected ? "#ffffff" : "#423646")};
  margin-bottom: 2px;
`;

const TagCount = styled.Text`
  font-family: "OpenSans-Light";
  font-size: 11px;
  color: #6c757d;
`;

const PostsTitle = styled.Text`
  font-family: "OpenSans-SemiBold";
  font-size: 16px;
  color: #423646;
  margin-bottom: 8px;
  margin-top: 8px;
  padding: 0 15px;
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
