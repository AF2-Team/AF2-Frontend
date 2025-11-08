import React from 'react';
import { 
  StyleProp,
  StyleSheet, 
  TouchableOpacity,  
  ViewStyle 
} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';


interface CircleIconButtonProps {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name']; // Usa el tipo de la libreria
  onPress: () => void;
  size?: number; 
  color?: string; 
  style?: StyleProp<ViewStyle>; // Permite al padre pasar estilos de layout (ej: posicionamiento)
  backgroundColor?: string;
}

const CircleIconButton = ({
  name,
  onPress,
  size = 24,
  color = 'white',
  style,  
  backgroundColor= 'rgba(0, 0, 0, 0.70)'
}:CircleIconButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}
    // Aplicamos los estilos base y luego los estilos pasados por el padre (style)
    style={[
      styles.container, 
      style,
      {backgroundColor},
    ]}
    activeOpacity={0.8}
    >
       <MaterialCommunityIcons
        name={name}
        size={size}      
        color={color}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    //backgroundColor: 'rgba(0, 0, 0, 0.70)',
  },
});

export default CircleIconButton;