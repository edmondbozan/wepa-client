import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import { ProjectDetails } from '@/interfaces/IProject';
import { normalize } from 'react-native-elements';
import GlobalStyles from '@/styles/styles';

interface ItemProps {
  item: ProjectDetails;
  onDelete: (id: number) => void;
}

const ListItem: React.FC<ItemProps> = ({ item }) => {
  const renderImage = () => (
    item.afterImage ? (
      <Image source={{ uri: item.afterImage  }} style={styles.image} resizeMode="cover" />
    ) : null
  );
  

  const renderVideo = () => (
    item.video ? (
      <View style={{width:200}}>
      <Video
        source={{ uri: item.video }}
        style={styles.video}
        useNativeControls
        isLooping
      />
      </View>
    ) : null
  );

  const renderText = () => (
    item.description ? (
       <View style={styles.textContainer}>
      <Text style={styles.text}>
        {item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}
      </Text>
       </View>
    ) : null
  );

  return (
    <><View style={{width:normalize(110)}} >
       <TouchableOpacity onPress={() => onDelete(item.projectDetailId)}>
        <View style={GlobalStyles.buttonContainer}>
        <Text style={GlobalStyles.button}>Delete Group</Text>
        </View>

      </TouchableOpacity> 
    </View>
    <ScrollView
      horizontal
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 20 }}>

        <View style={{ flexDirection: 'row' }}>
          <View style={styles.itemContainer}>
            {renderImage()}
          </View>
          <View style={styles.itemContainer}>
            {renderVideo()}
          </View>
          <View style={styles.itemContainer}>
            {renderText()}
          </View>
        </View>
      </ScrollView></>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderRadius: 10,
    //margin:10,
    // justifyContent:''
  },
  image: {
    width: normalize(200),
    height: normalize(150),
     borderRadius: 10,    
    margin:normalize(10)
  },
  video: {
    width: normalize(200),
    height: normalize(150),
     borderRadius: 10,
    margin:10

  },
  text: {
    fontSize: 18,
    color: '#000',
  },
  textContainer:{
    width: normalize(200),
    height: normalize(150),
     margin:10,
//     padding: 10,
    borderColor:'white',
    backgroundColor: 'rgba(221, 221, 221, 0.5)', //
    borderRadius:10,
    borderWidth:1,
    padding:10,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 10,
    margin: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ListItem;


