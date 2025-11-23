import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, TextInput as RNTextInput, ScrollView } from "react-native";
import styled from "styled-components/native";
import { DiscardPostModal } from "../../components/DiscardPostModal";
import { OriginalPostView } from "../../components/OriginalPostView";
import { TagSelectorModal } from "../../components/TagSelectorModal";
import { TextStyleModal } from "../../components/TextStyleModal";

const COLORS = {
  primary: '#1291EB',
  darkBg: '#423646',
  borderGray: '#D1D5DB',
  textDark: '#4B4B4B',
  textLight: '#888888',
  white: '#FFFFFF',
  grayLight: '#E0E0E0',
  grayMedium: '#B2D9F5',
  transparent: 'transparent',
};

const SIZES = {
  avatar: {
    small: 24,
    medium: 32,
    large: 48
  },
  borderRadius: {
    small: 8,
    medium: 16,
    large: 20
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 20
  }
};

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
  content: '"Ghost bird, do you love me?" he whispered once in the dark, before he left for his expedition training, even though he was the ghost. ~"Ghost bird, do you need me?"',
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

  // Heredar tags del post original si el comentario está vacío y no hay tags seleccionadas previamente.
  useEffect(() => {
    // Si el comentario está vacío Y la lista de tags actual está vacía (o son las iniciales del post original)
    if (repostComment.trim() === "" && selectedTags.length === 0) {
      setSelectedTags(mockOriginalPost.tags);
    } else if (repostComment.trim() !== "" && selectedTags.length === mockOriginalPost.tags.length && selectedTags.every((tag, index) => tag === mockOriginalPost.tags[index])) {
      // Caso en el que el usuario empieza a escribir, si las tags aún son las originales, las mantenemos.
      // Si el usuario las modificó manualmente, las respetamos.
      // Esta lógica de herencia puede variar mucho, la dejaremos simple: si el comentario está vacío, toma las originales.
      // Para el UX visual de la referencia, las tags se muestran SIEMPRE, ya sea las heredadas o las añadidas.
      // No haremos nada si el comentario cambia de vacío a lleno, manteniendo las tags que estén seleccionadas.
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
    Alert.alert("Repost Exitoso", `Posteado por @${currentUser.username} con tags: ${selectedTags.join(', ')}`);
    router.push("/");
  };

  const isReadyToRepost = repostComment.trim().length > 0 || mockOriginalPost.content.length > 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Container>
        {/* --- HEADER --- */}
        <Header>
          <CloseButton onPress={handleClose} accessibilityLabel="Cerrar y descartar">
            <Ionicons name="close-outline" size={32} color={COLORS.textDark} />
          </CloseButton>

          {/* Info del Reposter y Menú (en el centro) */}
          <UserHeaderContainer>
            <UserAvatar
              source={currentUser.avatarUrl ? { uri: currentUser.avatarUrl } : defaultAvatar}
              style={{ width: SIZES.avatar.medium, height: SIZES.avatar.medium, borderRadius: SIZES.avatar.medium / 2 }}
            />
            <Username>{currentUser.username}</Username>
            <Ionicons name="chevron-down-outline" size={18} color={COLORS.textDark} />
          </UserHeaderContainer>

          <RepostButton onPress={handleRepost} disabled={!isReadyToRepost}>
            <RepostText>Repostear</RepostText>
          </RepostButton>
        </Header>

        <ScrollView contentContainerStyle={{ paddingHorizontal: SIZES.spacing.md, paddingVertical: 10 }}>
          <Content>
            {/* Área de comentario */}
            <TextInput
              placeholder="Puedes añadir un comentario."
              placeholderTextColor={COLORS.textLight}
              multiline
              value={repostComment}
              onChangeText={setRepostComment}
              // ✅ Ajuste de la prop style para que no interfiera con styled-components ni con 'System'
              style={{
                fontFamily: `OpenSans-${textStyle.charAt(0).toUpperCase() + textStyle.slice(1)}`
              }}
            />

            {/* Vista del Post Original */}
            <OriginalPostView post={mockOriginalPost} />
          </Content>
        </ScrollView>

        {/* --- TAG BAR --- */}
        <TagBar>
            <TagAddButton onPress={() => setShowTagModal(true)} accessibilityLabel="Añadir etiquetas">
              {/* Botón de texto "+ Añadir Etiqueta" de la referencia */}
              <TagAddText>+ Añadir Etiqueta</TagAddText>
            </TagAddButton>

            {/* Tags seleccionados */}
            {selectedTags.map((tag) => (
                <TagChip key={tag} style={{ backgroundColor: COLORS.grayLight }}>
                    <TagText>#{tag}</TagText>
                </TagChip>
            ))}
        </TagBar>

        {/* --- BOTTOM BAR --- */}
        <BottomBar>
          <ToolButton onPress={() => setShowTextStyleModal(true)} accessibilityLabel="Seleccionar estilo de texto">
            {/* El ícono de la referencia es 'Aa' (Text-outline) */}
            <Ionicons name="text-outline" size={26} color={COLORS.white} />
          </ToolButton>

          <ToolButton onPress={() => Alert.alert("Función no implementada", "Añadir imagen a comentario")}>
            <Ionicons name="image-outline" size={26} color={COLORS.white} />
          </ToolButton>
        </BottomBar>

        {/* --- MODALES --- */}
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
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${COLORS.white};
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px ${SIZES.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${COLORS.borderGray};
`;

const CloseButton = styled.TouchableOpacity`
  padding: ${SIZES.spacing.xs}px;
`;

const UserHeaderContainer = styled.View`
    flex-direction: row;
    align-items: center;
`;

const UserAvatar = styled.Image`
  background-color: ${COLORS.grayLight};
  margin-right: ${SIZES.spacing.sm}px;
`;

const Username = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: #000000;
  font-family: 'OpenSans-SemiBold', 'System';
  margin-right: ${SIZES.spacing.xs}px;
`;

const RepostButton = styled.TouchableOpacity<{ disabled: boolean }>`
  background-color: ${(props) => (props.disabled ? COLORS.grayMedium : COLORS.primary)};
  padding: ${SIZES.spacing.sm}px ${SIZES.spacing.md}px;
  border-radius: ${SIZES.borderRadius.large}px;
`;

const RepostText = styled.Text`
  color: ${COLORS.white};
  font-size: 16px;
  font-weight: 700;
  font-family: 'OpenSans-Bold', 'System';
`;

const Content = styled.View`
  flex: 1;
`;

const TextInput = styled(RNTextInput)`
  min-height: 80px;
  font-size: 16px;
  color: #000000;
  padding: 0;
  margin-bottom: ${SIZES.spacing.md}px;
  font-family: 'OpenSans-Regular', 'System';
`;

const TagBar = styled.View`
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    padding: ${SIZES.spacing.sm}px ${SIZES.spacing.md}px;
    border-top-width: 1px;
    border-top-color: ${COLORS.borderGray};
`;

const TagAddButton = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: ${SIZES.borderRadius.large}px;
    border-width: 1px;
    border-color: ${COLORS.primary};
    padding: 6px 12px;
    margin-right: 12px;
`;

const TagAddText = styled.Text`
    font-size: 14px;
    color: ${COLORS.primary};
    font-family: 'OpenSans-SemiBold', 'System';
`;

const TagChip = styled.View`
  border-radius: 12px;
  padding: ${SIZES.spacing.xs}px 10px;
  margin-right: ${SIZES.spacing.sm}px;
  margin-bottom: ${SIZES.spacing.xs}px;
`;

const TagText = styled.Text`
  color: ${COLORS.textDark};
  font-size: 12px;
  font-family: 'OpenSans-Medium', 'System';
`;

const BottomBar = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${SIZES.spacing.md}px ${SIZES.spacing.md}px;
  justify-content: flex-start;
  background-color: ${COLORS.darkBg};
`;

const ToolButton = styled.TouchableOpacity`
  padding: ${SIZES.spacing.sm}px;
  margin-right: 20px;
`;
