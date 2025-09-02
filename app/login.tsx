import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Fehler', 'Bitte füllen Sie alle Felder aus.');
      return;
    }

    console.log('Attempting login with:', email);
    setLoading(true);
    
    try {
      const result = await login(email, password);
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Login successful, navigating to home');
        router.replace('/');
      } else {
        console.log('Login failed:', result.error);
        Alert.alert('Anmeldung fehlgeschlagen', result.error || 'Unbekannter Fehler');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Fehler', 'Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Willkommen zurück</Text>
        <Text style={styles.subtitle}>Melden Sie sich an, um fortzufahren</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-Mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="ihre@email.de"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholderTextColor="#999"
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Passwort</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Ihr Passwort"
            secureTextEntry
            autoComplete="password"
            placeholderTextColor="#999"
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginButtonText}>Anmelden</Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerSection}>
          <Text style={styles.registerText}>Noch kein Konto?</Text>
          <Link href="/register" asChild>
            <TouchableOpacity disabled={loading}>
              <Text style={styles.registerLink}>Jetzt registrieren</Text>
            </TouchableOpacity>
          </Link>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  registerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  registerText: {
    fontSize: 16,
    color: '#666',
    marginRight: 5,
  },
  registerLink: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
  debugSection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e8f4f8',
    borderRadius: 5,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});