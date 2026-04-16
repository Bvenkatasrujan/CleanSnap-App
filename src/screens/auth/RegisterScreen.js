import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { register } from '../../services/authService';
import { validateEmail, validatePassword } from '../../utils/validators';
import { useLanguage } from '../../i18n/LanguageContext';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { t } = useLanguage();

  const validate = () => {
    const e = {};
    if (!validateEmail(email)) e.email = 'Enter a valid email';
    const pwErr = validatePassword(password);
    if (pwErr) e.password = pwErr;
    if (password !== confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(email, password);
      Alert.alert(
        'Account Created! 🎉',
        'Your account has been created. Please sign in.',
        [{ text: t('signIn'), onPress: () => navigation.navigate('Login') }]
      );
    } catch (err) {
      Alert.alert('Registration Failed', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>👤</Text>
          </View>
          <Text style={styles.appName}>{t('signUp')}</Text>
          <Text style={styles.tagline}>Join CleanSnap App to report hygiene issues</Text>
        </View>

        <View style={styles.card}>
          <InputField
            label={t('email')}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            icon="mail-outline"
            error={errors.email}
          />
          <InputField
            label={t('password')}
            value={password}
            onChangeText={setPassword}
            placeholder="Min 6 characters"
            secureTextEntry
            icon="lock-closed-outline"
            error={errors.password}
          />
          <InputField
            label={t('confirmPassword')}
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Re-enter your password"
            secureTextEntry
            icon="shield-checkmark-outline"
            error={errors.confirm}
          />
          <Button
            title={t('signUp')}
            onPress={handleRegister}
            loading={loading}
            icon="person-add-outline"
          />
          <Button
            title={t('alreadyAccount')}
            onPress={() => navigation.goBack()}
            variant="outline"
          />
        </View>

        <View style={styles.note}>
          <Text style={styles.noteText}>
            🔒 Your data is secure and protected by Supabase RLS policies.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F0FDF4' },
  container: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 28 },
  logoCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#EFF6FF', alignItems: 'center',
    justifyContent: 'center', marginBottom: 10,
    borderWidth: 2, borderColor: '#BFDBFE',
  },
  logoEmoji: { fontSize: 30 },
  appName: { fontSize: 24, fontWeight: '800', color: '#1E3A5F', letterSpacing: -0.5 },
  tagline: { fontSize: 13, color: '#6B7280', marginTop: 4, textAlign: 'center' },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24,
    borderWidth: 1, borderColor: '#BFDBFE',
    shadowColor: '#2563EB', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 5, gap: 4,
  },
  note: { marginTop: 20, alignItems: 'center' },
  noteText: { fontSize: 12, color: '#6B7280', textAlign: 'center', lineHeight: 18 },
});

export default RegisterScreen;