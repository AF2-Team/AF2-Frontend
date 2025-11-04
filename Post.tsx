import React from 'react';
import styled from 'styled-components/native';
import { PostHeader } from './PostHeader';
import { PostFooter } from './PostFooter';

interface PostProps {
  post: {
    id: string;
    user: {
      id: string;
      username: string;
      avatarUrl?: string;
      avatarShape?: 'circle' | 'square';
    };
    createdAt: string;
    content: string;
    hashtags?: string[];
    initialLikes: number;
    initialFavorites: number;
    initialReposts: number;
    initialComments: number;
    mediaUrl?: string; // Nuevo campo para contenido multimedia
  };
  onFollowChange?: (userId: string, isFollowing: boolean) => void;
  onCommentPress?: () => void;
  onOptionsPress?: () => void;
  onHashtagPress?: (hashtag: string) => void;
}

export const Post = ({ 
  post, 
  onFollowChange, 
  onCommentPress, 
  onOptionsPress,
  onHashtagPress 
}: PostProps) => {
  return (
    <PostContainer>
      <PostHeader 
        user={post.user}
        createdAt={post.createdAt}
        onFollowChange={onFollowChange}
        onOptionsPress={onOptionsPress}
      />
      
      {/* Contenido de texto simple */}
      <ContentContainer>
        <ContentText>{post.content}</ContentText>
      </ContentContainer>

      {/* Contenido multimedia (si existe) */}
      {post.mediaUrl && (
        <MediaContainer>
          <PostImage source={{ uri: post.mediaUrl }} />
        </MediaContainer>
      )}
      
      {/* Hashtags como botones separados - más confiable */}
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

// Styled Components
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
