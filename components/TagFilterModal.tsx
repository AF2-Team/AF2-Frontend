import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Keyboard,
  Easing,
} from "react-native";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors, THEME } from "@/constants";

const { height: screenHeight } = Dimensions.get("window");

interface TagFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (selectedTags: string[]) => void;
  followedTags: string[];
  selectedTags: string[];
}

export const TagFilterModal: React.FC<TagFilterModalProps> = ({
  visible,
  onClose,
  onApply,
  followedTags,
  selectedTags: initiallySelectedTags,
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initiallySelectedTags,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [slideAnim] = useState(new Animated.Value(visible ? 0 : screenHeight));
  const [fadeAnim] = useState(new Animated.Value(visible ? 1 : 0));

  // Debounce para la búsqueda
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (visible) {
      setSelectedTags(initiallySelectedTags);
      setSearchQuery("");
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, initiallySelectedTags]);

  const filteredTags = followedTags.filter((tag) =>
    tag.toLowerCase().includes(debouncedQuery.toLowerCase()),
  );

  const handleTagPress = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const handleClear = () => {
    setSelectedTags([]);
  };

  const handleApply = () => {
    onApply(selectedTags);
    Keyboard.dismiss();
    onClose();
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const selectedTagsCount = selectedTags.length;

  const renderTagItem = useCallback(
    ({ item }: { item: string }) => (
      <TagItem
        onPress={() => handleTagPress(item)}
        isSelected={selectedTags.includes(item)}
      >
        <TagText isSelected={selectedTags.includes(item)}>#{item}</TagText>
      </TagItem>
    ),
    [selectedTags],
  );

  // Calcular altura dinámica basada en la cantidad de etiquetas
  const getModalHeight = () => {
    const baseHeight = 300; // Altura base para elementos fijos
    const tagRowHeight = 50; // Altura aproximada por fila de etiquetas
    const tagCount = filteredTags.length;
    const rowCount = Math.ceil(tagCount / 2);
    const calculatedHeight = baseHeight + rowCount * tagRowHeight;

    // Limitar la altura máxima al 75% de la pantalla
    return Math.min(calculatedHeight, screenHeight * 0.75);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Overlay as={Animated.View} style={{ opacity: fadeAnim }}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <OverlayBackground />
        </TouchableWithoutFeedback>

        <ModalContainer
          as={Animated.View}
          style={{
            transform: [{ translateY: slideAnim }],
            height: getModalHeight(),
          }}
        >
          <Header>
            <CancelButton onPress={handleClose}>
              <CancelText>Cancelar</CancelText>
            </CancelButton>
            <Title>Filtrar por etiquetas</Title>
            <PlaceholderView />
          </Header>

          <SearchContainer>
            <Ionicons name="search" size={20} color={Colors.textPlaceholder} />
            <SearchInput
              placeholder="Busca entre tus etiquetas"
              placeholderTextColor={Colors.textPlaceholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </SearchContainer>

          <TagsContainer>
            <TagsList
              data={filteredTags}
              keyExtractor={(item) => item}
              renderItem={renderTagItem}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: THEME.SPACING.XL,
                flexGrow: 1,
              }}
              initialNumToRender={20}
              maxToRenderPerBatch={30}
              windowSize={10}
            />
          </TagsContainer>

          <DividerContainer>
            <LinearGradient
              colors={["rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                height: 1,
                width: "100%",
              }}
            />
          </DividerContainer>

          <ActionsContainer>
            <ClearButton
              onPress={handleClear}
              disabled={selectedTagsCount === 0}
            >
              <ClearText disabled={selectedTagsCount === 0}>
                {selectedTagsCount > 0
                  ? `Borrar (${selectedTagsCount})`
                  : "Borrar"}
              </ClearText>
            </ClearButton>

            <ApplyButton onPress={handleApply}>
              <ApplyText>Aplicar</ApplyText>
            </ApplyButton>
          </ActionsContainer>
        </ModalContainer>
      </Overlay>
    </Modal>
  );
};

// Estilos con área táctil mejorada para Cancelar
const Overlay = styled.View`
  flex: 1;
  background-color: ${Colors.modalOverlay};
  justify-content: flex-end;
`;

const OverlayBackground = styled.View`
  flex: 1;
`;

