import { Stack } from 'expo-router';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { ThemeProvider } from '../src/context/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function RootLayoutContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="login" 
          options={{ 
            headerShown: true,
            title: 'Anmelden',
            headerTitleAlign: 'center',
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="register" 
          options={{ 
            headerShown: true,
            title: 'Registrieren',
            headerTitleAlign: 'center',
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="memorial/[id]" 
          options={{ 
            headerShown: true,
            title: 'Gedenkseite',
            headerTitleAlign: 'center',
          }} 
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <RootLayoutContent />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}