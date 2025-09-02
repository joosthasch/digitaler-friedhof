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

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert('Fehler', 'Bitte füllen Sie alle Felder aus.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Fehler', 'Die Passwörter stimmen nicht überein.');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Fehler', 'Das Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Fehler', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }

    setLoading(true);
    const result = await register(formData.email, formData.password, formData.name);
    setLoading(false);

    if (result.success) {
      Alert.alert(
        'Registrierung erfolgreich!',
        'Ihr Konto wurde erstellt. Sie sind jetzt angemeldet.',
        [{ text: 'OK', onPress: () => router.replace('/') }]
      );
    } else {
      Alert.alert('Registrierung fehlgeschlagen', result.error || 'Unbekannter Fehler');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Konto erstellen</Text>
        <Text style={styles.subtitle}>Erstellen Sie Ihr kostenloses Konto</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Vollständiger Name</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Max Mustermann"
            autoComplete="name"
            placeholderTextColor="#999"
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-Mail</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
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
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            placeholder="Mindestens 6 Zeichen"
            secureTextEntry
            autoComplete="password-new"
            placeholderTextColor="#999"
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Passwort bestätigen</Text>
          <TextInput
            style={styles.input}
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            placeholder="Passwort wiederholen"
            secureTextEntry
            autoComplete="password-new"
            placeholderTextColor="#999"
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={[styles.registerButton, loading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.registerButtonText}>Registrieren</Text>
          )}
        </TouchableOpacity>

        <View style={styles.loginSection}>
          <Text style={styles.loginText}>Bereits ein Konto?</Text>
          <Link href="/login" asChild>
            <TouchableOpacity disabled={loading}>
              <Text style={styles.loginLink}>Jetzt anmelden</Text>
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
  registerButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  loginText: {
    fontSize: 16,
    color: '#666',
    marginRight: 5,
  },
  loginLink: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
});