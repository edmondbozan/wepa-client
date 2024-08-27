import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { normalize } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

const CustomHeader = () => {
  return (
    <SafeAreaView>    
    <View style={styles.headerContainer}>    
          <Text style={styles.backButton}>Login to unlock full functionality. Accounts are free.</Text>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
//    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    fontSize: normalize(14),
    color: 'black',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CustomHeader;