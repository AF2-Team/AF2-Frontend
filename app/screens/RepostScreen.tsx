import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  ScrollView,
} from "react-native";
import styled from "styled-components/native";
import { DiscardPostModal } from "../../components/DiscardPostModal";
import { OriginalPostView } from "../../components/OriginalPostView";
import { TagSelectorModal } from "../../components/TagSelectorModal";
import { TextStyleModal } from "../../components/TextStyleModal";
import { Colors, THEME } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";

const defaultAvatar = require("../../assets/images/default_avatar.png");

interface PostData {
  id: string;
  user: {
    username: string;
    avatarUrl: string | null;
  };
  content: string;
  tags: string[];
  mainImage: string | null;
}

const mockOriginalPost: PostData = {
  id: "p123",
  user: {
    username: "archivetherot",
    avatarUrl: null,
  },
  content:
    '"Ghost bird, do you love me?" he whispered once in the dark, before he left for his expedition training, even though he was the ghost. ~"Ghost bird, do you need me?"',
  tags: ["annihilation", "web weaving", "the southern reach"],
  mainImage: "https://placehold.co/400x200/409C40/FFFFFF/?text=ANNIHILATION",
};

const currentUser = {
  id: "u456",
  username: "broken-hours",
  avatarUrl: null,
};

export default function RepostScreen() {
  const router = useRouter();
  const [repostComment, setRepostComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [textStyle, setTextStyle] = useState("regular");

  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showTextStyleModal, setShowTextStyleModal] = useState(false);

  useEffect(() => {
    if (repostComment.trim() === "" && selectedTags.length === 0) {
      setSelectedTags(mockOriginalPost.tags);
    }
  }, [repostComment]);

  const handleClose = () => {
    if (repostComment.trim() !== "") {
      setShowDiscardModal(true);
    } else {
      router.back();
    }
  };

  const handleDiscard = () => {
    router.back();
  };

  const handleRepost = () => {
    Alert.alert(
      "Repost Exitoso",
      `Posteado por @${currentUser.username} con tags: ${selectedTags.join(", ")}`,
    );
    router.push("/");
  };

  const isReadyToRepost =
    repostComment.trim().length > 0 || mockOriginalPost.content.length > 0;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.background }}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Container>
          <Header>
            <CloseButton
              onPress={handleClose}
              accessibilityLabel="Cerrar y descartar"
            >
              <Ionicons name="close-outline" size={32} color={Colors.text} />
            </CloseButton>

            <UserHeaderContainer>
              <UserAvatar
                source={
                  currentUser.avatarUrl
                    ? { uri: currentUser.avatarUrl }
                    : defaultAvatar
                }
              />
              <Username>{currentUser.username}</Username>
              <Ionicons
                name="chevron-down-outline"
                size={18}
                color={Colors.text}
              />
            </UserHeaderContainer>

            <RepostButton onPress={handleRepost} disabled={!isReadyToRepost}>
              <RepostText>Repostear</RepostText>
            </RepostButton>
          </Header>

          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: THEME.SPACING.SCREEN_HORIZONTAL,
              paddingVertical: 10,
            }}
          >
            <Content>
              <TextInput
                key={textStyle}
                placeholder="Puedes añadir un comentario."
                placeholderTextColor={Colors.textPlaceholder}
                multiline
                value={repostComment}
                onChangeText={setRepostComment}
                style={{
                  fontFamily:
                    textStyle === "light"
                      ? THEME.FONTS.LIGHT
                      : textStyle === "regular"
                        ? THEME.FONTS.REGULAR
                        : textStyle === "semibold"
                          ? THEME.FONTS.SEMI_BOLD
                          : textStyle === "bold"
                            ? THEME.FONTS.BOLD
                            : THEME.FONTS.REGULAR,
                  fontSize: THEME.TYPOGRAPHY.BODY,
                  color: Colors.text,
                  minHeight: 80,
                  padding: 0,
                  marginBottom: THEME.SPACING.MD,
                }}
              />

              <OriginalPostView post={mockOriginalPost} />
            </Content>
          </ScrollView>

          <TagBar>
            <TagAddButton
              onPress={() => setShowTagModal(true)}
              accessibilityLabel="Añadir etiquetas"
            >
              <TagAddText>+ Añadir Etiqueta</TagAddText>
            </TagAddButton>

            {selectedTags.map((tag) => (
              <TagChip key={tag}>
                <TagText>#{tag}</TagText>
              </TagChip>
            ))}
          </TagBar>

          <BottomBar>
            <ToolButton
              onPress={() => setShowTextStyleModal(true)}
              accessibilityLabel="Seleccionar estilo de texto"
            >
              <Ionicons
                name="text-outline"
                size={26}
                color={Colors.textLight}
              />
            </ToolButton>

            <ToolButton
              onPress={() =>
                Alert.alert(
                  "Función no implementada",
                  "Añadir imagen a comentario",
                )
              }
            >
              <Ionicons
                name="image-outline"
                size={26}
                color={Colors.textLight}
              />
            </ToolButton>
          </BottomBar>

          <DiscardPostModal
            visible={showDiscardModal}
            onDiscard={handleDiscard}
            onContinueEditing={() => setShowDiscardModal(false)}
          />
          <TagSelectorModal
            visible={showTagModal}
            onClose={() => setShowTagModal(false)}
            onTagsSelected={setSelectedTags}
            selectedTags={selectedTags}
          />
          <TextStyleModal
            visible={showTextStyleModal}
            onClose={() => setShowTextStyleModal(false)}
            onStyleSelected={setTextStyle}
            selectedStyle={textStyle}
          />
        </Container>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${Colors.background};
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${THEME.SPACING.MD}px ${THEME.SPACING.SCREEN_HORIZONTAL}px
    ${THEME.SPACING.SM}px; /* Más padding arriba */
  border-bottom-width: 1px;
  border-bottom-color: ${Colors.border};
