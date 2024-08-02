import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ImageBackground, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import { SessionProvider, useSession } from '@/context/ctx';
import fetchWithAuth from '@/context/FetchWithAuth';
import { BASE_URL } from '@/constants/Endpoints';
import { Project } from '@/interfaces/IProject';
import { FontAwesome } from '@expo/vector-icons';
import { normalize } from 'react-native-elements';
import { router } from 'expo-router';

// Define the types for your data


const Projects: React.FC = () => {
  const [data, setData] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const {userId } = useSession();



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(BASE_URL + '/api/Projects/user/' + userId);
        const result: Project[] = await response.json();
        if (response.ok) {
          setData(result);
        } else {
          Alert.alert('Page Load Error', 'Page Load');
        }
      } catch (err) {
        setError(JSON.stringify(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);




//   const { userId } = SessionProvider(SessionProvider);
  const renderItem = ({ item }: { item: Project }) => (
    
<SafeAreaView>
    <View style={styles.projectContainer}>
      <ImageBackground
        source={{ uri: "https://wepa.blob.core.windows.net/assets/" + item.details[0].projectDetailId + "_after.jpg" }}
        style={styles.backgroundImage}
        imageStyle={{ borderRadius: 8 }}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.viewRow}>
          <Text style={styles.category}>Category: {item.categoryName}</Text>
          <View style={styles.space} /> 
          <Text style={styles.cost}>Cost: ${item.cost}</Text>
          </View>
         <View style={styles.icon}>
            <View>
              <Text ><FontAwesome name="heart" size={normalize(35)} color="#FA9BCF" /> {item.likes}</Text>
            </View>
            <View style={styles.space} />
            <View>
              <Text ><FontAwesome name="comment" size={normalize(35)} color="#000" />{item.messageCount}</Text>
            </View>
            </View>
        </View>
      </ImageBackground>
    </View>
    <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={()=>{router.push('/project'); }} >
              <Text style={styles.button}>Add New Projecto</Text>
            </TouchableOpacity>
            </View>

    </SafeAreaView>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.projectId.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    // alignContent:'center'
  },
  viewRow:{
flexDirection:'row',
alignContent:'center'
  },
  projectContainer: {
    marginBottom: 20,
    padding: 10,    
 //    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,    
  },
  backgroundImage: {
    width: '100%',
    height: normalize(300),
    borderRadius: 8,
  },
  contentContainer: {
    flex: 1,
    // justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Optional: Add a semi-transparent background to improve text readability
    padding: 10,
    borderRadius: 8,
    
  },
  title: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    marginVertical: normalize(10),
  },
  category: {
    fontSize: normalize(16),
    color: '#000',
  },
  cost: {
    fontSize: normalize(16),
    color: '#000',

  },
  detailContainer: {
    marginTop: 10,
  },
  detailDescription: {
    fontSize: 14,
    color: '#555',
  },
  icon:{
    //  justifyContent: 'space-',
    margin:20,
    flexDirection:'row'
    // width:'50%'
  },
  space:{
    width:20
  },
  buttonContainer: {
    backgroundColor: '#e4eaf7', 
    borderRadius: 15, // Rounded edges
    paddingHorizontal: 20,    
    paddingVertical:8,
    // alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', // Shadow for a subtle depth effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 5, // For Android shadow
    color:'#000',


  },
  button:{
    fontSize:18,
    fontWeight: 'black',
    color:'#000',
  }
});

export default Projects;
