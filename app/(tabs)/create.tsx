import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { router } from 'expo-router';
import { MemorialService } from '../../src/services/memorialService';
import ImagePickerComponent from '../../src/components/common/ImagePickerComponent';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext'; // Add this import

export default function CreateMemorialScreen() {
  const { user } = useAuth();
  const { colors } = useTheme(); // Add this line
  const [formData, setFormData] = useState({
    name: '',
    birthYear: '',
    deathYear: '',
    description: '',
  });
  const [selectedImageUri, setSelectedImageUri] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!user) {
      router.replace('/login');
      return;
    }

    // Basic validation
    if (!formData.name || !formData.birthYear || !formData.deathYear) {
      Alert.alert('Fehler', 'Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    const birthYear = parseInt(formData.birthYear);
    const deathYear = parseInt(formData.deathYear);

    if (birthYear >= deathYear) {
      Alert.alert('Fehler', 'Das Geburtsjahr muss vor dem Sterbejahr liegen.');
      return;
    }

    if (birthYear < 1800 || deathYear > new Date().getFullYear()) {
      Alert.alert('Fehler', 'Bitte überprüfen Sie die Jahreszahlen.');
      return;
    }

    setLoading(true);

    try {
      let profileImageUrl: string | undefined;

      // Upload image if selected
      if (selectedImageUri) {
        const fileName = `memorial_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
        profileImageUrl = await MemorialService.uploadImage(selectedImageUri, fileName) || undefined;
        
        if (!profileImageUrl) {
          Alert.alert('Warnung', 'Das Bild konnte nicht hochgeladen werden, aber die Gedenkseite wird trotzdem erstellt.');
        }
      }

      await MemorialService.createMemorial({
        name: formData.name,
        birthYear: birthYear,
        deathYear: deathYear,
        description: formData.description,
        profileImage: profileImageUrl,
      }, user.id);

      // Reset form
      setFormData({
        name: '',
        birthYear: '',
        deathYear: '',
        description: '',
      });
      setSelectedImageUri(undefined);

      Alert.alert(
        'Erfolgreich!', 
        'Die Gedenkseite wurde erstellt.',
        [{ text: 'OK', onPress: () => router.push('/') }]
      );
    } catch (error) {
      Alert.alert(
        'Fehler', 
        'Die Gedenkseite konnte nicht erstellt werden. Bitte versuchen Sie es erneut.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loading if not authenticated
  if (!user) {
    const styles = createStyles(colors); // Move styles creation here for loading screen
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Weiterleitung zur Anmeldung...</Text>
      </View>
    );
  }

  const styles = createStyles(colors); // Create styles with theme colors

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Neue Gedenkseite erstellen</Text>
        <Text style={styles.subtitle}>
          Erstellen Sie eine liebevolle Erinnerung für einen geliebten Menschen
        </Text>
        
        <ImagePickerComponent
          imageUri={selectedImageUri}
          onImageSelected={setSelectedImageUri}
          placeholder="Profilbild hinzufügen"
        />
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Vollständiger Name"
            placeholderTextColor={colors.textPlaceholder}
            editable={!loading}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Geburtsjahr *</Text>
            <TextInput
              style={styles.input}
              value={formData.birthYear}
              onChangeText={(text) => setFormData({ ...formData, birthYear: text })}
              placeholder="z.B. 1945"
              keyboardType="numeric"
              placeholderTextColor={colors.textPlaceholder}
              editable={!loading}
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Sterbejahr *</Text>
            <TextInput
              style={styles.input}
              value={formData.deathYear}
              onChangeText={(text) => setFormData({ ...formData, deathYear: text })}
              placeholder="z.B. 2024"
              keyboardType="numeric"
              placeholderTextColor={colors.textPlaceholder}
              editable={!loading}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Beschreibung</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Erzählen Sie uns von dieser besonderen Person..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor={colors.textPlaceholder}
            editable={!loading}
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.disabledButton]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Gedenkseite erstellen</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Convert to function that takes colors parameter
const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Use theme color
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textSecondary, // Use theme color
  },
  form: {
    padding: 20,
    paddingBottom: 100, // Extra space for tab bar
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary, // Use theme color
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary, // Use theme color
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary, // Use theme color
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface, // Use theme color
    borderWidth: 1,
    borderColor: colors.border, // Use theme color
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.textPrimary, // Use theme color
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  submitButton: {
    backgroundColor: colors.primary, // Use theme color
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: colors.textTertiary, // Use theme color
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});