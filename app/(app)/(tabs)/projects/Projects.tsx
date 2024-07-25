import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ImageBackground, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import { SessionProvider, useSession } from '@/context/ctx';
import fetchWithAuth from '@/context/FetchWithAuth';
import { BASE_URL } from '@/constants/Endpoints';
import { Project, ProjectDetails } from '@/interfaces/IProject';
import { FontAwesome } from '@expo/vector-icons';
 import { normalize } from 'react-native-elements'
import { router } from 'expo-router';
//import normalize from '@/fonts/fonts';

// Define the types for your data


const Projects: React.FC = () => {
  const [data, setData] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useSession();



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(BASE_URL + '/api/Projects/user/' + userId);
        const result: Project[] = await response.json();
        if (response.ok) {
          setData(result);
          console.log(data);
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

  const findFirstNonNullAfterImage = (details: ProjectDetails[]): string | null => {
    const detail = details.find(detail => detail.afterImage !== null);
    return detail?.afterImage || null;
  };

  const renderItem = ({ item }: { item: Project }) => {
    const imageUri = findFirstNonNullAfterImage(item.details);
  return (
   <View style={styles.projectContainer}>
      <TouchableOpacity onPress={() => router.push({
        pathname: '/projects/project',
        params: { data: JSON.stringify(item) }
      })}
      >
        <ImageBackground
        source={
          imageUri
            ? { uri: imageUri }
            : require('../../../../assets/images/background.jpg')
        }
          style={styles.backgroundImage}
          imageStyle={{ borderRadius: 8 }}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <View >
              <Text style={styles.category}>Category: {item.categoryName}</Text>
              <View style={styles.space} />
              <Text style={styles.cost}>Cost: ${item.cost}</Text>
            </View>
            <View style={styles.icon}>
              <View>
                <Text ><FontAwesome name="heart" size={normalize(20)} color="#FA9BCF" /> {item.likes}</Text>
              </View>
              <View style={styles.space} />
              <View>
                <Text ><FontAwesome name="comment" size={normalize(20)} color="#000" /> {item.messageCount}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

  return (
    <SafeAreaView style={{flex:1}}>
      <View style={styles.container}>

        {(data.length > 0) ? (
          <FlatList
            data={data}
            keyExtractor={(item) => item.projectId.toString()}
            renderItem={renderItem} />
         ) :  
         (
         <ImageBackground style={{flex:1}} source={require('../../../../assets/images/background.jpg')} imageStyle={{ opacity: 0.25, height:'100%', justifyContent:'center', alignItems:'center' }}>
          <View style={{marginTop:100, margin:normalize(20), padding:15, borderRadius:12, backgroundColor:'rgba(211, 211, 211, .35)'}}>
            <Text style={{color:"#654321", fontSize:20, fontWeight:'700', lineHeight:30}}>Looks like you do not have any projects. Click the add new project button below to get started.{'\n\n'}</Text>
            <View style={{alignItems:'center'}}>
              <Text style={{color:"#654321", fontSize:normalize(17), fontWeight:'600',fontStyle:'italic', lineHeight:30}}> Go ahead and Peacock a bit.</Text>
</View>
              <View style={{alignItems:'center'}}> 
              <Text style={{color:"#654321", fontSize:normalize(17), fontWeight:'600',fontStyle:'italic'}}>
              We wont judge.</Text>
            </View>
          </View>
         </ImageBackground>)}



          <TouchableOpacity onPress={() => {
            router.push(
              {
                pathname: '/projects/project',
                params: { data: null }
              }
            )
          }} >
            <View style={styles.buttonContainer}>
            <Text style={styles.button}>Add New Project</Text>
            </View>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,    
    backgroundColor: 'rgba(221, 221, 221, 0.5)', // 
    padding: 10,
  },
  viewRow: {
    flexDirection: 'row',
    alignContent: 'center'
  },
  projectContainer: {
    marginBottom: normalize(20),
    padding: 10,
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
  icon: {
    margin: 20,
    flexDirection: 'row'
  },
  space: {
    width: normalize(10)
  },
  buttonContainer: {
    backgroundColor: '#FFF', // Hinge-inspired pastel color
    borderRadius: 8, // Rounded edges
    height: normalize(50),
    borderWidth: 2,
    borderColor: '#B87333',
    color: '#000',
    justifyContent:'center',
    alignItems:'center'
  },
  button: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: '#000',
  }
});

export default Projects;
