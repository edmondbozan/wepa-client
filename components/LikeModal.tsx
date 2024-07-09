import React from 'react';
import { Modal, View, Text, StyleSheet, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import GlobalStyles from '@/styles/styles';

interface LikeModalProps {
  visible: boolean;
  onClose: () => void;
  message: string;
  onSubmit: (feedback: string) => void;
}

const LikeModal: React.FC<LikeModalProps> = ({ visible, onClose, message, onSubmit }) => {
  const [feedback, setFeedback] = React.useState('');

  const handleSubmit = () => {
    if (typeof onSubmit === 'function') {
      onSubmit(feedback);
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
          <Text style={styles.modalText}>
            <FontAwesome name="heart" size={30} color="#FA9BCF" /> Like
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Provide some feedback"
            multiline
            value={feedback}
            onChangeText={setFeedback} // Update feedback state
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <TouchableOpacity onPress={handleSubmit}>
              <View style={GlobalStyles.buttonContainer}>
                <Text style={GlobalStyles.button}>Like</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <View style={GlobalStyles.buttonContainer}>
                <Text style={GlobalStyles.button}>Close</Text>
              </View>
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
    marginBottom: 20,
    paddingLeft: 10,
  },
});

export default LikeModal;
