import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView, ImageSourcePropType, TouchableOpacity, Alert, ActivityIndicator, TextInput, Button, FlatList, ImageBackground, Platform, Pressable, Modal } from 'react-native';
import { AntDesign, FontAwesome, FontAwesome5, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons'
import ListingDetails from './listingDetails';
import {normalize} from 'react-native-elements'
import { BASE_URL } from '../constants/Endpoints'
import { useSession } from '../context/ctx';
import fetchWithAuth from '../context/FetchWithAuth'
import { Project } from '../interfaces/IProject';
import { router } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import MessagesModal from './Messages';

interface ProjectModalProps {
  visible: boolean;
  projectId:number;
  project:Project;
  onClose: () => void;
}


const ProjectModal: React.FC<ProjectModalProps> = ({ visible, projectId, onClose, project}) => {
  const [data, setData] = useState<Project>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const flatListRef = React.useRef<FlatList>(null)
  const [visibleItems, setVisibleItems] = useState([]);
  const isFocused = useIsFocused();
  const [modalMessageVisible, setModalMessageVisible] = useState(false);

  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const fetchData = async () => {
    try {
      console.log(BASE_URL + '/api/Projects/'+projectId);
      const url = BASE_URL + '/api/Projects/'+projectId;
      const response = await fetchWithAuth(url);
      const result: Project = await response.json();
      if (response.ok) {
        setData(result);
      } else {
        Alert.alert('Page Load Error', 'Page Load');
      }
    } catch (err) {
      console.log(JSON.stringify(err));
      setError(JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project == null){     
    fetchData();
    } else {
      setData(project);
      setLoading(false);
    }
  }, []);

  const onViewableItemsChanged = ({ viewableItems }) => {
    setVisibleItems(viewableItems.map((item: { key: any; }) => item.key));
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };


  // if (loading) {
  //   return (
  //     // <View style={styles.loadingContainer}>
  //     //   <ActivityIndicator size="large" color="#000000" />
  //     // </View>
  //   // );

  // }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Server Error</Text>
        <TouchableOpacity onPress={()=>{setError(null); fetchData(); }}>
          <Text style={{textDecorationLine:'underline'}}>Reload</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
          <SafeAreaView style={{flex:1}}>
          <Button title="Close" color="#fff" onPress={onClose} />
        {loading ? (
          <ActivityIndicator size="large" color="#000000" />
        ) : (
         <><Button title="Close" color="black" onPress={onClose} /></>)}
        {/* <TouchableOpacity onPress={onClose}><Text>Close</Text></TouchableOpacity>     */}
        <View style={styles.horizontalRule}></View>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{data?.title}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: normalize(14), }}>By {data?.userName}</Text>
            {(data?.userType == "professional") &&
            <MaterialCommunityIcons name="professional-hexagon" size={normalize(30)} color="#B87333" />
            }
          </View>
          {(data?.userType == "professional") &&
            (<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: normalize(20) }}>
              <Text>{data.phoneNumber}</Text>
              <Text>
                <Text style={{ fontWeight: '500' }}>License#</Text> <Text>{data.licenseNumber}</Text>
              </Text>
            </View>
            )
          }         
          <View style={styles.header2}>
            <View style={styles.header2heart}>
              <Text style={styles.category}><FontAwesome name="heart" size={normalize(20)} color="#FA9BCF" /> {data?.likes}</Text>
            </View>
            <View style={styles.header2like}>
              <TouchableOpacity onPress={() => setModalMessageVisible((data?.messageCount > 0) ? true : false)}>
                <Text style={styles.category}><FontAwesome name="comment" size={normalize(20)} color="#a7abb5" /> {data?.messageCount}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.dollarSpace}></View>
            <Text style={styles.category}> <FontAwesome name="dollar" size={normalize(15)} color="#067d13" />{formatNumber(parseFloat(data?.cost))} </Text>
          </View>

        </View>
    
        <FlatList
          data={data?.details.map((item, index) => ({
            id: `${item.projectDetailId}-${index}`,
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
        />
      <MessagesModal onClose={() => setModalMessageVisible(false)} projectId={projectId.toString()} visible={modalMessageVisible} />
      </SafeAreaView>
   </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: normalize(25),
    flex: 1,
    backgroundColor: '#F0F0F0',
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

  cardImage: {
    // width: '100%',
    // height: 200,
    alignItems: 'center'
  },

  cardDescription: {
    fontSize: 21,
    fontWeight: "500"
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
  horizontalRule: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: normalize(5),
  },
});

export default ProjectModal;



