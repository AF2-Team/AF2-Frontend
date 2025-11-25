// components/CommentItem.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, THEME } from "@/constants";

export interface Comment {
  id: string;
  user: string;
  username: string;
  time: string;
  content: string;
  avatar?: string;
  isReply?: boolean;
  parentId?: string;
}

interface CommentItemProps {
  comment: Comment;
  onUsernamePress: (username: string) => void;
  onProfilePress: (username: string) => void;
  onReplyPress: (commentId: string, username: string) => void;
}

const defaultAvatar = require("@/assets/images/default_avatar.png");

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onUsernamePress,
  onProfilePress,
  onReplyPress,
}) => {
  return (
    <View style={[styles.commentItem, comment.isReply && styles.replyItem]}>
      <TouchableOpacity
        onPress={() => onProfilePress(comment.username)}
        style={styles.avatarContainer}
      >
        {comment.avatar ? (
          <Image
            source={
              typeof comment.avatar === "string"
                ? { uri: comment.avatar }
                : comment.avatar
            }
            style={styles.avatarImage}
            defaultSource={defaultAvatar}
          />
        ) : (
          <Image source={defaultAvatar} style={styles.avatarImage} />
        )}
      </TouchableOpacity>
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <TouchableOpacity onPress={() => onUsernamePress(comment.username)}>
            <Text style={styles.username}>{comment.user}</Text>
          </TouchableOpacity>
          <Text style={styles.time}>{comment.time}</Text>
        </View>
        <Text style={styles.commentText}>{comment.content}</Text>
        <TouchableOpacity
          style={styles.replyButton}
          onPress={() => onReplyPress(comment.id, comment.username)}
        >
          <Text style={styles.replyText}>Responder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  commentItem: {
    flexDirection: "row",
    marginBottom: THEME.SPACING.MD,
    padding: THEME.SPACING.MD,
    backgroundColor: Colors.grayLight,
    borderRadius: THEME.COMMON.BORDER_RADIUS.MD,
  },
  replyItem: {
    marginLeft: "15%",
    width: "85%",
  },
  avatarContainer: {
    marginRight: THEME.SPACING.MD,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: THEME.SPACING.XS,
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
  },
  commentText: {
    fontSize: THEME.TYPOGRAPHY.BODY,
    color: Colors.text,
    fontFamily: THEME.FONTS.REGULAR,
    marginBottom: THEME.SPACING.XS,
    lineHeight: 20,
  },
  replyButton: {
    alignSelf: "flex-start",
    marginTop: THEME.SPACING.XS,
  },
  replyText: {
    fontSize: THEME.TYPOGRAPHY.CAPTION,
    color: Colors.action,
    fontFamily: THEME.FONTS.REGULAR,
  },
});
