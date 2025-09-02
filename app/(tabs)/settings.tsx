import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = async () => {
    Alert.alert(
      'Abmelden',
      'Möchten Sie sich wirklich abmelden?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Abmelden',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            await logout();
            setLoading(false);
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Konto löschen',
      'Diese Aktion kann nicht rückgängig gemacht werden. Alle Ihre Gedenkseiten werden ebenfalls gelöscht.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Info', 'Funktion wird in einer zukünftigen Version verfügbar sein.');
          },
        },
      ]
    );
  };

  const styles = createStyles(colors);

  if (!user) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Laden...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* User Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profil</Text>
          <View style={styles.profileCard}>
            <View style={styles.profileIcon}>
              <Text style={styles.profileIconText}>
                {(user.name?.charAt(0) || '?').toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
              <Text style={styles.profileDate}>
                Mitglied seit: {new Date(user.created_at).toLocaleDateString('de-DE')}
              </Text>
            </View>
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App-Einstellungen</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={24} color={colors.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Benachrichtigungen</Text>
                <Text style={styles.settingDescription}>
                  Erhalten Sie Updates über neue Gedenkseiten
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={notificationsEnabled ? colors.surface : colors.textTertiary}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons 
                name={isDarkMode ? "moon" : "sunny"} 
                size={24} 
                color={colors.primary} 
              />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Dunkler Modus</Text>
                <Text style={styles.settingDescription}>
                  {isDarkMode ? 'Helles Design aktivieren' : 'Dunkles Design aktivieren'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={isDarkMode ? colors.surface : colors.textTertiary}
            />
          </View>
        </View>

        {/* Memorial Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gedenkseiten-Verwaltung</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="heart" size={24} color={colors.memorial} />
            <View style={styles.menuText}>
              <Text style={styles.menuLabel}>Meine Gedenkseiten</Text>
              <Text style={styles.menuDescription}>
                Alle von Ihnen erstellten Gedenkseiten verwalten
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="analytics" size={24} color={colors.info} />
            <View style={styles.menuText}>
              <Text style={styles.menuLabel}>Statistiken</Text>
              <Text style={styles.menuDescription}>
                Besucher und Interaktionen ansehen
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Support & Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Info</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle" size={24} color={colors.info} />
            <View style={styles.menuText}>
              <Text style={styles.menuLabel}>Hilfe & FAQ</Text>
              <Text style={styles.menuDescription}>
                Häufig gestellte Fragen und Unterstützung
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="shield-checkmark" size={24} color={colors.success} />
            <View style={styles.menuText}>
              <Text style={styles.menuLabel}>Datenschutz</Text>
              <Text style={styles.menuDescription}>
                Datenschutzerklärung und Nutzungsbedingungen
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="information-circle" size={24} color={colors.info} />
            <View style={styles.menuText}>
              <Text style={styles.menuLabel}>Über die App</Text>
              <Text style={styles.menuDescription}>
                Version 1.0.0 - Digitaler Friedhof
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Konto</Text>
          
          <TouchableOpacity 
            style={[styles.menuItem, styles.logoutItem]}
            onPress={handleLogout}
            disabled={loading}
          >
            <Ionicons name="log-out" size={24} color={colors.warning} />
            <View style={styles.menuText}>
              <Text style={[styles.menuLabel, { color: colors.warning }]}>Abmelden</Text>
              <Text style={styles.menuDescription}>
                Von diesem Gerät abmelden
              </Text>
            </View>
            {loading ? (
              <ActivityIndicator size="small" color={colors.warning} />
            ) : (
              <Ionicons name="chevron-forward" size={20} color={colors.warning} />
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, styles.deleteItem]}
            onPress={handleDeleteAccount}
          >
            <Ionicons name="trash" size={24} color={colors.error} />
            <View style={styles.menuText}>
              <Text style={[styles.menuLabel, { color: colors.error }]}>Konto löschen</Text>
              <Text style={styles.menuDescription}>
                Konto und alle Daten permanent löschen
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textSecondary,
  },
  content: {
    padding: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileIconText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  profileDate: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  settingItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  menuItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuText: {
    marginLeft: 12,
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  logoutItem: {
    borderColor: colors.warning,
    borderWidth: 1,
  },
  deleteItem: {
    borderColor: colors.error,
    borderWidth: 1,
  },
});