import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Keyboard,
  ScrollView,
  TextInput as RNTextInput,
} from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, THEME } from "@/constants";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface TagSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onTagsSelected: (tags: string[]) => void;
  selectedTags: string[];
}

// Etiquetas de ejemplo
const suggestedTags = [
  "spn",
  "annihilation",
  "the southern reach",
  "web weaving",
  "authority",
  "horror cosmic",
  "sci-fi",
  "book",
  "fantasy",
  "thriller",
  "mystery",
  "adventure",
  "technology",
  "programming",
  "reactnative",
  "design",
];

export const TagSelectorModal: React.FC<TagSelectorModalProps> = ({
  visible,
  onClose,
  onTagsSelected,
  selectedTags: initiallySelectedTags,
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initiallySelectedTags,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [slideAnim] = useState(new Animated.Value(screenHeight));
  const [fadeAnim] = useState(new Animated.Value(0));
  const inputRef = useRef<RNTextInput>(null);

  useEffect(() => {
    if (visible) {
      setSelectedTags(initiallySelectedTags);
      setSearchQuery("");
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => inputRef.current?.focus(), 100);
      });
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, initiallySelectedTags]);

  const handleTagPress = (tag: string) => {
    const normalizedTag = tag.toLowerCase().trim();

    setSelectedTags((prev) => {
      const isSelected = prev.includes(normalizedTag);
      if (isSelected) {
        return prev.filter((t) => t !== normalizedTag);
      } else {
        return [...prev, normalizedTag];
      }
    });
    if (searchQuery.toLowerCase().trim() === normalizedTag) {
      setSearchQuery("");
    }
  };

  const handleSearchInputSubmit = () => {
    if (searchQuery.trim() !== "") {
      const normalizedQuery = searchQuery.toLowerCase().trim();

      if (
        !selectedTags.includes(normalizedQuery) &&
        !suggestedTags.includes(normalizedQuery)
      ) {
        handleTagPress(normalizedQuery);
      } else if (selectedTags.includes(normalizedQuery)) {
        handleTagPress(normalizedQuery);
      }
      setSearchQuery("");
    }
  };

  const handleDone = () => {
    onTagsSelected(selectedTags);
    Keyboard.dismiss();
    onClose();
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const filteredTags = suggestedTags.filter((tag) =>
    tag.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Overlay as={Animated.View} style={{ opacity: fadeAnim }}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <OverlayBackground />
        </TouchableWithoutFeedback>

        <ModalContainer
          as={Animated.View}
          style={{
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Header>
            <Title>Añadir etiquetas</Title>
            <DoneButton onPress={handleDone}>
              <DoneText>Hecho</DoneText>
            </DoneButton>
          </Header>

          <Content>
            {/* Campo de búsqueda */}
            <SearchContainer>
              <HashSymbol>#</HashSymbol>
              <SearchInput
                ref={inputRef}
                placeholder="Buscar o crear etiquetas..."
                placeholderTextColor={Colors.textPlaceholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearchInputSubmit}
                returnKeyType="done"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </SearchContainer>

            {/* Etiquetas seleccionadas - Scroll horizontal */}
            {selectedTags.length > 0 && (
              <SelectedTagsSection>
                <SectionTitle>Tus etiquetas</SectionTitle>
                <SelectedTagsScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  {selectedTags.map((tag) => (
                    <SelectedTag key={tag}>
                      <SelectedTagText>#{tag}</SelectedTagText>
                      <RemoveTagButton onPress={() => handleTagPress(tag)}>
                        <Ionicons
                          name="close-circle"
                          size={14}
                          color={Colors.textLight}
                        />
                      </RemoveTagButton>
                    </SelectedTag>
                  ))}
                </SelectedTagsScrollView>
              </SelectedTagsSection>
            )}

            {/* Etiquetas sugeridas - Scroll horizontal */}
            <SuggestedTagsSection>
              <SectionTitle>Etiquetas sugeridas</SectionTitle>
              <SuggestedTagsScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {filteredTags.map((tag) => (
                  <SuggestedTag
                    key={tag}
                    onPress={() => handleTagPress(tag)}
                    isSelected={selectedTags.includes(tag)}
                  >
                    <SuggestedTagText isSelected={selectedTags.includes(tag)}>
                      #{tag}
                    </SuggestedTagText>
                  </SuggestedTag>
                ))}
              </SuggestedTagsScrollView>
            </SuggestedTagsSection>
          </Content>
        </ModalContainer>
      </Overlay>
    </Modal>
  );
};

// Estilos corregidos con botones más compactos
const Overlay = styled.View`
  flex: 1;
  background-color: ${Colors.modalOverlay};
  justify-content: flex-end;
`;

const OverlayBackground = styled.View`
  flex: 1;
`;

const ModalContainer = styled(Animated.View)`
  background-color: ${Colors.background};
  border-top-left-radius: ${THEME.COMMON.BORDER_RADIUS.LG}px;
  border-top-right-radius: ${THEME.COMMON.BORDER_RADIUS.LG}px;
  height: 30%;
  width: 100%;
  shadow-color: #000;
  shadow-offset: 0px -4px;
  shadow-opacity: 0.25;
  shadow-radius: 12px;
  elevation: 3;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${THEME.SPACING.MD}px ${THEME.SPACING.LG}px;
  border-bottom-width: 1px;
  border-bottom-color: ${Colors.border};
`;

const Title = styled.Text`
  font-size: ${THEME.TYPOGRAPHY.SUBTITLE}px;
  color: ${Colors.text};
  font-family: ${THEME.FONTS.BOLD};
`;

const DoneButton = styled.TouchableOpacity`
  padding: ${THEME.SPACING.XS}px ${THEME.SPACING.SM}px;
`;

const DoneText = styled.Text`
  color: ${Colors.action};
  font-size: ${THEME.TYPOGRAPHY.SUBTITLE}px;
  font-family: ${THEME.FONTS.BOLD};
`;

const Content = styled.View`
  flex: 1;
  padding: ${THEME.SPACING.MD}px ${THEME.SPACING.LG}px;
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${Colors.backgroundAlt};
  border-radius: ${THEME.COMMON.BORDER_RADIUS.MD}px;
  padding: ${THEME.SPACING.SM}px ${THEME.SPACING.MD}px;
  margin-bottom: ${THEME.SPACING.MD}px;
  border-width: 1px;
  border-color: ${Colors.border};
`;

const HashSymbol = styled.Text`
  font-size: ${THEME.TYPOGRAPHY.SUBTITLE}px;
  color: ${Colors.text};
  font-family: ${THEME.FONTS.BOLD};
  margin-right: ${THEME.SPACING.SM}px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: ${THEME.TYPOGRAPHY.BODY}px;
  color: ${Colors.text};
  font-family: ${THEME.FONTS.REGULAR};
  padding: 0;
`;

const SelectedTagsSection = styled.View`
  margin-bottom: ${THEME.SPACING.MD}px;
`;

const SuggestedTagsSection = styled.View`
  flex: 1;
`;

const SectionTitle = styled.Text`
  font-size: ${THEME.TYPOGRAPHY.CAPTION}px;
  color: ${Colors.text};
  font-family: ${THEME.FONTS.SEMI_BOLD};
  margin-bottom: ${THEME.SPACING.SM}px;
`;

const SelectedTagsScrollView = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})`
  flex-grow: 0;
`;

