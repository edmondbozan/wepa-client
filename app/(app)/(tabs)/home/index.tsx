import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView, ImageSourcePropType, TouchableOpacity, Alert, ActivityIndicator, TextInput, Button, FlatList, ImageBackground } from 'react-native';
import { AntDesign, FontAwesome, FontAwesome5, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons'
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
import { useIsFocused } from '@react-navigation/native';
import MessagesModal from '@/components/Messages';


interface QueryParams {
  categoryIds: number[];
}

// import Icon from 'react-native-vector-icons/FontAwesome';
export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [isLeftModalVisible, setLeftModalVisible] = useState(false);
  const [isCategoriesModalVisible, setCategoriesModalVisible] = useState(false);
  const [isRadiusModalVisible, setRadiusModalVisible] = useState(false);
  const [isBudgetModalVisible, setBudgetModalVisible] = useState(false);
  const [data, setData] = useState<Project[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const { signOut, userId } = useSession();
  const scrollViewRef = useRef<ScrollView>(null);
  const [visibleItems, setVisibleItems] = useState([]);
  const isFocused = useIsFocused();
  const [radius, setRadius] = useState<number>(100);
  const [budget, setBudget] = useState<number>(50000);
  const [bind, setBind] = useState<boolean>(false);
  const [modalMessageVisible, setModalMessageVisible] = useState(false);

  const images: ImageSourcePropType[] = [
    // afterImage, // Place your first image in the assets folder
    // beforeImage, // Place your second image in the assets folder
  ];




  const [imageIndex, setImageIndex] = useState<number>(0);
  const opacity = useSharedValue<number>(1);


  const buildQueryString = (params: { [key: string]: any }): string => {
    return Object.keys(params)
      .map(key => {              
        const value = params[key];        
        if (Array.isArray(value)) {
          console.log("array");
          return value.map(val => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('&');
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join('&');
  };


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
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });

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

    fetchData();
  }, [selectedItems, bind]);



  const onViewableItemsChanged = ({ viewableItems }) => {
    console.log(data[0].details.map((item, index) => ({
      id: `${item.projectDetailId}-${index}`, // Ensuring unique key
      afterImage: item.afterImage,
      video: item.video,
      description: item.description,
    })));
    setVisibleItems(viewableItems.map((item: { key: any; }) => item.key));
    console.log(viewableItems);
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



    const likeProject =  async(comment:string | null, like:boolean ) =>{
      const json = {
        userId: userId,
        projectId: data[0].projectId,
        comment: comment ,
        like: like,
      };
      try {
        const response = await fetchWithAuth(BASE_URL + '/api/projects/' + data[0].projectId + '/like' , {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(json),
        });
  
        const responseText = await response.text();
  
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${responseText}`);
        }
        fetchData();
      } catch (error) {
        console.error('Failed to send like:', error);
      }
  }
  const handleSettingsClick = () =>{
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

  const handleBudgetChange = (value:number) => {
    setBudget(value);
  };
  const handleRadiusChange = (value:number) => {
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
        <Text>{JSON.stringify(error)}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex:1}}>           
        <View style={styles.header}>
          {/* Header Line 1 */}
          <View style={styles.header1}>
          <View style={[styles.buttonContainer]}>
          <TouchableOpacity  onPress={handleSettingsClick} >
            <FontAwesome6 name="question" size={normalize(12)} />
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
          <TouchableOpacity  onPress={handleBudgetButtonClick} >
              <Text style={styles.button} >Budget</Text>
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
          </View>
        {(data.length > 0)?(  
       <View style={styles.header}>
          <View style={styles.projectTitle}>
            <Text style={styles.title}>{data[0].title}</Text>
          </View>     
          <View style={{flexDirection:'row', marginTop:10, alignItems:'center'}}>     
          <Text style={{fontSize:18,}}>By {data[0].userName}</Text> 
          {(data[0].userType == "professional") &&
          (
          <MaterialCommunityIcons name="professional-hexagon" size={30} color="#D8BFD8" />
          )
           }
           </View>
          <View style={styles.header2}>
            <View style={styles.header2heart}>
              <Text style={styles.category}><FontAwesome name="heart" size={normalize(20)} color="#FA9BCF" /> {data[0].likes}</Text>
            </View>
            <View style={styles.header2like}>
              <TouchableOpacity onPress={()=>setModalMessageVisible((data[0].messageCount > 0) ? true : false)}>
              <Text style={styles.category}><FontAwesome name="comment" size={normalize(20)} color="#a7abb5" /> {data[0].messageCount}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.dollarSpace}></View>
            <Text style={styles.category}> <FontAwesome name="dollar" size={normalize(15)} color="#067d13" />{formatNumber(parseFloat(data[0].cost))} </Text>
          </View>
          
        </View>
         ) : (<ImageBackground style={{flex:1}} source={require('../../../../assets/images/background.jpg')} imageStyle={{ opacity: 0.3, height:'100%' }}>
          <View style={{marginTop:100, margin:20, padding:15, borderRadius:12, backgroundColor:'rgba(211, 211, 211, .35)'}}>
            <Text style={{color:"#654321", fontSize:20, fontWeight:'700', lineHeight:30}}>You have viewed all projects that fit your criteria.{'\n\n'}</Text>
            <View style={{alignItems:'center'}}>
              <Text style={{color:"#654321", fontSize:normalize(17), fontWeight:'600',fontStyle:'italic', lineHeight:30}}> Adjust your criteria above to see more.  Or click here to view unlike</Text>
            </View>
              <View style={{alignItems:'center'}}> 
              <Text style={{color:"#654321", fontSize:normalize(17), fontWeight:'600',fontStyle:'italic'}}>
              Or click here to see unliked projects.</Text>
            </View>
          </View>

         </ImageBackground>

)
        }
        
        {(data.length > 0)?(  

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
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => <ListingDetails 
        isVisible={isFocused && visibleItems.includes(item.id.toString())}
        key={item.id} child={item} ></ListingDetails>}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        /> )
        : (<></>)
        }
                {(data.length > 0)?( <> 
      <TouchableOpacity style={styles.floatingButtonLeft} onPress={handleLeftButtonClick}   >
      <FontAwesome6 name="heart" size={30} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.floatingButtonRight}  onPress={() => likeProject(null, false)} >
        <FontAwesome5 name="heart-broken" size={30} color="#000" />
      </TouchableOpacity></>
                ):(<></>)}
      
     


      <LikeModal  
        visible={isLeftModalVisible}
        onClose={() => setLeftModalVisible(false)}
        userType={data[0].userType}
        message="Left Button Clicked!"
        onSubmit={(feedback) => {
          console.log('onSubmit called');
          likeProject(feedback, true);
        }}
//        onSubmit={(feedback) => likeProject(feedback, true)} // Pass the callback function with additional parameter

      />
      <SliderModal type="radius" onValueChange={handleRadiusChange} visible={isRadiusModalVisible} userradius={25} onClose={()=> {setRadiusModalVisible(false);setBind(!bind);}} />
      <SliderModal type="dollars" onValueChange={handleBudgetChange} visible={isBudgetModalVisible} userradius={100000} onClose={()=> {setBudgetModalVisible(false); setBind(!bind);}} />
      <CheckboxList
        isVisible={isCategoriesModalVisible}
        onClose={handleCategoryButtonClick}
        onSelect={handleSelect}
        initialSelectedItems={selectedItems.map(item=>item.id)}        
      />      
      <MessagesModal onClose={()=>setModalMessageVisible(false)} projectId={(data.length > 0) ? data[0].projectId.toString():0} visible={modalMessageVisible} />
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
    marginLeft: 15,
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
     width:10
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





