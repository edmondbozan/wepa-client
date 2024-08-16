import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { ImageBackground } from 'expo-image';
import { normalize } from 'react-native-elements';
import { BASE_URL } from '@/constants/Endpoints';
import fetchWithAuth from '@/context/FetchWithAuth';
import { useSession } from '@/context/ctx';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withDelay,
  withRepeat,
} from 'react-native-reanimated';

interface EmptyHomeProps {
  onUnlike: () => void;
}


const EmptyHome: React.FC<EmptyHomeProps> = ({ onUnlike }) => {
  const { userId } = useSession();
  const translateX = useSharedValue(500); // Start off-screen to the right
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    translateX.value = withTiming(0, { duration: 1200 });
    opacity.value = withTiming(1, { duration: 1200 });
  }, []);




  const unlikeProjects = async () => {
    try {
      const response = await fetchWithAuth(`${BASE_URL}/api/projects/users/${userId}/unlike`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${responseText}`);
      }
      onUnlike();
    } catch (error) {
      Alert.alert('Reuest failed.  Please try again.');
    }

  }
  return (

      <ImageBackground style={{ flex: 1 }} source={require('../assets/images/backgrounds/login.jpg')} imageStyle={{ opacity: 1, height: '100%' }}>
      <Animated.View style={[styles.itemContainer, animatedStyle]}>
          <Text style={{ color: "#000", fontSize: normalize(30), fontWeight: '200', lineHeight: normalize(30) }}>
            You have viewed all projects.
            Adjust your criteria above to see more.
          </Text>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity style={styles.skippedButton} onPress={unlikeProjects}>
              <Text style={styles.skippedButtonText}>review skipped projects</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
              </ImageBackground>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderColor: '#B87333',
    borderWidth: 1,
    padding: 20,
    backgroundColor: '#fff',
    opacity:.9,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    margin: 20,
  },
  skippedButton: {
    height: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 2,
    padding: 10,
    borderColor: '#B87333'
  },
  skippedButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default EmptyHome;





