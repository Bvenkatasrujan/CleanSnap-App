import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  Image, ActivityIndicator, Platform,
} from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { getAllReports, getMyReports } from '../../services/reportService';
import { getCurrentUser } from '../../services/authService';

const STATUS_COLORS = {
  pending: '#EAB308',
  found: '#16A34A',
  closed: '#94A3B8',
};

const MapScreen = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => { loadReports(); }, [showAll]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      const data = showAll ? await getAllReports() : await getMyReports(user.id);
      setReports(data || []);
    } catch (err) {
      console.error('Map load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const initialRegion = {
    latitude: 16.9891,
    longitude: 82.2475,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#16A34A" />
        </View>
      )}

      {/* Filter toggle */}
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

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
        mapType="none"
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
          tileSize={256}
          zIndex={-1}
        />
        {reports.map((r) => (
          <Marker
            key={r.id}
            coordinate={{ latitude: r.latitude, longitude: r.longitude }}
            onPress={() => setSelected(r)}
            pinColor={STATUS_COLORS[r.status] || '#EAB308'}
          >
            <View style={[styles.markerPin, { backgroundColor: STATUS_COLORS[r.status] || '#EAB308' }]}>
              <Ionicons name="person" size={14} color="#FFF" />
            </View>
          </Marker>
        ))}
      </MapView>

      <View style={styles.attribution} pointerEvents="none">
        <Text style={styles.attributionText}>Map data © OpenStreetMap contributors</Text>
      </View>

      {/* Count badge */}
      <View style={styles.countBadge}>
        <Text style={styles.countText}>{reports.length} reports</Text>
      </View>

      {/* Detail modal */}
      <Modal visible={!!selected} transparent animationType="slide">
        <TouchableOpacity style={styles.modalBackdrop} onPress={() => setSelected(null)} activeOpacity={1}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setSelected(null)}>
              <Ionicons name="close-circle" size={28} color="#9CA3AF" />
            </TouchableOpacity>

            {selected?.image_url && (
              <Image source={{ uri: selected.image_url }} style={styles.modalImage} />
            )}

            <Text style={styles.modalName}>{selected?.name}</Text>
            <Text style={styles.modalMeta}>{selected?.age} years • {selected?.gender}</Text>

            <View style={[
              styles.statusBadge,
              { backgroundColor: STATUS_COLORS[selected?.status] + '22' }
            ]}>
              <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[selected?.status] }]} />
              <Text style={[styles.statusText, { color: STATUS_COLORS[selected?.status] }]}>
                {selected?.status?.charAt(0).toUpperCase() + selected?.status?.slice(1)}
              </Text>
            </View>

            <Text style={styles.modalDesc}>{selected?.description}</Text>

            <View style={styles.coordRow}>
              <Ionicons name="location-outline" size={14} color="#2563EB" />
              <Text style={styles.coordText}>
                {selected?.latitude?.toFixed(5)}, {selected?.longitude?.toFixed(5)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(240,253,244,0.85)',
    alignItems: 'center', justifyContent: 'center', zIndex: 10,
  },
  filterBar: {
    position: 'absolute', top: 12, alignSelf: 'center',
    flexDirection: 'row', zIndex: 5,
    backgroundColor: '#FFF', borderRadius: 24,
    padding: 4, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1,
    shadowRadius: 8, elevation: 4,
    borderWidth: 1, borderColor: '#D1FAE5',
  },
  filterBtn: {
    paddingHorizontal: 20, paddingVertical: 8,
    borderRadius: 20,
  },
  filterBtnActive: { backgroundColor: '#DCFCE7' },
  filterText: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  filterTextActive: { color: '#16A34A' },
  countBadge: {
    position: 'absolute', bottom: 24, right: 16, zIndex: 5,
    backgroundColor: '#FFFFFF', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: '#D1FAE5',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  countText: { fontSize: 13, color: '#166534', fontWeight: '700' },
  attribution: {
    position: 'absolute',
    left: 12,
    bottom: 24,
    zIndex: 5,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  attributionText: { fontSize: 10, color: '#6B7280', fontWeight: '600' },
  markerPin: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#FFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
  },
  modalBackdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFF', borderTopLeftRadius: 28,
    borderTopRightRadius: 28, padding: 24,
    paddingBottom: 40,
  },
  modalClose: { position: 'absolute', top: 16, right: 16, zIndex: 1 },
  modalImage: {
    width: 80, height: 100, borderRadius: 12,
    marginBottom: 12, alignSelf: 'center',
  },
  modalName: { fontSize: 22, fontWeight: '800', color: '#1F2937', textAlign: 'center' },
  modalMeta: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 4 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center',
    alignSelf: 'center', paddingHorizontal: 14, paddingVertical: 5,
    borderRadius: 20, marginVertical: 10,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 13, fontWeight: '700' },
  modalDesc: { fontSize: 14, color: '#374151', lineHeight: 20, marginBottom: 12 },
  coordRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  coordText: { fontSize: 12, color: '#2563EB', marginLeft: 4 },
});

export default MapScreen;
