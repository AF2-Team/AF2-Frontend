import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Keyboard,
  FlatList,
  ScrollView,
  TextInput as RNTextInput,
} from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

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
  const inputRef = useRef<RNTextInput>(null); //

  useEffect(() => {
    if (visible) {
      setSelectedTags(initiallySelectedTags);
      setSearchQuery("");
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        inputRef.current?.focus();
      });
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (onClose) onClose();
      });
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
    if (onClose) onClose();
  };

  const filteredTags = suggestedTags.filter((tag) =>
    tag.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderTagItem = ({ item }: { item: string }) => (
    <SuggestedTag
      onPress={() => handleTagPress(item)}
      isSelected={selectedTags.includes(item)}
    >
      <SuggestedTagText isSelected={selectedTags.includes(item)}>
        #{item}
      </SuggestedTagText>
    </SuggestedTag>
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
          <HandleBar />

          <Header>
            <Title>Añadir etiquetas</Title>
            <DoneButton onPress={handleDone}>
              <DoneText>Hecho</DoneText>
            </DoneButton>
          </Header>

          <Content>
            {/* Etiquetas seleccionadas */}
            {selectedTags.length > 0 && (
              <SelectedTagsContainer>
                <SelectedTagsScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {selectedTags.map((tag) => (
                    <SelectedTag key={tag}>
                      <SelectedTagText>#{tag}</SelectedTagText>
                      <RemoveTagButton onPress={() => handleTagPress(tag)}>
                        <Ionicons
                          name="close-circle"
                          size={20}
                          color="#ffffff"
                        />
                      </RemoveTagButton>
                    </SelectedTag>
                  ))}
                </SelectedTagsScrollView>
              </SelectedTagsContainer>
            )}

            {/* Campo de búsqueda */}
            <SearchContainer>
              <HashSymbol>#</HashSymbol>
              <SearchInput
                ref={inputRef}
                placeholder="Añadir etiquetas o buscar sugerencias..."
                placeholderTextColor="#4B4B4B"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearchInputSubmit}
                returnKeyType="done"
                autoCapitalize="none"
              />
            </SearchContainer>

            {/* Etiquetas sugeridas */}
            <SuggestedTagsTitle>Etiquetas sugeridas</SuggestedTagsTitle>
            <SuggestedTagsList
              data={filteredTags}
              keyExtractor={(item) => item}
              renderItem={renderTagItem}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              keyboardShouldPersistTaps="always"
            />
          </Content>
        </ModalContainer>
      </Overlay>
    </Modal>
  );
};

// Estilos
const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

const OverlayBackground = styled.View`
  flex: 1;
`;

const ModalContainer = styled(Animated.View)`
  background-color: #ffffff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  max-height: 75%;
  width: ${screenWidth}px;
`;

const HandleBar = styled.View`
  width: 40px;
  height: 4px;
  background-color: #d9d9d9;
  border-radius: 2px;
  align-self: center;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  font-family: "OpenSans-SemiBold";
`;

const DoneButton = styled.TouchableOpacity`
  padding: 8px 16px;
`;

const DoneText = styled.Text`
  color: #1291eb;
  font-size: 16px;
  font-weight: 600;
  font-family: "OpenSans-SemiBold";
`;

const Content = styled.View`
  flex: 1;
  padding: 20px;
`;

const SelectedTagsContainer = styled.View`
  margin-bottom: 24px;
`;

const SelectedTagsScrollView = styled(ScrollView).attrs({
  contentContainerStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
})`
  flex-grow: 0;
  max-height: 100px;
`;

const SelectedTag = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #1291eb;
  padding: 6px 10px;
  border-radius: 16px;
  margin-right: 8px;
  margin-bottom: 8px;
`;

const SelectedTagText = styled.Text`
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  font-family: "OpenSans-Medium";
  margin-right: 6px;
`;

const RemoveTagButton = styled.TouchableOpacity`
  padding: 2px;
  margin-left: 2px;
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-bottom: 12px;
  border-bottom-width: 1px;
  border-bottom-color: #e0e0e0;
  margin-bottom: 24px;
`;

const HashSymbol = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #4b4b4b;
  margin-right: 12px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 18px;
  color: #000000;
  font-family: "OpenSans-Regular";
  padding-vertical: 8px;
`;

const SuggestedTagsTitle = styled.Text`
  font-size: 14px;
  color: #4b4b4b;
  margin-bottom: 12px;
  font-family: "OpenSans-Medium";
`;

const SuggestedTagsList = styled(
  FlatList as new (props: any) => FlatList<string>,
)`
  flex: 1;
  margin-horizontal: -6px;
`;

const SuggestedTag = styled.TouchableOpacity<{ isSelected: boolean }>`
  background-color: ${({ isSelected }) => (isSelected ? "#1291EB" : "#FFFFFF")};
  border: 1.5px solid
    ${({ isSelected }) => (isSelected ? "#1291EB" : "#D0D0D0")};
  padding: 10px 14px;
  border-radius: 16px;
  margin: 6px;
  flex: 1;
  min-width: 45%;
  align-items: center;
  justify-content: center;
`;

const SuggestedTagText = styled.Text<{ isSelected: boolean }>`
  color: ${({ isSelected }) => (isSelected ? "#FFFFFF" : "#4B4B4B")};
  font-size: 14px;
  font-weight: 500;
  font-family: "OpenSans-Medium";
`;
