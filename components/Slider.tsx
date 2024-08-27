import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,  TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import Slider from '@react-native-community/slider';
import Modal from 'react-native-modal';
import { BASE_URL } from '@/constants/Endpoints';
import { normalize } from 'react-native-elements';


  interface SliderModalProps {
      type:string;
      visible: boolean;
      userradius:number;
      onClose: () => void;
      onValueChange: (value: number, zip:string) => void;
    }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };
  
  const SliderModal: React.FC<SliderModalProps> = ({ visible, userradius, onClose, onValueChange, type = "radius" }) => {
    const [radius, setValue] = useState(5);
    const [zip, setZip] = useState('');

    const handleValueChange = (value: number) => {
      setValue(value);
      onValueChange(value, zip); // Call the parent's callback function
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
    <KeyboardAvoidingView style={styles.modalContent}  behavior="padding">
      <TextInput 
                        placeholder="Zip"
                        value={zip?.toString()}
                        onChangeText={setZip}
                        multiline={false} 
                        maxLength={5}
                        keyboardType='number-pad'
                        />

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
    </KeyboardAvoidingView>
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
    fontSize: normalize(24),
    marginBottom: 20,
  },
  slider: {
    width: normalize(300),
    height: normalize(40),
//    marginBottom:normalize(20)

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
