import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ImageBackground, Alert, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SessionProvider, useSession } from '@/context/ctx';
import fetchWithAuth from '@/context/FetchWithAuth';
import { BASE_URL } from '@/constants/Endpoints';
import { Project, ProjectDetails } from '@/interfaces/IProject';
import { FontAwesome } from '@expo/vector-icons';
import { normalize } from 'react-native-elements'
import { router, useFocusEffect } from 'expo-router';
import ProjectModal from '@/components/ProjectModal';

const Projects: React.FC = () => {
  const [data, setData] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useSession();
  const [isProjectModalVisible, setProjectModalVisible] = useState(false);
  const [projectId, setProjectId] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);


  const fetchData = async () => {
    try {
      const response = await fetchWithAuth(BASE_URL + '/api/Projects/user/' + userId);
      const result: Project[] = await response.json();
      if (response.ok) {
        setData(result);
      } else {
        setError("Server Error");
        // Alert.alert('Page Load Error');
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
    }, [])
  );


  const deleteProject = async (projectId: number) => {
    try {
      const response = await fetchWithAuth(BASE_URL + '/api/projects/' + projectId, {
        method: 'DELETE',
      });
      const responseText = await response.text();
      if (response.ok) {
        const deleteData = data.filter(detail => detail.projectId !== projectId);
        setData(deleteData);
      }
      else {
        Alert.alert('Failed to Delete Project', 'Please try again.');
      }
    } catch (error) {
      Alert.alert('Server Error.  Please try again.');
    }
  }



  const handleViewProject = (id: number) => {
    setProjectId(id);
    setProjectModalVisible(true);
  }



  const handleDeleteProject = (projectId: number) => {
    Alert.alert(
      "Are you sure you want to delete this project?",
      "All data including leads and likes will be permantly deleted.",
      [
        {
          text: "Cancel",
          onPress: () => { },
          style: "cancel"
        },
        { text: "Delete", onPress: () => deleteProject(projectId) }
      ],
      { cancelable: false }
    );
  }



  const findFirstNonNullAfterImage = (details: ProjectDetails[]): string | null => {
    const detail = details.find(detail => detail.afterImage !== null);
    return detail?.afterImage || null;
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
        <TouchableOpacity onPress={() => { setError(null); fetchData(); }} style={styles.buttonContainer}>
          <Text>Reload</Text>
        </TouchableOpacity>
      </View>
    );
  }




  const renderItem = ({ item }: { item: Project }) => {
    const imageUri = findFirstNonNullAfterImage(item.details);
    return (

      <SafeAreaView style={{ flex: 1, backgroundColor:'rgba(255,255,255,.9)' }}>
        <View style={styles.projectContainer}>
          <TouchableOpacity onPress={() => router.push({
            pathname: '/projects/project',
            params: { data: JSON.stringify(item) }
          })}
          >
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
              <TouchableOpacity style={{ zIndex:999, position: 'absolute', right: 20, top:20 }} onPress={() => handleViewProject(item.projectId)}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ fontWeight: 400, textDecorationLine: 'underline' }}>Preview</Text>
                      {/* <FontAwesome  name="eye" size={20} color="#000000" /> */}
                      {/* <Text> Delete Project</Text> */}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={{zIndex:999, position: 'absolute', right: 20, bottom: 20 }} onPress={() => handleDeleteProject(item.projectId)}>
                  <View style={{ flexDirection: 'row' }}>
                    <FontAwesome name="trash" size={20} color="#000000" />
                    {/* <Text> Delete Project</Text> */}
                  </View>
                </TouchableOpacity>


                  <Text style={styles.title}>{item.title}</Text>                  
                  <Text style={styles.category}>Category: {item.categoryName}</Text>
                  <View style={styles.space} />
                  <Text style={styles.cost}>Cost: ${item.cost}</Text>
                <View style={styles.icon}>
                  <View>
                    <Text ><FontAwesome name="heart" size={normalize(20)} color="#FA9BCF" /> {item.likes}</Text>
                  </View>
                  <View style={styles.space} />
                  <View>
                    <Text ><FontAwesome name="comment" size={normalize(20)} color="#000" /> {item.messageCount}</Text>
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
          <><Text style={{ fontWeight: 400, margin: 10, fontSize:normalize(16) }}>Your Projects {'\n'}</Text>
            <FlatList
              data={data}
              keyExtractor={(item) => item.projectId.toString()}
              renderItem={renderItem} />
            <TouchableOpacity onPress={() => {
              const emptyProject: Project = {
                userId: 0,
                userName: '',
                userType: '',
                projectId: 0,
                title: '',
                cost: '0',
                categoryId: 0,
                categoryName: '',
                likes: 0,
                messageCount: 0,
                phoneNumber: '',
                message: '',
                licenseNumber:'',
                details: [], 
              };
              router.push(
                {
                  pathname: '/projects/project',
                  params: { data: JSON.stringify(emptyProject) }

                  
                }
              )
            }} >
              <View style={styles.buttonContainer}>
                <Text style={styles.button}>Add New Project</Text>
              </View>
            </TouchableOpacity>

          </>
        ) :
          (
            <ImageBackground style={{ flex: 1 }} source={require('../../../../assets/images/projects.jpg')} imageStyle={{ opacity: 0.9, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <View style={styles.itemContainer}>
                  <Text style={{ color: "#000000", fontSize: normalize(30), fontWeight: '200', lineHeight: 30 }}>create projects to start generating leads getting likes. </Text>
                  <TouchableOpacity onPress={() => {
                    router.push(
                      {
                        pathname: '/projects/project',
                        params: { data: null }
                      }
                    )
                  }} >
                    <View style={styles.buttonContainer}>
                      <Text style={styles.button}>add new project</Text>
                    </View>
                  </TouchableOpacity>
              </View>
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

export default Projects;
