import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import Modal from 'react-native-modal';
import { normalize } from 'react-native-elements';
import { validateZip } from '@/http/validateZip';

interface SliderModalProps {
  type: string;
  visible: boolean;
  userradius: number;
  zip?: string;
  onClose: (zip?: string) => void;
  onValueChange: (value: number) => void;
}

const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

const SliderModal: React.FC<SliderModalProps> = ({
  visible,
  userradius,
  onClose,
  onValueChange,
  type = "radius",
  zip = "07302",
}) => {
  const [radius, setValue] = useState(userradius || 5);
  const [myZip, setMyZip] = useState(zip);
  const [invalidZip, setInvalidZip] = useState(false);

  const handleValueChange = (value: number) => {
    setValue(value);
    onValueChange(value);
  };

  useEffect(() => {
    if (userradius !== undefined) {
      setValue(userradius);
    }
  }, [userradius]);

  const handleClose = async () => {
    if (type === 'radius') {
      if (await validateZip(myZip)) {
        setInvalidZip(false);
        onClose(myZip);
      } else {
        setInvalidZip(true);
      }
    } else {
      setInvalidZip(false);
      onClose();
    }
  };

  return (
    <Modal isVisible={visible} onBackdropPress={handleClose} style={styles.modal}>
      <KeyboardAvoidingView style={styles.modalContent}   behavior="padding" keyboardVerticalOffset={normalize(10)}>
        <Text style={styles.text}>
          {type === 'radius' ? `Radius: ${formatNumber(radius)} Miles` : `$ ${formatNumber(radius)}`}
        </Text>
        {type === 'radius' && (
          <>
            <Text>
              <Text>Zip: </Text>
              {invalidZip && <Text style={styles.errorText}>Invalid Zip.</Text>}
            </Text>
            <TextInput
              style={[styles.textInput, invalidZip && styles.inputError]}
              placeholder="Zip"
              value={myZip?.toString()}
              onChangeText={setMyZip}
              maxLength={5}
              keyboardType="number-pad"
            />
          </>
        )}
        <Slider
          style={styles.slider}
          minimumValue={0}
        
          maximumValue={type === 'radius' ? 4000 : 500000}
          step={type === 'radius' ? 1 : 5000}
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
    maxHeight: '80%',
  },
  text: {
    fontSize: normalize(24),
    marginBottom: 20,
  },
  slider: {
//    width: normalize(300),
//    height: normalize(40),
    marginBottom: normalize(25),
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
  },
});

export default SliderModal;
