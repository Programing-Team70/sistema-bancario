import React, {useEffect} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator.jsx';
import { useAuthStore } from './src/features/auth/store/authStore.js';
import Toast from 'react-native-toast-message';

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth(); 
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AppNavigator />
      <Toast />
    </SafeAreaProvider>
  );
}
