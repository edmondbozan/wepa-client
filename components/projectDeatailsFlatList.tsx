import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import { ProjectDetails } from '@/interfaces/IProject';
import { Button, normalize } from 'react-native-elements';
import GlobalStyles from '@/styles/styles';

interface ItemProps {
  item: ProjectDetails;
  onDelete: (id: number) => void;
}

const ListItem: React.FC<ItemProps> = ({ item, onDelete }) => {
  const renderImage = () => (
    item.afterImage && (
      <Image source={{ uri: item.afterImage  }} style={styles.image} />
    ) 
  );
  

  const renderVideo = () => (
    item.video && (
      <Video
        source={{ uri: item.video }}
        style={styles.video}
        useNativeControls
        isLooping
      />
    ) 
  );

  const renderText = () => (
    item.description && (
       <View style={styles.textContainer}>
      <Text style={styles.text}>
        {item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}
      </Text>
       </View>
    ) 
  );

  return (
    <>
       <TouchableOpacity onPress={() => onDelete(item.projectDetailId)}>
        <View style={styles.buttonContainer}>
        <Text style={styles.button}>Delete Group</Text>
        </View>
      </TouchableOpacity> 
    <ScrollView
      horizontal
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: normalize(20) }}>

        <View style={{ flexDirection: 'row', justifyContent:'flex-start' }}>
        {item.afterImage && (
          <View style={styles.itemContainer}>
            {renderImage()}
          </View>
        )}
        { item.video && (
          <View style={styles.itemContainer}>
            {renderVideo()}
          </View>
        )}
        {item.description && (
          <View style={styles.itemContainer}>
            {renderText()}
          </View>
        )}
        </View>
      </ScrollView></>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderRadius: 10,
    margin:normalize(10),
  },
  image: {
    width: normalize(200),
    height: normalize(150),
    borderRadius: 10,    
  },
  video: {
    width: normalize(200),
    height: normalize(150),
    borderRadius: 10,    
    resizeMode:'cover'
  },
  text: {
    fontSize: normalize(18),
    color: '#000',
  },
  textContainer:{
    width: normalize(200),
    height: normalize(150),
    borderColor:'white',
    backgroundColor: 'rgba(221, 221, 221, 0.5)', //
    borderRadius:10,
    borderWidth:1,
    padding:normalize(10),
  },
  buttonContainer: {
    backgroundColor: '#e4eaf7',
    borderColor: '#B87333',
    borderWidth: 1.5,
    borderRadius: 15, // Rounded edges
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(8),
     alignItems: 'center',
     justifyContent: 'space-evenly',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 5, // For Android shadow
    color: '#000',
    width:normalize(200)
  },
  button: {
    fontSize: normalize(12),
    fontWeight: 'black',
    color: '#000'
  }
});

export default ListItem;


