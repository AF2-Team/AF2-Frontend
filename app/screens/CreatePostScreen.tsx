import React, { useState } from "react";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import { DiscardPostModal } from "../../components/DiscardPostModal";
import { TagSelectorModal } from "../../components/TagSelectorModal";
import { TextStyleModal } from "../../components/TextStyleModal";
import { PostPublishedAlert } from "../../components/PostPublishedAlert";

// Importar íconos
const textStyleIcon = require("../../assets/images/aa-icon.png");
const galleryIcon = require("../../assets/images/photo.png");
const defaultAvatar = require("../../assets/images/default_avatar.png");

// Mock user data
const currentUser = {
  id: "1",
  username: "ceaomaoenour",
  avatarUrl: null,
};

export const CreatePostScreen = () => {
  const router = useRouter();
  const [postContent, setPostContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [textStyle, setTextStyle] = useState("regular");
  const [media, setMedia] = useState<string | null>(null);

  // Estados modales
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showTextStyleModal, setShowTextStyleModal] = useState(false);
  const [showPublishedAlert, setShowPublishedAlert] = useState(false);

  const handlePublish = () => {
    console.log("Publicando post:", {
      postContent,
      selectedTags,
      textStyle,
      media,
    });

    // Mostrar alerta primero
    setShowPublishedAlert(true);

    // Navegar después de un delay para que se vea la alerta
    setTimeout(() => {
      router.push("/");
    }, 800);
  };

  const handleDiscard = () => {
    // Solo mostrar modal si hay contenido
    if (postContent.length > 0 || selectedTags.length > 0 || media !== null) {
      setShowDiscardModal(true);
    } else {
      // Si no hay contenido, salir directamente
      router.back();
    }
  };

  const confirmDiscard = () => {
    setShowDiscardModal(false);
    router.back();
  };

  const handleAddMedia = () => {
    console.log("Abrir selector de medios");
    // Aquí iría la lógica para abrir el selector de imágenes
  };

  const hasContent =
    postContent.length > 0 || selectedTags.length > 0 || media !== null;

  return (
    <Container>
      <Header>
        <HeaderButton onPress={handleDiscard}>
          <HeaderButtonText>X</HeaderButtonText>
        </HeaderButton>

        <PublishButton onPress={handlePublish} disabled={!hasContent}>
          <PublishButtonText disabled={!hasContent}>Publicar</PublishButtonText>
        </PublishButton>
      </Header>

      <Content>
        <UserInfo>
          <UserAvatar
            source={
              currentUser.avatarUrl
                ? { uri: currentUser.avatarUrl }
                : defaultAvatar
            }
          />
          <Username>@{currentUser.username}</Username>
        </UserInfo>

        <TextInput
          value={postContent}
          onChangeText={setPostContent}
          placeholder="Puedes añadir un comentario"
          placeholderTextColor="#4B4B4B"
          multiline
          textAlignVertical="top"
          style={{
            fontFamily:
              textStyle === "bold"
                ? "OpenSans-Bold"
                : textStyle === "light"
                  ? "OpenSans-Light"
                  : "OpenSans-Regular",
          }}
        />

        <AddTagsButton onPress={() => setShowTagModal(true)}>
          <AddTagsText># Añade algunas etiquetas</AddTagsText>
        </AddTagsButton>

        {media && <MediaPreview source={{ uri: media }} />}
      </Content>

      {/* Línea divisoria sutil */}
      <DividerLine />

      <BottomBar>
        <TextStyleButton onPress={() => setShowTextStyleModal(true)}>
          <TextStyleIcon source={textStyleIcon} />
        </TextStyleButton>

        <MediaButton onPress={handleAddMedia}>
          <MediaIcon source={galleryIcon} />
        </MediaButton>
      </BottomBar>

      {/* Modales */}
      <DiscardPostModal
        visible={showDiscardModal}
        onDiscard={confirmDiscard}
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

      {/* Alerta de publicación exitosa */}
      <PostPublishedAlert
        visible={showPublishedAlert}
        username={`@${currentUser.username}`}
        onHide={() => setShowPublishedAlert(false)}
      />
    </Container>
  );
};

// Estilos
const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
  margin-top: 5%;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

const HeaderButton = styled.TouchableOpacity`
  padding: 8px;
`;

const HeaderButtonText = styled.Text`
  font-size: 18px;
  color: #000000;
  font-weight: bold;
`;

const PublishButton = styled.TouchableOpacity<{ disabled: boolean }>`
  background-color: ${({ disabled }) => (disabled ? "#CCCCCC" : "#1291EB")};
  padding: 8px 16px;
  border-radius: 16px;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

const PublishButtonText = styled.Text<{ disabled: boolean }>`
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  font-family: Open Sans;
`;

const Content = styled.View`
  flex: 1;
  padding: 16px;
`;

const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const UserAvatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #f0f0f0;
  margin-right: 12px;
`;

const Username = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  font-family: OpenSans;
`;

const TextInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: #000000;
  min-height: 200px;
  font-family: OpenSans-Regular;
`;

const AddTagsButton = styled.TouchableOpacity`
  background-color: rgba(75, 75, 75, 0.35);
  border-radius: 16px;
  align-self: flex-start;
  padding: 6px 14px;
  margin-top: 16px;
`;

const AddTagsText = styled.Text`
  color: #000000;
  font-size: 13px;
  font-weight: 500;
  font-family: OpenSans-Medium;
`;

const MediaPreview = styled.Image`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  margin-top: 16px;
  background-color: #f0f0f0;
`;

const DividerLine = styled.View`
  height: 1px;
  background-color: rgba(75, 75, 75, 0.5);
  width: 100%;
`;

const BottomBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #ffffff;
  margin-bottom: 5%;
`;

const TextStyleButton = styled.TouchableOpacity`
  padding: 8px;
`;

const TextStyleIcon = styled.Image`
  width: 24px;
  height: 24px;
`;

const MediaButton = styled.TouchableOpacity`
  padding: 8px;
`;

const MediaIcon = styled.Image`
  width: 24px;
  height: 24px;
`;
export default CreatePostScreen;
