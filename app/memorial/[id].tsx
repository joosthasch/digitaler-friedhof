import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Memorial } from '../../src/types/memorial';
import { MemorialService } from '../../src/services/memorialService';

export default function MemorialDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [memorial, setMemorial] = useState<Memorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    const loadMemorial = async () => {
      if (!id) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const data = await MemorialService.getMemorialById(id);
        if (data) {
          setMemorial(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error loading memorial:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadMemorial();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Gedenkseite wird geladen...</Text>
      </View>
    );
  }

  if (error || !memorial) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Gedenkseite nicht gefunden</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Zurück</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {memorial.profileImage ? (
          <Image source={{ uri: memorial.profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>📷</Text>
          </View>
        )}
        
        <Text style={styles.name}>{memorial.name}</Text>
        <Text style={styles.years}>
          {memorial.birthYear} - {memorial.deathYear}
        </Text>
        <Text style={styles.age}>
          {memorial.deathYear - memorial.birthYear} Jahre alt geworden
        </Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Über {memorial.name.split(' ')[0]}</Text>
        <Text style={styles.description}>
          {memorial.description || 'Keine Beschreibung verfügbar.'}
        </Text>
        
        <View style={styles.metadata}>
          <Text style={styles.metadataText}>
            Erstellt am: {memorial.createdAt.toLocaleDateString('de-DE')}
          </Text>
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 48,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  years: {
    fontSize: 18,
    color: '#666',
    marginBottom: 4,
  },
  age: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 30,
  },
  metadata: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 20,
  },
  metadataText: {
    fontSize: 14,
    color: '#888',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});