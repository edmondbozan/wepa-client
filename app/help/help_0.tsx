import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { normalize } from 'react-native-elements';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withDelay,
  withRepeat,
} from 'react-native-reanimated';

const UserSettings: React.FC = () => {
  const textItems = [
    "a modern approach for matching home professionals and homeowners.",
    `looking for a professional or just an some inspiration?${'\n'}${'\n'}view projects by both professioanls and enthuists.`,
    "professionals* begin generating higly qualified leads. for free",
  ];

  // Create shared values for each text item to control animations
  const animations = textItems.map(() => ({
    translateY: useSharedValue(50),
    opacity: useSharedValue(0),
    offset:useSharedValue(0)
  }));

  useEffect(() => {
    // Trigger animations one by one with a delay
    animations.forEach((animation, index) => {
      const delay = index * 1500; // 500ms delay between each item

      animation.translateY.value = withDelay(
        delay,
        withTiming(0, {
          duration: 500,
          easing: Easing.out(Easing.ease),
        })
      );

      animation.opacity.value = withDelay(
        delay,
        withTiming(1, {
          duration: 500,
          easing: Easing.out(Easing.ease),
        })
      );
    });
  }, []);

  return (
      <ImageBackground
        style={{ flex: 1 }}
        source={require('../../assets/images/splash.png')}
        imageStyle={{
          opacity: 1,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{ height: '100%', justifyContent: 'flex-start', marginTop:20 }}>
          {textItems.map((text, index) => {
            const animatedStyle = useAnimatedStyle(() => ({
              transform: [{ translateX: animations[index].translateY.value }],
              opacity: animations[index].opacity.value,
              //transform: [{ translateX: animations[index].offset.value }],
            }));

            return (
              <Animated.View key={index} style={[styles.itemContainer, animatedStyle]}>
                <Text style={styles.text}>{text}</Text>
              </Animated.View>
            );
          })}
        </View>
      </ImageBackground>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderColor: '#B87333',
    borderWidth: 1,
    padding: 20,
    backgroundColor: '#fff',
    opacity: 0.9,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    margin: 20,
  },
  text: {
    fontSize: normalize(18),
    fontWeight: '400',
    color: '#333',
  },
});

export default UserSettings;
