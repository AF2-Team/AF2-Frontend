import React from "react";
import styled from "styled-components/native";
import { Colors, THEME } from "@/constants";

interface TagFilterBarProps {
  onTagFilterPress?: () => void;
  onManageTagsPress?: () => void;
  selectedTagsCount?: number;
}

export const TagFilterBar: React.FC<TagFilterBarProps> = ({
  onTagFilterPress,
  onManageTagsPress,
  selectedTagsCount = 0,
}) => {
  const isFilterActive = selectedTagsCount > 0;

  return (
    <Container>
      <TopLine />

      <Content>
        <FilterButton onPress={onTagFilterPress}>
          <ButtonContent active={isFilterActive}>
            <FilterIconContainer>
              <FilterIcon>#</FilterIcon>
              <DropdownArrow>▾</DropdownArrow>
            </FilterIconContainer>
            <ButtonText active={isFilterActive}>
              {isFilterActive
                ? `Filtrar con ${selectedTagsCount} etiqueta${selectedTagsCount > 1 ? "s" : ""}`
                : "Filtrar por etiquetas"}
            </ButtonText>
          </ButtonContent>
        </FilterButton>

        <ManageButton onPress={onManageTagsPress}>
          <ButtonContent>
            <GearIcon>⚙️</GearIcon>
            <ButtonText>Gestionar</ButtonText>
          </ButtonContent>
        </ManageButton>
      </Content>

      <BottomLine />
    </Container>
  );
};

const Container = styled.View`
  background-color: ${Colors.filterBarBackground};
  ${THEME.COMMON.SHADOWS.SMALL}
`;

const TopLine = styled.View`
  height: 1px;
  background-color: ${Colors.borderMuted};
  width: 100%;
`;

const BottomLine = styled.View`
  height: 1px;
  background-color: ${Colors.borderMuted};
  width: 100%;
`;

const Content = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${THEME.SPACING.SM}px ${THEME.SPACING.MD}px;
`;

const FilterButton = styled.TouchableOpacity`
  flex: 1;
  margin-right: ${THEME.SPACING.SM}px;
`;

const ManageButton = styled.TouchableOpacity`
  flex: 1;
  margin-left: ${THEME.SPACING.SM}px;
`;

const ButtonContent = styled.View<{ active?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${THEME.SPACING.SM}px ${THEME.SPACING.MD}px;
  background-color: ${({ active }) =>
    active ? "rgba(18, 145, 235, 0.15)" : "rgba(255, 255, 255, 0.08)"};
  border-radius: ${THEME.COMMON.BORDER_RADIUS.MD}px;
  border: 1.5px solid
    ${({ active }) => (active ? Colors.action : "rgba(255, 255, 255, 0.15)")};
  shadow-color: ${({ active }) => (active ? Colors.action : "transparent")};
  shadow-offset: 0px 1px;
  shadow-opacity: ${({ active }) => (active ? 0.3 : 0)};
  shadow-radius: 2px;
  elevation: ${({ active }) => (active ? 1 : 0)};
`;

const FilterIconContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: ${THEME.SPACING.SM}px;
`;

const FilterIcon = styled.Text`
  color: ${Colors.textLight};
  font-size: ${THEME.TYPOGRAPHY.CAPTION}px;
  font-family: ${THEME.FONTS.BOLD};
  margin-right: ${THEME.SPACING.XS}px;
`;

const DropdownArrow = styled.Text`
  color: ${Colors.textLight};
  font-size: ${THEME.TYPOGRAPHY.SMALL}px;
  margin-top: 1px;
`;

const GearIcon = styled.Text`
  color: ${Colors.textLight};
  font-size: ${THEME.TYPOGRAPHY.CAPTION}px;
  margin-right: ${THEME.SPACING.SM}px;
`;

const ButtonText = styled.Text<{ active?: boolean }>`
  color: ${Colors.textLight};
  font-size: ${THEME.TYPOGRAPHY.CAPTION}px;
  font-family: ${({ active }) =>
    active ? THEME.FONTS.SEMI_BOLD : THEME.FONTS.REGULAR};
`;
