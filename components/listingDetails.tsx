import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ImageSourcePropType, Image, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, runOnJS } from 'react-native-reanimated';
import { normalize } from 'react-native-elements';
import { isNullOrEmpty } from '../functions/stringfunctions';
import { ProjectDisplayDetails } from '@/interfaces/IProject';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';

interface DetailProps {
  child: ProjectDisplayDetails;
  isVisible: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ListingDetails: React.FC<DetailProps> = ({ child, isVisible }) => {
  const afterImage = { uri: child.images?.afterImage };
  const beforeImage = { uri: child.images?.beforeImage };

  const [isLeftModalVisible, setLeftModalVisible] = useState(false);
  const [isRightModalVisible, setRightModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const video = React.useRef<Video>(null);
  const [status, setStatus] = React.useState({});

  const images: ImageSourcePropType[] = [
    afterImage, // Place your first image in the assets folder
    beforeImage, // Place your second image in the assets folder
  ];

  useEffect(() => {
    if (isVisible) {
      video.current?.playAsync();
    } else {
      video.current?.pauseAsync();
    }
  }, [isVisible]);

  const [imageIndex, setImageIndex] = useState<number>(0);
  const [isFullImageVisible, setFullImageVisible] = useState(false); // State for full image visibility
  const scale = useSharedValue<number>(1);
  const translateX = useSharedValue<number>(0);
  const translateY = useSharedValue<number>(0);
  const opacity = useSharedValue<number>(1);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
      opacity: opacity.value,
    };
  });

  const updateImageIndex = () => {
    setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handleSingleTap = useCallback(() => {
    setFullImageVisible(true);

    // Animate to full screen
    scale.value = withTiming(1.5, { duration: 300 }); // Adjust scale to your preference
    translateX.value = withTiming(0, { duration: 300 });
    translateY.value = withTiming(0, { duration: 300 });
    opacity.value = withTiming(1, { duration: 300 });
  }, [scale, translateX, translateY, opacity]);

  const handleDoubleTap = useCallback(() => {
    opacity.value = withTiming(0, { duration: 500 }, () => {
      runOnJS(updateImageIndex)();
      opacity.value = withTiming(1, { duration: 500 });
    });
  }, [opacity]);

  const handleImageClose = useCallback(() => {
    // Reset animation
    scale.value = withTiming(1, { duration: 300 });
    translateX.value = withTiming(0, { duration: 300 });
    translateY.value = withTiming(0, { duration: 300 });
    opacity.value = withTiming(1, { duration: 300 });

    setTimeout(() => {
      setFullImageVisible(false);
    }, 300); // Delay to allow animation to finish
  }, [scale, translateX, translateY, opacity]);

  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      // Handle the single tap action
      if (!isFullImageVisible) handleSingleTap();
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      // Handle the double tap action
      handleDoubleTap();
    });

  const composedGesture = Gesture.Exclusive(doubleTapGesture, tapGesture);

  const handleLeftButtonClick = () => {
    setLeftModalVisible(true);
  };

  const handleRightButtonClick = () => {
    setRightModalVisible(true);
  };

  const handlePlaybackStatusUpdate = (statusUpdate: AVPlaybackStatus) => {
    setStatus(statusUpdate);
    console.error(statusUpdate);
  };

  return (
    <View>
      {child.images?.afterImage && child.images?.beforeImage ? (
        <GestureHandlerRootView>
          <View style={styles.containerImage}>
            <GestureDetector gesture={composedGesture}>
              <Animated.View>
                <View style={styles.iconBackground}>
                  <FontAwesome name="hand-pointer-o" size={24} color="black" />
                  <Text>2X</Text>
                </View>

                <Animated.Image
                  source={images[imageIndex]}
                  style={[styles.image, animatedStyles]}
                  resizeMode="cover"
                />
              </Animated.View>
            </GestureDetector>
          </View>
        </GestureHandlerRootView>
      ) : null}

      {child.images?.afterImage && !child.images.beforeImage ? (
        <View style={styles.containerImage}>
          <Image source={images[imageIndex]} style={styles.image} resizeMode="cover"></Image>
        </View>
      ) : null}

      {!isNullOrEmpty(child.video) ? (
        <View style={styles.videoContainer}>
          <Video
            ref={video}
            style={styles.videoStyle}
            source={{
              uri: child.video?.toString(),
            }}
            useNativeControls
            playsInSilentLockedModeIOS={true}
            resizeMode={ResizeMode.COVER}
            isLooping
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          />
        </View>
      ) : null}

      {!isNullOrEmpty(child.description) ? (
        <View style={styles.card}>
          <Text style={styles.cardDescription}> {child.description}</Text>
        </View>
      ) : null}

      {/* Full Image Display */}
      {isFullImageVisible && (
        <View style={styles.fullImageContainer}>
          <StatusBar hidden />
          <Animated.Image
            source={images[imageIndex]}
            style={[styles.fullImage]}
            resizeMode="contain"
          />
          <Text style={styles.closeText} onPress={handleImageClose}>
            Close
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 25,
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  iconBackground: {
    position: 'absolute',
    top: normalize(10),
    right: normalize(10),
    zIndex: 1,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  videoContainer: {
    margin: normalize(10),
  },
  videoStyle: {
    height: normalize(420),
    borderRadius: 18,
  },
  header: {
    justifyContent: 'space-evenly',
    margin: 15,
  },
  header1: {
    flexDirection: 'row',
  },
  header2: {
    paddingTop: 12,
    flexDirection: 'row',
  },
  header2heart: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  header2like: {
    flexDirection: 'row',
  },
  location: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  category: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  containerImage: {
    backgroundColor: '#000',
    borderRadius: 18,
    margin: normalize(10),
  },
  image: {
    width: '100%',
    height: normalize(420),
    borderRadius: 18,
    resizeMode: 'cover',
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    fontWeight: 900,
  },
  cardImage: {
    alignItems: 'center',
  },
  cardDescription: {
    fontSize: normalize(19),
    fontWeight: '500',
  },
  fullImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  fullImage: {
    width: screenWidth,
    height: screenHeight,
  },
  closeText: {
    position: 'absolute',
    top: 40,
    right: 20,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ListingDetails;
