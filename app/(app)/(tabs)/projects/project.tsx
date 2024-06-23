import { router } from 'expo-router';
import { Alert, Button, Text, TextInput, View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Platform, Modal, FlatList, Image } from 'react-native';
import { useSession } from '@/context/ctx';
import { useEffect, useState } from 'react';
import { BASE_URL } from '@/constants/Endpoints';
import normalize from '@/fonts/fonts';
import { Picker } from '@react-native-picker/picker';
import { StackParamList } from '@/types/types';
import Categories from '@/components/Categories';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import DropdownInput from '@/components/DropDowmList';
import { useLocalSearchParams } from 'expo-router';
import { ProjectDetails } from '@/interfaces/IProject';

export default function Project() {
  const [modalVisible, setModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const { data } = useLocalSearchParams();
  const projectData = data ? JSON.parse(data as string) : null;
  const [cost, setProjectCost] = useState('');
  const [title, setProjectTitle] = useState('');
  const [categoryName, setCategory] = useState('');



  useEffect(() => {
    if (projectData && projectData[0].cost !== undefined) {
      setProjectCost(projectData[0].cost.toString());
    }
    if (projectData) {
      setProjectTitle(projectData[0].title);
    }
    if (projectData) {
      setCategory(projectData[0].categoryName);
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch(BASE_URL + '/Category');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
      }
    }
    fetchCategories();
  }, []);


  const renderItem = ({ item }: { item: ProjectDetails }) => {
    // Declare a variable inside the renderItem function
    const afterImage = "https://wepa.blob.core.windows.net/assets/" + item.projectDetailId + "_after.jpg";
    const beforeImage = "https://wepa.blob.core.windows.net/assets/" + item.projectDetailId + "_before.jpg";
    return (
      <View style={styles.detailContainer}>
      {/* <Text>{afterImage}</Text> */}
      <Image style={styles.FLImage} source={{ uri: afterImage }} />
      <Image style={styles.FLImage} source={{ uri: beforeImage }} />
      </View>
  )
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text onPress={() => { router.replace('/projects/Projects'); }}>
        <FontAwesome name="arrow-left" /> Projects
      </Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text>Build a project.  Get Dollars.</Text>
        <View style={styles.horizontalRule} />

        <View style={styles.inputView}>
          <DropdownInput data={categories} placeholder="Select an Category" setValue={categoryName} />
          <TextInput
            placeholder="Project Name"
            style={styles.input}
            value={title}
            onChangeText={text => setProjectTitle(text)}
          />
          <TextInput
            placeholder="Project Cost"
            keyboardType='number-pad'
            style={styles.input}
            value={cost}
            onChangeText={text => setProjectCost(text)}
          />
          <View>
            <FlatList
              scrollEnabled={false}
              data={projectData[0].details}
              keyExtractor={(item) => item.projectDetailId.toString()}
              renderItem={renderItem} />
          </View>

          <TouchableOpacity onPress={() => {
            router.push(
              {
                pathname: '/projects/test',
                params: { data: JSON.stringify(projectData) }
              }
            )
          }} >
            <Text style={styles.button}>Add Details</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={styles.buttons}>
          <View style={[styles.buttonContainer]}>
          <TouchableOpacity   >
              <Text style={styles.button} >Sign In</Text>
            </TouchableOpacity>

            </View>
            <View style={styles.space} /> 
            <View style={styles.buttonContainer}>
            <TouchableOpacity   >
              <Text style={styles.button}>Register</Text>
            </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity  >
              <Text style={styles.button}>Forgot my Password</Text>
            </TouchableOpacity>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#faf9f2',
    margin: 20,
  },
  FLImage:{
    width:100,
    height:100,
    
  },
  detailContainer:{
    flexDirection:'row'
  },
  scrollContainer: {
    padding: 20,
  },
  horizontalRule: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  buttonContainer: {
    backgroundColor: '#fff',
    borderColor: '#B87333',
    borderWidth: 1,
    borderRadius: 10, // Rounded edges
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', // Shadow for a subtle depth effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 5, // For Android shadow
    color: '#000',
    width: '100%'
  },
  touchable: {
    flexDirection: 'row',
    width: '100%'
  },
  separator: {
    width: '100%',
    backgroundColor: 'black',
    alignSelf: 'stretch', // Make the separator stretch from top to bottom
  },
  button: {
    fontSize: 18,
    fontWeight: 'black',
    color: '#000'
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 30,
  },
  photos: {
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputView: {
    height: '50%',
    // justifyContent: 'center',
    //alignItems: 'center'
  },
  input: {
    height: normalize(40),
    borderColor: '#B87333',
    borderRadius: 10,
    shadowColor: '#000',
    color: "#000",
    elevation: 5,
    borderWidth: normalize(1),
    marginBottom: normalize(10),
    paddingHorizontal: normalize(10),
    width: '100%',
  },
  space: {
    width: normalize(7), // or whatever size you need
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
  }

});


