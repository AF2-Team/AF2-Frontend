import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { ImageCropType } from '../types/ImagePickerTypes';

interface ImageEditHeaderProps {
  type: ImageCropType; 
  onClose: () => void; 
  onSave: () => void;  
}

const LOCAL_COLORS = {
    BACKGROUND: '#423646', // Fondo oscuro de tu diseño
    WHITE: '#FFFFFF',
    GREEN: '#66bb6a',   // Color verde del checkmark
};


const ImageEditHeader: React.FC<ImageEditHeaderProps> = ({
  type,
  onClose,
  onSave,
}) => {

  const title = type === 'avatar' ? 'Avatar' : 'Imagen de cabecera';

  return (
    <HeaderContainer>
      {/* Botón de Cancelar/Cerrar (usa el checkmark con función de cerrar) */}
      <TouchableOpacity onPress={onClose} style={styles.buttonContainer}>
        <MaterialCommunityIcons name="arrow-left" size={24} color={LOCAL_COLORS.WHITE} />
      </TouchableOpacity>
      
      <HeaderText>{title}</HeaderText>

      {/* Botón de Guardar/Listo (usa el checkmark verde) */}
      <TouchableOpacity onPress={onSave} style={styles.buttonContainer}>
        <MaterialCommunityIcons name="check" size={28} color={LOCAL_COLORS.GREEN} />
      </TouchableOpacity>
    </HeaderContainer>
  );
};


// --- STYLED COMPONENTS ---
const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  width: 100%;
  height: 60px; /* Altura estándar de header */
  background-color: ${LOCAL_COLORS.BACKGROUND};
`;

const HeaderText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${LOCAL_COLORS.WHITE};
`;

const styles = StyleSheet.create({
    buttonContainer: {
        padding: 5, 
    }
});


export default ImageEditHeader;