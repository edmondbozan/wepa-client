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
import { ProjectDetails, Project } from '@/interfaces/IProject';
import GlobalStyles from '@/styles/styles';
import { formatNumber } from '@/functions/stringfunctions';
import SliderModal from '@/components/Slider';

export default function ProjectComponent() {
  const [projectId, setProjectId] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [categories, setCategories] = useState<DropdownItem[]>([]);
  const { data } = useLocalSearchParams();
  const initialData = data ? JSON.parse(data as string) : null;
  const [projectData, setProjectData] = useState<Project>(initialData);
  const [cost, setProjectCost] = useState<number>(0);
  const [title, setProjectTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DropdownItem | null>(null);
  const { userId } = useSession();
  const [isBudgetModalVisible, setBudgetModalVisible] = useState(false);
  const [isCategoryValid, setCategoryValid] = useState<boolean>(true);
  const [isProjectNameValid, setProjectNameValid] = useState<boolean>(true);
  const [isCostValid, setCostValid] = useState<boolean>(true);
  const [errors, setErrors] = useState<string[]>([]);
  const {userType } = useSession();

  const validateCategory = (): boolean => {
    if (selectedCategory) {
      setCategoryValid(true);
      return true;
    } else {
      setCategoryValid(false);
      return false;
    }
  };

  const validateProjectName = (): boolean => {
    if (title.length > 0) {
      setProjectNameValid(true);
      return true;
    } else {
      setProjectNameValid(false);
      return false;
    }
  };

  const validateCost = (): boolean => {
    if (cost > 0) {
      setCostValid(true);
      return true;
    } else {
      setCostValid(false);
      return false;
    }
  };

  const handleValidation = (): boolean => {
    const validationErrors: string[] = [];

    if (!validateCategory()) validationErrors.push('Invalid category');
    if (!validateProjectName()) validationErrors.push('Invalid project name');
    if (!validateCost()) validationErrors.push('Invalid cost');

    setErrors(validationErrors);

    return validationErrors.length === 0;
  };

  const handleBudgetButtonClick = () => {
    setBudgetModalVisible(!isBudgetModalVisible);
  };

  const handleBudgetChange = (value: number) => {
    setProjectCost(value);
  };

  useEffect(() => {
    if (projectData) {
      if (projectData.cost !== undefined) {
        setProjectCost(parseInt(projectData.cost));
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
        }
      } catch (error) {
        Alert.alert('Error fetching categories.');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    //    console.log('Project Data Updated:', projectData);
    setProjectId(projectData?.projectId);
  }, [projectData]);

  const deleteItem = async (id: number) => {
    console.log(BASE_URL + '/api/upload/projectDetails/' + id);
    try {
      const response = await fetchWithAuth(BASE_URL + '/api/upload/projectDetails/' + id, {
        method: 'DELETE',
      });
      const responseText = await response.text(); // Read response as text

      if (!response.ok) {
        Alert.alert("There was an issue trying to delete the media")
        return;
      }
      const updatedDetails = projectData.details.filter(detail => detail.projectDetailId !== id);
      setProjectData({ ...projectData, details: updatedDetails });
    }
    catch (error) {
      Alert.alert('Server Error. Please try again');
    }
  }



  const AddProject = async () => {

    const isValid = handleValidation();
    if (isValid) {
      const json = {
        id: projectId,
        categoryId: selectedCategory?.id,
        title: title,
        cost: cost.toString(),
        categoryName: selectedCategory?.description,
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
        const result: Project = await response.json();

        if (response.ok) {
          setProjectData(result);

        } else {
          Alert.alert('Page Load Error', 'Page Load');
        }

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${result.message}`);
        }

        setProjectData(result);
        console.log(projectData);
      } catch (error) {
        console.error('Failed to add project:', error);
      }
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
    <SafeAreaView style={styles.safeArea}>
      <Text style={{ marginLeft: 20 }} onPress={() => { router.replace('/projects/Projects'); }}>
        <FontAwesome name="arrow-left" /> Projects
      </Text>
      <ScrollView style={styles.scrollContainer}>
<     Text style={{ fontWeight: '400' , fontSize:normalize(12)}}>{(userType === 'professional') ? 'Build a project to begin generating leads.' : 'Build a project to demonstarte that drip.' }</Text>
        <View style={styles.horizontalRule} />

        <View>
          <Text style={styles.label}>Category</Text>
          <DropdownInput
            data={categories}
            setValue={selectedCategory}
            onSelect={item => {
              setSelectedCategory(item);
            }}
          />
          {!isCategoryValid && (<Text style={{ color: 'red' }}>Please choose a category.</Text>)}

          <Text style={styles.label}>Project Name</Text>
          <TextInput
            placeholder="Project Name"
            value={title}
            onChangeText={setProjectTitle}
            onBlur={() => { validateProjectName(); }}
            style={[styles.input, !isProjectNameValid && styles.inputError]}
          />
          {!isProjectNameValid && (<Text style={{ color: 'red' }}>Project Name is required.</Text>)}

          <Text style={styles.label}>Cost</Text>
          <TouchableOpacity onPress={() => setBudgetModalVisible(true)}>
            <TextInput
              placeholder="Project Cost"
              keyboardType='number-pad'
              value={"$" + formatNumber(cost)}
              editable={false}
              pointerEvents="none"
              style={[styles.input, !isCostValid && styles.inputError]}
            />
            {!isCostValid && (<Text style={{ color: 'red' }}>Project cost must be {'>'} 0.</Text>)}
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-evenly' }}>
          <TouchableOpacity onPress={AddProject} style={{ flex: 1 }}>
            <View style={styles.buttonContainer}>
              <Text style={styles.button}>Save</Text>
            </View>
          </TouchableOpacity>
          {projectData &&

            <TouchableOpacity style={{ flex: 1 }} onPress={() => {
              router.push({
                pathname: '/projects/media',
                params: { data: JSON.stringify(projectData) }
              });
            }}>
              <View style={styles.buttonContainer}>
                <Text style={styles.button}>Add Media</Text>
              </View>
            </TouchableOpacity>
          }
        </View>

        <View style={[styles.horizontalRule, { height: 20 }]} />

        {projectData ? (
          <>
            <Text>Media</Text>
            <FlatList
              scrollEnabled={false}
              data={projectData.details}
              keyExtractor={(item) => item.projectDetailId.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.verticalFlatListContainer}
            />
          </>
        ) : (
          <><Text>Give your project some details to start getting noticed. </Text></>
        )}
      </ScrollView>
      <SliderModal type="dollars" onValueChange={handleBudgetChange} visible={isBudgetModalVisible} userradius={cost} onClose={() => { setBudgetModalVisible(false); validateCost(); }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(221, 221, 221, .5)',
  },
  FLImage: {
    width: 100,
    height: 100,
  },
  detailContainer: {
    flexDirection: 'row'
  },
  scrollContainer: {
    padding: 10,
  },
  horizontalRule: {
    borderBottomColor: '#ccc',
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
    color: '#B87333',
    marginBottom: 5,
    marginTop: 15,
    fontWeight: 'bold'
  },
  input: {
    height: normalize(40),
    borderColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    color: "#000",
    elevation: 5,
    borderWidth: normalize(1),
    marginBottom: normalize(10),
    paddingHorizontal: normalize(10),
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)'
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
});
