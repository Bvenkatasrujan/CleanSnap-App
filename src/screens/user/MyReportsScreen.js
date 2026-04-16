import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  RefreshControl, ActivityIndicator, Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../config/supabase';
import { getMyReports } from '../../services/reportService';
import { logout } from '../../services/authService';
import { useLanguage } from '../../i18n/LanguageContext';
import ReportCard from '../../components/ReportCard';

const MyReportsScreen = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useLanguage();

  const loadReports = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const data = await getMyReports(session.user.id);
      setReports(data || []);
    } catch (err) {
      Alert.alert('Error', 'Failed to load reports');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => { loadReports(); }, [])
  );

  // ✅ Logout handler — useAuth detects session end and redirects automatically
  const handleLogout = () => {
    Alert.alert(
      t('logout'),
      t('logoutConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('logout'),
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // ✅ No navigation needed — useAuth handles redirect to Login
            } catch (err) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16A34A" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* ✅ Header with logout button */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>{t('myReports')}</Text>
          <Text style={styles.headerSub}>
            {reports.length} {t('reportsNearby')}
          </Text>
        </View>

        {/* ✅ Logout button — clearly visible top right */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        {[
          { key: 'pending', label: t('pending'), color: '#D97706', bg: '#FEF9C3' },
          { key: 'found',   label: t('found'),   color: '#16A34A', bg: '#DCFCE7' },
          { key: 'closed',  label: t('closed'),  color: '#94A3B8', bg: '#F1F5F9' },
        ].map((s) => (
          <View key={s.key} style={[styles.statCard, { backgroundColor: s.bg }]}>
            <Text style={[styles.statValue, { color: s.color }]}>
              {reports.filter((r) => r.status === s.key).length}
            </Text>
            <Text style={[styles.statLabel, { color: s.color }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Report List */}
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReportCard report={item} isAdmin={false} />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); loadReports(); }}
            tintColor="#16A34A"
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={56} color="#D1FAE5" />
            <Text style={styles.emptyTitle}>{t('noReports')}</Text>
            <Text style={styles.emptyText}>Submit your first hygiene report</Text>

            {/* ✅ Extra logout button at bottom when no reports */}
            <TouchableOpacity
              style={styles.logoutBtnLarge}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={18} color="#EF4444" />
              <Text style={styles.logoutBtnLargeText}>{t('logout')}</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* ✅ Floating logout button at bottom — always visible */}
      <TouchableOpacity
        style={styles.floatingLogout}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        <Text style={styles.floatingLogoutText}>{t('logout')}</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  center: {
    flex: 1, alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#F0FDF4',
  },
  loadingText: { marginTop: 12, color: '#6B7280', fontSize: 14 },

  // ✅ Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D1FAE5',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  headerLeft: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#166534' },
  headerSub: { fontSize: 13, color: '#6B7280', marginTop: 2 },

  // ✅ Header logout button
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '700',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  statCard: {
    flex: 1, borderRadius: 14, paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '600', marginTop: 2 },

  // List
  list: { paddingHorizontal: 16, paddingBottom: 100, paddingTop: 8 },

  // Empty state
  empty: { alignItems: 'center', paddingTop: 80, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#9CA3AF' },
  emptyText: { fontSize: 14, color: '#9CA3AF' },

  // Empty state logout button
  logoutBtnLarge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 24, backgroundColor: '#FEF2F2',
    paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: 14, borderWidth: 1, borderColor: '#FECACA',
  },
  logoutBtnLargeText: {
    fontSize: 15, color: '#EF4444', fontWeight: '700',
  },

  // ✅ Floating logout button — always visible at bottom
  floatingLogout: {
    position: 'absolute',
    bottom: 86,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#FECACA',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  floatingLogoutText: {
    fontSize: 14, color: '#EF4444', fontWeight: '700',
  },
});

export default MyReportsScreen;