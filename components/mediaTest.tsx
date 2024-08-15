import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, Alert, Modal, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { DragSortableView } from 'react-native-drag-sort';
import 'react-native-reanimated';
import { FontAwesome, FontAwesome5, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { Button, normalize } from 'react-native-elements';
import { ProjectDetails, uploadfile } from '@/interfaces/IProject';
import { ResizeMode, Video } from 'expo-av';
import * as ImageManipulator from 'expo-image-manipulator';


interface MediaComponentProps {
  data: ProjectDetails[];
  onValueChange: (value: ProjectDetails[]) => void;
  isDragging: (drag:boolean) => void;
}



const MediaPicker: React.FC<MediaComponentProps> = ({ data = [], onValueChange, isDragging }) => {
  const [media, setMedia] = useState<ProjectDetails[]>(data);
  const [selectedItem, setSelectedItem] = useState<ProjectDetails | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [description, setDescription] = useState<string | null>(null);
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [hideAdd, setHideAdd] = useState<boolean>(false);


  useEffect(() => {
    onValueChange(media);
  }, [media]);


  const handleDrag = (drag:boolean) =>{
    if (drag){
      setMedia((prevMedia) => prevMedia.filter((item) => item.key !== "-1"));
    }
    else {
      const newMedia = ({
        key: "-1",
        rank: 0, // Ensure unique key
        projectDetailId: 0,
        afterImage: 'add', // Assuming all selected items are images
        beforeImage: '',
        video: '',
        description: '',
        files:[]
      });
      setMedia((prevMedia) => [...prevMedia,newMedia,]);
    }
    isDragging(drag);
  }



  useEffect(() => {
    if (media?.filter(f => f.key == "-1").length === 0) {
      const newMedia = ({
        key: "-1",
        rank: 0, // Ensure unique key
        projectDetailId: 0,
        afterImage: 'add', // Assuming all selected items are images
        beforeImage: '',
        video: '',
        description: '', 
        files:[]       
      });      
      setMedia((prevMedia) => [...prevMedia,newMedia]);
    }

  }, []);

  const resizeImage = async (image: ImagePicker.ImagePickerAsset) => {
    const targetAspectRatio = 4 / 5;
    const originalWidth = image.width || 0;
    const originalHeight = image.height || 0;
  
    let cropWidth = originalWidth;
    let cropHeight = originalHeight;
    let cropX = 0;
    let cropY = 0;
  
    // Determine whether to crop width or height to fit the target aspect ratio
    const originalAspectRatio = originalWidth / originalHeight;
    
    if (originalAspectRatio > targetAspectRatio) {
      // Image is wider than 4:5, so crop the width
      cropWidth = originalHeight * targetAspectRatio;
      cropX = (originalWidth - cropWidth) / 2; // Center the crop horizontally
    } else if (originalAspectRatio < targetAspectRatio) {
      // Image is taller than 4:5, so crop the height
      cropHeight = originalWidth / targetAspectRatio;
      cropY = (originalHeight - cropHeight) / 2; // Center the crop vertically
    }
  
    // Perform the crop operation
    const cropResult = await ImageManipulator.manipulateAsync(
      image.uri,
      [{
        crop: {
          originX: cropX,
          originY: cropY,
          width: cropWidth,
          height: cropHeight
        },
      }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG } // No compression yet
    );
  
    // Then resize the cropped image
    const targetWidth = 500; // Target width for profile image
    const targetHeight = Math.floor(targetWidth * (5 / 4)); // Adjust height for 4:5 aspect ratio
  
    const manipResult = await ImageManipulator.manipulateAsync(
      cropResult.uri,
      [{ resize: { width: targetWidth, height: targetHeight } }],
      { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG } // Compress with 50% quality
    );
  
    const type = 'image/jpeg';
    const name = image.uri.split('/').pop() || 'image.jpg';
  
    return { uri: manipResult.uri, type, name };
  };
    
  const pickMedia = async (beforePic: boolean = false, mediaType: ImagePicker.MediaTypeOptions) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Please grant media library permissions to select media.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: mediaType,
      allowsEditing: true,
      quality: 1,
      aspect: [4,5]
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0]; // Since only one image/video is selected
  
      if (asset.type === 'image') {
        const resizedUri = await resizeImage(asset); // Resize image to 1000px width with 4:5 aspect ratio
        if (beforePic) {

          const newFile: uploadfile = {
            uri: resizedUri.uri,
            type: resizedUri.type || 'image/jpeg', // Assign a default type if not provided
            name: `before.jpg`, // Generate a name if not provided
        };
    
        setSelectedItem({
            ...selectedItem,
            beforeImage: resizedUri.uri, // Update the beforeImage URI
            files: [...(selectedItem?.files || []), newFile], // Append the new file to the existing array
        });
        } else {
          const newFile: uploadfile = {
            uri: resizedUri.uri,
            type: resizedUri.type || 'image/jpeg', // Assign a default type if not provided
            name: `after.jpg`, // Generate a name if not provided
        };
          const newMedia = {
            key: `${media.length}`,
            rank: media.length, // Ensure unique key
            projectDetailId: 0,
            afterImage: resizedUri.uri,
            beforeImage: null,
            video: null,
            description: '',
            files: [newFile]
          };
          setMedia([...media.slice(0, -1), newMedia, media[media.length - 1]]);
        }
      } else if (asset.type === 'video') {
        if (beforePic) {
          Alert.alert("Cannot select a video as the before image.");
        } else {
          const newFile: uploadfile = {
            uri: asset.uri,
            type: asset.type, 
            name: asset.fileName, 
        };
          const newMedia = {
            key: `${media.length}`,
            rank: media.length, // Ensure unique key
            projectDetailId: 0,
            afterImage: null,
            beforeImage: null,
            video: asset.uri,
            description: '',
            files: [newFile]
          };
          setMedia([...media.slice(0, -1), newMedia, media[media.length - 1]]);
        }
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
      selectedItem.description = description;
      setMedia(media.map(item => item.key === selectedItem.key ? selectedItem : item));
      setIsModalVisible(false);
    }
  };

  const deleteBeforeImage = () => {
    if (selectedItem) {
      setBeforeImage(null);      
      setSelectedItem({ ...selectedItem, beforeImage: null,
      files: selectedItem.files?.filter(file => file.name !== "before.jpg") || []
    });
    }
  }
  const renderItem = (item: ProjectDetails, index: number) => {
    if (item.afterImage === 'add' && hideAdd) {
      return (
      <></>        
      );
    }

    if (item.afterImage === 'add' && !hideAdd) {
      return (
        <TouchableOpacity style={styles.mediaTile} onPress={() => { pickMedia(false, ImagePicker.MediaTypeOptions.All) }}>
          <FontAwesome name="camera" size={normalize(50)} color="#B87333" />
        </TouchableOpacity>
        
      );
    }

    if (item.video) {
      return (
        <View key={item.rank}>
          <Video
            style={styles.mediaTile}
            source={{
              uri: item.video,
            }}
            useNativeControls
            resizeMode={ResizeMode.COVER}
            isLooping={false}
          />
          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteMedia(item.key.toString())}>
            <FontAwesome style={styles.deleteButtonText} name="times"></FontAwesome>
          </TouchableOpacity>
          <TouchableOpacity key={item.rank} onPress={() => openModal(item)} style={styles.editButton} >
            <FontAwesome6 style={styles.editButtonText} size={normalize(3)} name="pencil"></FontAwesome6>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <View key={item.rank}>
        <Image source={{ uri: item.afterImage?.toString() }} style={[styles.mediaTile]} />
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteMedia(item.key.toString())}>
          <FontAwesome style={styles.deleteButtonText} name="times"></FontAwesome>
        </TouchableOpacity>
        <TouchableOpacity key={item.rank} onPress={() => openModal(item)} style={styles.editButton} >
          <FontAwesome6 style={styles.editButtonText} size={normalize(3)} name="pencil"></FontAwesome6>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <Text style={styles.mediaTitle}>Project Media</Text>
      <Text style={styles.subTitle}>Long Press an tile to re-order. Tap <FontAwesome6 style={styles.editButtonText} name="pencil"></FontAwesome6> to add additonal attributes.</Text>
      {media &&
      <DragSortableView
        dataSource={media}
        parentWidth={Dimensions.get('window').width}
        childrenHeight={Dimensions.get('window').width / 3 - 20}
        childrenWidth={Dimensions.get('window').width / 3 - 20}
        onDataChange={(data) => setMedia(data)}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        delayLongPress={200} 
        onDragStart={()=>{handleDrag(true)}}
        onDragEnd={()=>{handleDrag(false)}}
        />
        }
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <KeyboardAvoidingView style={styles.modalContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
            {selectedItem.video && (<><Text>Add a description to your video.</Text><Video
                  style={styles.mediaTile}
                  source={{
                    uri: selectedItem.video,
                  }}
                  useNativeControls
                  resizeMode={ResizeMode.COVER}
                  isLooping={false} /></>
            )}
            {selectedItem.afterImage && (
                <>
                <Text>Add a description and (or) a before image.</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>                                                    
                  <Image source={{ uri: selectedItem.afterImage?.toString() }} style={styles.mediaTile} />
                  {!selectedItem.beforeImage ?
                    (
                      <TouchableOpacity style={styles.mediaTile} onPress={() => { pickMedia(true, ImagePicker.MediaTypeOptions.Images); }}>
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
                    </>
                    )}
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
