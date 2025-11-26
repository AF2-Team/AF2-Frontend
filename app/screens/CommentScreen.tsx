import { CommentInput } from "@/components/CommentInput";
import { Comment, CommentItem } from "@/components/CommentItem";
import { Tab, TabView } from "@/components/TabView";
import { UserListItem } from "@/components/UserListItem";
import { Colors, THEME } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Keyboard,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CommentScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const originalPost = params.originalPost ? JSON.parse(params.originalPost as string) : null;

  const postId = originalPost?.postId || "";
  const postContent = originalPost?.content || "";
  const postAuthor = originalPost?.user?.username || "";
  const postImage = originalPost?.mainImage || "";
  const postTags = originalPost?.tags || [];
  const initialLikes = Number(params.initialLikes) || 0;
  const initialComments = Number(params.initialComments) || 0;
  const initialReposts = Number(params.initialReposts) || 0;
  const initialFavorites = Number(params.initialFavorites) || 0;
  const totalInteractions =
    initialLikes + initialComments + initialReposts + initialFavorites;

  const currentUser = {
    name: "broken-hours",
    username: "broken-hours",
    avatar: require("@/assets/images/default_avatar.png"),
  };

  const [comments, setComments] = useState<Comment[]>(
    [
      {
        id: "1",
        user: "carnivora537",
        username: "carnivora537",
        time: "14 jun",
        content: "Perfección",
        avatar: "https://placehold.co/40x40/333/white?text=C",
      },
      ...(initialComments > 1
        ? [
            {
              id: "2",
              user: "broke...",
              username: "broke...",
              time: "13 jun",
              content: "Increíble trabajo!",
              avatar: "https://placehold.co/40x40/666/white?text=B",
            },
          ]
        : []),
    ].slice(0, initialComments),
  );

  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const inputContainerAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  // Efecto para el teclado
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        Animated.timing(inputContainerAnim, {
          toValue: -e.endCoordinates.height,
          duration: 250,
          useNativeDriver: false,
        }).start();
      },
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        Animated.timing(inputContainerAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }).start();
      },
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [inputContainerAnim]);

  const tabs: Tab[] = [
    {
      key: "comments",
      title: "Comments",
      icon: "chatbox-outline",
      count: comments.length,
    },
    {
      key: "reposts",
      title: "Reposts",
      icon: "arrow-redo-outline",
      count: initialReposts,
    },
    {
      key: "likes",
      title: "Likes",
      icon: "heart-outline",
      count: initialLikes,
    },
  ];

  const handleSendComment = () => {
    if (commentText.trim() === "") return;

    const newComment: Comment = {
      id: Date.now().toString(),
      user: currentUser.name,
      username: currentUser.username,
      time: "Ahora",
      content: commentText.trim(),
      avatar: currentUser.avatar,
      isReply: !!replyingTo,
      parentId: replyingTo || undefined,
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentText("");
    setReplyingTo(null);

    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 100);
  };

  const handleReplyPress = (commentId: string, username: string) => {
    setReplyingTo(commentId);
    setCommentText(`@${username} `);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setCommentText("");
  };

  const handleUsernamePress = (username: string) => {
    router.push({
      pathname: "/screens/ProfileUserScreen",
      params: { username },
    });
  };

  const handleProfilePress = (username: string) => {
    router.push({
      pathname: "/screens/ProfileUserScreen",
      params: { username },
    });
  };

  // Datos mock para reposts y likes
  const repostData = [
    {
      id: "1",
      user: "zantarna",
      username: "zantarna",
      time: "Hace 53min",
    },
    ...(initialReposts > 1
      ? [
          {
            id: "2",
            user: "sentryagent",
            username: "sentryagent",
            time: "Hace 1h",
          },
        ]
      : []),
  ].slice(0, initialReposts);

  const likeData = [
    {
      id: "1",
      user: "carnivora537",
      username: "carnivora537",
    },
    ...(initialLikes > 1
      ? [
          {
            id: "2",
            user: "zantarna",
            username: "zantarna",
          },
        ]
      : []),
  ].slice(0, initialLikes);

  const renderScene = ({ index }: { index: number }) => {
    switch (index) {
      case 0: // Comments
        return (
          <View style={styles.tabContent}>
            {comments.length > 0 ? (
              <FlatList
                ref={flatListRef}
                data={comments}
                renderItem={({ item }) => (
                  <CommentItem
                    comment={item}
                    onUsernamePress={handleUsernamePress}
                    onProfilePress={handleProfilePress}
                    onReplyPress={handleReplyPress}
                  />
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                inverted={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons
                  name="chatbox-outline"
                  size={48}
                  color={Colors.textMuted}
                />
                <Text style={styles.emptyText}>No hay comentarios aún</Text>
              </View>
            )}
          </View>
        );

      case 1: // Reposts
        return (
          <View style={styles.tabContent}>
            {repostData.length > 0 ? (
              <FlatList
                data={repostData}
                renderItem={({ item }) => (
                  <UserListItem
                    user={item.user}
                    username={item.username}
                    time={item.time}
                    onUsernamePress={handleUsernamePress}
                    onProfilePress={handleProfilePress}
                  />
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons
                  name="arrow-redo-outline"
                  size={48}
                  color={Colors.textMuted}
                />
                <Text style={styles.emptyText}>No hay reposts aún</Text>
              </View>
            )}
          </View>
        );

      case 2: // Likes
        return (
          <View style={styles.tabContent}>
            {likeData.length > 0 ? (
              <FlatList
                data={likeData}
                renderItem={({ item }) => (
                  <UserListItem
                    user={item.user}
                    username={item.username}
                    onUsernamePress={handleUsernamePress}
                    onProfilePress={handleProfilePress}
                  />
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons
                  name="heart-outline"
                  size={48}
                  color={Colors.textMuted}
                />
                <Text style={styles.emptyText}>No hay likes aún</Text>
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("../screens/HomeScreen")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textLight} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{totalInteractions} notas</Text>
        <View style={styles.headerSpacer} />
      </View>

      <TabView
        tabs={tabs}
        activeTab={activeTab}
        onTabPress={setActiveTab}
        onIndexChange={setActiveTab}
        renderScene={renderScene}
        activeColor={Colors.primary}
        inactiveColor={Colors.textMuted}
      />

      {activeTab === 0 && (
        <CommentInput
          commentText={commentText}
          onCommentTextChange={setCommentText}
          onSendComment={handleSendComment}
          inputContainerAnim={inputContainerAnim}
          replyingTo={replyingTo}
          onCancelReply={handleCancelReply}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: THEME.SPACING.MD,
    paddingVertical: THEME.SPACING.MD,
    backgroundColor: Colors.primary,
  },
  backButton: {
    padding: THEME.SPACING.XS,
  },
  headerTitle: {
    fontSize: THEME.TYPOGRAPHY.SUBTITLE,
    fontFamily: THEME.FONTS.BOLD,
    color: Colors.textLight,
  },
  headerSpacer: {
    width: 24,
  },
  tabContent: {
    flex: 1,
  },
  listContent: {
    padding: THEME.SPACING.MD,
    paddingBottom: THEME.SPACING.XL * 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyText: {
    marginTop: THEME.SPACING.MD,
    fontSize: THEME.TYPOGRAPHY.BODY,
    color: Colors.textMuted,
    fontFamily: THEME.FONTS.REGULAR,
  },
});

export default CommentScreen;
