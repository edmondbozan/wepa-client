import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView, ImageSourcePropType, TouchableOpacity, Alert, FlatList, Image, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'
import { GestureHandlerRootView, TapGestureHandler, State, TapGestureHandlerStateChangeEvent } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import {normalize} from 'react-native-elements';
import { isNullOrEmpty } from '../functions/stringfunctions'
import {ProjectDetails, ProjectDisplayDetails} from '@/interfaces/IProject'
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import { useIsFocused } from '@react-navigation/native';

interface DetailProps {
    child: ProjectDisplayDetails;
    isVisible:boolean;
}

// const { height: screenHeight } = Dimensions.get('window');
//console.log(normalize(400));

    const ListingDetails: React.FC<DetailProps> = ({ child,isVisible }) => {

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
        // console.log(isVisible);
        if (isVisible) {
          video.current?.playAsync();
        } else {
          video.current?.pauseAsync();
        }
      }, [isVisible]);

    const [imageIndex, setImageIndex] = useState<number>(0);
    const opacity = useSharedValue<number>(1);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });


    const updateImageIndex = () => {
        setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const onDoubleTap = (event: TapGestureHandlerStateChangeEvent) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            opacity.value = withTiming(0, { duration: 500 }, () => {
                runOnJS(updateImageIndex)();
                opacity.value = withTiming(1, { duration: 500 });
            });
        }
    };


    const handleLeftButtonClick = () => {
        setLeftModalVisible(true);
    };

    const handleRightButtonClick = () => {
        setRightModalVisible(true);
    };

    
  const handlePlaybackStatusUpdate = (statusUpdate: AVPlaybackStatus) => {
    setStatus(statusUpdate);
      console.error 
      (statusUpdate);
    }
  

      
    return (
        <View>

            {(child.images?.afterImage && child.images?.beforeImage) ? (

                <GestureHandlerRootView>
                    <View style={styles.containerImage}>
                        <TapGestureHandler onHandlerStateChange={onDoubleTap} numberOfTaps={2}>
                            <Animated.View>
                            <View style={styles.iconBackground}>                                
                            <FontAwesome name="hand-pointer-o" size={24} color="black"/>
                            <Text>2X</Text>
                            </View> 

                                <Animated.Image
                                    source={images[imageIndex]}
                                    style={[styles.image, animatedStyles]}
                                      resizeMode="contain"
                                />
                            </Animated.View>
                        </TapGestureHandler>
                    </View>
                </GestureHandlerRootView>
            ) : (
                null
            )}
             {(child.images?.afterImage && !child.images.beforeImage) ? (
                 <View style={styles.containerImage}>
                    <Image source={images[imageIndex]}
                        style={styles.image}
                        resizeMode="cover"
                    ></Image>
                </View>
             )
             : (null)
            } 

             { (isNullOrEmpty(child.video)) ? null : (
                <View style={styles.videoContainer}>
                                                    <Video
                                                    ref={video}
                                                    style={styles.videoStyle}
                                                    // style={styles.video}
                                                    source={{
                                                    uri: child.video?.toString(),
                                                    //   uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',//child.video?.toString(),
                                                    }}
                                                    useNativeControls                                                   
                                                    playsInSilentLockedModeIOS={ true }
                                                    resizeMode={ResizeMode.COVER}
                                                    isLooping
                                                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                                                 />
                                                 </View>
            
            )}  


        {isNullOrEmpty(child.description) ? null : (
            <View style={styles.card}>
                {/* <FontAwesome name="quote-left" size={10} color="#000" /> */}
                <Text style={styles.cardDescription}> {child.description}</Text>
                {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum et ligula in nunc bibendum fringilla a eu lectus. Aliquam erat volutpat. Integer in gravida sem, et dictum libero. Morbi auctor malesuada mauris, non dignissim odio commodo eget. Proin dignissim, felis ut suscipit pretium, eros purus auctor odio, ac vehicula sem metus et mauris. Integer fermentum, arcu eget aliquet fermentum, eros quam gravida odio, et pulvinar lorem dui nec neque. Donec vitae sapien ut libero venenatis faucibus.</Text> */}
                {/* <FontAwesome name="quote-right" size={10} color="#000" /> */}
            </View>)}


        </View>


    );
}

const styles = StyleSheet.create({
    container: {
        margin: 25,
        flex: 1,
        backgroundColor: '#F0F0F0',
    },
      iconBackground: {
        position: 'absolute',
        top: normalize(10), // Adjust top and left as necessary to position the icon correctly
        right: normalize(10),
        zIndex: 1, // Ensure the icon is above the image
        backgroundColor: '#fff', // Match this to the icon's color
        padding: 5,
        borderRadius: 5, // Adjust the border radius for a better look
        alignItems:'center'
      },
    videoContainer :{
        margin: normalize(10),

    },
    videoStyle:{
        // width:'100%',
        height : normalize(420),
        borderRadius: 18,

    },
    header: {
        // padding: 25,
        justifyContent: 'space-evenly',
        margin: 15,
    },
    header1: {
        flexDirection: 'row',

    },
    header2: {
        paddingTop: 12,
        flexDirection: "row",
    },
    header2heart: {
        flexDirection: 'row',
        paddingRight: 20

    },
    header2like: {
        flexDirection: 'row'
    },
    location: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    category: {
        fontSize: 20,
        fontWeight: 'bold'
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
        
        // resizeMode:'contain'
    },
    card: {
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#ddd',
        overflow: 'hidden',
        backgroundColor: '#fff',
        margin: 10,
        padding: 15,
        fontWeight: 900
    },
    cardImage: {
        alignItems: 'center'
    },

    cardDescription: {
        fontSize: normalize(19),
        fontWeight: "500"
    },
});

export default ListingDetails;

