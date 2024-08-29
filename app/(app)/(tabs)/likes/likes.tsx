import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ImageBackground, Alert, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SessionProvider, useSession } from '@/context/ctx';
import fetchWithAuth from '@/context/FetchWithAuth';
import { BASE_URL } from '@/constants/Endpoints';
import { Project, ProjectDetails } from '@/interfaces/IProject';
import { FontAwesome5 } from '@expo/vector-icons';
import { normalize } from 'react-native-elements'

import { router, useFocusEffect } from 'expo-router';
import ProjectModal from '@/components/ProjectModal';
import { formatNumber } from '@/functions/stringfunctions';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withDelay,
  withRepeat,
} from 'react-native-reanimated';
//import normalize from '@/fonts/fonts';

// Define the types for your data


const Likes: React.FC = () => {
  const [data, setData] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { userId, userType } = useSession();
  const [isProjectModalVisible, setProjectModalVisible] = useState(false);
  const [projectId, setProjectId] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const translateX = useSharedValue(500); // Start off-screen to the right
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));


  const fetchData = async () => {
    try {
      const response = await fetchWithAuth(`${BASE_URL}/api/Projects/user/${(userType?.toString() === 'guest') ? "0" : userId}/likes`)
      const result: Project[] = await response.json();
      if (response.ok) {
        setData(result);
      } else {
        setError("Server Error");
      }
    } catch (err) {
      setError(JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };


  useFocusEffect(
    useCallback(() => {
      fetchData();
      setRefreshKey((prevKey) => prevKey + 1);
      translateX.value = 300; 
      opacity.value = 0;   
      translateX.value = withTiming(0, { duration: 1200 });
      opacity.value = withTiming(1, { duration: 1200 });
      translateX.value = withTiming(0, { duration: 1200 });
      opacity.value = withTiming(1, { duration: 1200 });

    }, [translateX, opacity])
  );

  const handleViewProject = (id: number) => {
    setProjectId(id);
    setProjectModalVisible(true);
  }





  const findFirstNonNullAfterImage = (details: ProjectDetails[]): string | null => {
    const detail = details.find(detail => detail.afterImage !== null);
    return detail?.afterImage || null;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Server Error</Text>
        <TouchableOpacity onPress={() => { setError(null); fetchData(); }} style={styles.buttonContainer}>
          <Text>Reload</Text>
        </TouchableOpacity>
      </View>
    );
  }




  const renderItem = ({ item }: { item: Project }) => {
    const imageUri = findFirstNonNullAfterImage(item.details);
    return (

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.projectContainer}>
          <TouchableOpacity onPress={() => { handleViewProject(item.projectId) }}>
            <ImageBackground
              source={
                imageUri
                  ? { uri: imageUri }
                  : require('../../../../assets/images/backgrounds/login.jpg')
              }
              style={styles.backgroundImage}
              imageStyle={{ borderRadius: 8, borderColor: "#B87333", opacity: 1, shadowColor: "#000" }}
            >
              <View style={styles.contentContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <View >
                  <Text style={styles.category}>Category: {item.categoryName}</Text>
                  <View style={styles.space} />
                  <Text style={styles.cost}>Cost: ${formatNumber(parseFloat(item.cost))}</Text>
                </View>
                <View style={styles.icon}>
                  <View>
                    <Text ><FontAwesome5 name="heart" size={normalize(20)} color="#FA9BCF" /> {item.likes}</Text>
                  </View>
                  <View style={styles.space} />
                  <View>
                    <Text ><FontAwesome5 name="comment" size={normalize(20)} color="#000" /> {item.messageCount}</Text>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
          {isProjectModalVisible && (
            <ProjectModal visible={isProjectModalVisible} projectId={projectId} onClose={() => setProjectModalVisible(false)} project={null}>
            </ProjectModal>
          )}
        </View>
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>

        {(data.length > 0) ? (
          <><Text style={{fontWeight: 400, margin: 10, fontSize:normalize(16)  }}>Your Liked Projects  {'\n'}</Text>
            <FlatList
              data={data}
              keyExtractor={(item) => item.projectId.toString()}
              renderItem={renderItem} /></>
        ) :
          (
            <ImageBackground style={{ flex: 1 }} source={require('../../../../assets/images/backgrounds/reset-background.jpeg')} imageStyle={{ opacity: .9, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Animated.View style={[styles.itemContainer, animatedStyle]}>
                <Text style={{ color: "#000", fontSize: 30, fontWeight: '200', lineHeight: 30 }}><FontAwesome5 name="heart-broken" size={30} color="#65432" /> You have not liked any projects.
                  Tap below to begin matching with a professional.
                </Text>
                <TouchableOpacity onPress={() => {
                    router.push(
                      {
                        pathname: '/home',
                        params: { data: null }
                      }
                    )
                  }} >
                    <View style={styles.buttonContainer}>
                      <Text style={styles.button}>review projects</Text>
                    </View>
                  </TouchableOpacity>

              </Animated.View>
            </ImageBackground>)}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)', // 
    // padding: 10,
  },
  viewRow: {
    flexDirection: 'row',
    alignContent: 'center'
  },
  projectContainer: {
    marginBottom: normalize(20),
    padding: 10,
    borderRadius: 8,
    shadowColor: '#B87333',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  backgroundImage: {
    width: '100%',
    height: normalize(300),
    borderRadius: 8,
    backgroundColor: 'rgba(221,221,221,.1)'
  },
  contentContainer: {
    padding: 10,
    borderRadius: 8,
    backgroundColor:"rgba(255,255,255,1)",


  },
  title: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    marginVertical: normalize(10),
  },
  category: {
    fontSize: normalize(16),
    color: '#000',
  },
  cost: {
    fontSize: normalize(16),
    color: '#000',

  },
  detailContainer: {
    marginTop: 10,
  },
  detailDescription: {
    fontSize: 14,
    color: '#555',
  },
  icon: {
    margin: 20,
    flexDirection: 'row'
  },
  space: {
    width: normalize(10)
  },
  buttonContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8, // Rounded edges
    height: normalize(50),
    borderWidth: 2,
    borderColor: '#B87333',
    color: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  button: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: '#000',
  },
  itemContainer: {
    borderColor: '#B87333',
    borderWidth: 1,
    padding: 20,
    backgroundColor: '#fff',
    opacity: .9,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    margin: 20,
  },

});

export default Likes;
