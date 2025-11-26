import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import { ImageSourcePropType } from "react-native";
import { Colors, THEME } from "@/constants";

const defaultAvatar = require("../assets/images/default_avatar.png");

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
  textColor = Colors.textLight,
}) => {
  const router = useRouter();
  const [following, setFollowing] = useState(isFollowing);

  // Sincronizar con la prop isFollowing si cambia externamente
  useEffect(() => {
    setFollowing(isFollowing);
  }, [isFollowing]);

  const handleFollowPress = () => {
    const newFollowState = true; // Siempre pasa a true cuando se presiona
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
          source={
            user.avatarUrl
              ? ({ uri: user.avatarUrl } as ImageSourcePropType)
              : defaultAvatar
          }
          avatarShape={user.avatarShape || "circle"}
        />
      </AvatarContainer>

      <UserInfo onPress={handleUserPress}>
        <Username textColor={textColor}>{user.username}</Username>
        <DateText textColor={textColor}>
          {formatRelativeTime(createdAt)}
        </DateText>
      </UserInfo>

      {/* Botón de Seguir (solo visible si NO se está siguiendo) */}
      {!following && (
        <FollowButton onPress={handleFollowPress}>
          <FollowContent>
            <Ionicons
              name="person-add-outline"
              size={14}
              color={Colors.textLight}
            />
            <FollowText style={{ marginLeft: THEME.SPACING.XS }}>
              Seguir
            </FollowText>
          </FollowContent>
        </FollowButton>
      )}
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${Colors.transparent};
  padding: ${THEME.SPACING.SM}px ${THEME.SPACING.MD}px;
`;

const AvatarContainer = styled.TouchableOpacity`
  margin-right: ${THEME.SPACING.SM}px;
`;

const Avatar = styled.Image<{ avatarShape: "circle" | "square" }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ avatarShape }) =>
    avatarShape === "circle" ? "24px" : `${THEME.COMMON.BORDER_RADIUS.MD}px`};
`;

const UserInfo = styled.TouchableOpacity`
  flex: 1;
`;

const Username = styled.Text<{ textColor: string }>`
  font-size: ${THEME.TYPOGRAPHY.BODY}px;
  font-family: ${THEME.FONTS.SEMI_BOLD};
  color: ${({ textColor }) => textColor};
  margin-bottom: ${THEME.SPACING.XS}px;
`;

const DateText = styled.Text<{ textColor: string }>`
  font-size: ${THEME.TYPOGRAPHY.CAPTION}px;
  font-family: ${THEME.FONTS.LIGHT};
  color: ${({ textColor }) => textColor};
`;

const FollowButton = styled.TouchableOpacity`
  padding: ${THEME.SPACING.SM}px ${THEME.SPACING.MD}px;
  border-radius: ${THEME.COMMON.BORDER_RADIUS.XL}px;
  margin-left: ${THEME.SPACING.SM}px;
  background-color: ${Colors.action};
`;

const FollowContent = styled.View`
  flex-direction: row;
  align-items: center;
`;

const FollowText = styled.Text`
  font-size: ${THEME.TYPOGRAPHY.CAPTION}px;
  font-family: ${THEME.FONTS.BOLD};
  color: ${Colors.textLight};
`;
