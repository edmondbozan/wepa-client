import { Alert, Text, TextInput, View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { useSession } from '@/context/ctx';
import { useEffect, useRef, useState } from 'react';
import { BASE_URL } from '@/constants/Endpoints';
import normalize from '@/fonts/fonts';
import DropdownInput, { DropdownItem } from '@/components/DropDowmList';
import fetchWithAuth from '@/context/FetchWithAuth';
import { ProjectDetails, Project } from '@/interfaces/IProject';
import SliderModal from '@/components/Slider';
import { formatNumber } from '@/functions/stringfunctions';
import MediaPicker from './mediaTest';
import CategoryModal from './CategorySelectModal';
import { FontAwesome6 } from '@expo/vector-icons';
import InputModal from './InputModal';

interface ProjectProps {
  data: Project;
  onValueChange: (data: Project) => void;
}

const ProjectEditComponent: React.FC<ProjectProps> = ({ data, onValueChange }) => {
  const [projectId, setProjectId] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [categories, setCategories] = useState<DropdownItem[]>([]);
  const [projectData, setProjectData] = useState<Project>(data);
  const [projectVisible, setProjectEnabled] = useState<boolean>(projectData?.enabled);
  const [cost, setProjectCost] = useState<number>(5000);
  const [title, setProjectTitle] = useState("My Bathroom Remodel");
  const [selectedCategory, setSelectedCategory] = useState<DropdownItem>();
  const { userId, userType } = useSession();
  const [isBudgetModalVisible, setBudgetModalVisible] = useState(false);
  const [isCategoryValid, setCategoryValid] = useState<boolean>(true);
  const [isProjectNameValid, setProjectNameValid] = useState<boolean>(true);
  const [isCostValid, setCostValid] = useState<boolean>(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [isInputModeVisible, setInputModeVisible] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);



  const toggleSwitch = () => {
    setProjectData(prev=>({...prev, enabled: !projectVisible }));
    setProjectEnabled(previousState => !previousState);
  }




  useEffect(() => {
    onValueChange(projectData);
  }, [projectData]);


  const handleMediaChange = (value: ProjectDetails[]) => {
    setProjectData(prevdata => ({
      ...prevdata, details: value
    }));
  }

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
    // console.log(cost);
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
      setProjectTitle((projectData.title) ? projectData.title : "My Bathroom Remodel" );
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
            description: data[0].description,
            id: data[0].id,
          };
          setSelectedCategory(initialCategory);
          setProjectData(prevdata => ({ ...prevdata, categoryName: initialCategory.description, categoryId: parseInt(initialCategory.id) }));

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

  useEffect(() => {
    setProjectData(prevdata => ({
      ...prevdata, title: title
    }));
  }, [title]);

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
      <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={!isDragging} >
        <View style={[styles.container, { flexDirection: 'row' }]}>
          <Switch
            trackColor={{ false: "#C0C0C0", true: "#C0C0C0" }}
            thumbColor={projectVisible ? "#B87333" : "#000"}
            ios_backgroundColor="#C0C0C0"
            value={projectVisible}
            onValueChange={toggleSwitch}
          />
          <Text style={{ alignSelf: 'center' }}> Project Visible</Text>
        </View>


        <View style={styles.horizontalRule}></View>
        <TouchableOpacity onPress={() => { setModalVisible(true) }}>
          <View style={styles.container}>
            <Text style={styles.label}>Category:  </Text>
            <Text>{selectedCategory?.description} <FontAwesome6 name="chevron-right" /></Text>
          </View>
        </TouchableOpacity>
        <View style={styles.horizontalRule}></View>
        {/* {!isCategoryValid && (<Text style={{ color: 'red' }}>Please choose a category.</Text>)} */}
        <TouchableOpacity onPress={() => setInputModeVisible(true)} style={{ width: '100%' }}>
          <View style={styles.container}>
            <Text style={styles.label}>Title:  </Text>
            <View style={{ justifyContent: 'space-between' }}>
              <Text>{title.length > 40 ? title.slice(0, 40) + '...' : title} <FontAwesome6 name="chevron-right" /></Text>
            </View>
          </View>
        </TouchableOpacity>
        {/* {!isProjectNameValid && (<Text style={{ color: 'red' }}>Project Name is required.</Text>)} */}
        <View style={styles.horizontalRule}></View>
        <TouchableOpacity onPress={() => setBudgetModalVisible(true)} style={{ width: '100%' }}>
          <View style={styles.container}>
            <Text style={styles.label}>Cost:  </Text>
            <Text>{"$" + formatNumber(cost)} <FontAwesome6 name="chevron-right" /></Text>
          </View>
        </TouchableOpacity>
        {!isCostValid && (<Text style={{ color: 'red' }}>Project cost must be {'>'} 0.</Text>)}
        <View style={styles.horizontalRule}></View>
       <MediaPicker data={projectData?.details} onValueChange={handleMediaChange} isDragging={drag => { setIsDragging(drag) }}></MediaPicker>
        <SliderModal type="dollars" onValueChange={handleBudgetChange} visible={isBudgetModalVisible} userradius={cost} onClose={() => { setBudgetModalVisible(false); validateCost(); setProjectData(prevdata => ({ ...prevdata, cost: cost.toString() })); }} />
        <CategoryModal isVisible={modalVisible} data={categories} onClose={() => { setModalVisible(false); }} onSelect={item => {
          setSelectedCategory(item);
          setProjectData(prevdata => ({ ...prevdata, categoryName: item.description, categoryId: parseInt(item.id) }));
          setModalVisible(false)
        }} />
        {isInputModeVisible &&
          <InputModal isRequired={true} isVisible={isInputModeVisible} title="Project Title" initialValue={title} onClose={() => setInputModeVisible(false)} onSave={(text) => {
            setProjectTitle(text);
            setProjectData(prevdata => ({ ...prevdata, title: text }));
            setInputModeVisible(false)
          }} maxLength={50} />
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      margin: 20
    },
  horizontalRule: {
    borderBottomColor: 'rgba(0,0,0,.1)',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  label: {
    color: '#000000',
    //    marginBottom: 5,
    //  marginTop: 15,
    fontWeight: '300',
    fontSize: normalize(14)
  },
  inputError: {
    borderColor: 'red',
    color: 'red'
  },
  container: {
    borderWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 5,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
    //    alignItems:'flex-start'
  },
  separator: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: 10,
  },


});
export default ProjectEditComponent