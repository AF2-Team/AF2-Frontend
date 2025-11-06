import React, { useState, useEffect, useRef } from 'react';
import { 
  Modal, 
  TouchableWithoutFeedback, 
  Animated,
  Dimensions,
  Keyboard,
  FlatList
} from 'react-native';
import styled from 'styled-components/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface TagSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onTagsSelected: (tags: string[]) => void;
  selectedTags: string[];
}

// Etiquetas de ejemplo
const suggestedTags = [
  'spn', 'annihilation', 'the southern reach', 'web weaving',
  'authority', 'horror cosmic', 'sci-fi', 'book'
];

export const TagSelectorModal: React.FC<TagSelectorModalProps> = ({
  visible,
  onClose,
  onTagsSelected,
  selectedTags: initiallySelectedTags
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(initiallySelectedTags);
  const [searchQuery, setSearchQuery] = useState('');
  const [slideAnim] = useState(new Animated.Value(screenHeight));
  const [fadeAnim] = useState(new Animated.Value(0));
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (visible) {
      setSelectedTags(initiallySelectedTags);
      setSearchQuery('');
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200, // ✅ Consistente: 200ms
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200, // ✅ Consistente: 200ms
          useNativeDriver: true,
        }),
      ]).start();

      // ✅ Auto-focus con delay para que la animación termine primero
      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
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
      ]).start();
    }
  }, [visible, initiallySelectedTags]);

  const handleTagPress = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
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

  const filteredTags = suggestedTags.filter(tag =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
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
            transform: [{ translateY: slideAnim }]
          }}
        >
          {/* ✅ Handle bar para indicar que es arrastrable */}
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
                >
                  {selectedTags.map(tag => (
                    <SelectedTag key={tag}>
                      <SelectedTagText>#{tag}</SelectedTagText>
                      <RemoveTagButton onPress={() => handleTagPress(tag)}>
                        <RemoveTagText>×</RemoveTagText>
                      </RemoveTagButton>
                    </SelectedTag>
                  ))}
                  <AddMoreButton>
                    <AddMoreText>+</AddMoreText>
                  </AddMoreButton>
                </SelectedTagsScrollView>
              </SelectedTagsContainer>
            )}

            {/* Campo de búsqueda */}
            <SearchContainer>
              <HashSymbol>#</HashSymbol>
              <SearchInput
                ref={inputRef} // ✅ Ref para auto-focus
                placeholder="Añadir etiquetas..."
                placeholderTextColor="#4B4B4B"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="done"
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
            />
          </Content>
        </ModalContainer>
      </Overlay>
    </Modal>
  );
};

// Estilos mejorados
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
  max-height: 75%; // ✅ Mejor ergonomía en pantallas pequeñas
`;

// ✅ Handle bar para indicador de arrastre
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
  font-family: 'OpenSans-SemiBold', 'System';
`;

const DoneButton = styled.TouchableOpacity`
  padding: 8px 16px;
`;

const DoneText = styled.Text`
  color: #1291EB;
  font-size: 16px;
  font-weight: 600;
  font-family: 'OpenSans-SemiBold', 'System';
`;

const Content = styled.View`
  flex: 1;
  padding: 20px;
`;

const SelectedTagsContainer = styled.View`
  margin-bottom: 24px;
`;

const SelectedTagsScrollView = styled.ScrollView`
  flex-grow: 0;
`;

const SelectedTag = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #1291EB;
  padding: 8px 12px;
  border-radius: 16px;
  margin-right: 8px;
  margin-bottom: 8px;
`;

const SelectedTagText = styled.Text`
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  font-family: 'OpenSans-Medium', 'System';
  margin-right: 6px;
`;

const RemoveTagButton = styled.TouchableOpacity`
  padding: 2px;
`;

const RemoveTagText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;

const AddMoreButton = styled.TouchableOpacity`
  background-color: #f0f0f0;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  margin-left: 8px;
`;

const AddMoreText = styled.Text`
  color: #4B4B4B;
  font-size: 18px;
  font-weight: bold;
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
`;

const HashSymbol = styled.Text`
  font-size: 40px;
  font-weight: bold;
  color: #4B4B4B;
  margin-right: 12px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 18px;
  color: #000000;
  font-family: 'OpenSans-Regular', 'System';
  padding-vertical: 8px;
`;

const SuggestedTagsTitle = styled.Text`
  font-size: 14px;
  color: #4B4B4B;
  margin-bottom: 12px;
  font-family: 'OpenSans-Medium', 'System';
`;

const SuggestedTagsList = styled.FlatList`
  flex: 1;
`;

const SuggestedTag = styled.TouchableOpacity<{ isSelected: boolean }>`
  background-color: ${({ isSelected }) => isSelected ? '#1291EB' : '#FFFFFF'};
  border: 1.5px solid ${({ isSelected }) => isSelected ? '#1291EB' : '#4B4B4B'};
  padding: 10px 14px;
  border-radius: 16px;
  margin: 6px;
  flex: 1;
  min-width: 45%;
  align-items: center;
  justify-content: center;
`;

const SuggestedTagText = styled.Text<{ isSelected: boolean }>`
  color: ${({ isSelected }) => isSelected ? '#FFFFFF' : '#4B4B4B'};
  font-size: 14px;
  font-weight: 500;
  font-family: 'OpenSans-Medium', 'System';
`;
