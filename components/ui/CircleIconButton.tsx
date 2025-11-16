import React from 'react';
import { TouchableOpacity, StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

//Extraemos el tipo de dato que contiene todos los nombres de íconos válidos
// Este tipo se convierte en una gigantesca unión de strings literales ('home' | 'cog' | 'arrow-left' | ...)
type IconName = keyof typeof MaterialCommunityIcons.glyphMap; 


const LOCAL_SIZES = {
  ICON_STANDARD: 40,
} as const;

const LOCAL_COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  TRANSPARENT_BLACK_70: 'rgba(0, 0, 0, 0.70)', 
} as const;

// --- INTERFACE LOCAL ---
export interface CircleIconButtonProps {
  //Usamos el tipo extraído (IconName) en lugar de 'string' o 'any'
  name: IconName; 
  onPress: () => void;
  size?: number;
  color?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
}


const CircleIconButton = ({
  name,
  onPress,
  size = LOCAL_SIZES.ICON_STANDARD,
  color = LOCAL_COLORS.WHITE,
  backgroundColor = LOCAL_COLORS.TRANSPARENT_BLACK_70,
  style
}: CircleIconButtonProps) => {
  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: backgroundColor,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.baseContainer, containerStyle, style]}
    >
      <MaterialCommunityIcons 
        name={name} 
        size={size * 0.55} 
        color={color} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: LOCAL_COLORS.BLACK,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 3, 
      },
    }),
  },
});

export default CircleIconButton;