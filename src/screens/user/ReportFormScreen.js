import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../config/supabase';
import { createReport } from '../../services/reportService';
import { uploadImage } from '../../services/storageService';
import { useLocation } from '../../hooks/useLocation';
import { validateReportForm } from '../../utils/validators';
import { useLanguage } from '../../i18n/LanguageContext';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

const ReportFormScreen = () => {
  const [form, setForm] = useState({
    name: '', age: '', gender: '',
    phone: '', house_no: '', ward_no: '',
    description: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { location, loading: locLoading, error: locError, fetchLocation } = useLocation();
  const { t } = useLanguage();

  const GENDERS = [t('male'), t('female'), t('other')];
  const GENDER_VALUES = ['Male', 'Female', 'Other'];

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Needed', 'Please allow photo library access.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.7,
      });
      if (!result.canceled && result.assets?.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert('Error', 'Could not open gallery.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Needed', 'Please allow camera access.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.7,
      });
      if (!result.canceled && result.assets?.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert('Error', 'Could not open camera.');
    }
  };

  const handleSubmit = async () => {
    const validErr = validateReportForm(form);
    if (validErr) { Alert.alert('Validation Error', validErr); return; }
    if (!location) {
      Alert.alert('Location Required', 'Please fetch your current location first.');
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Not logged in. Please sign in again.');

      const user = session.user;
      let image_url = null;
      if (image) image_url = await uploadImage(image, user.id);

      await createReport({
        name: form.name,
        age: parseInt(form.age, 10),
        gender: form.gender,
        phone: form.phone,
        house_no: form.house_no,
        ward_no: form.ward_no,
        description: form.description,
        latitude: location.latitude,
        longitude: location.longitude,
        image_url,
        user_id: user.id,
        status: 'pending',
      });

      setForm({
        name: '', age: '', gender: '',
        phone: '', house_no: '', ward_no: '',
        description: '',
      });
      setImage(null);
      Alert.alert(t('reportSuccess'), t('reportSuccessMsg'));

    } catch (err) {
      console.error('Submit error:', err);
      Alert.alert('Submission Failed', err.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>

        {/* Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>{t('newReport')}</Text>
          <Text style={styles.pageSubtitle}>{t('newReportSub')}</Text>
        </View>

        {/* Photo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📷 {t('photo')}</Text>
          <View style={styles.imageRow}>
            {image ? (
              <TouchableOpacity onPress={() => setImage(null)} activeOpacity={0.8}>
                <Image source={{ uri: image }} style={styles.imagePreview} />
                <View style={styles.removeOverlay}>
                  <Ionicons name="close-circle" size={26} color="#EF4444" />
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={40} color="#9CA3AF" />
                <Text style={styles.imagePlaceholderText}>{t('noPhoto')}</Text>
              </View>
            )}
            <View style={styles.imageBtns}>
              <TouchableOpacity
                style={styles.imageBtn}
                onPress={pickImage}
                activeOpacity={0.8}
              >
                <Ionicons name="images-outline" size={20} color="#2563EB" />
                <Text style={styles.imageBtnText}>{t('gallery')}</Text>
              </TouchableOpacity>
              <View style={{ height: 10 }} />
              <TouchableOpacity
                style={[styles.imageBtn, styles.imageBtnOutline]}
                onPress={takePhoto}
                activeOpacity={0.8}
              >
                <Ionicons name="camera-outline" size={20} color="#16A34A" />
                <Text style={[styles.imageBtnText, { color: '#16A34A' }]}>
                  {t('camera')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Personal Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 {t('personalInfo')}</Text>
          <InputField
            label={t('fullName')}
            value={form.name}
            onChangeText={set('name')}
            placeholder={t('fullName')}
            icon="person-outline"
            autoCapitalize="words"
            error={errors.name}
          />
          <InputField
            label={t('age')}
            value={form.age}
            onChangeText={set('age')}
            placeholder={t('age')}
            icon="calendar-outline"
            keyboardType="numeric"
            error={errors.age}
          />
          <Text style={styles.label}>{t('gender')}</Text>
          <View style={styles.genderRow}>
            {GENDERS.map((g, index) => (
              <TouchableOpacity
                key={g}
                style={[
                  styles.genderBtn,
                  form.gender === GENDER_VALUES[index] && styles.genderBtnActive,
                ]}
                onPress={() => set('gender')(GENDER_VALUES[index])}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.genderText,
                  form.gender === GENDER_VALUES[index] && styles.genderTextActive,
                ]}>
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 {t('contactInfo')}</Text>
          <InputField
            label={t('phone')}
            value={form.phone}
            onChangeText={set('phone')}
            placeholder={t('phonePlaceholder')}
            icon="call-outline"
            keyboardType="phone-pad"
            maxLength={10}
            error={errors.phone}
          />
        </View>

        {/* ✅ Address Info — House No + Ward No */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏠 {t('addressInfo')}</Text>
          <InputField
            label={t('houseNo')}
            value={form.house_no}
            onChangeText={set('house_no')}
            placeholder={t('houseNoPlaceholder')}
            icon="home-outline"
            autoCapitalize="characters"
            error={errors.house_no}
          />
          <InputField
            label={t('wardNo')}
            value={form.ward_no}
            onChangeText={set('ward_no')}
            placeholder={t('wardNoPlaceholder')}
            icon="business-outline"
            keyboardType="default"
            error={errors.ward_no}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 {t('description')}</Text>
          <InputField
            label={t('description')}
            value={form.description}
            onChangeText={set('description')}
            placeholder={t('descriptionPlaceholder')}
            multiline
            numberOfLines={5}
            icon="document-text-outline"
          />
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 {t('location')}</Text>
          {location ? (
            <View style={styles.locationCard}>
              <Ionicons name="location" size={20} color="#16A34A" />
              <Text style={styles.locationText}>
                {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
              </Text>
              <TouchableOpacity onPress={fetchLocation}>
                <Ionicons name="refresh" size={18} color="#2563EB" />
              </TouchableOpacity>
            </View>
          ) : (
            <Button
              title={locLoading ? t('fetchingLocation') : t('getLocation')}
              onPress={fetchLocation}
              loading={locLoading}
              variant="secondary"
              icon="locate-outline"
            />
          )}
          {locError ? <Text style={styles.locError}>⚠️ {locError}</Text> : null}
        </View>

        {/* Submit */}
        <Button
          title={t('submitReport')}
          onPress={handleSubmit}
          loading={loading}
          icon="send-outline"
        />
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F0FDF4' },
  scroll: { flex: 1 },
  container: { padding: 20 },
  pageHeader: { marginBottom: 20 },
  pageTitle: { fontSize: 26, fontWeight: '800', color: '#166534' },
  pageSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  section: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
    marginBottom: 16, borderWidth: 1, borderColor: '#D1FAE5',
    shadowColor: '#16A34A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  sectionTitle: {
    fontSize: 15, fontWeight: '700',
    color: '#166534', marginBottom: 12,
  },
  imageRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  imagePreview: {
    width: 90, height: 110, borderRadius: 12,
    borderWidth: 1, borderColor: '#D1FAE5',
  },
  removeOverlay: { position: 'absolute', top: -10, right: -10 },
  imagePlaceholder: {
    width: 90, height: 110, borderRadius: 12,
    backgroundColor: '#F9FAFB', borderWidth: 1.5,
    borderColor: '#E5E7EB', borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  imagePlaceholderText: { fontSize: 11, color: '#9CA3AF' },
  imageBtns: { flex: 1 },
  imageBtn: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#EFF6FF',
    borderRadius: 10, paddingVertical: 10,
    paddingHorizontal: 14, borderWidth: 1,
    borderColor: '#BFDBFE', gap: 6,
  },
  imageBtnOutline: { backgroundColor: '#F0FDF4', borderColor: '#86EFAC' },
  imageBtnText: { fontSize: 14, fontWeight: '600', color: '#2563EB' },
  label: {
    fontSize: 13, fontWeight: '600',
    color: '#166534', marginBottom: 8, marginTop: 4,
  },
  genderRow: { flexDirection: 'row', gap: 10 },
  genderBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#D1FAE5',
    alignItems: 'center', backgroundColor: '#F9FAFB',
  },
  genderBtnActive: { borderColor: '#16A34A', backgroundColor: '#DCFCE7' },
  genderText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  genderTextActive: { color: '#16A34A', fontWeight: '700' },
  locationCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F0FDF4', borderRadius: 10,
    padding: 12, borderWidth: 1, borderColor: '#D1FAE5', gap: 8,
  },
  locationText: { flex: 1, fontSize: 13, color: '#166534', fontWeight: '600' },
  locError: { fontSize: 12, color: '#EF4444', marginTop: 6 },
});

export default ReportFormScreen;