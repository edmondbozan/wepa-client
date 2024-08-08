import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import Swiper from 'react-native-swiper';
import Page0 from './help_0'; // Adjust the path as needed
import Page1 from './help_1'; // Adjust the path as needed
import Page2 from './help_2'; // Adjust the path as needed
import Page3 from './help_3'; // Adjust the path as needed
import { TouchableOpacity } from 'react-native-gesture-handler';
import { router } from 'expo-router';

const MainSwiper: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Swiper loop={false} showsPagination={true} dotStyle={styles.dot} activeDotStyle={styles.activeDot}>
        <Page0 />
        <Page1 />
        <Page2  />
        <Page3  />
      </Swiper>
      <TouchableOpacity style={styles.button} onPress={()=>{router.navigate("/home");}}>
        <Text style={styles.buttonText} >begin exloring</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dot: {
    backgroundColor: '#E0E0E0',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: '#B87333',
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 3,
  },
  button: {
    height: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin:20,
    borderWidth: 2,
    padding: 10,
    borderColor: '#B87333'
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default MainSwiper;
