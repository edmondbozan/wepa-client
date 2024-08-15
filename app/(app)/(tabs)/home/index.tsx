import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView, ImageSourcePropType, TouchableOpacity, Alert, ActivityIndicator, TextInput, Button, FlatList, ImageBackground, Platform, Pressable } from 'react-native';
import { AntDesign, FontAwesome, FontAwesome5, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons'
import { GestureHandlerRootView, TapGestureHandler, State, TapGestureHandlerStateChangeEvent } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import LikeModal from '@/components/LikeModal';
import ListingDetails from '@/components/listingDetails';
import {normalize} from 'react-native-elements'
import CheckboxList, { Item } from '@/components/test'
import SliderModal from '@/components/Slider';
import { BASE_URL } from '@/constants/Endpoints'
import { useSession } from '@/context/ctx';
import fetchWithAuth from '@/context/FetchWithAuth'
import { Project } from '@/interfaces/IProject';
import { router } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import MessagesModal from '@/components/Messages';
import EmptyHome from '@/components/EmptyHome';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import BlockModal from '@/components/BlockModal';
import { Checkbox } from 'react-native-paper';


interface QueryParams {
  categoryIds: number[];
}

// import Icon from 'react-native-vector-icons/FontAwesome';
export default function App() {
  // const [scrollY, setScrollY] = useState(0);
  const [isLeftModalVisible, setLeftModalVisible] = useState(false);
  const [isCategoriesModalVisible, setCategoriesModalVisible] = useState(false);
  const [isRadiusModalVisible, setRadiusModalVisible] = useState(false);
  const [isBudgetModalVisible, setBudgetModalVisible] = useState(false);
  const [data, setData] = useState<Project[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const { signOut, userId } = useSession();
  const flatListRef = React.useRef<FlatList>(null)
  const [visibleItems, setVisibleItems] = useState([]);
  const isFocused = useIsFocused();
  const [radius, setRadius] = useState<number>(4000);
  const [budget, setBudget] = useState<number>(250000);
  const [bind, setBind] = useState<boolean>(false);
  const [modalMessageVisible, setModalMessageVisible] = useState(false);
  const [modalBlockVisible, setModalBlockVisible] = useState(false);
  const opacity = useSharedValue<number>(1);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();



  const buildQueryString = (params: { [key: string]: any }): string => {
    return Object.keys(params)
      .map(key => {
        const value = params[key];
        if (Array.isArray(value)) {
          return value.map(val => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('&');
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join('&');
  };





  function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
  }
  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
//        handleRegistrationError('Permission not granted to get push token for push notification!');
        return;
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        handleRegistrationError('Project ID not found');
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        return pushTokenString;
      } catch (e: unknown) {
        handleRegistrationError(`${e}`);
      }
    } else {
      handleRegistrationError('Must use physical device for push notifications');
    }
  }
  
 const updatePush = async () => {
      const response = await fetch(BASE_URL + '/api/Auth/expoToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId,   
          expoToken: expoPushToken })
      },
      );
  }
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };


  // const { isAuthenticated, user, logout } = useAuth();
  const fetchData = async () => {
    try {

      const categoryIds = selectedItems.map((item: { id: number }) => item.id.toString());

      const queryParams = buildQueryString({ categoryIds, radius, budget });
      const url = BASE_URL + '/api/Projects?' + queryParams;

      const response = await fetchWithAuth(url);
      const result: Project[] = await response.json();
      if (response.ok) {
        setData(result);
        flatListRef.current?.scrollToOffset({ animated: true, offset: 0 })

      } else {
        Alert.alert('Page Load Error', 'Page Load');
      }
    } catch (err) {
      setError(JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (expoPushToken && Device.isDevice) {
      updatePush();
    }
  }, [expoPushToken]);

  useEffect(() => {

    fetchData();
  }, [selectedItems, bind]);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);



  const onViewableItemsChanged = ({ viewableItems }) => {
    // (data[0].details.map((item, index) => ({
    //   id: `${item.projectDetailId}-${index}`, // Ensuring unique key
    //   afterImage: item.afterImage,
    //   video: item.video,
    //   description: item.description,
    // })));
    setVisibleItems(viewableItems.map((item: { key: any; }) => item.key));
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  // const transformedData = data[0].details.map((item, index) => ({
  //   id: `${item.projectDetailId}-${index}`, // Ensuring unique key
  //   afterImage: item.afterImage,
  //   video: item.video,
  //   description: item.description,
  // }));

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const likeProject = async (comment: string | null, like: boolean, isLead: boolean) => {
    const json = {
      userId: userId,
      projectId: data[0].projectId,
      comment: comment,
      like: like,
      isLead: isLead
    };
    try {
      const response = await fetchWithAuth(BASE_URL + '/api/projects/' + data[0].projectId + '/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(json),
      });

      const responseText = await response.json();
      if (!response.ok) {
        Alert.alert('Error', responseText.message || 'Like failed');
//        fetchData();
      }
      fetchData();
    } catch (error) {
      Alert.alert('Failed to send like:', 'Please try agin.');
    }
  }
  const handleSettingsClick = () => {
    signOut();
    router.navigate("auth/login");
  }
  const handleLeftButtonClick = () => {
    setLeftModalVisible(true);
  };

  const handleRadiusButtonClick = () => {
    setRadiusModalVisible(!isRadiusModalVisible);
  };
  const handleBudgetButtonClick = () => {
    setBudgetModalVisible(!isBudgetModalVisible);
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

  const handleBudgetChange = (value: number) => {
    setBudget(value);
  };
  const handleRadiusChange = (value: number) => {
    setRadius(value);
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
        <Text>Server Error</Text>
        <TouchableOpacity onPress={()=>{setError(null); fetchData(); }} style={styles.buttonContainer}>
          <Text>Reload</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.headerFilters}>
        {/* Header Line 1 */}
        <View style={styles.header1}>
          {/* <TouchableOpacity  > */}
          {(data.length > 0) ?
            (<TouchableOpacity style={[styles.buttonContainer]} onPress={()=>{setModalBlockVisible(true)}}>
              <FontAwesome6 name="ban" style={{color:'red'}} size={normalize(12)} />
            </TouchableOpacity>) : null
          }
          

          <TouchableOpacity onPress={handleCategoryButtonClick} >
            <View style={[styles.buttonContainer]}>
              <Text style={styles.button} >Categories</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRadiusButtonClick} >
            <View style={[styles.buttonContainer]}>
              <Text style={styles.button} >Radius</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleBudgetButtonClick} >
            <View style={[styles.buttonContainer]}>
              <Text style={styles.button} >Budget</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.horizontalRule}></View>
      </View>
      {(data.length > 0) ? (
        <View style={styles.header}>
          <View style={styles.projectTitle}>
            <Text style={styles.title}>{data[0].title}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: normalize(14), }}>By {data[0].userName}</Text>
            <MaterialCommunityIcons name="professional-hexagon" size={normalize(30)} color="#B87333" />
            </View>
            {(data[0].userType == "professional") &&
              (<View style={{ flexDirection: 'row', justifyContent:'space-between', marginRight:normalize(20)}}>
                <Text>{data[0].phoneNumber}</Text>
                <Text>
                <Text style={{fontWeight:'500'}}>License#</Text> <Text>{data[0].licenseNumber}</Text>
                </Text>
                </View>
              )
            }

          <View style={styles.header2}>
            <View style={styles.header2heart}>
              <Text style={styles.category}><FontAwesome name="heart" size={normalize(20)} color="#FA9BCF" /> {data[0].likes}</Text>
            </View>
            <View style={styles.header2like}>
              <TouchableOpacity onPress={() => setModalMessageVisible((data[0].messageCount > 0) ? true : false)}>
                <Text style={styles.category}><FontAwesome name="comment" size={normalize(20)} color="#a7abb5" /> {data[0].messageCount}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.dollarSpace}></View>
            <Text style={styles.category}> <FontAwesome name="dollar" size={normalize(15)} color="#067d13" />{formatNumber(parseFloat(data[0].cost))} </Text>
          </View>

        </View>
      ) : (<EmptyHome onUnlike={fetchData}></EmptyHome>)
      }

      {(data.length > 0) && (

        <FlatList
          data={data[0].details.map((item, index) => ({
            id: `${item.projectDetailId}-${index}`, // Ensuring unique key
            images: {
              afterImage: item.afterImage,
              beforeImage: item.beforeImage,
            },
            video: item.video,
            description: item.description,
          }))}
          ref={flatListRef}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <ListingDetails
            isVisible={isFocused && visibleItems.includes(item.id.toString())}
            key={item.id} child={item} ></ListingDetails>}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />)}
      {(data.length > 0) ? (<>
        <TouchableOpacity style={styles.floatingButtonLeft} onPress={handleLeftButtonClick}   >
          <FontAwesome5 name="heart" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.floatingButtonRight} onPress={() => likeProject(null, false, false)} >
          <FontAwesome5 name="heart-broken" size={30} color="#000" />
        </TouchableOpacity>        
        </>
      ) : (<></>)}




      <LikeModal
        visible={isLeftModalVisible}
        onClose={() => setLeftModalVisible(false)}
        userType={(data.length > 0) ? data[0].userType : ''}
        message="Left Button Clicked!"
        onSubmit={(feedback, isLead) => {
          likeProject(feedback, true, isLead);
        }}
      //        onSubmit={(feedback) => likeProject(feedback, true)} // Pass the callback function with additional parameter

      />
      <SliderModal type="radius" onValueChange={handleRadiusChange} visible={isRadiusModalVisible} userradius={4000} onClose={() => { setRadiusModalVisible(false); setBind(!bind); }} />
      <SliderModal type="dollars" onValueChange={handleBudgetChange} visible={isBudgetModalVisible} userradius={250000} onClose={() => { setBudgetModalVisible(false); setBind(!bind); }} />
      <CheckboxList
        isVisible={isCategoriesModalVisible}
        onClose={handleCategoryButtonClick}
        onSelect={handleSelect}
        initialSelectedItems={selectedItems.map(item => item.id)}
      />
      <MessagesModal onClose={() => setModalMessageVisible(false)} projectId={(data.length > 0) ? data[0].projectId.toString() : 0} visible={modalMessageVisible} />
      <BlockModal onClose={() => setModalBlockVisible(false)} projectId={(data.length > 0) ? data[0].projectId : 0} visible={modalBlockVisible} userId={userId} blockUserId={(data.length > 0) ? data[0].userId : 0} onRebind={() => { setModalBlockVisible(false); setBind(!bind); }} />
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    margin: normalize(25),
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  filterbar: {
    flexDirection: "row",
    backgroundColor: "#d3d3d3",
    paddingLeft: normalize(25),
    paddingBottom: normalize(1)
  },
  radiusInput: {
    borderWidth: 1,
    borderColor: '#000',
    width: normalize(60),
    marginLeft: normalize(10)
  },
  header: {
    // padding: 25,
    justifyContent: 'space-evenly',
   // marginTop: 0,
    marginLeft: normalize(15),
  },
  headerFilters: {
    // padding: 25,
    justifyContent: 'space-evenly',
   // marginTop: 0,
    margin: normalize(15),
  },
    horizontalRule: {
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
      marginVertical: normalize(10),
    },
  projectTitle: {

  },
  header1: {
    flexDirection: 'row',
    justifyContent: 'space-around'

  },
  header2: {
    paddingTop: normalize(12),
    flexDirection: "row",
  },
  header2heart: {
    flexDirection: 'row',
    paddingRight: normalize(20)

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
    margin: normalize(10),
  },

  image: {
    // width: '100%',
    // height: 440,
    // borderRadius: 18,
  },
  card: {
    // borderRadius: 18,
    // borderWidth: 1,
    // borderColor: '#ddd',
    // overflow: 'hidden',
    // backgroundColor: '#fff',
    // margin: 10,
    // padding: 15,
    // fontWeight: 900
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
    borderWidth: 3,
    bottom: 20,
    left: 20,
    backgroundColor: '#f0f0f0',
    borderColor: '#B87333',
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
    borderColor: '#B87333',
    borderWidth: 3,
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
  dollarSpace: {
    width: normalize(10)
  },
  buttonContainer: {
    backgroundColor: '#e4eaf7',
    borderColor: '#B87333',
    borderWidth: 1.5,
    borderRadius: 15, // Rounded edges
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(8),
     alignItems: 'center',
     justifyContent: 'space-evenly',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 5, // For Android shadow
    color: '#000',


  },
  button: {
    fontSize: normalize(12),
    fontWeight: 'black',
    color: '#000'
  }

});





