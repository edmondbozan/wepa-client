import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,  TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import Modal from 'react-native-modal';
import { BASE_URL } from '@/constants/Endpoints';


interface SliderModalProps {
    visible: boolean;
    userradius:number;
    onClose: () => void;
  }

  

  const SliderModal: React.FC<SliderModalProps> = ({ visible, userradius, onClose }) => {
    const [radius, setValue] = useState(5);

    useEffect(() => {
        // This will run when the component mounts
        if (userradius !== undefined) {
        setValue(userradius);
        }
      }, [userradius]);
    
  return (
    <Modal
    isVisible={visible}
      onBackdropPress={onClose}
      style={styles.modal}
      
  >
    <View style={styles.modalContent}>
      <Text style={styles.text}>Radius: {radius.toFixed(2)}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={radius}
        onValueChange={setValue}
        minimumTrackTintColor="#2196F3"
        maximumTrackTintColor="#000000"
        thumbTintColor="#2196F3"
      />
    </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  slider: {
    width: 300,
    height: 40,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    maxHeight: '50%',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SliderModal;
