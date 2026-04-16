import React from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../i18n/LanguageContext';

const LanguageScreen = ({ onClose }) => {
  const { language, setLanguage, t, LANGUAGES } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('selectLanguage')}</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#166534" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {LANGUAGES.map((lang) => {
          const isActive = language === lang.code;
          return (
            <TouchableOpacity
              key={lang.code}
              style={[styles.langItem, isActive && styles.langItemActive]}
              onPress={() => { setLanguage(lang.code); onClose?.(); }}
              activeOpacity={0.8}
            >
              <View style={styles.langInfo}>
                <Text style={[styles.langLabel, isActive && styles.langLabelActive]}>
                  {lang.label}
                </Text>
                <Text style={[styles.langNative, isActive && styles.langNativeActive]}>
                  {lang.native}
                </Text>
              </View>
              {isActive && (
                <Ionicons name="checkmark-circle" size={22} color="#16A34A" />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', backgroundColor: '#FFFFFF',
    paddingHorizontal: 20, paddingTop: 54, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: '#D1FAE5',
  },
  title: { fontSize: 20, fontWeight: '800', color: '#166534' },
  list: { padding: 16, gap: 10 },
  langItem: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', borderRadius: 14,
    padding: 16, borderWidth: 1, borderColor: '#D1FAE5',
  },
  langItemActive: {
    borderColor: '#16A34A', backgroundColor: '#F0FDF4',
  },
  langInfo: { gap: 2 },
  langLabel: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  langLabelActive: { color: '#166534' },
  langNative: { fontSize: 14, color: '#6B7280' },
  langNativeActive: { color: '#16A34A' },
});

export default LanguageScreen;