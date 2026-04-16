import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
  Alert, TouchableOpacity, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllReports } from '../../services/reportService';
import { supabase } from '../../config/supabase';

// ✅ Safe import — won't crash if maps not available
let MapView, Marker, PROVIDER_GOOGLE;
try {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
} catch (e) {
  console.warn('react-native-maps not available:', e);
}

const STATUS_COLORS = {
  pending: '#D97706',
  found:   '#16A34A',
  closed:  '#94A3B8',
};

const MapScreen = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    loadReports();
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      const ExpoLocation = require('expo-location');
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await ExpoLocation.getCurrentPositionAsync({});
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      }
    } catch (e) {
      console.warn('Location error:', e);
    }
  };

  const loadReports = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const data = await getAllReports();
      setReports(data || []);
    } catch (err) {
      console.error('Map load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fallback if maps not available
  if (!MapView) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Map View</Text>
        </View>
        <View style={styles.center}>
          <Ionicons name="map-outline" size={48} color="#D1FAE5" />
          <Text style={styles.errorText}>Map not available on this device</Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16A34A" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  const initialRegion = userLocation
    ? { ...userLocation, latitudeDelta: 0.05, longitudeDelta: 0.05 }
    : reports.length > 0
    ? { latitude: reports[0].latitude, longitude: reports[0].longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 }
    : { latitude: 20.5937, longitude: 78.9629, latitudeDelta: 10, longitudeDelta: 10 };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Report Map</Text>
        <Text style={styles.headerSub}>{reports.length} reports nearby</Text>
      </View>

      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onPress={() => setSelected(null)}
      >
        {reports.map((report) => (
          <Marker
            key={report.id}
            coordinate={{
              latitude: report.latitude,
              longitude: report.longitude,
            }}
            pinColor={STATUS_COLORS[report.status] || '#16A34A'}
            onPress={() => setSelected(report)}
          />
        ))}
      </MapView>

      {/* Legend */}
      <View style={styles.legend}>
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <View key={status} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendText}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </View>
        ))}
      </View>

      {/* Selected report popup */}
      {selected && (
        <View style={styles.popup}>
          <View style={styles.popupHeader}>
            <Text style={styles.popupName}>{selected.name}</Text>
            <TouchableOpacity onPress={() => setSelected(null)}>
              <Ionicons name="close-circle" size={22} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.popupMeta}>
            {selected.age} yrs • {selected.gender}
          </Text>
          <Text style={styles.popupDesc} numberOfLines={2}>
            {selected.description}
          </Text>
          <View style={[
            styles.popupStatus,
            { backgroundColor: STATUS_COLORS[selected.status] + '20',
              borderColor: STATUS_COLORS[selected.status] }
          ]}>
            <Text style={[styles.popupStatusText,
              { color: STATUS_COLORS[selected.status] }]}>
              {selected.status.toUpperCase()}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 12, color: '#6B7280', fontSize: 14 },
  errorText: { marginTop: 12, color: '#9CA3AF', fontSize: 15 },
  header: {
    backgroundColor: '#FFFFFF', paddingHorizontal: 20,
    paddingTop: 54, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: '#D1FAE5',
    shadowColor: '#16A34A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#166534' },
  headerSub: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  map: { flex: 1 },
  legend: {
    flexDirection: 'row', justifyContent: 'center',
    gap: 20, paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1, borderTopColor: '#D1FAE5',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  popup: {
    position: 'absolute', bottom: 80, left: 16, right: 16,
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#D1FAE5',
    shadowColor: '#16A34A', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 6,
  },
  popupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  popupName: { fontSize: 17, fontWeight: '700', color: '#1F2937' },
  popupMeta: { fontSize: 13, color: '#6B7280', marginBottom: 6 },
  popupDesc: { fontSize: 13, color: '#374151', lineHeight: 20, marginBottom: 8 },
  popupStatus: {
    alignSelf: 'flex-start', paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 20, borderWidth: 1,
  },
  popupStatusText: { fontSize: 11, fontWeight: '700' },
});

export default MapScreen;