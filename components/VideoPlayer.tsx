import React, { useEffect, useRef, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { Video, AVPlaybackStatus, ResizeMode } from 'expo-av';

const { height } = Dimensions.get('window');

const VideoPlayer = ({ uri, isFocused, scrollY }: { uri: string; isFocused: boolean; scrollY: number }) => {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus>({});
  const [layoutY, setLayoutY] = useState(0);
  const [isInView, setIsInView] = useState(false);

  const handleLayout = (event) => {
    const { y } = event.nativeEvent.layout;
    setLayoutY(y);
  };

  useEffect(() => {
    const videoTop = layoutY;
    const videoBottom = videoTop + 200; // Assuming the video height is 200
    const isVisible = videoTop < scrollY + height && videoBottom > scrollY;
    setIsInView(isVisible);
  }, [scrollY, layoutY]);

  useEffect(() => {
    if (isFocused && isInView) {
      videoRef.current?.playAsync();
    } else {
      videoRef.current?.pauseAsync();
    }
  }, [isFocused, isInView]);

  return (
    <View onLayout={handleLayout}>
      <Video
        ref={videoRef}
        style={{ width: '100%', height: 200 }}
        source={{ uri }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        onPlaybackStatusUpdate={(status) => setStatus(status)}
      />
    </View>
  );
};

export default VideoPlayer;
