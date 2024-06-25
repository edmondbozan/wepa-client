import normalize from '@/fonts/fonts';
import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';

interface CameraButtonProps {
  label: string;
  onPress: () => void;
  imageUri: string | null;
}

const CameraButton: React.FC<CameraButtonProps> = ({ label, onPress, imageUri }) => {
  return (
    <View style={styles.buttonContainer}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <TouchableOpacity onPress={onPress} style={styles.touchable}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <IconButton icon="camera" size={normalize(50)}  style={styles.iconButton} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: normalize(110),
    height: normalize(110),
    borderWidth: 2,
    borderColor: 'gray',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconButton: {
    margin: 0,
  },
  touchable: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  labelContainer: {
    position: 'absolute',
    top: normalize(5),
    left: normalize(5),
  },
  label: {
    fontSize: normalize(12),
    color: 'gray',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default CameraButton;
