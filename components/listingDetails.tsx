import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView, ImageSourcePropType, TouchableOpacity, Alert, FlatList, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'
import { GestureHandlerRootView, TapGestureHandler, State, TapGestureHandlerStateChangeEvent } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import normalize from '@/fonts/fonts';
import { isNullOrEmpty } from '../functions/stringfunctions'
import {ProjectDetails} from '@/interfaces/IProject'
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';

interface DetailProps {
    child: ProjectDetails;
}

// import Icon from 'react-native-vector-icons/FontAwesome';
const ListingDetails: React.FC<DetailProps> = ({ child }) => {

    const afterImage = { uri: child.afterImage };
    const beforeImage = { uri: child.beforeImage };

    const [isLeftModalVisible, setLeftModalVisible] = useState(false);
    const [isRightModalVisible, setRightModalVisible] = useState(false);
    const [data, setData] = useState([]);
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});

    const images: ImageSourcePropType[] = [
        afterImage, // Place your first image in the assets folder
        beforeImage, // Place your second image in the assets folder
    ];



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

            {(child.afterImage && child.beforeImage) ? (

                <GestureHandlerRootView>
                    <View style={styles.containerImage}>
                        <TapGestureHandler onHandlerStateChange={onDoubleTap} numberOfTaps={2}>
                            <Animated.View>
                            <View style={styles.iconBackground}>                                
                            <FontAwesome name="hand-pointer-o" size={24} color="white" style={styles.doubleTapIcon} />
                            </View> 

                                <Animated.Image
                                    source={images[imageIndex]}
                                    style={[styles.image, animatedStyles]}
                                    resizeMode="cover"
                                />
                            </Animated.View>
                        </TapGestureHandler>
                    </View>
                </GestureHandlerRootView>
            ) : (
                null
            )}
             {(child.afterImage && !child.beforeImage) ? (
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
                                                    uri: child.video,
                                                    //   uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',//child.video?.toString(),
                                                    }}
                                                    useNativeControls
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
    doubleTapIcon: {
        position: 'absolute',
        top: 10,  // Adjust top and left as necessary to position the icon correctly
        left: 10,
        zIndex: 1,  // Ensure the icon is above the image
      },
      doubleTapIcon2: {
        position: 'absolute',
        top: 10,  // Adjust top and left as necessary to position the icon correctly
        left: 32,
        zIndex: 1,  // Ensure the icon is above the image
        fontWeight:'bold'
      },
      iconBackground: {
        position: 'absolute',
        top: 10, // Adjust top and left as necessary to position the icon correctly
        left: 10,
        zIndex: 1, // Ensure the icon is above the image
        backgroundColor: '#900', // Match this to the icon's color
        padding: 5,
        borderRadius: 12, // Adjust the border radius for a better look
      },
    videoContainer :{
        margin: 10,

    },
    videoStyle:{
        // width:'100%',
        height : normalize(440),
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
        margin: 10,


    },

    image: {
        width: '100%',
        height: normalize(440),
        borderRadius: 18,
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
        // width: '100%',
        // height: 200,
        alignItems: 'center'
    },

    cardDescription: {
        fontSize: 21,
        fontWeight: "500"
    },
    floatingButtonLeft: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: '#6200ea',
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    floatingButtonRight: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#6200ea',
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
});

export default ListingDetails;

