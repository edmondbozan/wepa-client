import { router } from 'expo-router';
import { Alert, Button, Text, TextInput, View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Platform, Modal } from 'react-native';
import { useSession } from '@/context/ctx';
import { useState } from 'react';
import { BASE_URL } from '@/constants/Endpoints';
import normalize from '@/fonts/fonts';
import { Picker } from '@react-native-picker/picker';
import { StackParamList } from '@/types/types'; 


export default function Project() {

  const [selectedValue, setSelectedValue] = useState("java");
  const [modalVisible, setModalVisible] = useState(false);

  const openPicker = () => {
    if (Platform.OS === 'ios') {
      setModalVisible(true);
    }
  };
  const closePicker = () => {
    if (Platform.OS === 'ios') {
      setModalVisible(false);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inputView}>
          {Platform.OS === 'ios' ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={openPicker}>
                <Text >{selectedValue}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Picker
              selectedValue={selectedValue}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedValue(itemValue)}
            >
              <Picker.Item label="Java" value="java" />
              <Picker.Item label="JavaScript" value="js" />
              <Picker.Item label="Python" value="python" />
              <Picker.Item label="C++" value="cpp" />
            </Picker>
          )}

          <TextInput
            placeholder="Project Cost"
            style={styles.input}
          />

          <TextInput
            placeholder="Project Name"
            style={styles.input}
          />
          <TextInput
            placeholder="Project Cost"
            secureTextEntry
            style={styles.input}
          />
        </View>
        <TouchableOpacity onPress={()=>{router.push('/projects/test'); }} >
              <Text style={styles.button}>Add Details</Text>
            </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <Modal
            transparent={true}
            animationType="slide"
            visible={modalVisible}
            onRequestClose={closePicker}
          >
            <View style={styles.modalContainer}>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedValue}
                  onValueChange={(itemValue) => {
                    setSelectedValue(itemValue);
                    closePicker();
                  }}
                >
                  <Picker.Item label="Java" value="java" />
                  <Picker.Item label="JavaScript" value="js" />
                  <Picker.Item label="Python" value="python" />
                  <Picker.Item label="C++" value="cpp" />
                </Picker>
                <Button title="Done" onPress={closePicker} />
              </View>
            </View>
          </Modal>
        )}


        {/* <View style={styles.buttons}>
          <View style={[styles.buttonContainer]}>
          <TouchableOpacity   >
              <Text style={styles.button} >Sign In</Text>
            </TouchableOpacity>

            </View>
            <View style={styles.space} /> 
            <View style={styles.buttonContainer}>
            <TouchableOpacity   >
              <Text style={styles.button}>Register</Text>
            </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity  >
              <Text style={styles.button}>Forgot my Password</Text>
            </TouchableOpacity>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#e4eaf7', // Hinge-inspired pastel color
    borderRadius: 15, // Rounded edges
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', // Shadow for a subtle depth effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 5, // For Android shadow
    color: '#000',
    width: 100


  },

  button: {
    fontSize: 18,
    fontWeight: 'black',
    color: '#000'
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#faf9f2',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 30,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  photos: {
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputView: {
    height: '50%',
    // justifyContent: 'center',
    //alignItems: 'center'
  },
  input: {
    height: normalize(40),
    borderColor: 'gray',
    borderWidth: normalize(1),
    marginBottom: normalize(10),
    paddingHorizontal: normalize(10),
    width: '100%',
  },
  space: {
    width: normalize(7), // or whatever size you need
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
  }

});


