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
  onSelect: (item: DropdownItem) => void;
}

const DropdownInput: React.FC<DropdownInputProps> = ({ data, placeholder, setValue, onSelect }) => {
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
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={(selectedValue) ? selectedValue.description : ''}
          placeholder={placeholder}
          editable={false}
          pointerEvents="none"
        />
        <MaterialIcons name="arrow-drop-down"  size={24} style={styles.icon} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
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
  inputContainer: {
     flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B87333',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom:10,
    color:"#fff",
    backgroundColor: 'rgba(255, 255, 255, .3)'
//    margin:10
//    height: 40,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    // backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height:50,
  },
  icon: {
    marginLeft: 5,
    color:"#B87333"
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
