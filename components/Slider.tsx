import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,  TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import Modal from 'react-native-modal';
import { BASE_URL } from '@/constants/Endpoints';


  interface SliderModalProps {
      type:string;
      visible: boolean;
      userradius:number;
      onClose: () => void;
      onValueChange: (value: number) => void;
    }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };
  
  const SliderModal: React.FC<SliderModalProps> = ({ visible, userradius, onClose, onValueChange, type = "radius" }) => {
    const [radius, setValue] = useState(5);

    const handleValueChange = (value: number) => {
      setValue(value);
      onValueChange(value); // Call the parent's callback function
    };

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
      {(type=="radius") ?
      <Text style={styles.text}>Radius: {formatNumber(radius)} Miles</Text>
      :
      <Text style={styles.text}>$ {formatNumber(radius)}</Text>
      }
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={(type=="radius") ? 4000 : 500000}
        step={(type=="radius") ? 1 : 5000}
        value={radius}
        onValueChange={handleValueChange}
        minimumTrackTintColor="#B87333"
        maximumTrackTintColor="#000000"
        thumbTintColor="#B87333"
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
