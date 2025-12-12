import { COLORS, PALLETE } from '@constants/colors';
import 'styled-components/native';

type PalleteType = typeof PALLETE;
type ColorsType = typeof COLORS;

// Extiende la interfaz DefaultTheme de styled-components/native
declare module 'styled-components/native' {
    export interface DefaultTheme extends ColorsType {
        PALLETE: PalleteType;
    }
}
