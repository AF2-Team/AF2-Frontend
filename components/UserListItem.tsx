import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, THEME } from "@/constants";

interface UserListItemProps {
  user: string;
  username: string;
  time?: string;
  onUsernamePress: (username: string) => void;
  onProfilePress: (username: string) => void;
  showFollowButton?: boolean;
}

export const UserListItem: React.FC<UserListItemProps> = ({
  user,
  username,
  time,
  onUsernamePress,
  onProfilePress,
  showFollowButton = true,
}) => {
  return (
    <View style={styles.listItem}>
      <TouchableOpacity
        onPress={() => onProfilePress(username)}
        style={styles.avatarContainer}
      >
        <View style={styles.avatarFallback}>
          <Text style={styles.avatarText}>{user.charAt(0).toUpperCase()}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => onUsernamePress(username)}>
          <Text style={styles.username}>{user}</Text>
        </TouchableOpacity>
        {time && <Text style={styles.time}>{time}</Text>}
      </View>
      {showFollowButton && (
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followButtonText}>Seguir</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: THEME.SPACING.LG,
    padding: THEME.SPACING.MD,
    backgroundColor: Colors.background,
    borderRadius: THEME.COMMON.BORDER_RADIUS.MD,
    ...THEME.COMMON.SHADOWS.SMALL,
  },
  avatarContainer: {
    marginRight: THEME.SPACING.MD,
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: Colors.textLight,
    fontSize: THEME.TYPOGRAPHY.BODY,
    fontFamily: THEME.FONTS.BOLD,
  },
  content: {
    flex: 1,
  },
  username: {
    fontSize: THEME.TYPOGRAPHY.BODY,
    fontFamily: THEME.FONTS.SEMI_BOLD,
    color: Colors.text,
  },
  time: {
    fontSize: THEME.TYPOGRAPHY.CAPTION,
    color: Colors.textMuted,
    fontFamily: THEME.FONTS.REGULAR,
    marginTop: 2,
  },
  followButton: {
    paddingHorizontal: THEME.SPACING.MD,
    paddingVertical: THEME.SPACING.SM,
    borderWidth: 1,
    borderColor: Colors.action,
    borderRadius: THEME.COMMON.BORDER_RADIUS.LG,
    backgroundColor: Colors.action,
  },
  followButtonText: {
    fontSize: THEME.TYPOGRAPHY.CAPTION,
    color: Colors.textLight,
    fontFamily: THEME.FONTS.SEMI_BOLD,
  },
});
