import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ReportFormScreen from '../screens/user/ReportFormScreen';
import MapScreen from '../screens/user/MapScreen';
import MyReportsScreen from '../screens/user/MyReportsScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminReportDetailScreen from '../screens/admin/AdminReportDetailScreen';
import { useAuth } from '../hooks/useAuth';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  'New Report': { active: 'add-circle',   inactive: 'add-circle-outline' },
  'My Reports': { active: 'list',         inactive: 'list-outline'       },
  'Map':        { active: 'map',          inactive: 'map-outline'        },
};

const UserTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopColor: '#D1FAE5',
        borderTopWidth: 1.5,
        paddingBottom: 10,
        paddingTop: 6,
        height: 68,
      },
      tabBarActiveTintColor: '#16A34A',
      tabBarInactiveTintColor: '#9CA3AF',
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
      tabBarIcon: ({ color, size, focused }) => {
        const icons = TAB_ICONS[route.name];
        return <Ionicons name={focused ? icons.active : icons.inactive} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="New Report" component={ReportFormScreen} options={{ tabBarLabel: 'Report' }} />
    <Tab.Screen name="My Reports" component={MyReportsScreen} options={{ tabBarLabel: 'My Reports' }} />
    <Tab.Screen name="Map"        component={MapScreen}        options={{ tabBarLabel: 'Map' }} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.splash}>
        <View style={styles.splashLogo}>
          <Ionicons name="search" size={36} color="#16A34A" />
        </View>
        <ActivityIndicator size="large" color="#16A34A" style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {!user ? (
          <>
            <Stack.Screen name="Login"    component={LoginScreen}    />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : role === 'admin' ? (
          <>
            {/* ✅ Both admin screens in the stack */}
            <Stack.Screen name="AdminDashboard"    component={AdminDashboardScreen}    />
            <Stack.Screen name="AdminReportDetail" component={AdminReportDetailScreen} />
          </>
        ) : (
          <Stack.Screen name="UserTabs" component={UserTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splash: {
    flex: 1, backgroundColor: '#F0FDF4',
    alignItems: 'center', justifyContent: 'center',
  },
  splashLogo: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#86EFAC',
    shadowColor: '#16A34A', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 6,
  },
});

export default AppNavigator;