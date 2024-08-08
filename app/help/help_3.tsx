import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const BlinkingButton = () => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false, // `useNativeDriver` must be false for color animations
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    );

    blinkAnimation.start();

    // Cleanup the animation on unmount
    return () => blinkAnimation.stop();
  }, [animation]);

  const interpolatedBorderColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#B87333', '#FFFFFF'], // Bronze to white
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.skippedButton, { borderColor: interpolatedBorderColor }]}>
        <Text style={styles.skippedButtonText}>Blinking Text</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
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
  },
  skippedButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BlinkingButton;
