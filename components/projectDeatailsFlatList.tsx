import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import { ProjectDetails } from '@/interfaces/IProject';
import { Button, normalize } from 'react-native-elements';
import GlobalStyles from '@/styles/styles';
import { FontAwesome5 } from '@expo/vector-icons';
import { IconButton } from 'react-native-paper';

interface ItemProps {
  item: ProjectDetails;
  onDelete: (id: number) => void;
}

const ListItem: React.FC<ItemProps> = ({ item, onDelete }) => {
  return (
    <>
      {/* <TouchableOpacity onPress={() => onDelete(item.projectDetailId)}>
        <View>
        <Text style={styles.button}>Delete</Text>
        </View>
      </TouchableOpacity> */}


<View style={{borderColor:"#B87333", borderRadius:8, borderWidth:1, padding:20, margin:10}}>
<TouchableOpacity onPress={() => onDelete(item.projectDetailId)}>
  <Text style={{position:'relative', textDecorationLine:'underline', color: "#B87333", marginBottom:10}}>Delete</Text>
  </TouchableOpacity>
  {/* <FontAwesome5 name="trash" color="#B87333" style={{position:'absolute', left:10, top:10}}></FontAwesome5> */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        {/* <View style={{backgroundColor:"white", borderColor:"red", borderWidth:1, justifyContent:'center'}}>
        <Text><FontAwesome5 name="trash" size="20"/></Text>
        </View> */}
        <View style={styles.buttonContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>After</Text>
          </View>
            {item.afterImage ? (
              <Image source={{ uri: item.afterImage }} style={styles.image} />
            ) : (
              <IconButton icon="camera" size={normalize(50)} iconColor='#B87333' style={styles.iconButton} />
            )}
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Before</Text>
          </View>
            {item.beforeImage ? (
              <Image source={{ uri: item.beforeImage }} style={styles.image} />
            ) : (
              <IconButton icon="camera" size={normalize(50)} iconColor='#B87333' style={styles.iconButton} />
            )}
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Video</Text>
          </View>
            {item.video ? (
              <Image source={{ uri: item.video }} style={styles.image} />
            ) : (
              <IconButton icon="video" size={normalize(50)} iconColor='#B87333' style={styles.iconButton} />
            )}
        </View>

      </View>
      <View style={styles.textContainer}>

{item.description ? (
  
    <Text style={{fontSize:normalize(12)}}> {item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}</Text>
) : (
  <><View style={[styles.labelContainer, {width:900}]}>
    <Text style={styles.label}>Description</Text>
  </View><IconButton icon="text" size={normalize(50)} iconColor='#B87333' style={styles.iconButton} /></>
)}
</View>
</View>
    </>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderRadius: 10,
    margin: normalize(10),
  },
  labelContainer: {
    position: 'absolute',
    top: normalize(5),
    left: normalize(5),
  },
  label: {
    fontSize: normalize(12),
    color: 'gray',
  },
  iconButton: {
    margin: 0
  },

  image: {
    width: normalize(90),
    height: normalize(90),
    borderRadius: 10,
  },
  video: {
    width: normalize(200),
    height: normalize(150),
    borderRadius: 10,
    resizeMode: 'cover'
  },
  text: {
    fontSize: normalize(18),
    color: '#000',
  },
  buttonContainer: {
    width: normalize(90),
    height: normalize(90),
    borderWidth: 2,
    borderColor: 'gray',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight:10
  },
  textContainer: {
    marginTop:10,
    width: '100%',
     height: normalize(90),
    borderWidth: 2,
    borderColor: 'gray',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'flex-start',
    padding:10
  },
  button: {
    fontSize: normalize(12),
    fontWeight: 'black',
    color: '#000'
  }
});

export default ListItem;


