import React, { useState } from 'react';
import { Image, Alert, View, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons from expo vector icons

interface GalleryPickerProps {
  onImageSelected: (imageUri: string) => void;
}

const GalleryPicker: React.FC<GalleryPickerProps> = ({ onImageSelected }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openGallery = async () => {
    // Request permission to access the gallery
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'You need to allow access to your gallery.');
      return;
    }

    // Open gallery picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only allow images
      allowsEditing: true, // Enable editing
      quality: 1, // Best quality
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setSelectedImage(imageUri); // Update UI
      onImageSelected(imageUri); // Notify parent component
    }
  };

  return (
    <View style={styles.container}>
      {}
      <TouchableOpacity onPress={openGallery}>
        <MaterialIcons name="photo-library" size={50} color="#007AFF" /> {/* Gallery Icon */}
      </TouchableOpacity>
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    flex: 1, // Ensures the container takes up the full screen
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,  // Optional: makes the image corners rounded
  },
});

export default GalleryPicker;
