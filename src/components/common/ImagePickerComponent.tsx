import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface ImagePickerComponentProps {
  imageUri?: string;
  onImageSelected: (uri: string) => void;
  placeholder?: string;
}

export default function ImagePickerComponent({ 
  imageUri, 
  onImageSelected, 
  placeholder = "Foto hinzufügen" 
}: ImagePickerComponentProps) {
  
  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Berechtigung erforderlich',
        'Wir benötigen Zugriff auf Ihre Fotos, um ein Profilbild hinzuzufügen.'
      );
      return;
    }

    // Show action sheet for camera or library
    Alert.alert(
      'Foto auswählen',
      'Woher möchten Sie das Foto nehmen?',
      [
        { text: 'Kamera', onPress: () => openCamera() },
        { text: 'Fotogalerie', onPress: () => openImageLibrary() },
        { text: 'Abbrechen', style: 'cancel' },
      ]
    );
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Berechtigung erforderlich',
        'Wir benötigen Zugriff auf Ihre Kamera.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0].uri);
    }
  };

  const openImageLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={pickImage}>
      {imageUri ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>Ändern</Text>
          </View>
        </View>
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>📷</Text>
          <Text style={styles.placeholderText}>{placeholder}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#e0e0e0',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    paddingVertical: 8,
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  placeholderText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});