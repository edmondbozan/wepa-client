// CustomModal.tsx
import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'


interface LikeModalProps {
  visible: boolean;
  onClose: () => void;
  message: string;
}

const LikeModal: React.FC<LikeModalProps> = ({ visible, onClose, message }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}> <FontAwesome name="heart" size={30} color="#FA9BCF" /> Like</Text>
          <TextInput style={styles.modalText}
        placeholder="Provide some feedback"
        multiline        
      />
  
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={onClose}
          >
            <Text style={styles.textStyle}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
     justifyContent: 'center',
    // alignItems: 'center',
    marginTop: 22,
  },
  comment: {
    height:50
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    // alignItems: 'center',
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
    // textAlign: 'center',
  },
});

export default LikeModal;
