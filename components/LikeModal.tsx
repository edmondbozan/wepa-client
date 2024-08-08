import React from 'react';
import { Modal, View, Text, StyleSheet, TextInput, Switch, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import GlobalStyles from '@/styles/styles';
import { Checkbox } from 'react-native-paper';
import { normalize } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LikeModalProps {
  visible: boolean;
  onClose: () => void;
  message: string;
  userType:string;
  onSubmit: (feedback: string, share: boolean) => void;
}



const LikeModal: React.FC<LikeModalProps> = ({ visible, onClose, message, userType, onSubmit }) => {
  const [feedback, setFeedback] = React.useState('');
  const [share, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const handleSubmit = () => {
    if (typeof onSubmit === 'function') {
      setIsEnabled(false);
      onSubmit(feedback, share);
    } else {
      console.error('onSubmit is not a function');
    }
    setFeedback('');
    onClose(); // Optionally close the modal after submitting
  };

  return (
    <Modal
      animationType="slide"      
      transparent={true}
      visible={visible}
      onRequestClose={onClose}      
      style={{width:'100%'}}
    >
      <ScrollView  automaticallyAdjustKeyboardInsets={true}>
      <GestureHandlerRootView>
        <View style={styles.modalView}>
            {userType=="professional"  && 
           (<View style={{flexDirection:'row', alignItems:'center', marginRight:20}}>
        <Switch
         trackColor={{ false: "#C0C0C0", true: "#C0C0C0" }}
         thumbColor={share ? "#B87333" : "#000"}
         ios_backgroundColor="#a7abb5"
         onValueChange={toggleSwitch}
         value={share}
      />
      <Text style={{fontSize:normalize(14)}}> 
            <Text style={{ fontWeight:'bold', color:'#B87333'}}>{share?' Share ':' Do not share '}</Text>
            <Text>my info with this pro.</Text>
      </Text>
      </View>
            )}
          <TextInput
            style={styles.textInput}
            placeholder="leave a comment."
            multiline
            value={feedback}
            maxLength={500}
            onChangeText={setFeedback} // Update feedback state
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <TouchableOpacity onPress={handleSubmit}>
            <FontAwesome6 name="heart" size={30} color="black" />

              {/* <View style={GlobalStyles.buttonContainer}>
                <Text style={GlobalStyles.button}>Like</Text>
              </View> */}
        </TouchableOpacity>
          <TouchableOpacity onPress={() =>{setIsEnabled(false);setFeedback('');onClose();}}>
            <FontAwesome name="times" size={30} color="black" />

              {/* <View style={GlobalStyles.buttonContainer}>
                <Text style={GlobalStyles.button}>Close</Text>
              </View> */}
            </TouchableOpacity>
          </View>
        </View>
      </GestureHandlerRootView>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: normalize(121),
  },
  modalView: {
    marginVertical:normalize(128),
    margin: 10,
    borderRadius: 20,
    padding: 30,
    backgroundColor:'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInput: {
    height: normalize(200),
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    marginBottom:10,
    padding: 10,
  },
});

export default LikeModal;
