import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import { ProjectDetails } from '@/interfaces/IProject';

interface ItemProps {
  item: ProjectDetails;
}

const ListItem: React.FC<ItemProps> = ({ item }) => {
  const renderImage = () => (
    item.afterImage ? (
      <View style={{height:200}}>
        <Image source={{ uri: item.afterImage }} style={styles.image} resizeMode="cover" />
      </View>
    ) : null
  );

  const renderVideo = () => (
    item.video ? (
      <View style={{height:200}}>
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
      <Text style={styles.text}>
        {item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}
      </Text>
    ) : null
  );

  return (
    <View style={styles.itemContainer}>
      {renderImage()}
      {renderVideo()}
      {renderText()}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderColor:'black',
    borderWidth:1,
    marginBottom: 15,
    padding: 2,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  video: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default ListItem;
