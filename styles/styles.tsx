// GlobalStyles.ts

import { StyleSheet } from 'react-native';
import { normalize } from 'react-native-elements';

const GlobalStyles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: '#e4eaf7',
        borderColor:'#B87333',
        borderWidth:1.5,
        borderRadius: 15, // Rounded edges
        paddingHorizontal: normalize(15),    
        paddingVertical:normalize(8),
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
        fontSize: normalize(12),
        fontWeight: 'black',
        color:'#000'
      },});
    
    
export default GlobalStyles;
