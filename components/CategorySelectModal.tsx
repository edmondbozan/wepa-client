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
  isVisible:boolean;
  onSelect: (item: DropdownItem) => void;
  onClose:()=> void;
}

const CategoryModal: React.FC<DropdownInputProps> = ({ data,  onSelect, onClose, isVisible }) => {


  const handleSelect = (item: DropdownItem) => {
    onSelect(item);  // Pass the selected item to the parent component
  };

  return (
    <View  >
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => onClose}>
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
              onPress={onClose}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>close</Text>
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
    backgroundColor: 'rgba(0, 0, 0, .8)', 
  },
  modalContent: {
    width: '80%',
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
    color: '#000',
    textAlign: 'center',
  },
});

export default CategoryModal;
