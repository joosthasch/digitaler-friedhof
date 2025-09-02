import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Memorial } from '../../types/memorial';
import { useTheme } from '../../context/ThemeContext';

interface MemorialCardProps {
  memorial: Memorial;
  showOwnership?: boolean;
}

export default function MemorialCard({ memorial, showOwnership = false }: MemorialCardProps) {
  const { colors } = useTheme();
  
  const handlePress = () => {
    router.push(`/memorial/${memorial.id}`);
  };

  const calculateAge = (birthYear: number, deathYear: number) => {
    return deathYear - birthYear;
  };

  const styles = createStyles(colors);
  const age = calculateAge(memorial.birthYear, memorial.deathYear);

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.cardContent}>
        {/* Profile Image */}
        <View style={styles.imageContainer}>
          {memorial.profileImage ? (
            <Image source={{ uri: memorial.profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImageText}>
                {memorial.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          {showOwnership && (
            <View style={styles.ownershipBadge}>
              <Ionicons name="person" size={12} color="white" />
            </View>
          )}
        </View>

        {/* Memorial Info */}
        <View style={styles.memorialInfo}>
          <Text style={styles.name}>{memorial.name}</Text>
          
          <View style={styles.dateRow}>
            <Text style={styles.dates}>
              {memorial.birthYear} - {memorial.deathYear}
            </Text>
            <Text style={styles.age}>({age} Jahre)</Text>
          </View>

          {memorial.description && (
            <Text style={styles.description} numberOfLines={2}>
              {memorial.description}
            </Text>
          )}

          <View style={styles.footer}>
            <Text style={styles.createdDate}>
              Erstellt: {memorial.createdAt.toLocaleDateString('de-DE')}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.memorial,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  ownershipBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.success,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  memorialInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dates: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  age: {
    fontSize: 12,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  createdDate: {
    fontSize: 12,
    color: colors.textTertiary,
  },
});