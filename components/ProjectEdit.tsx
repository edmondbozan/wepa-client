import { router } from 'expo-router';
import { Alert, Text, TextInput, View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, FlatList, Animated } from 'react-native';
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
import SliderModal from '@/components/Slider';
import { formatNumber } from '@/functions/stringfunctions';
import MediaModal from '@/components/MediaModal';


export default function ProjectEditComponent() {
  const [projectId, setProjectId] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [categories, setCategories] = useState<DropdownItem[]>([]);
  const { data } = useLocalSearchParams();
  const initialData = data ? JSON.parse(data as string) : null;
  const [projectData, setProjectData] = useState<Project>(initialData);
  const [cost, setProjectCost] = useState<number>(0);
  const [title, setProjectTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DropdownItem | null>(null);
  const { userId, userType } = useSession();
  const [isBudgetModalVisible, setBudgetModalVisible] = useState(false);
  const [isMediaModalVisible, setMediaModalVisible] = useState(false);

  const [isCategoryValid, setCategoryValid] = useState<boolean>(true);
  const [isProjectNameValid, setProjectNameValid] = useState<boolean>(true);
  const [isCostValid, setCostValid] = useState<boolean>(true);
  const [errors, setErrors] = useState<string[]>([]);
  const animation = useRef(new Animated.Value(0)).current;
  const blinkAnimationRef = useRef<any>(null);
  const [showDetails, setShowDetails] = useState<Boolean>(true);


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
            id: projectData.categoryId,
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
    setProjectId(projectData?.projectId);
  }, [projectData]);

  const AddProject = async () => {
    const isValid = handleValidation();
    if (isValid) {
      const json = {
        id: projectId,
        categoryId: selectedCategory?.id,
        title: title,
        cost: cost.toString(),
        categoryName: selectedCategory?.description,
        userId: userId,
      };

      try {
        const response = await fetchWithAuth(BASE_URL + '/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
      } catch (error) {
        console.error('Failed to add project:', error);
      }
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>       
            <View>
              <Text style={styles.label}>category</Text>
              <DropdownInput
                data={categories}
                setValue={selectedCategory}
                onSelect={item => {
                  setSelectedCategory(item);
                }}
              />
              {!isCategoryValid && (<Text style={{ color: 'red' }}>Please choose a category.</Text>)}

              <Text style={styles.label}>project name</Text>
              <TextInput
                placeholder="project name"
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
                  keyboardType="number-pad"
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
                  <Text style={styles.button}>save</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={[styles.horizontalRule, { height: 20 }]} />

            {/* {(projectData && projectData.details.length > 0) ? ( */}
              <View style={styles.container}><Text style={{ fontSize: normalize(20) }}>
                {projectData ? 'give your project some details to start getting noticed. tap \'+media\' to begin adding photos, videos, and text.' : 'fill out the above attributes and tap \'save\''} </Text></View>
            {/* )} */}
        <SliderModal type="dollars" onValueChange={handleBudgetChange} visible={isBudgetModalVisible} userradius={cost} onClose={() => { setBudgetModalVisible(false); validateCost(); }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
     flex: 1,
    backgroundColor: 'rgba(0,0,0,.1)'
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
    //    backgroundColor: 'rgba(0, 0, 0, .1)',

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
