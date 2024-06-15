import React, { useState } from 'react';
import { View, Image, Dimensions, StyleSheet,Text } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Dots from 'react-native-dots-pagination';
import { normalize } from 'react-native-elements';

const { width: viewportWidth, height:viewportHeight } = Dimensions.get('window');

const images = [
   { uri: 'https://wepa.blob.core.windows.net/assets/1_after.jpg' },
   { uri: 'https://wepa.blob.core.windows.net/assets/1_before.jpg' },
   { uri: 'https://wepa.blob.core.windows.net/assets/3_before.jpg' },
];

const PhotoCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  

  const renderItem = ({ item }: { item: { uri: string } }) => {
    return (
      <View style={styles.slide}>
        <Image source={{ uri: item.uri }} style={styles.image} />
      </View>
    );
  };

  return (
    <View>
      <Carousel
        loop={false}
        width={viewportWidth}
        height={viewportHeight * 0.50}
        autoPlay={true}
        data={images}
        scrollAnimationDuration={1000}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={renderItem}
      />
      {/* <Dots 
        length={images.length} 
        active={activeIndex} 
        activeColor='black' 
        passiveColor='gray' 
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    //  flex: 21,
    justifyContent: 'center',
     alignItems: 'center',
      marginTop:'5%'
//    marginRight:30
  },
  image: {    
    width: '99%',
    height: '99%', // Adjust the height as needed
    resizeMode: 'cover',
    borderRadius : 15,
//    marginTop:14

  },
});

export default PhotoCarousel;



// import React from 'react';
// import { View, Image, Dimensions, StyleSheet } from 'react-native';
// import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
// import { useSharedValue } from "react-native-reanimated";

// const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

// const images = [
//   { uri: 'https://wepa.blob.core.windows.net/assets/1_after.jpg' },
//   { uri: 'https://wepa.blob.core.windows.net/assets/1_before.jpg' },
//   { uri: 'https://wepa.blob.core.windows.net/assets/3_before.jpg' },
// ];

// const PhotoCarousel: React.FC = () => {
//   const ref = React.useRef<ICarouselInstance>(null);


  
//   const renderItem = ({ item }: { item: { uri: string } }) => {
//     return (
//       <View style={styles.slide}>
//         <Image source={{ uri: item.uri }} style={styles.image} />
//       </View>
//     );
//   };

//   return (
//     <Carousel
//       loop
//       ref={ref}
//       pagingEnabled={true}
//       width={viewportWidth}
//       height={viewportHeight * 0.75}
//       autoPlay={false}
//       data={images}
//       renderItem={renderItem}   
//     //   modeConfig={{
//     //     parallaxScrollingScale: 0.9,
//     //     parallaxScrollingOffset: 50,
//     //   }}   
//     />
//   );
// };

// const styles = StyleSheet.create({
//   slide: {
//      flex: 1,
//      justifyContent: 'center',
//      alignItems: 'center',
//       //marginRight: 50
//   },
//   image: {
// //      width: '100%',
//     //height: viewportWidth * 1.75, // Adjust the height as needed
//     resizeMode: 'cover',
//     borderRadius: 14,
//   },
// });

// export default PhotoCarousel;
