import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VARIANTS = {
  primary: { bg: '#16A34A', text: '#FFFFFF', border: '#16A34A' },
  secondary: { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  danger: { bg: '#FEF2F2', text: '#EF4444', border: '#FECACA' },
  outline: { bg: 'transparent', text: '#16A34A', border: '#16A34A' },
};

const Button = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  fullWidth = true,
}) => {
  const colors = VARIANTS[variant] || VARIANTS.primary;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: colors.bg, borderColor: colors.border },
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} size="small" />
      ) : (
        <View style={styles.inner}>
          {icon && (
            <Ionicons name={icon} size={18} color={colors.text} style={styles.icon} />
          )}
          <Text style={[styles.text, { color: colors.text }]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.55 },
  inner: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: 8 },
  text: { fontSize: 15, fontWeight: '700', letterSpacing: 0.4 },
});

export default Button;
