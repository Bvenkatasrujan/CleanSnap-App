import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  RefreshControl, TouchableOpacity, Alert,
  ActivityIndicator, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllReports, updateStatus } from '../../services/reportService';
import { logout } from '../../services/authService';
import { useLanguage } from '../../i18n/LanguageContext';
import ReportCard from '../../components/ReportCard';

const AdminDashboardScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const { t } = useLanguage();

  const STATUS_FILTERS = ['All', 'pending', 'found', 'closed'];

  useEffect(() => { loadReports(); }, []);
  useEffect(() => { applyFilter(); }, [reports, activeFilter, search]);

  const loadReports = async () => {
    try {
      const data = await getAllReports();
      setReports(data || []);
    } catch (err) {
      Alert.alert('Error', 'Failed to load reports');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilter = () => {
    let result = [...reports];
    if (activeFilter !== 'All') result = result.filter((r) => r.status === activeFilter);
    if (search) result = result.filter((r) => r.name?.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  };

  const handleStatusChange = async (reportId, status) => {
    try {
      await updateStatus(reportId, status);
      setReports((prev) => prev.map((r) => r.id === reportId ? { ...r, status } : r));
    } catch (err) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const handleLogout = () => {
    Alert.alert(t('logout'), t('logoutConfirm'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('logout'), style: 'destructive', onPress: async () => {
          await logout();
        }
      },
    ]);
  };

  const stats = {
    total:   reports.length,
    pending: reports.filter((r) => r.status === 'pending').length,
    found:   reports.filter((r) => r.status === 'found').length,
    closed:  reports.filter((r) => r.status === 'closed').length,
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16A34A" />
        <Text style={styles.loadingText}>Loading reports...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t('adminDashboard')}</Text>
          <Text style={styles.headerSub}>{t('manageReports')}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: t('total'),   value: stats.total,   color: '#2563EB', bg: '#EFF6FF' },
          { label: t('pending'), value: stats.pending, color: '#D97706', bg: '#FEF9C3' },
          { label: t('found'),   value: stats.found,   color: '#16A34A', bg: '#DCFCE7' },
          { label: t('closed'),  value: stats.closed,  color: '#94A3B8', bg: '#F1F5F9' },
        ].map((s) => (
          <View key={s.label} style={[styles.statCard, { backgroundColor: s.bg }]}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: s.color }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder={t('searchByName')}
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Pills */}
      <View style={styles.filterRow}>
        {STATUS_FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.pill, activeFilter === f && styles.pillActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.pillText, activeFilter === f && styles.pillTextActive]}>
              {f === 'All' ? 'All' : t(f)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReportCard
            report={item}
            isAdmin
            onStatusChange={handleStatusChange}
            onPress={() => navigation.navigate('AdminReportDetail', { report: item })}
          />
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
            <Ionicons name="document-text-outline" size={48} color="#D1FAE5" />
            <Text style={styles.emptyText}>{t('noReports')}</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0FDF4' },
  loadingText: { marginTop: 12, color: '#6B7280', fontSize: 14 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#FFFFFF', paddingHorizontal: 20,
    paddingTop: 54, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: '#D1FAE5',
    shadowColor: '#16A34A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#166534' },
  headerSub: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  logoutBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#FECACA',
  },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 14, gap: 8 },
  statCard: {
    flex: 1, borderRadius: 14, paddingVertical: 12, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', marginHorizontal: 16,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: '#D1FAE5', gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1F2937' },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  pill: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20, backgroundColor: '#FFF',
    borderWidth: 1, borderColor: '#D1FAE5',
  },
  pillActive: { backgroundColor: '#DCFCE7', borderColor: '#16A34A' },
  pillText: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  pillTextActive: { color: '#16A34A' },
  list: { paddingHorizontal: 16, paddingBottom: 30 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 16, color: '#9CA3AF', marginTop: 12 },
});

export default AdminDashboardScreen;