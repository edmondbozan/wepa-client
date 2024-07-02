import { router } from 'expo-router';
import { Alert, Button, Text, TextInput, View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, FlatList, Image } from 'react-native';
import { useSession } from '@/context/ctx';
import { useEffect, useState } from 'react';
import { BASE_URL } from '@/constants/Endpoints';
import normalize from '@/fonts/fonts';
import DropdownInput, { DropdownItem } from '@/components/DropDowmList';
import { useLocalSearchParams } from 'expo-router';
import ListItem from '@/components/projectDeatailsFlatList';
import fetchWithAuth from '@/context/FetchWithAuth';
import { FontAwesome } from '@expo/vector-icons';
import { ProjectDetails } from '@/interfaces/IProject';
import GlobalStyles from '@/styles/styles';




export default function Project() {
  const [projectId, setProjectId] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [categories, setCategories] = useState<DropdownItem[]>([]);
  const { data } = useLocalSearchParams();
  const projectData = data ? JSON.parse(data as string) : null;
  const [cost, setProjectCost] = useState('');
  const [title, setProjectTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DropdownItem | null>(null);
  const { userId } = useSession();

  useEffect(() => {
    if (projectData) {
      if (projectData.cost !== undefined) {
        setProjectCost(projectData.cost.toString());
      }
      setProjectTitle(projectData.title);
      setProjectId(projectData.projectId);
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(BASE_URL + '/Category');
        const data = await response.json();
        setCategories(data);

        if (projectData) {
          const initialCategory = {
            description: projectData.categoryName,
            id: projectData.categoryId
          };
          setSelectedCategory(initialCategory);
          console.log('Initial category:', initialCategory);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // useEffect(() => {
  //   console.log('Selected category updated:', selectedCategory);
  // }, [selectedCategory]);

  const AddProject = async () => {
    if (!selectedCategory) {
      console.log('No category selected');
      return;
    }

    const json = {
      id: projectId,
      categoryId: selectedCategory.id,
      title: title,
      cost: cost,
      categoryName: selectedCategory.description,
      userId: userId
    };


    try {
      const response = await fetchWithAuth(BASE_URL + '/api/projects', {
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

      console.log('Project added successfully:', responseText);
    } catch (error) {
      console.error('Failed to add project:', error);
    }
  };

  const renderItem = ({ item }: { item: any }) => <ListItem item={item} onDelete={function (id: number): void {
    throw new Error('Function not implemented.');
  } } />;

  // interface Row {
  //   items: ProjectDetails[];
  // }
  
  // interface HorizontalRowProps {
  //   row: Row;
  // }
  
  // const HorizontalRow: React.FC<HorizontalRowProps> = ({ row }) => (
  //   <View style={styles.rowContainer}>
  //     <FlatList
  //       data={row.items}
  //       renderItem={({ item }) => renderItem{item} />}
  //       keyExtractor={(item) => item.projectDetailId.toString()}
  //       horizontal
  //       showsHorizontalScrollIndicator={false}
  //       contentContainerStyle={styles.horizontalFlatListContainer}
  //     />
  //   </View>
  // );
  






  return (
    <SafeAreaView style={styles.safeArea}>
      <Text onPress={() => { router.replace('/projects/Projects'); }}>
        <FontAwesome name="arrow-left" /> Projects
      </Text>
      <ScrollView  style={styles.scrollContainer}>
        <Text style={{fontWeight:'bold'}}>Build a project. Get Dollars.</Text>
        <View style={styles.horizontalRule} />

        <View style={styles.inputView}>
          <DropdownInput
            data={categories}            
            placeholder="Select a Category"
            setValue={selectedCategory}
            onSelect={item => {
              setSelectedCategory(item);
            }}
          />
          <TextInput
            placeholder="Project Name"
            style={styles.input}
            value={title}
            onChangeText={setProjectTitle}
          />
          <TextInput
            placeholder="Project Cost"
            keyboardType='number-pad'
            style={styles.input}
            value={cost}
            onChangeText={setProjectCost}
          />
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <TouchableOpacity onPress={AddProject}>
              <View style={GlobalStyles.buttonContainer}>
              <Text style={GlobalStyles.button}>Save</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              router.push({
                pathname: '/projects/test',
                params: { data: JSON.stringify(projectData) }
              });
            }}>
              <View style={GlobalStyles.buttonContainer}>
              <Text style={GlobalStyles.button}>Add Media</Text>
              </View>
            </TouchableOpacity>
          </View> 

          </View>

          <View style={[styles.horizontalRule, {height:20}]} />
          <Text>Media</Text>
          <FlatList
              scrollEnabled={false}
              data={projectData.details}
              keyExtractor={(item) => item.projectDetailId.toString()}
              renderItem={({ item }) => <ListItem item={item} onDelete={function (id: number): void {
                throw new Error('Function not implemented.');
              } } 
              />}
              contentContainerStyle={styles.verticalFlatListContainer}

                  
              />
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
  FLImage: {
    width: 100,
    height: 100,
  },
  detailContainer: {
    flexDirection: 'row'
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
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 5,
    width: '100%'
  },
  touchable: {
    flexDirection: 'row',
    width: '100%'
  },
  separator: {
    width: '100%',
    backgroundColor: 'black',
    alignSelf: 'stretch',
  },
  button: {
    fontSize: 18,
    fontWeight: 'bold',
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
    // height: '50%',
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
});
