import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, Alert,
  TouchableOpacity, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { login } from '../../services/authService';
import { validateEmail } from '../../utils/validators';
import { useLanguage } from '../../i18n/LanguageContext';
import LanguageScreen from '../LanguageScreen';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showLang, setShowLang] = useState(false);

  // ✅ Language hook
  const { t } = useLanguage();

  const validate = () => {
    const e = {};
    if (!validateEmail(email)) e.email = 'Enter a valid email';
    if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      // ✅ No navigation needed — useAuth + AppNavigator handles it automatically
    } catch (err) {
      Alert.alert('Login Failed', err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >

        {/* ✅ Language picker button — top right */}
        <TouchableOpacity
          style={styles.langBtn}
          onPress={() => setShowLang(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="language-outline" size={18} color="#16A34A" />
          <Text style={styles.langBtnText}>{t('language')}</Text>
        </TouchableOpacity>

        {/* ✅ Language Modal */}
        <Modal visible={showLang} animationType="slide">
          <LanguageScreen onClose={() => setShowLang(false)} />
        </Modal>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🔍</Text>
          </View>
          <Text style={styles.appName}>CleanSnap App</Text>
          <Text style={styles.tagline}>Report and track hygiene issues</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.title}>{t('welcome')}</Text>
          <Text style={styles.subtitle}>{t('signIn')}</Text>

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

          <Button
            title={t('signIn')}
            onPress={handleLogin}
            loading={loading}
            icon="log-in-outline"
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title={t('signUp')}
            onPress={() => navigation.navigate('Register')}
            variant="secondary"
            icon="person-add-outline"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F0FDF4' },
  container: { flexGrow: 1, padding: 24, justifyContent: 'center' },

  // ✅ Language button
  langBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'flex-end', marginBottom: 12,
    backgroundColor: '#DCFCE7', paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: '#86EFAC',
  },
  langBtnText: { fontSize: 13, color: '#166534', fontWeight: '600' },

  header: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#DCFCE7', alignItems: 'center',
    justifyContent: 'center', marginBottom: 12,
    borderWidth: 2, borderColor: '#86EFAC',
    shadowColor: '#16A34A', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
  },
  logoEmoji: { fontSize: 34 },
  appName: { fontSize: 28, fontWeight: '800', color: '#166534', letterSpacing: -0.5 },
  tagline: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24,
    borderWidth: 1, borderColor: '#D1FAE5',
    shadowColor: '#16A34A', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1, shadowRadius: 16, elevation: 6,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 20 },
  divider: {
    flexDirection: 'row', alignItems: 'center', marginVertical: 16,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { marginHorizontal: 12, color: '#9CA3AF', fontSize: 13 },
});

export default LoginScreen;