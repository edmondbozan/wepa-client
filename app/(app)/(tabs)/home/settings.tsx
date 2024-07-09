import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GlobalStyles from '@/styles/styles';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    // Handle login logic here
  };

  const handleSignUp = () => {
//    navigation.navigate('SignUp'); // Navigate to the Sign Up screen
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground source={require('../../../../assets/images/background.jpg')} style={styles.background} imageStyle={{ opacity: 0.3 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>SIGN IN</Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpText}>Sign Up →</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#FFF"
            style={styles.input}
          />
          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#FFF"
            secureTextEntry
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>           
            <Text style={styles.buttonText}>SIGN IN</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adds a dark overlay to the container
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  headerText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  signUpText: {
    color: '#FFF',
    fontSize: 16,
  },
  label: {
    color: '#FFF',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    height: 50,
    borderColor: '#FFF',    
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#FFF',
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // White background with transparency
    borderRadius: 5,
  },
  button: {
    height: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
    borderWidth:2,
    borderColor:'#B87333'
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;



// import React, { useRef, useState, useEffect } from 'react';
// import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
// import { Video, ResizeMode } from 'expo-av';
// import { useIsFocused } from '@react-navigation/native';

// const { width, height } = Dimensions.get('window');

// interface ProjectDetails {
//   id: string;
//   video: string;
//   description?: string;
// }

// const DATA: ProjectDetails[] = [
//   { id: '1', video: 'https://www.w3schools.com/html/mov_bbb.mp4', description: 'Video 1' },
//   { id: '2', video: 'https://www.w3schools.com/html/mov_bbb.mp4', description: 'Video 2' },
//   { id: '3', video: 'https://www.w3schools.com/html/mov_bbb.mp4', description: 'Video 3' },
// ];

// const VideoItem = ({ item, isVisible }: { item: ProjectDetails; isVisible: boolean }) => {
//   const videoRef = useRef<Video>(null);
//   const [status, setStatus] = useState({});

//   useEffect(() => {
//     if (isVisible) {
//       videoRef.current?.playAsync();
//     } else {
//       videoRef.current?.pauseAsync();
//     }
//   }, [isVisible]);

//   return (
//     <View style={styles.videoContainer}>
//       <Video
//         ref={videoRef}
//         style={styles.video}
//         source={{ uri: item.video }}
//         useNativeControls
//         resizeMode={ResizeMode.COVER}
//         isLooping
//         onPlaybackStatusUpdate={status => setStatus(() => status)}
//       />
//       <Text style={styles.description}>{item.description}</Text>
//     </View>
//   );
// };

// const VideoList = () => {
//   const isFocused = useIsFocused();
//   const [visibleItems, setVisibleItems] = useState([]);

//   const onViewableItemsChanged = ({ viewableItems }) => {
//     setVisibleItems(viewableItems.map(item => item.key));
//   };

//   const viewabilityConfig = {
//     itemVisiblePercentThreshold: 50,
//   };

//   const renderItem = ({ item }) => (
//     <VideoItem item={item} isVisible={isFocused && visibleItems.includes(item.id)} />
//   );

//   return (
//     <FlatList
//       data={DATA}
//       renderItem={renderItem}
//       keyExtractor={item => item.id}
//       onViewableItemsChanged={onViewableItemsChanged}
//       viewabilityConfig={viewabilityConfig}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   videoContainer: {
//     height: 300,
//     marginVertical: 350,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   video: {
//     width: width * 0.9,
//     height: 200,
//   },
//   description: {
//     marginTop: 10,
//     fontSize: 16,
//   },
// });

// export default VideoList;
