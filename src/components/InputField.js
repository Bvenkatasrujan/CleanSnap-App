import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#16A34A',
  blue: '#2563EB',
  border: '#D1FAE5',
  borderFocus: '#16A34A',
  label: '#166534',
  placeholder: '#9CA3AF',
  error: '#EF4444',
  bg: '#F0FDF4',
  white: '#FFFFFF',
};

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  icon,
  multiline = false,
  numberOfLines = 1,
  editable = true,
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        focused && styles.inputFocused,
        error && styles.inputError,
        !editable && styles.inputDisabled,
      ]}>
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={focused ? COLORS.primary : COLORS.placeholder}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, multiline && styles.multiline]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          editable={editable}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={COLORS.placeholder}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.label,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  inputFocused: {
    borderColor: COLORS.borderFocus,
    shadowOpacity: 0.12,
    elevation: 3,
  },
  inputError: { borderColor: COLORS.error },
  inputDisabled: { backgroundColor: '#F9FAFB', opacity: 0.7 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#1F2937' },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  errorText: { fontSize: 12, color: COLORS.error, marginTop: 4, marginLeft: 4 },
});

export default InputField;
