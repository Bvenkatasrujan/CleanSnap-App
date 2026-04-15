import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

let AppNavigator = null;
let appNavigatorLoadError = null;

try {
  AppNavigator = require('./src/navigation/AppNavigator').default;
} catch (error) {
  appNavigatorLoadError = error;
  console.error('Failed to load AppNavigator on web:', error);
}

class WebErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error) {
    console.error('Web render error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Web render failed</Text>
          <Text style={styles.errorText}>{this.state.error?.message || 'Unknown error'}</Text>
          <Text style={styles.errorHelp}>Open browser console for details.</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function AppWeb() {
  if (appNavigatorLoadError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Startup module failed</Text>
        <Text style={styles.errorText}>{appNavigatorLoadError.message || 'Unknown startup error'}</Text>
        <Text style={styles.errorHelp}>A required module failed while loading. Check browser console for stack trace.</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.webBootBanner}>
        <Text style={styles.webBootText}>CleanSnap Web Booted</Text>
      </View>
      <WebErrorBoundary>
        <StatusBar style="dark" backgroundColor="#F0FDF4" />
        {AppNavigator ? <AppNavigator /> : null}
      </WebErrorBoundary>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  webBootBanner: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  webBootText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#991B1B',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#1F2937',
    textAlign: 'center',
  },
  errorHelp: {
    marginTop: 10,
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
});
