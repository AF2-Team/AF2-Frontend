// src/components/Profile/ImageEditOptionsSheet.tsx

import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomSheet, Option } from './ui/BottomSheet';
import { AvatarShape, ImageCropType } from '../types/ImagePickerTypes';
import * as ImagePicker from 'expo-image-picker';
import {MediaType} from 'expo-image-picker';


interface ImageEditOptionsSheetProps {
  isVisible: boolean;
  type: ImageCropType | null;
  avatarShape: AvatarShape;
  onClose: () => void;
  onImageSelected: (uri: string, type: ImageCropType) => void;
  onShapeChange: (shape: AvatarShape) => void;
  onSave: () => void;
}

const ImageEditOptionsSheet: React.FC<ImageEditOptionsSheetProps> = ({
  isVisible,
  type,
  avatarShape,
  onClose,
  onImageSelected,
  onShapeChange,
  onSave,
}) => {

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true, 
      aspect: type === 'avatar' ? [1, 1] : [16, 9], 
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0 && type) {
      onImageSelected(result.assets[0].uri, type);
    }
    //No se cierra el bottomsheet aquí, para que el usuario pueda seguir cambiando la forma.
  };


  if (!type) return null;

  // Opciones base 
  const options: Option[] = [
    {
      id: 'pick_photo',
      label: 'Elegir una foto de la galería',
      onPress: handlePickImage,
      icon: <MaterialCommunityIcons name="image-edit-outline" size={24} color="#423646" />,
      isPrimary: true, 
    },
  ];

  //Opciones de forma (Solo si es avatar)
  if (type === 'avatar') {
    options.push(
      {
        id: 'shape_square',
        label: `Forma Cuadrada ${avatarShape === 'square' ? ' (Actual)' : ''}`,
        onPress: () => onShapeChange('square'),
        icon: <MaterialCommunityIcons name={avatarShape === 'square' ? "checkbox-marked-outline" : "checkbox-blank-outline"} size={24} color="#423646" />,
      },
      {
        id: 'shape_circle',
        label: `Forma Circular ${avatarShape === 'circle' ? ' (Actual)' : ''}`,
        onPress: () => onShapeChange('circle'),
        icon: <MaterialCommunityIcons name={avatarShape === 'circle' ? "radiobox-marked" : "radiobox-blank"} size={24} color="#423646" />,
      },
    );
  }

  //Opción de Guardar y Cerrar
   options.push(
    {
      id: 'save',
      label: 'Guardar cambios',
      onPress: onSave,
      icon: <MaterialCommunityIcons name="content-save" size={24} color="#423646" />,
      isPrimary: true,
    },
    {
      id: 'cancel',
      label: 'Cancelar',
      onPress: onClose, // onClose ya está configurado para cerrar en la prop del sheet
      icon: <MaterialCommunityIcons name="close-circle-outline" size={24} color="#423646" />,
    }
  );

  return (
    <BottomSheet
      visible={isVisible}
      onClose={onClose}
      options={options}
    />
  );
};

export default ImageEditOptionsSheet;