import { router, useLocalSearchParams } from 'expo-router';
import { Text,  View, StyleSheet, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import normalize from '@/fonts/fonts';
import fetchWithAuth from '@/context/FetchWithAuth';
import { ProjectDetails, Project } from '@/interfaces/IProject';

import MediaComponent from '@/components/MediaComponent';
import ProjectEditComponent from '@/components/ProjectEdit';
import { FontAwesome } from '@expo/vector-icons';


export default function ProjectComponent() {
  const { data } = useLocalSearchParams();
  const initialData = data ? JSON.parse(data as string) : null;
  const [projectData, setProjectData] = useState<Project>(initialData);

//   const [data, setProjectData] = useState<Project>();
  const animation = useRef(new Animated.Value(0)).current;
  const blinkAnimationRef = useRef<any>(null);
  const [showDetails, setShowDetails] = useState<Boolean>(true);


   
  // Adjust useEffect to animate only when projectData.details is empty
  useEffect(() => {
    if (projectData && projectData.details.length === 0) {
      // Start the blinking animation if the array is empty
      blinkAnimationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }),
        ])
      );
      blinkAnimationRef.current.start();
    } else {
      // Stop the animation if the array is not empty
      if (blinkAnimationRef.current) {
        blinkAnimationRef.current.stop();
        animation.setValue(0); // Reset animation to ensure it doesn't leave the view in the last animated state
      }
    }

    // Cleanup on unmount
    return () => {
      if (blinkAnimationRef.current) {
        blinkAnimationRef.current.stop();
      }
    };
  }, [data, animation]);

  const interpolatedBorderColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#B87333', '#FFFFFF'], // Bronze to white
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navigation */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <TouchableOpacity onPress={() => { router.replace('/projects/Projects'); }} style={styles.signUpButton}>
          <Text style={{fontSize:normalize(16)}}>← Projects</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setShowDetails(true); }} style={[styles.signUpButton, showDetails && styles.selected]}>
          <Text style={[styles.signUpText, styles.selected]}>details</Text>
        </TouchableOpacity>


        {data &&

          <TouchableOpacity onPress={() => {
            setShowDetails(false);
          }}>
            <Animated.View style={[styles.signUpButton, { borderColor: interpolatedBorderColor }, !showDetails && styles.selected]}>
              <Text style={styles.signUpText}><FontAwesome name="plus" /> media</Text>
            </Animated.View>
          </TouchableOpacity>
        }
      </View>
      <View style={styles.horizontalRule} />

      {showDetails &&
        (
          <ProjectEditComponent></ProjectEditComponent>
        )}
      {!showDetails &&
        (
          <MediaComponent data={projectData} visible={false}/>
         
        )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
     flex: 1,
    backgroundColor: 'rgba(0,0,0,.1)'
  },
  FLImage: {
    width: 100,
    height: 100,
  },
  detailContainer: {
    flexDirection: 'row'
  },
  scrollContainer: {
    padding: 10,
    //    backgroundColor: 'rgba(0, 0, 0, .1)',

  },
  horizontalRule: {
    borderBottomColor: '#B87333',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  buttonContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    height: 50,
    borderWidth: 2,
    borderColor: '#B87333',
    color: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10

  },
  button: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  separator: {
    width: '100%',
    backgroundColor: 'black',
    alignSelf: 'stretch',
  },
  photos: {
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: '#000000',
    marginBottom: 5,
    marginTop: 15,
    fontWeight: '200'
  },
  input: {
    height: normalize(50),
    borderColor: '#B87333',
    borderRadius: 10,
    shadowColor: '#000',
    color: "#000",
    elevation: 5,
    borderWidth: normalize(1),
    marginBottom: normalize(10),
    paddingHorizontal: normalize(10),
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',

  },
  space: {
    width: normalize(7),
    height: 1,
  },
  picker: {
    height: normalize(1),
    width: normalize(200),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  pickerText: {
    fontSize: 16,
    color: 'blue',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  verticalFlatListContainer: {
    paddingVertical: 10,
    justifyContent: 'flex-start',
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
  inputError: {
    borderColor: 'red',
    color: 'red'
  },
  signUpButton: {
    //borderColor: '#B87333',
    //borderWidth: 1,
    //backgroundColor: 'rgba(255, 255, 255, 0.8)', // Light background for better contrast
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    // width:100
  },
  selected: {
    borderBottomColor: '#B87333',
    borderBottomWidth: 2,
  },
  signUpText: {
    color: '#000',
    fontSize: normalize(12),
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.8)', // Text shadow for better readability
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  container: {
    borderColor: '#B87333',
    borderWidth: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    margin: 20,
  },


});
