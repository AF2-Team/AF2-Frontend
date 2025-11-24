import { Colors } from "./Colors";

export const THEME_COLORS = Colors;

export const FONTS = {
  REGULAR: "OpenSans-Regular",
  SEMI_BOLD: "OpenSans-SemiBold",
  BOLD: "OpenSans-Bold",
  LIGHT: "OpenSans-Light",
  TITLE_SERIF: "Alegreya_400Regular_Italic",
};

export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  SCREEN_HORIZONTAL: 20,
  SCREEN_VERTICAL: 16,
  BUTTON_HEIGHT: 48,
  INPUT_HEIGHT: 48,
  HEADER_HEIGHT: 140,
  NAV_BAR_HEIGHT: 56,
  STATUS_BAR: 24,
  BOTTOM_SAFE: 16,
  KEYBOARD_MARGIN: 24,
  SECTION_MARGIN: 32,
};

export const TYPOGRAPHY = {
  HEADER: 28,
  TITLE: 20,
  SUBTITLE: 16,
  BODY: 14,
  CAPTION: 12,
  SMALL: 10,
};

export const COMMON = {
  BORDER_RADIUS: { SM: 4, MD: 8, LG: 12, XL: 24, FULL: 999 },
  SHADOWS: {
    SMALL: {
      elevation: 2,
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
    },
    MEDIUM: {
      elevation: 4,
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
  },
};

export const THEME = {
  COLORS: THEME_COLORS,
  FONTS,
  SPACING,
  TYPOGRAPHY,
  COMMON,
};
