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
//    padding:10
    margin:normalize(10),
//     justifyContent:'flex-start'
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


