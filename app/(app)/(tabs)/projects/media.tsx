import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Image, Alert, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Button, Provider, Card, IconButton } from 'react-native-paper';
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
import { DropdownItem } from '@/components/DropDowmList';
import fetchWithAuth from '@/context/FetchWithAuth';

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
    const [loading, setLoading] = useState(false);

    // const projectData = data ? JSON.parse(data as string) : null;

    const pickImage = async (setImage: React.Dispatch<React.SetStateAction<ImagePicker.ImagePickerAsset | null>>, mediaType: ImagePicker.MediaTypeOptions) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: mediaType,
            allowsEditing: false,
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
        setLoading(true);
        //call database first then set object 
        let formData = new FormData();

        if (afterImage != null) {
            formData.append('Files', {
                uri: afterImage.uri,
                name: 'after_image.' + afterImage.uri.split('.').pop(),
                type: afterImage.uri.split('.').pop(),
            } as any)
        }
        if (beforeImage != null) {
            formData.append('files', {
                uri: beforeImage.uri,
                name: 'before_image.' + beforeImage.uri.split('.').pop(),
                type: beforeImage.uri.split('.').pop(),
            } as any)
        }
        if (videoUri != null) {
            formData.append('files', {
                uri: videoUri.uri,
                name: 'video.' + videoUri.uri.split('.').pop(),
                type: videoUri.uri.split('.').pop()
            } as any)
        }

        formData.append('Description', description);

        try {
            const response = await fetch(BASE_URL + '/api/Upload/upload/projects/' + projectData.projectId, {
                method: 'POST',
                body: formData,
            });
            const responseText = await response.text(); // Read response as text

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${responseText}`);
            }

            const responseData = JSON.parse(responseText);

            const updatedProjectData = projectData;
            updatedProjectData.details = [...updatedProjectData.details, responseData];
            setItems(updatedProjectData.details);

        } catch (error) {
            Alert.alert("There was a problem adding the media.", "Please try again.");
        }

        // Reset form
        setDescription('');
        setBeforeImage(null);
        setAfterImage(null);

        router.replace({
            pathname: '/projects/project',
            params: { data: JSON.stringify(projectData) }
        });
    };

    if (loading) {
        return (
          <View style={styles.loadingContainer}>
            <Text>Saving Media{'\n'}</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
      }
    

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{ marginLeft: 20 }} onPress={() => {
                router.replace({
                    pathname: '/projects/project',
                    params: { data: JSON.stringify(projectData) }
                });
            }}>
                <FontAwesome name="arrow-left" /> Project
            </Text>

            <Provider>
                <ScrollView automaticallyAdjustKeyboardInsets={true}>
                    <View style={styles.form}>
                        <View style={styles.photoBox}>
                            <Text style={{ marginBottom: normalize(10) }}>Show off your work with before and after pics </Text>
                            <View style={styles.photoRow}>
                                <CameraButton label="Photo" onPress={() => pickImage(setAfterImage, ImagePicker.MediaTypeOptions.Images)} imageUri={afterImage?.uri || null} />
                                <View style={{ width: 50 }}></View>
                                {afterImage &&
                                    <CameraButton label="Before" onPress={() => pickImage(setBeforeImage, ImagePicker.MediaTypeOptions.Images)} imageUri={beforeImage?.uri || null} />
                                }
                            </View>
                        </View>
                        <View style={styles.videoBox}>
                            <Text style={{ marginBottom: 10 }}>Upload a Video </Text>
                            <View style={styles.photoRow}>
                                <VideoButton label="Video" onPress={() => pickImage(setVideo, ImagePicker.MediaTypeOptions.Videos)} videoUri={videoUri?.uri || null} />
                            </View>
                        </View>
                        <View style={{ margin: 10 }}>
                            <TextInput
                                placeholder="Give it some life..."
                                value={description}
                                onChangeText={setDescription}
                                style={styles.input}
                                multiline={true}
                                maxLength={500}
                            />
                        </View>

                        <View style={styles.buttons}>
                            <TouchableOpacity style={{ flex: 1 }} onPress={addItem}>
                                <View style={styles.buttonContainer}>
                                    <Text style={styles.button}>Add</Text>
                                </View>
                            </TouchableOpacity>

                            {/* <View style={styles.space} /> */}
                            <TouchableOpacity style={{ flex: 1 }} onPress={Cancel}>
                                <View style={styles.buttonContainer}>

                                    <Text style={styles.button}>Cancel</Text>
                                </View>

                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </Provider>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    container: {
        flex: 1,
        backgroundColor: 'rgba(221, 221, 221, 1)',
    },
    buttons: {
        flexDirection: 'row',
        width: null,
        justifyContent: 'space-evenly',
        
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
    photoBox: {
        margin: normalize(10),
        borderWidth: 2,
        padding: normalize(5),
        borderRadius: 10,
        marginBottom: normalize(10),
        borderColor:"#fff",
        
    },
    videoBox: {
        margin: normalize(10),
        borderWidth: 2,
        borderColor:"#fff",
        padding: normalize(5),
        borderRadius: 10,
        marginBottom: normalize(10),

    },
    photoRow: {
        flexDirection: 'row',
        marginLeft: 20
    },

    form: {
        marginTop: normalize(20),
    },
    input: {
        textAlignVertical: 'top',
        height: normalize(200),
        borderColor: '#fff',
        backgroundColor: 'rgba(255, 255, 255, .6)',
        borderRadius: 10,
        shadowColor: '#000',
        color: '#000',
        padding:10,
        // elevation: 5,
        borderWidth: normalize(1),
    },
    space: {
        width: normalize(20),
    }
});

export default App;
