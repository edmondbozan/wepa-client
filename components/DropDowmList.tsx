import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface DropdownItem {
  id: string;
  description: string;
}

interface DropdownInputProps {
  data: DropdownItem[];
  placeholder: string;
  setValue: string;
}

const DropdownInput: React.FC<DropdownInputProps> = ({ data, placeholder,setValue }) => {
   const [selectedValue, setSelectedValue] = useState<string>(setValue);
   const [modalVisible, setModalVisible] = useState<boolean>(false);
  useEffect(() => {
    setSelectedValue(setValue);
  }, [setValue]);

  const handleSelect = (item: DropdownItem) => {
    setSelectedValue(item.description);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={selectedValue}
          placeholder={placeholder}
          editable={false}
          pointerEvents="none"
        />
        <MaterialIcons name="arrow-drop-down" size={24} style={styles.icon} />
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
    height: 40,

  },
  input: {
    flex: 1,
    paddingVertical: 10,

  },
  icon: {
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
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
    borderColor: '#ddd',
  },
  closeButton: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default DropdownInput;
