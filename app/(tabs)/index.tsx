import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import MemorialCard from '../../src/components/memorial/MemorialCard';
import { Memorial } from '../../src/types/memorial';
import { MemorialService } from '../../src/services/memorialService';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';

export default function MemorialsScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [userMemorials, setUserMemorials] = useState<Memorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showUserMemorials, setShowUserMemorials] = useState(false);

  const loadMemorials = async () => {
    try {
      const allMemorials = await MemorialService.getAllMemorials();
      setMemorials(allMemorials);

      if (user) {
        const userMems = await MemorialService.getUserMemorials(user.id);
        setUserMemorials(userMems);
      }
    } catch (error) {
      console.error('Error loading memorials:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMemorials();
    setRefreshing(false);
  };

  useEffect(() => {
    loadMemorials();
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadMemorials();
    }, [user])
  );

  useEffect(() => {
    if (!user && !loading) { // Only redirect if not loading
      router.replace('/login');
    }
  }, [user, loading]);

  if (loading) {
    const styles = createStyles(colors);
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>App wird geladen...</Text>
      </View>
    );
  }

  if (!user) {
    const styles = createStyles(colors);
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Weiterleitung zur Anmeldung...</Text>
      </View>
    );
  }

  const displayedMemorials = showUserMemorials ? userMemorials : memorials;
  const styles = createStyles(colors);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Willkommen, {user.name}! 👋</Text>
        <Text style={styles.subtitle}>
          Digitaler Friedhof für verstorbene Angehörige
        </Text>
      </View>
      
      <View style={styles.filterSection}>
        <TouchableOpacity 
          style={[styles.filterButton, !showUserMemorials && styles.activeFilter]}
          onPress={() => setShowUserMemorials(false)}
        >
          <Text style={[styles.filterText, !showUserMemorials && styles.activeFilterText]}>
            Alle Gedenkseiten ({memorials.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, showUserMemorials && styles.activeFilter]}
          onPress={() => setShowUserMemorials(true)}
        >
          <Text style={[styles.filterText, showUserMemorials && styles.activeFilterText]}>
            Meine Gedenkseiten ({userMemorials.length})
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.memorialsList}>
        <Text style={styles.sectionTitle}>
          {showUserMemorials 
            ? (userMemorials.length > 0 ? 'Meine Gedenkseiten' : 'Keine eigenen Gedenkseiten')
            : (memorials.length > 0 ? 'Alle Gedenkseiten' : 'Noch keine Gedenkseiten')
          }
        </Text>
        
        {displayedMemorials.length > 0 ? (
          displayedMemorials.map((memorial) => (
            <MemorialCard 
              key={memorial.id} 
              memorial={memorial}
              showOwnership={user?.id === memorial.createdBy}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {showUserMemorials 
                ? 'Sie haben noch keine Gedenkseiten erstellt.'
                : 'Noch keine Gedenkseiten vorhanden.'
              }
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => router.push('/(tabs)/create')}
            >
              <Text style={styles.emptyStateButtonText}>
                {showUserMemorials ? 'Erste erstellen' : 'Jetzt erstellen'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  welcomeText: {
    fontSize: 24,
    color: colors.textPrimary,
    marginBottom: 8,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  filterSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  filterButton: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeFilter: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  activeFilterText: {
    color: 'white',
  },
  memorialsList: {
    padding: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  emptyStateButton: {
    backgroundColor: colors.memorial,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyStateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});