import React from "react";
import styled from "styled-components/native";

const gestionIcon = require("../assets/images/gestion.png");

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
      {/* Línea separadora superior */}
      <TopLine />

      <Content>
        {/* Botón de Filtro por Etiquetas */}
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

        {/* Botón de Gestionar */}
        <ManageButton onPress={onManageTagsPress}>
          <ButtonContent>
            <Icon source={gestionIcon} />
            <ButtonText>Gestionar</ButtonText>
          </ButtonContent>
        </ManageButton>
      </Content>

      {/* Línea separadora inferior */}
      <BottomLine />
    </Container>
  );
};

const Container = styled.View`
  background-color: #2b222d;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 3;
`;

const TopLine = styled.View`
  height: 1px;
  background-color: #918991;
  width: 100%;
`;

const BottomLine = styled.View`
  height: 1px;
  background-color: #918991;
  width: 100%;
`;

const Content = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
`;

const FilterButton = styled.TouchableOpacity`
  flex: 1;
  margin-right: 8px;
`;

const ManageButton = styled.TouchableOpacity`
  flex: 1;
  margin-left: 8px;
`;

const ButtonContent = styled.View<{ active?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  background-color: ${({ active }) =>
    active ? "rgba(18, 145, 235, 0.15)" : "rgba(255, 255, 255, 0.08)"};
  border-radius: 8px;
  border: 1.5px solid
    ${({ active }) => (active ? "#1291EB" : "rgba(255, 255, 255, 0.15)")};
  shadow-color: ${({ active }) => (active ? "#1291EB" : "transparent")};
  shadow-offset: 0px 1px;
  shadow-opacity: ${({ active }) => (active ? 0.3 : 0)};
  shadow-radius: 2px;
  elevation: ${({ active }) => (active ? 1 : 0)};
`;

const FilterIconContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 8px;
`;

const FilterIcon = styled.Text`
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  margin-right: 4px;
`;

const DropdownArrow = styled.Text`
  color: #ffffff;
  font-size: 12px;
  margin-top: 1px;
`;

const ButtonText = styled.Text<{ active?: boolean }>`
  color: #ffffff;
  font-size: 14px;
  font-weight: ${({ active }) => (active ? "600" : "500")};
  font-family: "OpenSans-SemiBold";
`;

const Icon = styled.Image`
  width: 16px;
  height: 16px;
  tint-color: #ffffff;
  margin-right: 8px;
`;
