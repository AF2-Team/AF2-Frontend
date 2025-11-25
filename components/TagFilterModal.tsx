import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl } from "react-native";
import styled from "styled-components/native";
import { PostData } from "../types/PostTypes";
import { Post } from "./Post";
import { TagFilterBar } from "./TagFilterBar";
import { TagFilterModal } from "./TagFilterModal";
import { Colors, THEME } from "@/constants";

const mockFollowedTags = [
  { id: "1", name: "spn", postCount: 42 },
  { id: "2", name: "flowers", postCount: 28 },
  { id: "3", name: "renmick", postCount: 15 },
  { id: "4", name: "art", postCount: 36 },
  { id: "5", name: "photography", postCount: 52 },
];

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
    mediaUrls: [
      "https://64.media.tumblr.com/4e1d9bdb2eeef58b263aacd74f87f2db/12d9f53468679919-89/s540x810/302b355d345c213efba725992bc532e8117b0e9f.pnj",
      "https://64.media.tumblr.com/7f4bbb971fc56826564fbb50295e7514/12d9f53468679919-c7/s400x600/cdc24e1ff8fc0131180959f70a14e10553513f9a.jpg",
      "https://64.media.tumblr.com/7acac4888048455cb1d30b29bb45481c/12d9f53468679919-8d/s400x600/1122fde097a8705229321fab329463db53e4a44f.jpg",
      "https://64.media.tumblr.com/e7072b3d667ad1f43551e203ceea7b2c/12d9f53468679919-a7/s540x810/2968a06cb8f1fc1e4562ed6000646bf9325dfc2d.jpg",
    ],
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
  };

  const handleManageTagsPress = () => {
    console.log("Navegar a pantalla de gestión de etiquetas");
    router.push("../screens/ManageTagsScreen");
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
    router.push(`../screens/CommentScreen/${postId}`);
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
            contentContainerStyle={{ paddingHorizontal: THEME.SPACING.XS }}
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
          <ActivityIndicator size="large" color={Colors.primary} />
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
        <ActivityIndicator size="large" color={Colors.primary} />
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
          paddingBottom: THEME.SPACING.XL * 3,
          flexGrow: posts.length === 0 ? 1 : 0,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
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

const Container = styled.View`
  flex: 1;
  background-color: ${Colors.background};
`;

const HeaderContainer = styled.View`
  background-color: ${Colors.background};
`;

const FilterSection = styled.View`
  margin-bottom: ${THEME.SPACING.MD}px;
  padding: ${THEME.SPACING.MD}px ${THEME.SPACING.MD}px ${THEME.SPACING.SM}px
    ${THEME.SPACING.MD}px;
`;

const FollowedTagsSection = styled.View`
  background-color: ${Colors.backgroundAlt};
  border-radius: ${THEME.COMMON.BORDER_RADIUS.MD}px;
  padding: ${THEME.SPACING.SM}px;
  border: 1px solid ${Colors.border};
`;

const TagsHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${THEME.SPACING.SM}px;
`;

const TagsTitle = styled.Text`
  font-family: ${THEME.FONTS.SEMI_BOLD};
  font-size: ${THEME.TYPOGRAPHY.CAPTION}px;
  color: ${Colors.text};
`;

const ClearFilterButton = styled.TouchableOpacity`
  padding: ${THEME.SPACING.SM}px ${THEME.SPACING.MD}px;
  background-color: ${Colors.textMuted};
  border-radius: ${THEME.COMMON.BORDER_RADIUS.XL}px;
`;

const ClearFilterText = styled.Text`
  color: ${Colors.textLight};
  font-size: ${THEME.TYPOGRAPHY.SMALL}px;
  font-family: ${THEME.FONTS.SEMI_BOLD};
`;

const TagsScrollView = styled.ScrollView`
  flex-grow: 0;
`;

const TagItem = styled.TouchableOpacity<{ isSelected: boolean }>`
  background-color: ${({ isSelected }) =>
    isSelected ? Colors.primary : Colors.background};
  padding: ${THEME.SPACING.SM}px ${THEME.SPACING.MD}px;
  border-radius: ${THEME.COMMON.BORDER_RADIUS.XL}px;
  margin-right: ${THEME.SPACING.SM}px;
  border: 1px solid
    ${({ isSelected }) => (isSelected ? Colors.primary : Colors.border)};
  min-width: 80px;
  align-items: center;
`;

const TagName = styled.Text<{ isSelected: boolean }>`
  font-family: ${THEME.FONTS.BOLD};
  font-size: ${THEME.TYPOGRAPHY.CAPTION}px;
  color: ${({ isSelected }) => (isSelected ? Colors.textLight : Colors.text)};
  margin-bottom: ${THEME.SPACING.XS}px;
`;

const TagCount = styled.Text`
  font-family: ${THEME.FONTS.LIGHT};
  font-size: ${THEME.TYPOGRAPHY.SMALL}px;
  color: ${Colors.textMuted};
`;

const PostsTitle = styled.Text`
  font-family: ${THEME.FONTS.SEMI_BOLD};
  font-size: ${THEME.TYPOGRAPHY.BODY}px;
  color: ${Colors.text};
  margin-bottom: ${THEME.SPACING.SM}px;
  margin-top: ${THEME.SPACING.SM}px;
  padding: 0 ${THEME.SPACING.MD}px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${THEME.SPACING.XL * 2}px;
`;

const LoadingText = styled.Text`
  margin-top: ${THEME.SPACING.MD}px;
  font-size: ${THEME.TYPOGRAPHY.BODY}px;
  color: ${Colors.textMuted};
  font-family: ${THEME.FONTS.REGULAR};
`;

const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${THEME.SPACING.XL * 2}px;
  min-height: 300px;
`;

const EmptyText = styled.Text`
  font-size: ${THEME.TYPOGRAPHY.TITLE}px;
  font-family: ${THEME.FONTS.SEMI_BOLD};
  color: ${Colors.text};
  margin-bottom: ${THEME.SPACING.SM}px;
  text-align: center;
`;

const EmptySubText = styled.Text`
  font-size: ${THEME.TYPOGRAPHY.BODY}px;
  color: ${Colors.textMuted};
  text-align: center;
  font-family: ${THEME.FONTS.REGULAR};
`;

const ErrorText = styled.Text`
  font-size: ${THEME.TYPOGRAPHY.TITLE}px;
  font-family: ${THEME.FONTS.SEMI_BOLD};
  color: ${Colors.error};
  margin-bottom: ${THEME.SPACING.SM}px;
  text-align: center;
`;

const ErrorSubText = styled.Text`
  font-size: ${THEME.TYPOGRAPHY.BODY}px;
  color: ${Colors.textMuted};
  text-align: center;
  font-family: ${THEME.FONTS.REGULAR};
  margin-bottom: ${THEME.SPACING.LG}px;
`;

const RetryButton = styled.TouchableOpacity`
  background-color: ${Colors.primary};
  padding: ${THEME.SPACING.SM}px ${THEME.SPACING.LG}px;
  border-radius: ${THEME.COMMON.BORDER_RADIUS.MD}px;
`;

const RetryButtonText = styled.Text`
  color: ${Colors.textLight};
  font-size: ${THEME.TYPOGRAPHY.BODY}px;
  font-family: ${THEME.FONTS.SEMI_BOLD};
`;
