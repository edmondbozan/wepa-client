import { isNullOrEmpty } from '@/functions/stringfunctions';
import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { normalize } from 'react-native-elements';

interface InputProps {
  title: string;
  maxLength: number;
  initialValue: string;
  isVisible: boolean;
  isRequired: boolean;
  onSave: (value: string) => void;
  onClose: () => void;
  validate?: (value: string) => boolean;
}

const InputModal: React.FC<InputProps> = ({
  title,
  maxLength,
  initialValue,
  onSave,
  onClose,
  isVisible,
  isRequired,
  validate
}) => {
  const [text, setTextValue] = useState<string>(initialValue);
  const [valid, setValid] = useState<boolean>(true);


  useEffect(() => {
    setTextValue(initialValue);
  }, [initialValue]);

  const save=()=>{
    if (isRequired)
      {
        if (isNullOrEmpty(text)){
          setValid(false);
          return;
        }
      }
      if (title.toLowerCase() === "email"){
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(text)) {
            setValid(true);
          } else {
            setValid(false);
            return;
          }
      }
    onSave(text);
  }


  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
    <KeyboardAvoidingView style={styles.modalContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.modalContent}>
          <View style={[styles.titleContainer, !valid && {borderColor:"red"}]}>
            <Text>
            <Text style={styles.titleText}>{title}</Text>
            </Text>
          </View>
          <View>
            <TextInput
              value={text}
              multiline={true}
              maxLength={maxLength} 
              keyboardType={(title.toLowerCase() === "email") ? "email-address" : "default"}
              style={[styles.input, !valid && {borderColor:"red"}]}
              autoCapitalize="none"
              onChangeText={setTextValue} // Update state on text change
            />
            <Text>{`${text.length}/${maxLength}`}</Text> 
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <TouchableOpacity onPress={save}>
              <Text>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> {setTextValue(''); onClose()}}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  input: {
    marginTop:normalize(10),
    padding: normalize(15),
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.3)',
    borderRadius:8,
    height:normalize(250)
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgba(0, 0, 0, .8)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  titleContainer: {
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.3)',
    borderRadius:8
  },
  titleText: {
    fontWeight: '600',
  },
  closeButton: {
    height: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#B87333',
  },
  closeButtonText: {
    color: '#B87333',
    textAlign: 'center',
  },
});

export default InputModal;
