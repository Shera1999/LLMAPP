import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import GalleryPicker from './components/galleryPicker';
import { uploadImage } from '../services/imageService';

const PREIDCTION_THRESHOLD = 5;// Threshold for displaying predictions

type ProbabilityClass = {
  class: string;
  probability: number;
};

type ImageResult = {
  prediction: string;
  class_probabilities: ProbabilityClass[];
};

const EvaluateScreen = () => {
  const [result, setResult] = useState<ImageResult | null>(null); 

  const handleImageSelected = async (imageUri: string) => {
    console.log('Selected Image URI:', imageUri);
    try {
      const response: ImageResult = await uploadImage(imageUri)
      console.log('API Response:', response);
      setResult(response); 

    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const windowHeight = Dimensions.get('window').height;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Gallery Picker */}
        <View style={[styles.pickerContainer, { top: windowHeight * 0.4 - 50 }]}>
          <GalleryPicker onImageSelected={handleImageSelected} />
        </View>

        {/* Results section */}
        {result && (
          <View style={styles.resultsSection}>
            {/* Display Prediction */}
            <Text style={styles.prediction}>Prediction: {result?.class_probabilities
              .filter(prob => prob.probability * 100 > PREIDCTION_THRESHOLD)
              .map(prob => prob.class)
              .join(', ') || 'No classification'}</Text>

            {/* Table with class probabilities */}
            {result.class_probabilities && (
              <View style={styles.tableWrapper}>
                <ScrollView style={styles.tableContainer} 
                            contentContainerStyle={styles.tableContent}>
                  <View style={styles.headerRow}>
                    <Text style={styles.headerCell}>Class</Text>
                    <Text style={styles.headerCell}>Probability (%)</Text>
                  </View>

                  {result.class_probabilities.map((prob, index) => (
                    <View key={index} style={styles.row}>
                      <Text style={styles.cell}>{prob.class}</Text>
                      <Text style={styles.cell}>{(prob.probability * 100).toFixed(2)}%</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  pickerContainer: {
    position: 'absolute',
    width: 100,
    height: 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  resultsSection: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  prediction: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  tableWrapper: {
    width: '100%',
    alignItems: 'center',
    maxHeight: 150, // Limit the table height
  },
  tableContainer: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 150,
  },
  tableContent: {
    flexGrow: 0, // Prevents the ScrollView from expanding
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    padding: 8,
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
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default EvaluateScreen;