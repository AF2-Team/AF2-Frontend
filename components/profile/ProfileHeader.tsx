import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ImageSourcePropType, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import CircleIconButton, { CircleIconButtonProps } from '../ui/CircleIconButton';


const LOCAL_SIZES = {
  HEADER_HEIGHT: 210,
  HEADER_PADDING: 15,
} as const;

const LOCAL_COLORS = {
  PRIMARY: '#423646',
  WHITE: '#FFFFFF',
} as const;


export interface HeaderProfileProps {
  //URL de la imagen de cubierta (red) o URI de archivo (galería/cámara)
  //Si es undefined o null, se usará la imagen local por defecto
  //coverImageUrl?: string;
  //coverSource acepta URL ({uri: string}), local (number del require()), o null/undefined.
  coverSource?: ImageSourcePropType | null;
  //Si es true, fuerza el uso de la imagen local por defecto, ignorando coverImageUrl
  useDefaultCover?: boolean;
  onPressBack?: () => void;
  onPressSettings?: () => void;
  style?: StyleProp<ViewStyle>;
}

const HeaderProfile = ({
  //coverImageUrl,
  coverSource,
  useDefaultCover = false,
  onPressBack,
  onPressSettings,
  style,
}: HeaderProfileProps) => {

  const router = useRouter();
  //const isDefault = useDefaultCover || !coverImageUrl;
  const shouldShowColorFallback = useDefaultCover || !coverSource;

  const backButtonProps: CircleIconButtonProps = {
    name: 'arrow-left',
    onPress: onPressBack || (() => router.push('/screens/HomeScreen')),
  };

  const settingsButtonProps: CircleIconButtonProps = {
    name: 'cog',
    onPress: onPressSettings || (() => console.log('Settings pressed')),
  };

  return (
    <View style={[

      styles.container,
      //Si es default entonces muestra el color por defecto
      //isDefault && { backgroundColor: LOCAL_COLORS.PRIMARY }, 
      shouldShowColorFallback && { backgroundColor: LOCAL_COLORS.PRIMARY },
      style

    ]}
    >
      {/*{isDefault ? (*/}
      {shouldShowColorFallback ? (
        //Si no hay URL, renderizamos el View de relleno
        <View style={styles.coverFallback} />
      ) : (
        //Si hay URL, renderizamos la imagen
        <Image
          source={coverSource!}
          style={styles.coverImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.buttonsContainer}>
        <CircleIconButton {...backButtonProps} />
        <CircleIconButton {...settingsButtonProps} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: LOCAL_SIZES.HEADER_HEIGHT,
    // El color de fondo se establece dinámicamente o por defecto
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverFallback: {
    // View de relleno solo para mantener el layout si no hay imagen
    width: '100%',
    height: '100%',
  },
  buttonsContainer: {
    position: 'absolute',
    top: LOCAL_SIZES.HEADER_PADDING,
    left: LOCAL_SIZES.HEADER_PADDING,
    right: LOCAL_SIZES.HEADER_PADDING,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
});

export default HeaderProfile;