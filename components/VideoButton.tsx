import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { ResizeMode, Video } from 'expo-av';

interface VideoButtonProps {
  label: string;
  onPress: () => void;
  videoUri: string | null;
}

const VideoButton: React.FC<VideoButtonProps> = ({ label, onPress, videoUri }) => {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
  return (
    <View style={styles.buttonContainer}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <TouchableOpacity onPress={onPress} style={styles.touchable}>
        {videoUri ? (
                                        <Video
                                        ref={video}
                                        style={{ width: '100%', height: '100%' }}
                                        // style={styles.video}
                                        source={{
//                                          uri: JSON.stringify(videoUri),
                                          uri: videoUri,
                                        }}
                                        useNativeControls
                                        resizeMode={ResizeMode.COVER}
                                        isLooping
                                        onPlaybackStatusUpdate={status => setStatus(() => status)}
                                      />
        ) : (
          <IconButton icon="video" size={50}  style={styles.iconButton} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: 150,
    height: 150,
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
    top: 5,
    left: 5,
  },
  label: {
    fontSize: 12,
    color: 'gray',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default VideoButton;