`;

const CloseButton = styled.TouchableOpacity`
  padding: ${THEME.SPACING.XS}px;
`;

const UserHeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const UserAvatar = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${Colors.grayLight};
  margin-right: ${THEME.SPACING.SM}px;
`;

const Username = styled.Text`
  font-size: 15px;
  color: ${Colors.text};
  font-family: ${THEME.FONTS.SEMI_BOLD};
  margin-right: ${THEME.SPACING.XS}px;
`;

const RepostButton = styled.TouchableOpacity<{ disabled: boolean }>`
  background-color: ${(props) =>
    props.disabled ? Colors.grayLight : Colors.action};
  padding: ${THEME.SPACING.SM}px ${THEME.SPACING.MD}px;
  border-radius: 20px;
`;

const RepostText = styled.Text`
  color: ${Colors.textLight};
  font-size: 16px;
  font-family: ${THEME.FONTS.BOLD};
`;

const Content = styled.View`
  flex: 1;
`;

const TextInput = styled(RNTextInput)`
  min-height: 80px;
  font-size: 16px;
  color: ${Colors.text};
  padding: 0;
  margin-bottom: ${THEME.SPACING.MD}px;
  font-family: ${THEME.FONTS.REGULAR};
`;

const TagBar = styled.View`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  padding: ${THEME.SPACING.SM}px ${THEME.SPACING.SCREEN_HORIZONTAL}px;
  border-top-width: 1px;
  border-top-color: ${Colors.border};
`;

const TagAddButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  border-width: 1px;
  border-color: ${Colors.action};
  padding: 6px 12px;
  margin-right: 12px;
`;

const TagAddText = styled.Text`
  font-size: 14px;
  color: ${Colors.action};
  font-family: ${THEME.FONTS.SEMI_BOLD};
`;

const TagChip = styled.View`
  border-radius: 12px;
  padding: ${THEME.SPACING.XS}px 10px;
  margin-right: ${THEME.SPACING.SM}px;
  margin-bottom: ${THEME.SPACING.XS}px;
  background-color: ${Colors.backgroundTag};
`;

const TagText = styled.Text`
  color: ${Colors.text};
  font-size: 12px;
  font-family: ${THEME.FONTS.SEMI_BOLD};
`;

const BottomBar = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${THEME.SPACING.MD}px ${THEME.SPACING.SCREEN_HORIZONTAL}px;
  justify-content: flex-start;
  background-color: ${Colors.primary};
`;

const ToolButton = styled.TouchableOpacity`
  padding: ${THEME.SPACING.SM}px;
  margin-right: 20px;
`;