const ModalContainer = styled.View`
  background-color: ${Colors.modalBackground};
  border-top-left-radius: ${THEME.COMMON.BORDER_RADIUS.LG}px;
  border-top-right-radius: ${THEME.COMMON.BORDER_RADIUS.LG}px;
  padding: ${THEME.SPACING.LG}px ${THEME.SPACING.MD}px ${THEME.SPACING.MD}px;
  min-height: 300px;
  max-height: 75%;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: ${THEME.SPACING.SM}px;
  min-height: 50px;
`;

const CancelButton = styled.TouchableOpacity`
  padding: ${THEME.SPACING.MD}px;
  justify-content: center;
  align-items: flex-start;
  min-height: 44px;
  min-width: 80px;
`;

const CancelText = styled.Text`
  color: ${Colors.action};
  font-size: ${THEME.TYPOGRAPHY.BODY}px;
  font-family: ${THEME.FONTS.SEMI_BOLD};
`;

const Title = styled.Text`
  font-size: ${THEME.TYPOGRAPHY.BODY}px;
  font-family: ${THEME.FONTS.BOLD};
  color: ${Colors.text};
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
`;

const PlaceholderView = styled.View`
  width: 80px;
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${Colors.backgroundAlt};
  height: 44px;
  border-radius: ${THEME.COMMON.BORDER_RADIUS.XL}px;
  padding-horizontal: ${THEME.SPACING.MD}px;
  margin-top: ${THEME.SPACING.SM}px;
  margin-bottom: ${THEME.SPACING.MD}px;
  gap: ${THEME.SPACING.SM}px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: ${THEME.TYPOGRAPHY.BODY}px;
  color: ${Colors.text};
  font-family: ${THEME.FONTS.REGULAR};
  padding-vertical: 0;
`;

const TagsContainer = styled.View`
  flex: 1;
  min-height: 120px;
  margin-bottom: ${THEME.SPACING.MD}px;
`;

const TagsList = styled.FlatList`
  flex: 1;
`;

const TagItem = styled.TouchableOpacity<{ isSelected: boolean }>`
  background-color: ${({ isSelected }) =>
    isSelected ? Colors.action : Colors.background};
  border: 1.5px solid
    ${({ isSelected }) => (isSelected ? Colors.action : Colors.border)};
  padding: ${THEME.SPACING.SM}px ${THEME.SPACING.MD}px;
  border-radius: ${THEME.COMMON.BORDER_RADIUS.XL}px;
  margin: ${THEME.SPACING.XS}px;
  flex: 1;
  min-width: 45%;
  align-items: center;
  justify-content: center;
`;

const TagText = styled.Text<{ isSelected: boolean }>`
  color: ${({ isSelected }) => (isSelected ? Colors.textLight : Colors.text)};
  font-size: ${THEME.TYPOGRAPHY.CAPTION}px;
  font-family: ${THEME.FONTS.SEMI_BOLD};
`;

const DividerContainer = styled.View`
  width: 100%;
  margin-vertical: ${THEME.SPACING.SM}px;
`;

const ActionsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: ${THEME.SPACING.MD}px;
  background-color: ${Colors.modalBackground};
  min-height: 60px;
`;

const ClearButton = styled.TouchableOpacity<{ disabled: boolean }>`
  padding: ${THEME.SPACING.MD}px ${THEME.SPACING.LG}px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  min-height: 44px;
  justify-content: center;
`;

const ClearText = styled.Text<{ disabled: boolean }>`
  color: ${({ disabled }) => (disabled ? Colors.textMuted : Colors.action)};
  font-size: ${THEME.TYPOGRAPHY.BODY}px;
  font-family: ${THEME.FONTS.SEMI_BOLD};
`;

const ApplyButton = styled.TouchableOpacity`
  background-color: ${Colors.action};
  padding: ${THEME.SPACING.MD}px ${THEME.SPACING.XL}px;
  border-radius: ${THEME.COMMON.BORDER_RADIUS.XL}px;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  min-height: 44px;
`;

const ApplyText = styled.Text`
  color: ${Colors.textLight};
  font-size: ${THEME.TYPOGRAPHY.BODY}px;
  font-family: ${THEME.FONTS.BOLD};
`;
