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
  Switch,
} from 'react-native';
import { normalize } from 'react-native-elements';

interface ProModalProps {
  maxLength: number;
  isVisible: boolean;
  initialIsPro : boolean,
  initialLicenseNumber:string,

  onSave: (isPro: boolean, license: string) => void;
  onClose: () => void;
}

const ProModal: React.FC<ProModalProps> = ({
  maxLength,
  initialIsPro,
  initialLicenseNumber,
  onSave,
  onClose,
  isVisible,
}) => {
    const [license, setLicense] = useState<string>(initialLicenseNumber);
    const [isPro, setPro] = useState<boolean>(initialIsPro);
    useEffect(() => {
        setLicense(initialLicenseNumber);        
    }, [initialLicenseNumber]);

    useEffect(() => {
        setPro(initialIsPro);
    }, [initialIsPro]);

    const handleToggle=()=>{
        setPro(!isPro);
        if(isPro){
        setLicense('');
        }
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
    <View style={[styles.container, { flexDirection: 'row' }]}>
     <Text style={[styles.titleText, { alignSelf: 'center' }]}> Pro:</Text>
     <Switch
            trackColor={{ false: "#C0C0C0", true: "#C0C0C0" }}
            thumbColor={(isPro) ? "#B87333" : "#000"}
            ios_backgroundColor="#C0C0C0"
            value={(isPro) ? true:false} 
            onValueChange={handleToggle}
            />
        </View>
        <View style={styles.separator} />
                
          <><View>
                          <Text style={styles.titleText}>License Number</Text>
                      </View><View>
                              <TextInput
                                  value={license}
                                  maxLength={maxLength}
                                  style={[styles.input, !isPro && {backgroundColor:"#f0f0f0"}]}
                                  editable={isPro}
                                  onChangeText={setLicense} // Update state on text change
                              />

                          </View></>
                
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <TouchableOpacity onPress={() => onSave(isPro, license)}>
              <Text>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> {setLicense(''); setPro(false);  onClose()}}>
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
    height:normalize(50)
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
  container: {
    borderWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 5,
    //    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',

    //    alignItems:'flex-start'
  },
  separator: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: 10,
  },

});

export default ProModal;
