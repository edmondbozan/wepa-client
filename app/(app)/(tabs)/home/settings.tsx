import React from 'react';
import { View, FlatList, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import ListItem from '@/components/projectDeatailsFlatList';
import { ProjectDetails } from '@/interfaces/IProject';


const data = [
      {
        afterImage: "https://wepa.blob.core.windows.net/assets/1_after.jpg",
        beforeImage: null,
        description: "Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum ",
        projectDetailId: 12,
        video: "https://bozanassets.blob.core.windows.net/assets/79cde01d-68aa-4c44-900c-e0888abc7a5c.mp4"
      },
      {
        afterImage: "https://wepa.blob.core.windows.net/assets/1_after.jpg",
        beforeImage: null,
        description: "Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum ",
        projectDetailId: 13,
        video: "https://bozanassets.blob.core.windows.net/assets/79cde01d-68aa-4c44-900c-e0888abc7a5c.mp4"
      },
    ];


const VerticalFlatList: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={data}
        renderItem={({ item }) => <ListItem item={item} />}
        keyExtractor={(item) => item.projectDetailId.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.verticalFlatListContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#faf9f2',
  },
  verticalFlatListContainer: {
    paddingVertical: 10,
  },
  rowContainer: {
    marginVertical: 10,
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 5,
  },
  horizontalFlatListContainer: {
    paddingHorizontal: 10,
  },
});

export default VerticalFlatList;