// Botones seleccionados - más compactos y redondeados
const SelectedTag = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${Colors.action};
  padding: ${THEME.SPACING.XS}px ${THEME.SPACING.SM}px;
  border-radius: ${THEME.COMMON.BORDER_RADIUS.XL}px; /* Más redondeado */
  margin-right: ${THEME.SPACING.SM}px;
`;

const SelectedTagText = styled.Text`
  color: ${Colors.textLight};
  font-size: ${THEME.TYPOGRAPHY.SMALL}px;
  font-family: ${THEME.FONTS.SEMI_BOLD};
  margin-right: ${THEME.SPACING.XS}px;
`;

const RemoveTagButton = styled.TouchableOpacity`
  padding: 1px;
`;

const SuggestedTagsScrollView = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})`
  flex: 1;
`;

const SuggestedTag = styled.TouchableOpacity<{ isSelected: boolean }>`
  background-color: ${({ isSelected }) =>
    isSelected ? Colors.action : Colors.backgroundTag};
  /* QUITAMOS el borde: border: 1px solid ${Colors.border}; */
  padding: ${THEME.SPACING.XS}px ${THEME.SPACING.MD}px; /* Menos padding vertical */
  border-radius: ${THEME.COMMON.BORDER_RADIUS.XL}px; /* Más redondeado */
  margin-right: ${THEME.SPACING.SM}px;
  align-items: center;
  justify-content: center;
  min-height: 32px; /* Altura fija más compacta */
`;

const SuggestedTagText = styled.Text<{ isSelected: boolean }>`
  color: ${({ isSelected }) => (isSelected ? Colors.textLight : Colors.text)};
  font-size: ${THEME.TYPOGRAPHY.SMALL}px;
  font-family: ${THEME.FONTS.SEMI_BOLD};
`;
