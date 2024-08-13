import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, ActivityIndicator, Button, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CameraButton from '@/components/CameraButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import VideoButton from '@/components/VideoButton';
import { BASE_URL } from '@/constants/Endpoints';
import fetchWithAuth from '@/context/FetchWithAuth';
import { Project, ProjectDetails } from '@/interfaces/IProject';
import { Slider, normalize } from 'react-native-elements';
import Modal from 'react-native-modal';


interface MediaModalProps {
  visible: boolean;
  project: Project;
  onClose: () => void;
  onSave: (data: Project) => void;
}

const MediaModal: React.FC<MediaModalProps> = ({ visible, project, onClose, onSave }) => {
  const [items, setItems] = useState<ProjectDetails[]>([]);
  const [description, setDescription] = useState<string>('');
  const [beforeImage, setBeforeImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [videoUri, setVideo] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [afterImage, setAfterImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [projectData, setProjectData] = useState<Project>(project);
  const [loading, setLoading] = useState(false);

  const pickImage = async (setImage: React.Dispatch<React.SetStateAction<ImagePicker.ImagePickerAsset | null>>, mediaType: ImagePicker.MediaTypeOptions) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: mediaType,
      allowsEditing: true,
      aspect: [4,5],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
      setImage(result.assets[0]);
    }
  };

  const cancel = () => {
    setAfterImage(null);
    setBeforeImage(null);
    setVideo(null);
    setDescription('');
    onClose();
  };

  const addItem = async () => {
    if (afterImage == null && videoUri == null && description.length == 0) {
      Alert.alert("Please add media.");
      return;
    }
    setLoading(true);

    let formData = new FormData();

    if (afterImage != null) {
      formData.append('Files', {
        uri: afterImage.uri,
        name: 'after_image.' + afterImage.uri.split('.').pop(),
        type: afterImage.uri.split('.').pop(),
      } as any);
    }
    if (beforeImage != null) {
      formData.append('files', {
        uri: beforeImage.uri,
        name: 'before_image.' + beforeImage.uri.split('.').pop(),
        type: beforeImage.uri.split('.').pop(),
      } as any);
    }
    if (videoUri != null) {
      formData.append('files', {
        uri: videoUri.uri,
        name: 'video.' + videoUri.uri.split('.').pop(),
        type: videoUri.uri.split('.').pop(),
      } as any);
    }

    formData.append('Description', description);
    try {
      const response = await fetch(BASE_URL + '/api/Upload/upload/projects/' + projectData.projectId, {
        method: 'POST',
        body: formData,
      });
      const responseText = await response.json();

      if (!response.ok) {
        Alert.alert("Error", responseText.message);
        return;
      }

      const responseData = responseText;
      const updatedProjectData = projectData;
      updatedProjectData.details = [...updatedProjectData.details, responseData];
      setItems(updatedProjectData.details);

    } catch (error) {
      Alert.alert("There was a problem adding the media.", "Please try again.");
      setLoading(false);
      return;
    }

    setDescription('');
    setBeforeImage(null);
    setAfterImage(null);
    onSave(projectData);
  };

 
  return (
    <Modal isVisible={visible} style={styles.modal} >
      <KeyboardAvoidingView style={styles.modalContent} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.photoBox}>
          {/* <Text style={{ marginBottom: normalize(10) }}>Before and after pics </Text> */}
          <View style={styles.photoRow}>
            <CameraButton label="After" onPress={() => pickImage(setAfterImage, ImagePicker.MediaTypeOptions.All)} imageUri={afterImage?.uri || null} />
            <CameraButton label="Before" onPress={() => {
              if (!afterImage) { Alert.alert("please upload finished picture first."); return; }
              pickImage(setBeforeImage, ImagePicker.MediaTypeOptions.Images)
            }} imageUri={beforeImage?.uri || null} />
            <VideoButton label="Video" onPress={() => pickImage(setVideo, ImagePicker.MediaTypeOptions.Videos)} videoUri={videoUri?.uri || null} />
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <TextInput
            placeholder="Project Description ..."
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
          <TouchableOpacity style={{ flex: 1 }} onPress={cancel}>
            <View style={styles.buttonContainer}>

              <Text style={styles.button}>Cancel</Text>
            </View>

          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({

  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    marginLeft: 0,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    margin: 10,
  },
  button: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  photoBox: {
    marginBottom: normalize(10),
  },
  photoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  input: {
    textAlignVertical: 'top',
    height: normalize(200),
    borderColor: '#B87333',
    borderRadius: 10,
    shadowColor: '#000',
    color: '#000',
    padding: 10,
    borderWidth: normalize(1),
    borderStyle: 'dashed'
  },
  modalContent: {
    marginTop: 20,
    backgroundColor: 'white',
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: 'rgba(0, 0, 0, 0.1)',

    //    maxHeight: '90%',

  },

});

export default MediaModal;
