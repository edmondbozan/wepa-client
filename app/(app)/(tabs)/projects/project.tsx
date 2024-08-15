import { router, useLocalSearchParams } from 'expo-router';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import normalize from '@/fonts/fonts';
import { Project, User } from '@/interfaces/IProject';
import ProjectEditComponent from '@/components/ProjectEdit';
import ProjectModal from '@/components/ProjectModal';
import { ScrollView } from 'react-native-gesture-handler';
import { fetchUserData } from '@/http/apiUser';
import { useSession } from '@/context/ctx';
import fetchWithAuth from '@/context/FetchWithAuth';
import { BASE_URL } from '@/constants/Endpoints';


export default function ProjectComponent() {
  const { data } = useLocalSearchParams();
  const initialData = data ? JSON.parse(data as string) : null;
  const [projectData, setProjectData] = useState<Project>(initialData);
  const [isProjectModalVisible, setProjectModeVisible] = useState<boolean>(false);
  const { userId } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);




  useEffect(() => {
  }, [projectData]);

  const handleProjectChange = (value: Project) => {
    setProjectData(value);
  }

  const handleSaveProject = async () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("id", (projectData.projectId) ? projectData.projectId.toString() : "0");
    formData.append("userId", userId.toString());
    formData.append("title", projectData.title);
    formData.append("cost", projectData.cost);
    formData.append("categoryId", projectData.categoryId.toString());
//    formData.append("enabled", projectData.en)


    projectData.details.forEach((detail, index) => {
      if (detail.key != "-1") {   //Skip the add button
        formData.append(`details[${index}].rank`, detail.rank.toString() || '');
        formData.append(`details[${index}].description`, detail.description || '');
        formData.append(`details[${index}].afterUri`, detail.afterImage || '');
        formData.append(`details[${index}].beforeUri`, detail.beforeImage || '');
        formData.append(`details[${index}].videoUri`, detail.video || '');

        // Append each file associated with this detail
        detail.files?.forEach((file, fileIndex) => {
          console.log(file);
          formData.append(`details[${index}].files`, {
            uri: file.uri,  // The local file URI
            type: file.type, // MIME type, e.g., 'image/jpeg'
            name: file.name || `file_${index}_${fileIndex}`, // A name for the file
          } as any);
        });
      }
    });
    const response = await fetchWithAuth(BASE_URL + '/api/upload/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (response.ok) {
      router.navigate("/projects/Projects");
      setIsLoading(false);

    } else {
      console.log(response);
      console.error("Failed to save project:", response.statusText);
    }
  }


  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }



  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: "#fff" }}>
        <TouchableOpacity onPress={handleSaveProject}>
          <Text>save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            // Update projectData by filtering the details
            setProjectData((prevProjectData) => ({
              ...prevProjectData,
              details: prevProjectData.details.filter((item) => item.key !== "-1"),
            }));

            if (projectData.phoneNumber == null) {
              try {
                // Fetch user data
                const user: User = await fetchUserData(userId);

                // Decorate projectData with user details
                setProjectData((prevProjectData) => ({
                  ...prevProjectData,
                  userType: user.userType,
                  userName: user.userName,
                  userId: user.userId,
                  phoneNumber: user.phoneNumber,
                  licenseNumber: user.licenseNumber,
                }));
              } catch (error) {
                console.error('Failed to fetch user data:', error);
              }
            }

            // Set project mode visible
            setProjectModeVisible(true);
          }}
        >
          <Text style={{ color: '#B87333' }}>preview</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          router.navigate({
            pathname: '/projects/Projects',
          })
        }
        }>
          <Text>cancel</Text>
        </TouchableOpacity>

      </View>
      <View style={styles.horizontalRule} />
      <ProjectEditComponent onValueChange={handleProjectChange} data={projectData}></ProjectEditComponent>
      {isProjectModalVisible &&
        <ProjectModal visible={isProjectModalVisible} projectId={0} project={projectData} onClose={() => setProjectModeVisible(false)}></ProjectModal>
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    //    margin:10
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
    marginVertical: 15,
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
