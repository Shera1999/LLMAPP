import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GalleryPicker from './components/galleryPicker';
import { uploadImage } from '../services/imageService';

type ImageResult = {
  prediction: string;
  probabilities: number[];
};

const EvaluateScreen = () => {
  const [result, setResult] = useState<ImageResult | null>(null); // Initialize state to hold a single result

  const handleImageSelected = async (imageUri: string) => {
    console.log('Selected Image URI:', imageUri);
    const response: ImageResult = await uploadImage(imageUri); // Assuming this function returns the result
    console.log('API Response:', response);
    setResult(response); // Set the single result to state
  };

  return (
    <View style={styles.container}>
      <GalleryPicker onImageSelected={handleImageSelected} />

      {/* Render result in a table-like format if result is available */}
      {result && (
        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>Prediction</Text>
            <Text style={styles.headerCell}>Probabilities</Text>
          </View>

          {/* Render a single row for the result */}
          <View style={styles.row}>
            <Text style={styles.cell}>{result.prediction}</Text>
            <Text style={styles.cell}>
              {result.probabilities
                .map((prob) => prob.toFixed(3)) // Format probabilities to 3 decimal places
                .join(', ')}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  table: {
    marginTop: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default EvaluateScreen;
