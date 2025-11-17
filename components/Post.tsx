import { useRouter } from "expo-router";
import React from "react";
import styled from "styled-components/native";
import { PostData } from "../types/PostTypes.ts";
import { PostFooter } from "./PostFooter";
import { PostHeader } from "./PostHeader";

interface PostProps {
  post: PostData;
  onFollowChange?: (userId: string, isFollowing: boolean) => void;
  onCommentPress?: () => void;
  onOptionsPress?: () => void;
  onHashtagPress?: (hashtag: string) => void;
  onNotInterested?: (postId: string) => void;
}

export const Post = ({
  post,
  onFollowChange,
  onCommentPress,
  onOptionsPress,
  onHashtagPress,
  onNotInterested,
}: PostProps) => {
  const router = useRouter();

  const handleImagePress = () => {
    if (post.mediaUrl) {
      router.push({
        pathname: "/screens/ImageFullScreen",
        params: {
          post: JSON.stringify(post),
        },
      });
    }
  };

  return (
    <PostContainer>
      <PostHeader
        user={post.user}
        createdAt={post.createdAt}
        isFollowing={post.isFollowing}
        onFollowChange={onFollowChange}
        onOptionsPress={onOptionsPress}
        postId={post.id}
        postContent={post.content}
        onNotInterested={onNotInterested}
      />

      <ContentContainer>
        <ContentText>{post.content}</ContentText>
      </ContentContainer>

      {post.mediaUrl && (
        <MediaContainer>
          <TouchableOpacity onPress={handleImagePress}>
            <PostImage source={{ uri: post.mediaUrl }} />
          </TouchableOpacity>
        </MediaContainer>
      )}

      {post.hashtags && post.hashtags.length > 0 && (
        <HashtagsContainer>
          {post.hashtags.map((hashtag, index) => (
            <HashtagButton
              key={index}
              onPress={() => onHashtagPress?.(hashtag)}
            >
              <Hashtag>#{hashtag}</Hashtag>
            </HashtagButton>
          ))}
        </HashtagsContainer>
      )}

      <PostFooter
        onCommentPress={onCommentPress}
        initialLikes={post.initialLikes}
        initialFavorites={post.initialFavorites}
        initialReposts={post.initialReposts}
        initialComments={post.initialComments}
        postId={post.id}
        postContent={post.content}
        postAuthor={post.user.username}
      />
    </PostContainer>
  );
};

const PostContainer = styled.View`
  background-color: #fff;
  margin-bottom: 12px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

const ContentContainer = styled.View`
  padding: 0 15px 10px 15px;
`;

const ContentText = styled.Text`
  font-size: 16px;
  line-height: 22px;
  color: #423646;
`;

const MediaContainer = styled.View`
  padding: 0 0 10px 0;
  margin: 0 15px;
`;

const PostImage = styled.Image`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  resize-mode: cover;
`;

const HashtagsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0 15px 10px 15px;
`;

const HashtagButton = styled.TouchableOpacity`
  margin-right: 8px;
  margin-bottom: 4px;
`;

const Hashtag = styled.Text`
  color: #687076;
  font-size: 14px;
  font-weight: 600;
`;
const TouchableOpacity = styled.TouchableOpacity``;
