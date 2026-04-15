import 'react-native-url-polyfill/auto';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { registerRootComponent } from 'expo';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
  return (
    <>
      <StatusBar style="dark" backgroundColor="#F0FDF4" />
      <AppNavigator />
    </>
  );
}

export default registerRootComponent(App);