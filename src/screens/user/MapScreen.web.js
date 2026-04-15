import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllReports, getMyReports } from '../../services/reportService';
import { getCurrentUser } from '../../services/authService';

const MapScreen = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadReports = async () => {
      setLoading(true);
      try {
        const user = await getCurrentUser();
        const data = showAll ? await getAllReports() : await getMyReports(user.id);
        if (mounted) {
          setReports(data || []);
        }
      } catch (error) {
        if (mounted) {
          setReports([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadReports();

    return () => {
      mounted = false;
    };
  }, [showAll]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Map View</Text>
        <Text style={styles.subtitle}>OpenStreetMap is available on mobile. Browser view shows your reports list.</Text>
      </View>

      <View style={styles.filterBar}>
        <TouchableOpacity
          style={[styles.filterBtn, !showAll && styles.filterBtnActive]}
          onPress={() => setShowAll(false)}
        >
          <Text style={[styles.filterText, !showAll && styles.filterTextActive]}>My Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, showAll && styles.filterBtnActive]}
          onPress={() => setShowAll(true)}
        >
          <Text style={[styles.filterText, showAll && styles.filterTextActive]}>All Reports</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#16A34A" />
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.dot} />
                <Text style={styles.cardTitle}>{item.name}</Text>
              </View>
              <Text style={styles.cardText}>{item.description}</Text>
              <Text style={styles.meta}>{item.latitude?.toFixed(5)}, {item.longitude?.toFixed(5)}</Text>
              {item.image_url ? (
                <TouchableOpacity onPress={() => Linking.openURL(item.image_url)}>
                  <Text style={styles.link}>Open photo</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="map-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No map preview in browser</Text>
              <Text style={styles.emptyText}>Use the mobile app to see markers on OpenStreetMap.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#D1FAE5' },
  title: { fontSize: 24, fontWeight: '800', color: '#166534' },
  subtitle: { marginTop: 4, color: '#6B7280', fontSize: 13, lineHeight: 18 },
  filterBar: { flexDirection: 'row', padding: 16, gap: 8 },
  filterBtn: { flex: 1, paddingVertical: 10, borderRadius: 18, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#D1FAE5', alignItems: 'center' },
  filterBtnActive: { backgroundColor: '#DCFCE7', borderColor: '#16A34A' },
  filterText: { color: '#6B7280', fontWeight: '600' },
  filterTextActive: { color: '#16A34A' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#D1FAE5', marginBottom: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#16A34A', marginRight: 8 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  cardText: { color: '#374151', marginBottom: 8, lineHeight: 20 },
  meta: { color: '#2563EB', fontSize: 12 },
  link: { marginTop: 8, color: '#16A34A', fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 48, paddingHorizontal: 30 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151', marginTop: 12 },
  emptyText: { fontSize: 14, color: '#6B7280', marginTop: 6, textAlign: 'center', lineHeight: 20 },
});

export default MapScreen;