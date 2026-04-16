import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Image, TouchableOpacity, Alert, Modal,
  ActivityIndicator, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { updateStatus } from '../../services/reportService';
import { useLanguage } from '../../i18n/LanguageContext';

const STATUS_COLORS = {
  pending: { bg: '#FEF9C3', text: '#D97706', border: '#FDE68A' },
  found:   { bg: '#DCFCE7', text: '#16A34A', border: '#86EFAC' },
  closed:  { bg: '#F1F5F9', text: '#64748B', border: '#CBD5E1' },
};

const AdminReportDetailScreen = ({ route, navigation }) => {
  const { report: initialReport } = route.params;
  const [report, setReport] = useState(initialReport);
  const [updating, setUpdating] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const { t } = useLanguage();

  const STATUS_OPTIONS = ['pending', 'found', 'closed'];

  const handleStatusChange = async (newStatus) => {
    if (newStatus === report.status) return;
    Alert.alert(
      t('updateStatus'),
      `Change status to "${t(newStatus)}"?`,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: 'Update',
          onPress: async () => {
            setUpdating(true);
            try {
              await updateStatus(report.id, newStatus);
              setReport((prev) => ({ ...prev, status: newStatus }));
              Alert.alert('Updated ✅', `Status changed to ${t(newStatus)}`);
            } catch (err) {
              Alert.alert('Error', 'Failed to update status');
            } finally {
              setUpdating(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short',
      year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const statusColor = STATUS_COLORS[report.status] || STATUS_COLORS.pending;

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#166534" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t('reportDetails')}</Text>
          <Text style={styles.headerSub}>
            #{report.id.slice(0, 8).toUpperCase()}
          </Text>
        </View>
        <View style={[styles.statusBadge, {
          backgroundColor: statusColor.bg,
          borderColor: statusColor.border,
        }]}>
          <Text style={[styles.statusText, { color: statusColor.text }]}>
            {t(report.status).toUpperCase()}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Photo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📷 {t('photo')}</Text>
          {report.image_url ? (
            <TouchableOpacity
              onPress={() => setImageModal(true)}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: report.image_url }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.imageTapHint}>
                <Ionicons name="expand-outline" size={16} color="#6B7280" />
                <Text style={styles.imageTapText}>Tap to enlarge</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.noImage}>
              <Ionicons name="image-outline" size={48} color="#D1FAE5" />
              <Text style={styles.noImageText}>{t('noPhoto')}</Text>
            </View>
          )}
        </View>

        {/* Personal Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 {t('personalInfo')}</Text>
          <DetailRow icon="person-outline"
            label={t('fullName')} value={report.name} />
          <DetailRow icon="calendar-outline"
            label={t('age')} value={`${report.age} years`} />
          <DetailRow icon="male-female-outline"
            label={t('gender')} value={report.gender} />
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 {t('contactInfo')}</Text>
          <View style={styles.phoneRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="call-outline" size={18} color="#16A34A" />
            </View>
            <View style={styles.phoneInfo}>
              <Text style={styles.detailLabel}>{t('phone')}</Text>
              <Text style={styles.detailValue}>{report.phone || '—'}</Text>
            </View>
            {report.phone ? (
              <TouchableOpacity
                style={styles.callBtn}
                onPress={() => Linking.openURL(`tel:${report.phone}`)}
                activeOpacity={0.8}
              >
                <Ionicons name="call" size={16} color="#FFFFFF" />
                <Text style={styles.callBtnText}>Call</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* ✅ Address Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏠 {t('addressInfo')}</Text>
          <DetailRow
            icon="home-outline"
            label={t('houseNo')}
            value={report.house_no}
          />
          <DetailRow
            icon="business-outline"
            label={t('wardNo')}
            value={report.ward_no}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 {t('description')}</Text>
          <View style={styles.descBox}>
            <Text style={styles.descText}>{report.description}</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 {t('location')}</Text>
          <DetailRow icon="location-outline"
            label="Latitude" value={report.latitude?.toFixed(6)} />
          <DetailRow icon="location-outline"
            label="Longitude" value={report.longitude?.toFixed(6)} />
          <TouchableOpacity
            style={styles.mapBtn}
            onPress={() => {
              const url = `https://maps.google.com/?q=${report.latitude},${report.longitude}`;
              Alert.alert(t('mapView'), t('viewOnMaps'), [
                { text: t('cancel'), style: 'cancel' },
                { text: 'Open', onPress: () => Linking.openURL(url) },
              ]);
            }}
          >
            <Ionicons name="map-outline" size={18} color="#2563EB" />
            <Text style={styles.mapBtnText}>{t('viewOnMaps')}</Text>
          </TouchableOpacity>
        </View>

        {/* Report Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 {t('reportDetails')}</Text>
          <DetailRow icon="time-outline"
            label="Submitted" value={formatDate(report.created_at)} />
          <DetailRow icon="finger-print-outline"
            label="Report ID" value={report.id.slice(0, 16).toUpperCase()} />
        </View>

        {/* Update Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔄 {t('updateStatus')}</Text>
          <Text style={styles.statusHint}>
            Current:{' '}
            <Text style={{ color: statusColor.text, fontWeight: '700' }}>
              {t(report.status)}
            </Text>
          </Text>
          <View style={styles.statusRow}>
            {STATUS_OPTIONS.map((s) => {
              const sc = STATUS_COLORS[s];
              const isActive = report.status === s;
              return (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.statusBtn,
                    {
                      borderColor: sc.border,
                      backgroundColor: isActive ? sc.bg : '#F9FAFB',
                    },
                  ]}
                  onPress={() => handleStatusChange(s)}
                  disabled={updating}
                >
                  {updating && isActive ? (
                    <ActivityIndicator size="small" color={sc.text} />
                  ) : (
                    <>
                      <Ionicons
                        name={isActive ? 'checkmark-circle' : 'ellipse-outline'}
                        size={18}
                        color={isActive ? sc.text : '#9CA3AF'}
                      />
                      <Text style={[
                        styles.statusBtnText,
                        { color: isActive ? sc.text : '#6B7280' },
                      ]}>
                        {t(s)}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Full Screen Image Modal */}
      <Modal
        visible={imageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setImageModal(false)}
      >
        <View style={styles.modalBg}>
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setImageModal(false)}
          >
            <Ionicons name="close-circle" size={36} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{ uri: report.image_url }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailIcon}>
      <Ionicons name={icon} size={18} color="#16A34A" />
    </View>
    <View style={styles.detailContent}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || '—'}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', paddingHorizontal: 16,
    paddingTop: 54, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: '#D1FAE5',
    shadowColor: '#16A34A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3, gap: 12,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#F0FDF4', alignItems: 'center',
    justifyContent: 'center', borderWidth: 1, borderColor: '#D1FAE5',
  },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#166534' },
  headerSub: { fontSize: 11, color: '#9CA3AF', marginTop: 1 },
  statusBadge: {
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1,
  },
  statusText: { fontSize: 11, fontWeight: '700' },
  scroll: { padding: 16 },
  section: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
    marginBottom: 14, borderWidth: 1, borderColor: '#D1FAE5',
    shadowColor: '#16A34A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  sectionTitle: {
    fontSize: 15, fontWeight: '700',
    color: '#166534', marginBottom: 14,
  },
  image: {
    width: '100%', height: 260,
    borderRadius: 12, backgroundColor: '#F9FAFB',
  },
  imageTapHint: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6, marginTop: 8,
  },
  imageTapText: { fontSize: 12, color: '#6B7280' },
  noImage: {
    height: 140, borderRadius: 12, backgroundColor: '#F9FAFB',
    borderWidth: 1.5, borderColor: '#E5E7EB', borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  noImageText: { fontSize: 13, color: '#9CA3AF' },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  phoneInfo: { flex: 1 },
  callBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#16A34A', paddingHorizontal: 14,
    paddingVertical: 8, borderRadius: 10,
  },
  callBtnText: { fontSize: 13, color: '#FFFFFF', fontWeight: '700' },
  descBox: {
    backgroundColor: '#F9FAFB', borderRadius: 10,
    padding: 14, borderWidth: 1, borderColor: '#E5E7EB',
  },
  descText: { fontSize: 14, color: '#374151', lineHeight: 22 },
  detailRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, marginBottom: 12,
  },
  detailIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F0FDF4', alignItems: 'center',
    justifyContent: 'center', borderWidth: 1, borderColor: '#D1FAE5',
  },
  detailContent: { flex: 1 },
  detailLabel: {
    fontSize: 11, color: '#9CA3AF',
    fontWeight: '600', marginBottom: 2,
  },
  detailValue: { fontSize: 15, color: '#1F2937', fontWeight: '600' },
  mapBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 4, backgroundColor: '#EFF6FF', borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 14,
    borderWidth: 1, borderColor: '#BFDBFE', justifyContent: 'center',
  },
  mapBtnText: { fontSize: 14, color: '#2563EB', fontWeight: '600' },
  statusHint: { fontSize: 13, color: '#6B7280', marginBottom: 12 },
  statusRow: { flexDirection: 'row', gap: 10 },
  statusBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6,
    paddingVertical: 10, borderRadius: 12, borderWidth: 1.5,
  },
  statusBtnText: { fontSize: 13, fontWeight: '700' },
  modalBg: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.95)',
    alignItems: 'center', justifyContent: 'center',
  },
  modalClose: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  fullImage: { width: '100%', height: '80%' },
});

export default AdminReportDetailScreen;