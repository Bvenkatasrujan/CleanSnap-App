import 'react-native-url-polyfill/auto';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { registerRootComponent } from 'expo';
import AppNavigator from './src/navigation/AppNavigator';
import { LanguageProvider } from './src/i18n/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <StatusBar style="dark" backgroundColor="#F0FDF4" />
      <AppNavigator />
    </LanguageProvider>
  );
}

export default registerRootComponent(App);