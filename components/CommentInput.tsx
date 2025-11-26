import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, THEME } from "@/constants";

interface CommentInputProps {
  commentText: string;
  onCommentTextChange: (text: string) => void;
  onSendComment: () => void;
  inputContainerAnim: Animated.Value;
  replyingTo: string | null;
  onCancelReply: () => void;
  placeholder?: string;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  commentText,
  onCommentTextChange,
  onSendComment,
  inputContainerAnim,
  replyingTo,
  onCancelReply,
  placeholder = "Responder desde @broke...",
}) => {
  return (
    <Animated.View
      style={[
        styles.inputContainer,
        { transform: [{ translateY: inputContainerAnim }] },
      ]}
    >
      <TextInput
        style={styles.textInput}
        placeholder={replyingTo ? "Escribir respuesta..." : placeholder}
        placeholderTextColor={Colors.textLight}
        value={commentText}
        onChangeText={onCommentTextChange}
        multiline
        maxLength={500}
      />
      {replyingTo && (
        <TouchableOpacity
          style={styles.cancelReplyButton}
          onPress={onCancelReply}
        >
          <Ionicons name="close" size={20} color={Colors.textLight} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.sendButton}
        onPress={onSendComment}
        disabled={commentText.trim() === ""}
      >
        <Ionicons
          name="send"
          size={30}
          color={
            commentText.trim() === "" ? Colors.textMuted : Colors.textLight
          }
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: THEME.SPACING.MD,
    backgroundColor: Colors.primary,
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.textLight,
    borderRadius: THEME.COMMON.BORDER_RADIUS.LG,
    paddingHorizontal: THEME.SPACING.MD,
    paddingVertical: THEME.SPACING.SM,
    marginRight: THEME.SPACING.SM,
    fontSize: THEME.TYPOGRAPHY.BODY,
    color: Colors.textLight,
    fontFamily: THEME.FONTS.REGULAR,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    maxHeight: 100,
  },
  cancelReplyButton: {
    padding: THEME.SPACING.SM,
    marginRight: THEME.SPACING.XS,
  },
  sendButton: {
    padding: THEME.SPACING.SM,
  },
});
