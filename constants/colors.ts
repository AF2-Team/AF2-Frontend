export const PALLETE = {
    // Brand Colors
    darkPurple: '#423646',
    lavender: '#BCA1BD',
    vividBlue: '#1291EB',

    // Neutral Colors
    white: '#FFFFFF',
    offWhite: '#FAF7F7',
    black: '#000000',

    // Grays
    grayDark: '#4B4B4B',
    grayMedium: '#687076',
    grayLight: '#D1D5DB',
    grayPlaceholder: '#ADADAD',
    grayInputBorder: '#6F6A6F',

    // Component-specific colors
    grayTagBackground: '#E0E0E0',
    modalOverlay: 'rgba(0, 0, 0, 0.5)',
    pressedOverlay: 'rgba(255, 255, 255, 0.15)',

    // Feedback Colors
    redError: '#FF6B6B',
    successGreen: '#4CAF50',

    transparent: 'transparent',

    grayInputBackground: '#ADADAD',
    textDark: '#000000',
    modalBackground: '#FFFFFF',

    filterBarBackground: '#2B222D',
    borderMuted: '#918991',
    iconLight: '#FFFFFF',
} as const;

export const COLORS = {
    light: {
        // Textos
        text: PALLETE.darkPurple,
        textSecondary: PALLETE.grayDark,
        textMuted: PALLETE.grayMedium,
        textLight: PALLETE.white,
        textPlaceholder: PALLETE.grayPlaceholder,

        // Fondos
        background: PALLETE.white,
        backgroundAlt: PALLETE.offWhite,
        backgroundTag: PALLETE.grayTagBackground,

        // Elementos de UI
        tint: PALLETE.vividBlue,
        icon: PALLETE.grayMedium,
        iconActive: PALLETE.vividBlue,
        border: PALLETE.grayLight,
        borderInput: PALLETE.grayInputBorder,

        // Identidad
        primary: PALLETE.darkPurple,
        secondary: PALLETE.lavender,
        action: PALLETE.vividBlue,

        // Estados y feedback
        error: PALLETE.redError,
        success: PALLETE.successGreen,

        // Componentes específicos
        navIconInactive: PALLETE.grayLight,
        buttonDisabled: PALLETE.grayPlaceholder,
        modalOverlay: PALLETE.modalOverlay,
        pressedOverlay: PALLETE.pressedOverlay,
        feedBackground: PALLETE.white,
        emptyStateText: PALLETE.grayMedium,

        // Navegación
        tabIconDefault: PALLETE.grayPlaceholder,
        tabIconSelected: PALLETE.white,
        tabBarBackground: PALLETE.darkPurple,

        inputBackground: PALLETE.grayInputBackground,
        textDark: PALLETE.textDark,
        modalBackground: PALLETE.modalBackground,

        filterBarBackground: PALLETE.filterBarBackground,
        borderMuted: PALLETE.borderMuted,
        iconLight: PALLETE.iconLight,
    },
    dark: {},
} as const;
