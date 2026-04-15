import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  RefreshControl, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMyReports } from '../../services/reportService';
import { logout, getCurrentUser } from '../../services/authService';
import ReportCard from '../../components/ReportCard';

const MyReportsScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadReports(); }, []);

  const loadReports = async () => {
    try {
      const user = await getCurrentUser();
      const data = await getMyReports(user.id);
      setReports(data || []);
    } catch (err) {
      Alert.alert('Error', 'Failed to load your reports');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout', style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.replace('Login');
        },
      },
    ]);
  };

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === 'pending').length,
    found: reports.filter((r) => r.status === 'found').length,
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
          <Text style={styles.title}>My Reports</Text>
          <Text style={styles.subtitle}>Track your submissions</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={[styles.stat, { backgroundColor: '#EFF6FF' }]}>
          <Text style={[styles.statNum, { color: '#2563EB' }]}>{stats.total}</Text>
          <Text style={[styles.statLabel, { color: '#2563EB' }]}>Total</Text>
        </View>
        <View style={[styles.stat, { backgroundColor: '#FEF9C3' }]}>
          <Text style={[styles.statNum, { color: '#D97706' }]}>{stats.pending}</Text>
          <Text style={[styles.statLabel, { color: '#D97706' }]}>Pending</Text>
        </View>
        <View style={[styles.stat, { backgroundColor: '#DCFCE7' }]}>
          <Text style={[styles.statNum, { color: '#16A34A' }]}>{stats.found}</Text>
          <Text style={[styles.statLabel, { color: '#16A34A' }]}>Found</Text>
        </View>
      </View>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReportCard report={item} />}
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
            <Text style={styles.emptyTitle}>No reports yet</Text>
            <Text style={styles.emptyText}>Tap "New Report" below to submit your first report</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  center: {
    flex: 1, alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#F0FDF4',
  },
  loadingText: { marginTop: 12, color: '#6B7280' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#FFFFFF', paddingHorizontal: 20,
    paddingTop: 54, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: '#D1FAE5',
    shadowColor: '#16A34A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#166534' },
  subtitle: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  logoutBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#FEF2F2', alignItems: 'center',
    justifyContent: 'center', borderWidth: 1, borderColor: '#FECACA',
  },
  statsRow: { flexDirection: 'row', padding: 14, gap: 10 },
  stat: {
    flex: 1, borderRadius: 14, paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  statNum: { fontSize: 24, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  list: { padding: 16, paddingBottom: 30 },
  empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151', marginTop: 16 },
  emptyText: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginTop: 6, lineHeight: 20 },
});

export default MyReportsScreen;
