const palette = {
  // Brand Colors
  darkPurple: "#423646",
  lavender: "#BCA1BD",
  vividBlue: "#1291EB",

  // Neutral Colors
  white: "#FFFFFF",
  offWhite: "#FAF7F7",
  black: "#000000",

  // Grays
  grayDark: "#4B4B4B",
  grayMedium: "#687076",
  grayLight: "#D1D5DB",
  grayPlaceholder: "#ADADAD",
  grayInputBorder: "#6F6A6F",

  // Component-specific colors
  grayTagBackground: "#E0E0E0",
  modalOverlay: "rgba(0, 0, 0, 0.5)",
  pressedOverlay: "rgba(255, 255, 255, 0.15)",

  // Feedback Colors
  redError: "#FF6B6B",
  successGreen: "#4CAF50",

  transparent: "transparent",
};

// ESTRUCTURA PLANA - SOLO MODO CLARO
export const Colors = {
  // Textos
  text: palette.darkPurple,
  textSecondary: palette.grayDark,
  textMuted: palette.grayMedium,
  textLight: palette.white,
  textPlaceholder: palette.grayPlaceholder,

  // Fondos
  background: palette.white,
  backgroundAlt: palette.offWhite,
  backgroundTag: palette.grayTagBackground,

  // Elementos de UI
  tint: palette.vividBlue,
  icon: palette.grayMedium,
  iconActive: palette.vividBlue,
  border: palette.grayLight,
  borderInput: palette.grayInputBorder,

  // Identidad
  primary: palette.darkPurple,
  secondary: palette.lavender,
  action: palette.vividBlue,

  // Estados y feedback
  error: palette.redError,
  success: palette.successGreen,

  // Componentes específicos
  navIconInactive: palette.grayLight,
  buttonDisabled: palette.grayPlaceholder,
  modalOverlay: palette.modalOverlay,
  pressedOverlay: palette.pressedOverlay,

  // Navegación
  tabIconDefault: palette.grayPlaceholder,
  tabIconSelected: palette.white,
  tabBarBackground: palette.darkPurple,
};

export const COLORS = Colors;
