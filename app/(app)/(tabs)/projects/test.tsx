import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Alert, TouchableOpacity } from 'react-native';
import { Button, TextInput, Provider, Card, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import CameraButton from '@/components/CameraButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { ProjectDetails } from '@/interfaces/IProject';
import { normalize } from 'react-native-elements';
import VideoButton from '@/components/VideoButton';
import { ResizeMode, Video } from 'expo-av';
import { BASE_URL } from '@/constants/Endpoints';

interface Item {
    id: number;
    description: string;
    beforeImage: string | null;
    afterImage: string | null;
}

const App: React.FC = () => {
    const [items, setItems] = useState<ProjectDetails[]>([]);
    const [description, setDescription] = useState<string>('');
    const [beforeImage, setBeforeImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [videoUri, setVideo] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [afterImage, setAfterImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const { data } = useLocalSearchParams();
    const projectData = data ? JSON.parse(data as string) : null;
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});

    // const projectData = data ? JSON.parse(data as string) : null;

    const pickImage = async (setImage: React.Dispatch<React.SetStateAction<ImagePicker.ImagePickerAsset | null>>, mediaType: ImagePicker.MediaTypeOptions) => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: mediaType,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
    
        if (!result.canceled) {
          setImage(result.assets[0]);
        }
      };

    const Cancel = () => {

        router.replace({
            pathname: '/projects/project',
            params: { data: JSON.stringify(projectData) }
        });
    }

    const addItem = async () => {

        const newItem: ProjectDetails = {
            projectDetailId: 0,
            description: description,
            afterImage: afterImage?.uri || null,
            beforeImage: beforeImage?.uri || null,
            video: videoUri?.uri || null
        }

        const updatedProjectData = [...projectData];
        updatedProjectData[0].details = [...updatedProjectData[0].details, newItem];
        setItems(updatedProjectData[0].details);

        let formData = new FormData();

        if (afterImage != null) {
            formData.append('files', {
                uri: afterImage.uri,
                name: afterImage.fileName || 'photo_after.jpg',
                type: afterImage.type || 'image/jpeg',            } as any)
        }
        formData.append('description', description);

        // for (let pair of formData.entries()) {
        //     console.log(`${pair[0]}: ${pair[1]}`);
        // }
                try {
            const response = await fetch(BASE_URL + '/api/Upload/upload', {
                method: 'POST',
                body: formData,
                // headers: {
                //     'Content-Type': 'multipart/form-data',
                // },
            });
            const responseText = await response.text(); // Read response as text

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${responseText}`);
            }
    
            // Parse the response text as JSON
            const responseData = JSON.parse(responseText);
            console.log(responseData);         
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }

        // Reset form
        setDescription('');
        setBeforeImage(null);
        setAfterImage(null);





        router.replace({
            pathname: '/projects/project',
            params: { data: JSON.stringify(projectData) }
        });

        //    Alert.alert(JSON.stringify(projectData[0].details[2]));
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text onPress={() => {
                router.replace({
                    pathname: '/projects/project',
                    params: { data: projectData }
                });
            }}>
                <FontAwesome name="arrow-left" /> Projects
            </Text>

            <Provider>
                <View style={styles.form}>
                    <View style={styles.photoBox}>
                        <Text style={{ marginBottom: 10 }}>Show off your work with before and after pics </Text>
                        <View style={styles.photoRow}>
                        <CameraButton label="After" onPress={() => pickImage(setAfterImage, ImagePicker.MediaTypeOptions.Images)} imageUri={afterImage?.uri || null} />
                            <View style={styles.space}></View>
                            <CameraButton label="Before" onPress={() => pickImage(setBeforeImage, ImagePicker.MediaTypeOptions.Images)} imageUri={beforeImage?.uri || null} />                        
                        </View>
                    </View>
                    <View style={styles.photoBox}>
                        <Text style={{ marginBottom: 10 }}>Upload a Video </Text>
                        <View style={styles.photoRow}>
                            <VideoButton label="Video" onPress={() => pickImage(setVideo, ImagePicker.MediaTypeOptions.Videos)} videoUri={videoUri?.uri || null} />
                        </View>
                    </View>
                    <View>
                        <TextInput
                            label="Description"
                            value={description}
                            onChangeText={setDescription}
                            style={styles.input}
                            //                            multiline={true}
                            maxLength={500}
                        />
                    </View>

                    <View style={styles.buttons}>
                        <View style={[styles.buttonContainer]}>
                            <TouchableOpacity onPress={addItem} >
                                <Text style={styles.button}>  Add</Text>
                            </TouchableOpacity>

                        </View>
                        <View style={styles.space} />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={Cancel} >
                                <Text style={styles.button}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                </View>
            </Provider>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        padding: 30,
    },


    buttonContainer: {
        backgroundColor: '#e4eaf7',
        borderColor: '#B87333',
        borderWidth: 1.5,
        borderRadius: 15, // Rounded edges
        //        height:20
        padding: 20,
        justifyContent: 'center',
        paddingVertical: 8,
        shadowColor: '#000', // Shadow for a subtle depth effect
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 0,
        elevation: 5, // For Android shadow
        color: '#000',
        width: 100,
    },
    button: {
        fontSize: 18,
        fontWeight: 'black',
        color: '#000',
    },


    photoBox: {
        //  margin: 20,
        borderWidth: .5,
        padding: 10,
        borderRadius: 10,
        marginBottom: 10
    },
    photoRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    form: {
        marginTop: 20,
    },
    input: {
        // marginBottom: 10,
        // height: 250,
        height: normalize(200),
        borderColor: '#B87333',
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: '#000',
        color: "#000",
        elevation: 5,
        borderWidth: normalize(1),
        //        marginBottom: normalize(10),
        //      paddingHorizontal: normalize(10),
        width: '100%',

    },
    card: {
        marginBottom: 10,
    },
    image: {
        width: 100,
        height: 100,
        marginVertical: 10,
    },
    space: {
        width: normalize(50)
    }
});

export default App;
