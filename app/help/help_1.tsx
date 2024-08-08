import { FontAwesome, FontAwesome5, Fontisto } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, SafeAreaView } from 'react-native';
import { normalize } from 'react-native-elements';
import Swiper from 'react-native-swiper';

const helpScreens = [
  {
    id: '1',
    title: 'Welcome to MatchApp',
    subTitle: 'Connecting with Ease',
    description: 'Connect with professionals and homeowners seamlessly.',
  },
  {
    id: '2',
    title: 'Browse Projects',
    subTitle: 'Find What You Need',
    description: 'Explore various projects and find the perfect match for your needs.',
  },
  // Add more items as needed
];

const HelpScreen = () => {
  const screenWidth = Dimensions.get('window').width;

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ backgroundColor: 'rgba(255,255,255,1)' }}>
      <View style={{ margin: normalize(20) }}>
          <Text style={styles.description}>
            <View style={styles.likeButton}  >
              <FontAwesome5 name="heart" size={normalize(12)} color="black" />
            </View> send some love <View style={styles.likeButton}  >
              <FontAwesome5 name="heart-broken" size={normalize(12)} color="black" />
            </View> next project 
            </Text>
        </View>
        <View style={styles.slide} >
          <Image source={require('../../assets/images/help/image.png')} style={[styles.image, { height: 600 }]} resizeMode="contain" />
        </View>
        <View style={{margin:normalize(20)}}>
          <Text style={{fontSize:normalize(20)}}>easily filter and find projects that match your criteria</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  slide: {
    //flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,

  },
  subtitle: {
    fontSize: normalize(12),
    //   fontWeight: 'bold',
    //    textAlign: 'center',
    color: '#333',
    //    marginBottom: 10,
  },
  description: {
    fontSize: normalize(20),
    alignSelf:'center',
    color: '#666',
  },
  likeButton: {
    borderWidth: 3,
    //    bottom: 20,
    //  left: 20,
    backgroundColor: '#f0f0f0',
    borderColor: '#B87333',
    borderRadius: 50,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  iconBackground: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  }


});

export default HelpScreen;
