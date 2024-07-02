import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView, ImageSourcePropType, TouchableOpacity, Alert, ActivityIndicator, TextInput, Button } from 'react-native';
import { AntDesign, FontAwesome, FontAwesome5, FontAwesome6 } from '@expo/vector-icons'
import { GestureHandlerRootView, TapGestureHandler, State, TapGestureHandlerStateChangeEvent } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import LikeModal from '@/components/LikeModal';
import ListingDetails from '@/components/listingDetails';
import normalize from '@/fonts/fonts'
import CheckboxList, { Item } from '@/components/test'
import SliderModal from '@/components/Slider';
import {BASE_URL} from '@/constants/Endpoints'
import { useSession } from '@/context/ctx';
import fetchWithAuth from '@/context/FetchWithAuth'
import { Project } from '@/interfaces/IProject';
import { router } from 'expo-router';




// import Icon from 'react-native-vector-icons/FontAwesome';
export default function App() {
  // const afterImage = { uri: "https://wepa.blob.core.windows.net/assets/after.jpg" };
  // const beforeImage = { uri: "https://wepa.blob.core.windows.net/assets/before.jpg" };
  const [isLeftModalVisible, setLeftModalVisible] = useState(false);
  const [isCategoriesModalVisible, setCategoriesModalVisible] = useState(false);
  const [isRadiusModalVisible, setRadiusModalVisible] = useState(false);
  const [data, setData] = useState<Project[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const { signOut, userId } = useSession();


  const images: ImageSourcePropType[] = [
    // afterImage, // Place your first image in the assets folder
    // beforeImage, // Place your second image in the assets folder
  ];

  const [imageIndex, setImageIndex] = useState<number>(0);
  const opacity = useSharedValue<number>(1);

  // const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(BASE_URL + '/api/Projects');
        const result: Project[] = await response.json();
        if (response.ok) {
          setData(result);
        } else {
          Alert.alert('Page Load Error', 'Page Load');
        }
      } catch (err) {
        setError(JSON.stringify(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);



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


  const handleSettingsClick = () =>{
    signOut();
    router.navigate("/");    
  }
  const handleLeftButtonClick = () => {
    setLeftModalVisible(true);
  };

  const handleRadiusButtonClick = () => {
    setRadiusModalVisible(!isRadiusModalVisible);
  };
  const handleCategoryButtonClick = () => {
    setCategoriesModalVisible(!isCategoriesModalVisible);
  };

  const handleSelect = (items: Item[]) => {
    setSelectedItems(items);
  };

  const toggleModal = () => {
    setRadiusModalVisible(!isRadiusModalVisible);
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>error</Text>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.header}>
          {/* Header Line 1 */}
          <View style={styles.header1}>
          <View style={[styles.buttonContainer]}>
          <TouchableOpacity  onPress={handleSettingsClick} >
            <FontAwesome6 name="gear" size={normalize(12)} />
            </TouchableOpacity>
            </View>

          <View style={[styles.buttonContainer]}>
          <TouchableOpacity  onPress={handleCategoryButtonClick} >
              <Text style={styles.button} >Categories</Text>
            </TouchableOpacity>
            </View>
            <View style={[styles.buttonContainer]}>
          <TouchableOpacity  onPress={handleRadiusButtonClick} >
              <Text style={styles.button} >Radius</Text>
            </TouchableOpacity>
            </View>
            <View style={[styles.buttonContainer]}>
          <TouchableOpacity  onPress={handleRadiusButtonClick} >
              <Text style={styles.button} >Cost</Text>
            </TouchableOpacity>
            </View>

            {/* <TouchableOpacity onPress={handleCategoryButtonClick}   >
              <FontAwesome name="filter" size={normalize(26)} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRadiusButtonClick}>
            <FontAwesome name="bullseye" size={normalize(26)} color="#000" />
          </TouchableOpacity> */}
      {/* <Button
        title="Go to Add Item"
        onPress={() => router.replace("/Projects")}
      /> */}
          </View>
<View style={styles.horizontalRule}></View>
          <View style={styles.projectTitle}>
            <Text style={styles.title}>{data[0].title}</Text>
          </View>
          {/* Header Line 2 */}
          <View style={styles.header2}>
            <View style={styles.header2heart}>
              <Text style={styles.category}><FontAwesome name="heart" size={normalize(20)} color="#FA9BCF" /> {data[0].likes}</Text>
            </View>
            <View style={styles.header2like}>
              <Text style={styles.category}><FontAwesome name="comment" size={normalize(20)} color="#000" /> {data[0].messageCount}</Text>
            </View>
            <View style={styles.dollarSpace}></View>
            <Text style={styles.category}> <FontAwesome name="dollar" size={normalize(20)} color="#000" /> {data[0].cost} </Text>
          </View>
        </View>
        {data[0].details.map((child) => (
          <ListingDetails key={child.projectDetailId} child={child} ></ListingDetails>
        ))}


        {/* <Text style={styles.description}>This is some description blah blah blah</Text>
    <View style={styles.container}>
    <View style={styles.imageContainer}>
     <Image source= {afterImage} style={styles.image} />
    </View>
    <StatusBar />
  </View> */}
      </ScrollView>



      <TouchableOpacity style={styles.floatingButtonLeft} onPress={handleLeftButtonClick}   >
      <FontAwesome6 name="heart" size={30} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.floatingButtonRight} >
        <FontAwesome name="times" size={30} color="#000" />
      </TouchableOpacity>
      <LikeModal  
        visible={isLeftModalVisible}
        onClose={() => setLeftModalVisible(false)}
        message="Left Button Clicked!"
      />
      <SliderModal visible={isRadiusModalVisible} userradius={25} onClose={()=> setRadiusModalVisible(false)} />
      <CheckboxList
        isVisible={isCategoriesModalVisible}
        onClose={handleCategoryButtonClick}
        onSelect={handleSelect}
      />      
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    margin: 25,
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  filterbar: {
    flexDirection: "row",
    backgroundColor: "#d3d3d3",
    paddingLeft: 25,
    paddingBottom: 1
  },
  radiusInput: {
    borderWidth:1,
    borderColor:'#000',
    width:60,
    marginLeft:10
  },
  header: {
    // padding: 25,
    justifyContent: 'space-evenly',
    margin: 15,
  },
  horizontalRule: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  projectTitle:{

  },
  header1: {
    flexDirection: 'row',
    justifyContent:'space-evenly'

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
    fontSize: normalize(16),
    fontWeight: '300',
  },
  category: {
    fontSize: normalize(16),
    fontWeight: '300'
  },


  title: {
    ////    fontSize: normalize(19),
    //    fontSize: moderateScale(17),
    fontSize: normalize(20),
    fontWeight: 'bold',
  },


  containerImage: {
    backgroundColor: '#000',
    borderRadius: 18,
    margin: 10,


  },

  image: {
    width: '100%',
    height: 440,
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
    borderWidth:3,
    bottom: 20,
    left: 20,
    backgroundColor: '#f0f0f0',
    borderColor:'#B87333',
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
    backgroundColor: '#f0f0f0',
    borderColor:'#B87333',    
    borderWidth:3,
    // backgroundColor: '#c456bb',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dollarSpace:{
    width:20
  },
  buttonContainer: {
    backgroundColor: '#e4eaf7',
    borderColor:'#B87333',
    borderWidth:1.5,
    borderRadius: 15, // Rounded edges
    paddingHorizontal: normalize(15),    
    paddingVertical:normalize(8),
    // alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', // Shadow for a subtle depth effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 5, // For Android shadow
    color:'#000',


  },
  button:{
    fontSize: normalize(12),
    fontWeight: 'black',
    color:'#000'
  },});





