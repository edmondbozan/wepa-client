import React from 'react';
import { Modal, View, Text, StyleSheet, TextInput, Switch } from 'react-native';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import GlobalStyles from '@/styles/styles';
import { Checkbox } from 'react-native-paper';

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
    onClose(); // Optionally close the modal after submitting
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={styles.centeredView}>
        <View style={styles.modalView}>
            {userType=="professional"  && 
           (<View style={{flexDirection:'row', alignItems:'center', marginRight:20}}>
        <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
         thumbColor={share ? "#f5dd4b" : "#f4f3f4"}
         ios_backgroundColor="#a7abb5"
         onValueChange={toggleSwitch}
         value={share}
      />
      <Text> 
            <Text style={{fontWeight:'bold', color:'#B87333'}}>{share?' Share ':' Do not share '}</Text>
            <Text>my info with this pro.</Text>
      </Text>
      </View>
            )}
          <TextInput
            style={styles.textInput}
            placeholder="Leave a comments"
            multiline
            value={feedback}
            onChangeText={setFeedback} // Update feedback state
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <TouchableOpacity onPress={handleSubmit}>
            <FontAwesome6 name="heart" size={30} color="black" />

              {/* <View style={GlobalStyles.buttonContainer}>
                <Text style={GlobalStyles.button}>Like</Text>
              </View> */}
        </TouchableOpacity>
          <TouchableOpacity onPress={() =>{setIsEnabled(false);onClose();}}>
            <FontAwesome name="times" size={30} color="black" />

              {/* <View style={GlobalStyles.buttonContainer}>
                <Text style={GlobalStyles.button}>Close</Text>
              </View> */}
            </TouchableOpacity>
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
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
  modalText: {
    marginBottom: 15,
  },
  textInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginLeft: 20,
    marginTop: 10,
    marginBottom:10
    // paddingLeft: 0,
  },
});

export default LikeModal;
