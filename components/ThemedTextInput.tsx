import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { THEME } from "@/constants";

interface ThemedTextInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  showPasswordToggle?: boolean;
}

export const ThemedTextInput: React.FC<ThemedTextInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  error,
  showPasswordToggle = false,
  onBlur,
  ...restProps
}) => {
  const [passwordVisible, setPasswordVisible] =
    React.useState(!secureTextEntry);

  const isSecure = showPasswordToggle ? !passwordVisible : secureTextEntry;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={THEME.COLORS.textPlaceholder}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onBlur={onBlur}
          {...restProps}
        />

        {showPasswordToggle && (
          <TouchableOpacity
            style={styles.icon}
            onPress={() => setPasswordVisible(!passwordVisible)}
            accessibilityLabel={
              passwordVisible ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            <MaterialCommunityIcons
              name={passwordVisible ? "eye-off" : "eye"}
              size={24}
              color={THEME.COLORS.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: THEME.SPACING.MD,
    width: "100%",
  },
  label: {
    fontSize: THEME.TYPOGRAPHY.BODY,
    marginBottom: THEME.SPACING.SM,
    color: THEME.COLORS.text,
    fontFamily: THEME.FONTS.REGULAR,
  },
  input: {
    height: THEME.SPACING.INPUT_HEIGHT,
    borderWidth: 1,
    borderColor: THEME.COLORS.borderInput,
    paddingHorizontal: THEME.SPACING.MD,
    borderRadius: THEME.COMMON.BORDER_RADIUS.MD,
    fontSize: THEME.TYPOGRAPHY.BODY,
    color: THEME.COLORS.text,
    backgroundColor: THEME.COLORS.backgroundAlt,
    paddingRight: THEME.SPACING.XL * 2,
  },
  inputError: {
    borderColor: THEME.COLORS.error,
  },
  icon: {
    position: "absolute",
    right: THEME.SPACING.MD,
    top: (THEME.SPACING.INPUT_HEIGHT - 24) / 2,
    padding: 2,
  },
  errorText: {
    color: THEME.COLORS.error,
    fontSize: THEME.TYPOGRAPHY.SMALL,
    marginTop: THEME.SPACING.XS,
    marginLeft: THEME.SPACING.SM,
    fontFamily: THEME.FONTS.REGULAR,
  },
});
