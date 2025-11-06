import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Keyboard,
  Easing,
  Image,
} from "react-native";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";

const { height: screenHeight } = Dimensions.get("window");

// Importar el ícono de lupa
const searchIcon = require("../assets/images/search-icon.png");

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
          }}
        >
          <Header>
            <CancelButton onPress={handleClose}>
              <CancelText>Cancelar</CancelText>
            </CancelButton>
            <Title>Filtrar por etiquetas</Title>
          </Header>

          <SearchContainer>
            <SearchIcon source={searchIcon} />
            <SearchInput
              placeholder="Busca entre tus etiquetas"
              placeholderTextColor="#4B4B4B"
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
              contentContainerStyle={{ paddingBottom: 20 }}
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

// Estilos finales pulidos
const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

const OverlayBackground = styled.View`
  flex: 1;
`;

const ModalContainer = styled.View`
  background-color: #ffffff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 20px 16px 10px 16px;
  max-height: 85%;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-bottom: 10px;
  position: relative;
`;

const CancelButton = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  justify-content: center;
  padding-vertical: 8px;
`;

const CancelText = styled.Text`
  color: #1291eb;
  font-size: 14px;
  font-weight: 600;
  font-family: "OpenSans-SemiBold", "System";
`;

const Title = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: #000000;
  font-family: "OpenSans-Bold", "System";
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #adadad;
  height: 36px;
  border-radius: 20px;
  padding-horizontal: 16px;
  margin-top: 8px;
  gap: 8px;
`;

const SearchIcon = styled.Image`
  width: 16px;
  height: 16px;
  /* Se eliminó tint-color para mantener el color original del Figma */
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 14px;
  color: #000000;
  font-family: "OpenSans-Regular", "System";
  padding-vertical: 0; /* ✅ Alinea verticalmente con el icono */
`;

const TagsContainer = styled.View`
  flex: 1;
  margin-top: 16px;
  min-height: 200px;
`;

const TagsList = styled.FlatList`
  flex: 1;
`;

const TagItem = styled.TouchableOpacity<{ isSelected: boolean }>`
  background-color: ${({ isSelected }) => (isSelected ? "#1291EB" : "#FFFFFF")};
  border: 1.5px solid
    ${({ isSelected }) => (isSelected ? "#1291EB" : "#4B4B4B")};
  padding: 6px 12px;
  border-radius: 16px;
  margin: 4px;
  flex: 1;
  min-width: 45%;
  align-items: center;
  justify-content: center;
`;

const TagText = styled.Text<{ isSelected: boolean }>`
  color: ${({ isSelected }) => (isSelected ? "#FFFFFF" : "#4B4B4B")};
  font-size: 14px;
  font-weight: 500;
  font-family: "OpenSans-Medium", "System";
`;

const DividerContainer = styled.View`
  width: 100%;
  margin-vertical: 8px;
`;

const ActionsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 14px;
  background-color: #ffffff;
`;

const ClearButton = styled.TouchableOpacity<{ disabled: boolean }>`
  padding: 10px 0;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

const ClearText = styled.Text<{ disabled: boolean }>`
  color: ${({ disabled }) => (disabled ? "#ADADAD" : "#1291EB")};
  font-size: 14px;
  font-weight: 600;
  font-family: "OpenSans-SemiBold", "System";
`;

const ApplyButton = styled.TouchableOpacity`
  background-color: #1291eb;
  padding: 10px 28px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
`;

const ApplyText = styled.Text`
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  font-family: "OpenSans-Bold", "System";
`;
