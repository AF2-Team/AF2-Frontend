import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import styled from "styled-components/native";
import { DiscardPostModal } from "../../components/DiscardPostModal";
import { TagSelectorModal } from "../../components/TagSelectorModal";
import { TextStyleModal } from "../../components/TextStyleModal";
import { Colors, THEME } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";

const defaultAvatar = require("../../assets/images/default_avatar.png");

const currentUser = {
  id: "u456",
  username: "broken-hours",
  avatarUrl: null,
};

export default function CreatePostScreen() {
  const router = useRouter();
  const [postContent, setPostContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [textStyle, setTextStyle] = useState("regular");

  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showTextStyleModal, setShowTextStyleModal] = useState(false);

  const handleClose = () => {
    if (postContent.trim() !== "" || selectedTags.length > 0) {
      setShowDiscardModal(true);
    } else {
      router.back();
    }
  };

  const handleDiscard = () => {
    router.back();
  };

  const handlePublish = () => {
    Alert.alert(
      "Publicación Exitosa",
      `Post publicado por @${currentUser.username} con tags: ${selectedTags.join(", ")}`,
    );
    router.push("/");
  };

  const getFontFamily = (style: string) => {
    switch (style) {
      case "light":
        return THEME.FONTS.LIGHT;
      case "regular":
        return THEME.FONTS.REGULAR;
      case "semibold":
        return THEME.FONTS.SEMI_BOLD;
      case "bold":
        return THEME.FONTS.BOLD;
      default:
        return THEME.FONTS.REGULAR;
    }
  };

  // ⭕ SIMPLE Y DIRECTO - igual que en LoginScreen
  const isReadyToPublish = postContent.trim().length > 0;

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
            <CloseButton onPress={handleClose}>
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

            {/* ⭕ BOTÓN SIMPLIFICADO - igual que en LoginScreen */}
            <TouchableOpacity
              onPress={handlePublish}
              disabled={!isReadyToPublish}
              style={{
                backgroundColor: isReadyToPublish
                  ? Colors.action // AZUL CUANDO HAY TEXTO
                  : Colors.grayLight, // GRIS CLARO SIN TEXTO
                paddingHorizontal: THEME.SPACING.MD,
                paddingVertical: THEME.SPACING.SM,
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  color: isReadyToPublish
                    ? Colors.textLight // BLANCO CUANDO ACTIVO
                    : Colors.grayMedium, // GRIS OSCURO CUANDO VACÍO
                  fontSize: 16,
                  fontFamily: THEME.FONTS.BOLD,
                }}
              >
                Publicar
              </Text>
            </TouchableOpacity>
          </Header>

          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: THEME.SPACING.SCREEN_HORIZONTAL,
              paddingVertical: 10,
              flexGrow: 1,
            }}
          >
            <Content>
              <TextInput
                key={textStyle}
                placeholder="¿Qué estás pensando?"
                placeholderTextColor={Colors.textPlaceholder}
                multiline
                value={postContent}
                onChangeText={setPostContent}
                style={{
                  fontFamily: getFontFamily(textStyle),
                  fontSize: THEME.TYPOGRAPHY.BODY,
                  color: Colors.text,
                  minHeight: 180,
                  padding: 0,
                  marginBottom: THEME.SPACING.MD,
                }}
              />
            </Content>
          </ScrollView>

          <TagBar>
            <TagAddButton onPress={() => setShowTagModal(true)}>
              <TagAddText>+ Añadir Etiqueta</TagAddText>
            </TagAddButton>

            {selectedTags.map((tag) => (
              <TagChip key={tag}>
                <TagText>#{tag}</TagText>
              </TagChip>
            ))}
          </TagBar>

          <BottomBar>
            <LeftIcons>
              <ToolButton onPress={() => setShowTextStyleModal(true)}>
                <Ionicons
                  name="text-outline"
                  size={26}
                  color={Colors.textLight}
                />
              </ToolButton>
            </LeftIcons>

            <RightIcons>
              <ToolButton
                onPress={() =>
                  Alert.alert(
                    "Función no implementada",
                    "Añadir imagen a la publicación",
                  )
                }
              >
                <Ionicons
                  name="image-outline"
                  size={26}
                  color={Colors.textLight}
                />
              </ToolButton>
            </RightIcons>
          </BottomBar>
        </Container>

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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = {
  publishButton: {
    paddingHorizontal: THEME.SPACING.MD,
    paddingVertical: THEME.SPACING.SM,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  publishButtonActive: {
    backgroundColor: Colors.action, // AZUL
  },
  publishButtonDisabled: {
    backgroundColor: Colors.grayLight, // GRIS CLARO
  },
  publishButtonText: {
    fontSize: 16,
    fontFamily: THEME.FONTS.BOLD,
  },
  publishButtonTextActive: {
    color: Colors.textLight, // BLANCO
  },
  publishButtonTextDisabled: {
    color: Colors.grayMedium, // GRIS OSCURO
  },
};

const Container = styled.View`
  flex: 1;
  background-color: ${Colors.background};
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${THEME.SPACING.MD}px ${THEME.SPACING.SCREEN_HORIZONTAL}px
    ${THEME.SPACING.SM}px;
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

const Content = styled.View`
  flex: 1;
`;

const TextInput = styled(RNTextInput)`
  min-height: 180px;
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
  justify-content: space-between;
  padding: ${THEME.SPACING.MD}px ${THEME.SPACING.SCREEN_HORIZONTAL}px;
  background-color: ${Colors.primary};
  min-height: ${THEME.SPACING.NAV_BAR_HEIGHT}px;
`;

const LeftIcons = styled.View`
  flex-direction: row;
  align-items: center;
`;

const RightIcons = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ToolButton = styled.TouchableOpacity`
  padding: ${THEME.SPACING.SM}px;
`;
