import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export interface DropdownItem {
  id: string;
  description: string;
}

interface DropdownInputProps {
  data: DropdownItem[];
  placeholder: string;
  setValue: DropdownItem;
  label:string;
  onSelect: (item: DropdownItem) => void;
}

const DropdownInput: React.FC<DropdownInputProps> = ({ data, placeholder, setValue, onSelect, label }) => {
  const [selectedValue, setSelectedValue] = useState<DropdownItem>(setValue);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    setSelectedValue(setValue);
  }, [setValue]);

  const handleSelect = (item: DropdownItem) => {
    setSelectedValue(item);
    setModalVisible(false);
    onSelect(item);  // Pass the selected item to the parent component
  };

  return (
    <View  >
      <View style={{width:'100%'}}>
      {/* <TouchableOpacity style={{  flexDirection:'row'}}
        onPress={() => setModalVisible(true)}>
        <Text>{label} </Text>
        <Text>{(selectedValue) ? selectedValue.description : ''}</Text>
        <Text style={{justifyContent:'flex-end'}}>{'>'}</Text>
      </TouchableOpacity> */}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  style={styles.item}
                >
                  <Text>{item.description}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    //  width:'100%',
    //  height:'100%'
  },
  icon: {
    marginLeft: 5,
    color:"#B87333",

  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'rgba(221, 221, 221, 1)', 
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
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#B87333',
  },
  closeButton: {
    height: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
    borderWidth:2,
    borderColor:'#B87333'

  },
  closeButtonText: {
    color: '#B87333',
    textAlign: 'center',
  },
});

export default DropdownInput;
