import React from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const STATUS_COLORS = {
  pending: { bg: '#FEF9C3', text: '#D97706', border: '#FDE68A' },
  found:   { bg: '#DCFCE7', text: '#16A34A', border: '#86EFAC' },
  closed:  { bg: '#F1F5F9', text: '#64748B', border: '#CBD5E1' },
};

const STATUS_ICONS = {
  pending: 'time-outline',
  found:   'checkmark-circle-outline',
  closed:  'close-circle-outline',
};

const ReportCard = ({ report, isAdmin, onStatusChange, onPress }) => {
  const sc = STATUS_COLORS[report.status] || STATUS_COLORS.pending;
  const statusIcon = STATUS_ICONS[report.status] || 'time-outline';

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  return (
    // ✅ Whole card is tappable — opens detail screen
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Top Row — Image + Info */}
      <View style={styles.topRow}>

        {/* Thumbnail */}
        {report.image_url ? (
          <Image
            source={{ uri: report.image_url }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noThumb}>
            <Ionicons name="person-outline" size={24} color="#9CA3AF" />
          </View>
        )}

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{report.name}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={13} color="#9CA3AF" />
            <Text style={styles.meta}>{report.age} yrs • {report.gender}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={13} color="#9CA3AF" />
            <Text style={styles.meta} numberOfLines={1}>
              {report.latitude?.toFixed(4)}, {report.longitude?.toFixed(4)}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={13} color="#9CA3AF" />
            <Text style={styles.meta}>{formatDate(report.created_at)}</Text>
          </View>
        </View>

        {/* Status Badge */}
        <View style={[styles.badge, { backgroundColor: sc.bg, borderColor: sc.border }]}>
          <Ionicons name={statusIcon} size={13} color={sc.text} />
          <Text style={[styles.badgeText, { color: sc.text }]}>
            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
          </Text>
        </View>
      </View>

      {/* Description preview */}
      {report.description ? (
        <Text style={styles.desc} numberOfLines={2}>{report.description}</Text>
      ) : null}

      {/* ✅ Tap hint for admin */}
      {isAdmin && (
        <View style={styles.tapHint}>
          <Ionicons name="eye-outline" size={13} color="#9CA3AF" />
          <Text style={styles.tapHintText}>Tap to view full details</Text>
          <Ionicons name="chevron-forward-outline" size={13} color="#9CA3AF" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16,
    padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: '#D1FAE5',
    shadowColor: '#16A34A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  topRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  thumbnail: {
    width: 64, height: 76, borderRadius: 10,
    borderWidth: 1, borderColor: '#D1FAE5',
  },
  noThumb: {
    width: 64, height: 76, borderRadius: 10,
    backgroundColor: '#F9FAFB', borderWidth: 1.5,
    borderColor: '#E5E7EB', borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
  },
  info: { flex: 1, gap: 4 },
  name: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta: { fontSize: 12, color: '#6B7280', flex: 1 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 20, borderWidth: 1, alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 11, fontWeight: '700' },
  desc: {
    fontSize: 13, color: '#6B7280', lineHeight: 19,
    marginTop: 10, paddingTop: 10,
    borderTopWidth: 1, borderTopColor: '#F3F4F6',
  },
  tapHint: {
    flexDirection: 'row', alignItems: 'center',
    gap: 4, marginTop: 10, paddingTop: 8,
    borderTopWidth: 1, borderTopColor: '#F3F4F6',
    justifyContent: 'center',
  },
  tapHintText: { fontSize: 12, color: '#9CA3AF', flex: 1, textAlign: 'center' },
});

export default ReportCard;