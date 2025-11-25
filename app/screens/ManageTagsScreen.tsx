import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import { Colors, THEME } from "@/constants";
import { Ionicons } from "@expo/vector-icons";

// Datos de ejemplo con imágenes similares al ExploreScreen
const initialTags = [
  {
    id: "1",
    name: "spn",
    following: true,
    imageUrl: "https://placehold.co/100x100/333/white?text=SP",
  },
  {
    id: "2",
    name: "flowers",
    following: true,
    imageUrl: "https://placehold.co/100x100/pink/white?text=FL",
  },
  {
    id: "3",
    name: "remmick",
    following: true,
    imageUrl: "https://placehold.co/100x100/222/white?text=RM",
  },
  {
    id: "4",
    name: "sentryagent",
    following: true,
    imageUrl: "https://placehold.co/100x100/gold/black?text=SA",
  },
];

const ManageTagsScreen = () => {
  const router = useRouter();
  const [tags, setTags] = useState(initialTags);

  const handleFollowToggle = (tagId: string) => {
    setTags((prevTags) =>
      prevTags.map((tag) =>
        tag.id === tagId ? { ...tag, following: !tag.following } : tag,
      ),
    );
  };

  const renderTagItem = ({
    item,
  }: {
    item: { id: string; name: string; following: boolean; imageUrl: string };
  }) => (
    <TagContainer>
      <TagInfo>
        <TagImage source={{ uri: item.imageUrl }} />
        <TagName>#{item.name}</TagName>
      </TagInfo>

      <FollowButton
        active={item.following}
        onPress={() => handleFollowToggle(item.id)}
      >
        <ButtonText active={item.following}>
          {item.following ? "Siguiendo" : "Seguir"}
        </ButtonText>
      </FollowButton>
    </TagContainer>
  );

  return (
    <Container>
      <Header>
        <BackButton onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textLight} />
        </BackButton>
        <HeaderTitle>Etiquetas que sigues</HeaderTitle>
        <PlaceholderView />
      </Header>

      <Content>
        <FlatList
          data={tags}
          renderItem={renderTagItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: THEME.SPACING.MD,
  },
});

// Styled Components - ACTUALIZADO con estilos de imagen
const Container = styled.View`
  flex: 1;
  background-color: ${Colors.background};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${THEME.SPACING.XL * 1.5}px ${THEME.SPACING.SCREEN_HORIZONTAL}px
    ${THEME.SPACING.XL}px;
  background-color: ${Colors.primary};
  min-height: 140px;
`;

const BackButton = styled.TouchableOpacity`
  padding: ${THEME.SPACING.XS}px;
  margin-top: ${THEME.SPACING.SM}px;
`;

const HeaderTitle = styled.Text`
  font-size: ${THEME.TYPOGRAPHY.TITLE}px;
  color: ${Colors.textLight};
  font-family: ${THEME.FONTS.BOLD};
  text-align: center;
  flex: 1;
  margin-top: ${THEME.SPACING.SM}px;
`;

const PlaceholderView = styled.View`
  width: 24px;
`;

const Content = styled.View`
  flex: 1;
  padding: 0 ${THEME.SPACING.SCREEN_HORIZONTAL}px;
  margin-top: -${THEME.SPACING.MD}px;
`;

const TagContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${THEME.SPACING.MD}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${Colors.border};
`;

const TagInfo = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const TagImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: ${THEME.COMMON.BORDER_RADIUS.MD}px;
  background-color: ${Colors.backgroundAlt};
  margin-right: ${THEME.SPACING.MD}px;
`;

const TagName = styled.Text`
  font-size: ${THEME.TYPOGRAPHY.BODY}px;
  color: ${Colors.text};
  font-family: ${THEME.FONTS.SEMI_BOLD};
`;

const FollowButton = styled.TouchableOpacity<{ active: boolean }>`
  padding: ${THEME.SPACING.SM}px ${THEME.SPACING.MD}px;
  border-radius: ${THEME.COMMON.BORDER_RADIUS.LG}px;
  border-width: 1.5px;
  border-color: ${({ active }) => (active ? Colors.action : Colors.action)};
  background-color: ${({ active }) =>
    active ? Colors.background : Colors.action};
  min-width: 90px;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text<{ active: boolean }>`
  font-size: ${THEME.TYPOGRAPHY.CAPTION}px;
  color: ${({ active }) => (active ? Colors.action : Colors.textLight)};
  font-family: ${THEME.FONTS.SEMI_BOLD};
`;

export default ManageTagsScreen;
