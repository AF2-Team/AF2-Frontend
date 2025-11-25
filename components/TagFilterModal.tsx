import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Keyboard,
  Modal,
  TouchableWithoutFeedback
} from "react-native";
import styled from "styled-components/native";

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
  const [selectedTags, setSelectedTags] = useState<string[]>(initiallySelectedTags);
  const [searchQuery, setSearchQuery] = useState("");
  const [slideAnim] = useState(new Animated.Value(visible ? 0 : screenHeight));
  const [fadeAnim] = useState(new Animated.Value(visible ? 1 : 0));
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
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 250,
          easing: Easing.in(Easing.ease),
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
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      return [...prev, tag];
    });
  };

  const handleClear = () => setSelectedTags([]);

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
        activeOpacity={0.8}
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
            {/* Posicionamiento absoluto para no necesitar Views extra */}
            <CancelButton onPress={handleClose}>
              <CancelText>Cancelar</CancelText>
            </CancelButton>
            <Title>Filtrar por etiquetas</Title>
          </Header>

          <SearchContainer>
            <SearchIcon source={searchIcon} resizeMode="contain" />
            <SearchInput
              placeholder="Busca entre tus etiquetas"
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
            />
          </SearchContainer>

          <TagsContainer>
            <TagsList
              data={filteredTags}
              keyExtractor={(item) => item}
              renderItem={renderTagItem}
              numColumns={2}
              columnWrapperStyle={{ gap: 10 }} // Espacio horizontal
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
            />
          </TagsContainer>

          <DividerContainer>
            <LinearGradient
              colors={["rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0)"]}
              style={{ height: 2, width: "100%" }}
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

// --- ESTILOS AJUSTADOS ---

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
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px 20px 20px 20px; /* Padding uniforme */
  
  /* SOLUCIÓN: Altura fija para que suba y ocupe espacio visible */
  height: 60%; 
  width: 100%;
  
  /* Sombra suave */
  shadow-color: #000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 5;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center; /* Centra el Título */
  position: relative;      /* Necesario para el absolute del botón */
  margin-bottom: 20px;
  height: 30px;
`;

const CancelButton = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  height: 100%;
  justify-content: center;
  z-index: 1;
`;

const CancelText = styled.Text`
  color: #1291EB;
  font-size: 16px;
  font-weight: 600;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  text-align: center;
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #E8E8E8;
  height: 45px;
  border-radius: 12px;
  padding-horizontal: 15px;
  margin-bottom: 15px;
`;

const SearchIcon = styled.Image`
  width: 18px;
  height: 18px;
  margin-right: 10px;
  opacity: 0.5;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: #000000;
  height: 100%;
`;

const TagsContainer = styled.View`
  flex: 1;
`;

const TagsList = styled.FlatList`
  flex: 1;
`;

const TagItem = styled.TouchableOpacity<{ isSelected: boolean }>`
  background-color: ${({ isSelected }) => (isSelected ? "#ffffff" : "#ffffff")};
  border-width: 1.5px;
  border-color: ${({ isSelected }) => (isSelected ? "#000000" : "#808080")};
  padding: 8px 16px;
  border-radius: 20px;
  margin-bottom: 8px;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const TagText = styled.Text<{ isSelected: boolean }>`
  color: ${({ isSelected }) => (isSelected ? "#000000" : "#505050")};
  font-size: 14px;
  font-weight: 600;
`;

const DividerContainer = styled.View`
  width: 100%;
  height: 10px;
  justify-content: center;
  margin-top: 10px;
`;

const ActionsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const ClearButton = styled.TouchableOpacity<{ disabled: boolean }>`
  padding: 10px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const ClearText = styled.Text<{ disabled: boolean }>`
  color: #A0A0A0;
  font-size: 16px;
  font-weight: 600;
`;

const ApplyButton = styled.TouchableOpacity`
  background-color: #1291eb;
  padding-vertical: 12px;
  padding-horizontal: 35px;
  border-radius: 25px;
`;

const ApplyText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
`;