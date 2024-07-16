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
import { formatNumber } from '@/functions/stringfunctions';
import SliderModal from '@/components/Slider';
 


export default function Project() {
  const [projectId, setProjectId] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [categories, setCategories] = useState<DropdownItem[]>([]);
  const { data } = useLocalSearchParams();
  const initialData = data ? JSON.parse(data as string) : null;
  const [projectData, setProjectData] = useState(initialData);
  const [cost, setProjectCost] = useState<number>(0);
  const [title, setProjectTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DropdownItem | null>(null);
  const { userId } = useSession();
  const [isBudgetModalVisible, setBudgetModalVisible] = useState(false);
  const [isCategoryValid, setCategoryValid] = useState<boolean>(true);
  const [isProjectNameValid, setProjectNameValid] = useState<boolean>(true);
  const [isCostValid, setCostValid] = useState<boolean>(true);
  const [errors, setErrors] = useState<string[]>([]);


  const validateCategory = () : boolean =>{
    if (selectedCategory) {
        setCategoryValid(true);
        return true;
    } else {
      setCategoryValid(false);
      return false;
    }
  }
  const validateProjectName = () : boolean =>{
    if (title.length > 0) {
        setProjectNameValid(true);
        return true;
    } else {
      setProjectNameValid(false);
      return false;
    }
  }

  const validateCost = () : boolean =>{
    if (cost > 0) {
        setCostValid(true);
        return true;
    } else {
      setCostValid(false);
      return false;
    }
  }

  const handleValidation = (): boolean => {
    const validationErrors: string[] = [];

    if (!validateCategory()) validationErrors.push('Invalid username');
    if (!validateProjectName()) validationErrors.push('Invalid email');
    if (!validateCost()) validationErrors.push('Invalid password');

    setErrors(validationErrors);

    // Return true if there are no validation errors
    return validationErrors.length === 0;
  };



  const handleBudgetButtonClick = () => {
    setBudgetModalVisible(!isBudgetModalVisible);
  };
  const handleBudgetChange = (value:number) => {
    setProjectCost(value);
  };

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
    const isValid = handleValidation();
    if (isValid) 
    {

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

      // const response = await fetchWithAuth(url);
      // const result: Project[] = await response.json();

      const responseText = await response.json();

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${responseText}`);
      }
      console.log(responseText);
      setProjectData(responseText);
      console.log(projectData);
    } catch (error) {
      console.error('Failed to add project:', error);
    }
  }
};

  const renderItem = ({ item }: { item: any }) => <ListItem item={item} onDelete={function (id: number): void {
    throw new Error('Function not implemented.');
  } } />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={{marginLeft:20}} onPress={() => { router.replace('/projects/Projects'); }}>
        <FontAwesome name="arrow-left" /> Projects
      </Text>
      <ScrollView  style={styles.scrollContainer}>
        <Text style={{fontWeight:'bold'}}>Build a project. Get Dollars. Or just show off a bit.</Text>
        <View style={styles.horizontalRule} />

        <View style={styles.inputView}>
          <Text style={styles.label}>Category</Text>
          <DropdownInput
            data={categories}            
            //placeholder="Select a Category"
            setValue={selectedCategory}
            onSelect={item => {
              setSelectedCategory(item);

            }}            
          />
           {!isCategoryValid &&
            (<Text style={{ color: 'red' }}>Please choose a category.</Text>)}
          <Text style={styles.label}>Project Name</Text>
          <TextInput
            placeholder="Project Name"
            value={title}
            onChangeText={(text) => {setProjectTitle(text); validateProjectName();}}
            onKeyPress={validateProjectName}
            style={[styles.input, !isProjectNameValid && styles.inputError]}
            // onBlur={validateProjectName}
          />
          {!isProjectNameValid &&
            (<Text style={{ color: 'red' }}>Project Name is required.</Text>)}
          <Text style={styles.label}>Cost</Text>
          <TouchableOpacity
        onPress={() => setBudgetModalVisible(true)}>
          <TextInput
            placeholder="Project Cost"
            keyboardType='number-pad'
            value={"$" + formatNumber(cost)}
            onChangeText={setProjectCost}
            editable={false}
            pointerEvents="none"
            style={[styles.input, !isCostValid && styles.inputError]}
                        
          />
            {!isCostValid &&
            (<Text style={{ color: 'red' }}>Project cost must be {'>'} 0.</Text>)}

          </TouchableOpacity>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <TouchableOpacity onPress={AddProject}>
              <View style={GlobalStyles.buttonContainer}>
              <Text style={GlobalStyles.button}>Save</Text>
              </View>
            </TouchableOpacity>
            {!projectData  && <Text>Nope</Text>}
            {projectData  && <Text>Yup</Text>}

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

          {(projectData) ? 
          (
          <>  
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
              /></>) : (<><Text>Give your project some details to start getting noticed. </Text></>)}
      </ScrollView>
      <SliderModal type="dollars" onValueChange={handleBudgetChange} visible={isBudgetModalVisible} userradius={cost} onClose={()=> {setBudgetModalVisible(false);validateCost();}} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(221, 221, 221, 1)', //
//    margin: 20,
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
  label: {
    color:'#B87333',
    marginBottom: 5,
    marginTop: 15,
    fontWeight:'bold'
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
    justifyContent:'flex-start',
//    alignSelf:'center'
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
