import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, Alert, Modal, TextInput, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { DragSortableView } from 'react-native-drag-sort';
import 'react-native-reanimated';
import { FontAwesome, FontAwesome5, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { Button, normalize } from 'react-native-elements';
import { ProjectDetails } from '@/interfaces/IProject';
import { ResizeMode, Video } from 'expo-av';


interface MediaComponentProps {
  data: ProjectDetails[];
  onValueChange: (value: ProjectDetails[]) => void;
}




const MediaPicker: React.FC<MediaComponentProps> = ({ data, onValueChange }) => {
  const [media, setMedia] = useState<ProjectDetails[]>(data);
  const [selectedItem, setSelectedItem] = useState<ProjectDetails | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [description, setDescription] = useState<string | null>(null);
  const [beforeImage, setBeforeImage] = useState<string | null>(null);

  useEffect(() => {
    onValueChange(media);
  }, [media]);


  useEffect(() => {
    if (media.filter(f => f.key == "-1").length === 0) {
      const newMedia = ({
        key: "-1",
        rank: 0, // Ensure unique key
        projectDetailId: 0,
        afterImage: 'add', // Assuming all selected items are images
        beforeImage: '',
        video: '',
        description: '',
      });
      setMedia((prevMedia) => [
        ...prevMedia,
        newMedia,
      ]);
    }

  }, []);

  const pickMedia = async (beforePic: boolean = false) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Please grant media library permissions to select media.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      if (beforePic) {
        setSelectedItem({ ...selectedItem, beforeImage: result.assets[0].uri });
        // setSelectedItem({...selectedItem,key:beforeImage: result.assets[0].uri});
      } else {
        const newMedia = result.assets.map((asset, index) => ({
          key: `${media.length + index}`,
          rank: index, // Ensure unique key
          projectDetailId: 0,
          //        uri: asset.uri,
          afterImage: asset.uri, // Assuming all selected items are images
          beforeImage: '',
          video: '',
          description: '',

        }));
        setMedia([...media.slice(0, -1), ...newMedia, media[media.length - 1]]);
      }
    }
  };
  const deleteMedia = (key: string) => {
    setMedia(media.filter(item => item.key.toString() !== key));
  };

  const openModal = (item: ProjectDetails) => {

    setSelectedItem(item);
    setDescription(item.description);
    setBeforeImage(item.afterImage);
    setIsModalVisible(true);
  };
  const saveDescription = () => {
    if (selectedItem) {
      setMedia(media.map(item => item.key === selectedItem.key ? { ...item, description, beforeImage } : item));
      setIsModalVisible(false);
    }
  };

  const deleteBeforeImage = () =>{
    if (selectedItem) {
      setBeforeImage(null);
      setSelectedItem({ ...selectedItem, beforeImage: null});

  }
  }
  const renderItem = (item: ProjectDetails, index: number) => {
    if (item.afterImage === 'add') {
      return (
        <TouchableOpacity style={styles.mediaTile} onPress={() => { pickMedia(false) }}>
          <FontAwesome name="camera" size={normalize(50)} color="#B87333" />
        </TouchableOpacity> 
      );
    }

    if(item.video){
      return(
      <Image source={{ uri: item.video }} style={styles.mediaTile} />
      )}
      //   <Video
      //   ref={item.video}
      //   style={styles.mediaTile}
      //   source={{
      //     uri: item.video,
      //   }}
      //   useNativeControls
      //   playsInSilentLockedModeIOS={true}
      //   resizeMode={ResizeMode.COVER}
      //   isLooping
      //   onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      // />
      
    

    return (
      <View key={item.rank}>        
        <Image source={{ uri: item.afterImage?.toString() }} style={[styles.mediaTile]} />
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteMedia(item.key.toString())}>
          <FontAwesome style={styles.deleteButtonText} name="times"></FontAwesome>
        </TouchableOpacity>
        <TouchableOpacity key={item.rank} onPress={() => openModal(item)} style={styles.editButton} >
          <FontAwesome6 style={styles.editButtonText} size={3} name="pencil"></FontAwesome6>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <Text style={styles.mediaTitle}>Project Media</Text>
      <Text style={styles.subTitle}>Long Press an tile to re-order. Tap <FontAwesome6 style={styles.editButtonText} name="pencil"></FontAwesome6> to add additonal attributes.</Text>
      <DragSortableView
        dataSource={media}
        parentWidth={Dimensions.get('window').width}
        childrenHeight={Dimensions.get('window').width / 3 - 20}
        childrenWidth={Dimensions.get('window').width / 3 - 20}
        onDataChange={(data) => setMedia(data)}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        delayLongPress={200} />    
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}>      
        <KeyboardAvoidingView style={styles.modalContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <Text>Add a description and or a before image.</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                  <Image source={{ uri: selectedItem.afterImage?.toString() }} style={styles.mediaTile} />
                  {!selectedItem.beforeImage ?
                    (
                      <TouchableOpacity style={styles.mediaTile} onPress={() => { pickMedia(true); } }>
                        <FontAwesome name="camera" size={normalize(50)} color="#B87333" />
                      </TouchableOpacity>
                    )
                    :
                    (
                      <View>
                        <Image source={{ uri: selectedItem.beforeImage?.toString() }} style={styles.mediaTile} />
                        <TouchableOpacity style={styles.deleteButton} onPress={deleteBeforeImage}>
                          <FontAwesome style={styles.deleteButtonText} name="times"></FontAwesome>
                        </TouchableOpacity>
                      </View>
                    )}
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Enter description"
                  value={description?.toString()}
                  onChangeText={setDescription}
                  multiline={true} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                  <TouchableOpacity onPress={saveDescription}>
                    <Text style={[styles.buttonText, { marginLeft: 10 }]}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                    <Text style={[styles.buttonText, { marginRight: 10 }]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal></>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mediaTouchable: {
    width: '69%',
    height: '69%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
//    marginLeft: 20,
    marginTop: 20,
    color: "black"
  },
  subTitle: {
    //    fontSize: 18,
    //    fontWeight: 'bold',
    //    margin: 20,
//    marginLeft: 20,
    marginTop: 10,
    marginBottom: normalize(20),
    color: "black"
  },
  mediaTile: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    width: normalize(90),
    height: normalize(90),
    position: 'relative',
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 15,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  editButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'white',
    borderRadius: 15,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  editButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    // alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContent: {
    //   width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    //    alignItems: 'center',
  },
  modalImage: {
    width: normalize(90),
    height: normalize(90),
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    height: 201
  },
  button: {
    height: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 2,
    padding: 10,
    borderColor: '#B87333'
  },
  buttonText: {
    color: '#000',
    fontSize: normalize(13),
    fontWeight: '500',
  }
});

export default MediaPicker;
