import React, { useState } from "react";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { PostOptionsModal } from "./PostOptionsModal";

const defaultAvatar = require("../assets/images/default_avatar.png");
const followButton = require("../assets/images/follow_button.png");
const moveVertIcon = require("../assets/images/more_vert.png");

interface PostHeaderProps {
  user: {
    id: string;
    username: string;
    avatarUrl?: string;
    avatarShape?: "circle" | "square";
  };
  createdAt: string;
  isFollowing?: boolean;
  onFollowChange?: (userId: string, isFollowing: boolean) => void;
  onOptionsPress?: () => void;
  postId: string;
  postContent?: string;
  onNotInterested?: (postId: string) => void;
}

export const PostHeader = ({
  user,
  createdAt,
  isFollowing = false,
  onFollowChange,
  onOptionsPress,
  postId,
  postContent,
  onNotInterested,
}: PostHeaderProps) => {
  const router = useRouter();
  const [following, setFollowing] = useState(isFollowing);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const handleFollowPress = () => {
    const newFollowState = !following;
    setFollowing(newFollowState);

    if (onFollowChange) {
      onFollowChange(user.id, newFollowState);
    }
  };

  const handleUserPress = () => {
    router.push(`/screens/profile/${user.id}`);
  };

  const handleOptionsPress = () => {
    setShowOptionsModal(true);
    if (onOptionsPress) {
      onOptionsPress();
    }
  };

  const handleCloseModal = () => {
    setShowOptionsModal(false);
  };

  const handleNotInterested = () => {
    console.log("No me interesa el post:", postId);
    if (onNotInterested) {
      onNotInterested(postId);
    }
    setShowOptionsModal(false);
  };

  const handleFollowFromModal = () => {
    const newFollowState = true;
    setFollowing(newFollowState);

    if (onFollowChange) {
      onFollowChange(user.id, newFollowState);
    }
    setShowOptionsModal(false);
  };

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();

    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
      return `${seconds} seg`;
    } else if (minutes < 60) {
      return `${minutes} min`;
    } else if (hours < 24) {
      return `${hours} hr`;
    } else if (days === 1) {
      return "ayer";
    } else if (days < 365) {
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
      });
    } else {
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  };

  return (
    <>
      <Container>
        <AvatarContainer onPress={handleUserPress}>
          <Avatar
            source={user.avatarUrl ? { uri: user.avatarUrl } : defaultAvatar}
            avatarShape={user.avatarShape || "circle"}
          />
        </AvatarContainer>

        <UserInfo onPress={handleUserPress}>
          <Username>{user.username}</Username>
          <DateText>{formatRelativeTime(createdAt)}</DateText>
        </UserInfo>

        <ActionsContainer>
          {!following && (
            <FollowButton onPress={handleFollowPress}>
              <FollowButtonImage source={followButton} />
            </FollowButton>
          )}
          <OptionsButton onPress={handleOptionsPress}>
            <OptionsIcon name ="more-vert" />
          </OptionsButton>
        </ActionsContainer>
      </Container>

      <PostOptionsModal
        visible={showOptionsModal}
        onClose={handleCloseModal}
        onNotInterested={handleNotInterested}
        onFollow={handleFollowFromModal}
        isFollowing={following}
      />
    </>
  );
};

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px 15px;
  background-color: #fff;
`;

const AvatarContainer = styled.TouchableOpacity`
  margin-right: 12px;
`;

const Avatar = styled.Image<{ avatarShape: "circle" | "square" }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ avatarShape }) =>
    avatarShape === "circle" ? "24px" : "0px"};
`;

const UserInfo = styled.TouchableOpacity`
  flex: 1;
`;

const Username = styled.Text`
  font-family: "OpenSans-SemiBold";
  font-size: 12px;
  color: #423646;
  margin-bottom: 2px;
`;

const DateText = styled.Text`
  font-family: "OpenSans-Light";
  font-size: 12px;
  color: #687076;
`;

const ActionsContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const FollowButton = styled.TouchableOpacity`
  margin-right: 8px;
`;

const FollowButtonImage = styled.Image``;

const OptionsButton = styled.TouchableOpacity``;

const OptionsIcon = styled.Image``;
