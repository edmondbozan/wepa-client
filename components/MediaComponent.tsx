import { Alert, Text, TextInput, View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, FlatList, Animated, LayoutChangeEvent } from 'react-native';
import { useSession } from '@/context/ctx';
import { useEffect, useRef, useState } from 'react';
import { BASE_URL } from '@/constants/Endpoints';
import normalize from '@/fonts/fonts';
import DropdownInput, { DropdownItem } from '@/components/DropDowmList';
import { useLocalSearchParams } from 'expo-router';
import ListItem from '@/components/projectDeatailsFlatList';
import fetchWithAuth from '@/context/FetchWithAuth';
import { FontAwesome } from '@expo/vector-icons';
import { ProjectDetails, Project } from '@/interfaces/IProject';
import MediaModal from '@/components/MediaModal';
import { Button, Divider, Menu, PaperProvider } from 'react-native-paper';

interface MediaComponentProps{
    visible: false;
    data: Project;
   }

const MediaComponent: React.FC<MediaComponentProps> = ({ visible, data }) => {


  const [projectData, setProjectData] = useState<Project>(data);
  const { userId, userType } = useSession();
  const [isMediaModalVisible, setMediaModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState({ x: 0, y: 0 });


  const deleteItem = async (id: number) => {
    try {
      const response = await fetchWithAuth(BASE_URL + '/api/upload/projectDetails/' + id, {
        method: 'DELETE',
      });
      const responseText = await response.text(); // Read response as text

      if (!response.ok) {
        Alert.alert('There was an issue trying to delete the media');
        return;
      }
      const updatedDetails = projectData.details.filter(detail => detail.projectDetailId !== id);
      setProjectData({ ...projectData, details: updatedDetails });
    } catch (error) {
      Alert.alert('Server Error. Please try again');
    }
  };




  const renderItem = ({ item }: { item: any }) => (
    <ListItem
      item={item}
      onDelete={(id: number) => {
        deleteItem(id);
      }}
    />    
  );
  

  return (
   <>
          <TouchableOpacity
            onPress={() => setMediaModalVisible(true)}
            style={styles.touchable}
            
            >
            <Text style={styles.text}>
              Add New Media <FontAwesome size={20} name="plus-square-o" />
            </Text>
          </TouchableOpacity>
      <FlatList
        scrollEnabled={true}
        data={projectData.details}
        keyExtractor={(item) => item.projectDetailId.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.verticalFlatListContainer} />
        <MediaModal visible={isMediaModalVisible} onClose={() => { setMediaModalVisible(false); } } onSave={(data) => { setMediaModalVisible(false); setProjectData(data); } } project={projectData}></MediaModal></>     
  );
}

const styles = StyleSheet.create({
  touchable: {
    margin: normalize(10),
  },
  text: {
    fontSize: 20,
  },
  safeArea: {
     flex: 1,
    backgroundColor: 'rgba(0,0,0,.1)'
  },
  detailContainer: {
    flexDirection: 'row'
  },
  scrollContainer: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, .1)',

  },
  horizontalRule: {
    borderBottomColor: '#B87333',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  buttonContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    height: 50,
    borderWidth: 2,
    borderColor: '#B87333',
    color: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10

  },
  button: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  separator: {
    width: '100%',
    backgroundColor: 'black',
    alignSelf: 'stretch',
  },
  photos: {
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: '#000000',
    marginBottom: 5,
    marginTop: 15,
    fontWeight: '200'
  },
  input: {
    height: normalize(50),
    borderColor: '#B87333',
    borderRadius: 10,
    shadowColor: '#000',
    color: "#000",
    elevation: 5,
    borderWidth: normalize(1),
    marginBottom: normalize(10),
    paddingHorizontal: normalize(10),
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',

  },
  space: {
    width: normalize(7),
    height: 1,
  },
  picker: {
    height: normalize(1),
    width: normalize(200),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  pickerText: {
    fontSize: 16,
    color: 'blue',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  verticalFlatListContainer: {
    paddingVertical: 10,
    justifyContent: 'flex-start',
  },
  rowContainer: {
    marginVertical: 10,
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 5,
  },
  horizontalFlatListContainer: {
    paddingHorizontal: 10,
  },
  inputError: {
    borderColor: 'red',
    color: 'red'
  },
  signUpButton: {
    //borderColor: '#B87333',
    //borderWidth: 1,
    //backgroundColor: 'rgba(255, 255, 255, 0.8)', // Light background for better contrast
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    // width:100
  },
  selected: {
    borderBottomColor: '#B87333',
    borderBottomWidth: 2,
  },
  signUpText: {
    color: '#000',
    fontSize: normalize(12),
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.8)', // Text shadow for better readability
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  container: {
    borderColor: '#B87333',
    borderWidth: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    margin: 20,
  },


});

export default MediaComponent;