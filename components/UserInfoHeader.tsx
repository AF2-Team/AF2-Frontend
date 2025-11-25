import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons"; 
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import { ImageSourcePropType } from "react-native";

const defaultAvatar = require("../assets/images/default_avatar.png");

const COLORS = {
  primary: '#1291EB',
  white: '#FFFFFF',
  transparent: 'transparent',
};

interface UserInfoHeaderProps {
  user: {
    id: string;
    username: string;
    avatarUrl?: string;
    avatarShape?: "circle" | "square";
  };
  createdAt: string;
  isFollowing?: boolean;
  onFollowChange?: (userId: string, isFollowing: boolean) => void;
  textColor?: string;
}

export const UserInfoHeader: React.FC<UserInfoHeaderProps> = ({
  user,
  createdAt,
  isFollowing = false,
  onFollowChange,
  textColor = "#FFFFFF",
}) => {
  const router = useRouter();
  const [following, setFollowing] = useState(isFollowing);

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

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();

    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return `${seconds} seg`;
    } else if (minutes < 60) {
      return `${minutes} min`;
    } else if (hours < 24) {
      return `${hours} hr`;
    } else if (days === 1) {
      return "ayer";
    } else {
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
      });
    }
  };

  return (
    <Container>
      <AvatarContainer onPress={handleUserPress}>
        <Avatar
          source={user.avatarUrl ? { uri: user.avatarUrl } as ImageSourcePropType : defaultAvatar}
          avatarShape={user.avatarShape || "circle"}
        />
      </AvatarContainer>

      <UserInfo onPress={handleUserPress}>
        <Username textColor={textColor}>{user.username}</Username>
        <DateText textColor={textColor}>
          {formatRelativeTime(createdAt)}
        </DateText>
      </UserInfo>

      <FollowButtonStyled onPress={handleFollowPress} isFollowing={following}>
        {following ? (
          <FollowText isFollowing={following}>
            Siguiendo
          </FollowText>
        ) : (
          <FollowContent>
            <Ionicons name="person-add-outline" size={14} color={COLORS.white} />
            <FollowText isFollowing={following} style={{ marginLeft: 4 }}>
              Seguir
            </FollowText>
          </FollowContent>
        )}
      </FollowButtonStyled>
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: transparent;
`;

const AvatarContainer = styled.TouchableOpacity`
  margin-right: 12px;
`;

const Avatar = styled.Image<{ avatarShape: "circle" | "square" }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ avatarShape }) =>
    avatarShape === "circle" ? "24px" : "8px"};
`;

const UserInfo = styled.TouchableOpacity`
  flex: 1;
`;

const Username = styled.Text<{ textColor: string }>`
  font-size: 16px;
  font-weight: 600;
  color: ${({ textColor }) => textColor};
  margin-bottom: 2px;
  font-family: 'OpenSans-SemiBold', 'System';
`;

const DateText = styled.Text<{ textColor: string }>`
  font-size: 14px;
  font-weight: 300;
  color: ${({ textColor }) => textColor};
  font-family: 'OpenSans-Light', 'System';
`;

const FollowButtonStyled = styled.TouchableOpacity<{ isFollowing: boolean }>`
  padding: 6px 14px;
  border-radius: 20px;
  margin-left: 10px;
  background-color: ${({ isFollowing }) =>
    isFollowing ? COLORS.transparent : COLORS.primary};
  border: 1px solid ${({ isFollowing }) =>
    isFollowing ? COLORS.primary : COLORS.transparent};
`;

const FollowContent = styled.View`
  flex-direction: row;
  align-items: center;
`;

const FollowText = styled.Text<{ isFollowing: boolean }>`
  font-size: 14px;
  font-weight: 700;
  color: ${({ isFollowing }) =>
    isFollowing ? COLORS.primary : COLORS.white};
  font-family: 'OpenSans-Bold', 'System';
`;
