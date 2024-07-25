import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { Checkbox } from 'react-native-paper';
import { BASE_URL } from '@/constants/Endpoints';
import GlobalStyles from '@/styles/styles';
import normalize from 'react-native-elements/dist/helpers/normalizeText';

export interface Item {
  id: number;
  description: string;
}

interface CheckboxListProps {
  isVisible?: boolean;
  onClose?: () => void;
  onSelect?: (selectedItems: Item[]) => void;
  initialSelectedItems?: number[]; // Add this prop
}

const CheckboxList: React.FC<CheckboxListProps> = ({
  isVisible = false,
  onClose = () => {},
  onSelect = () => {},
  initialSelectedItems = [], // Add this default prop
}) => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (isVisible) {
      fetchItems();
      setSelectedItems(initialSelectedItems); // Initialize selected items when modal is opened
    }
  }, [isVisible]); // Remove initialSelectedItems as a dependency

  const fetchItems = async () => {
    try {
      const response = await fetch(BASE_URL + '/Category');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: Item[] = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  };

  const toggleSelection = (itemId: number) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(itemId)) {
        return prevSelectedItems.filter((id) => id !== itemId);
      } else {
        return [...prevSelectedItems, itemId];
      }
    });
  };

  const handleSelect = () => {
    const selectedItemsData = items.filter((item) => selectedItems.includes(item.id));
    onSelect(selectedItemsData);
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <ScrollView>
          {items.map((item) => (
            <View key={item.id} style={styles.item} >
              <Checkbox
                status={selectedItems.includes(item.id) ? 'checked' : 'unchecked'}
                onPress={() => toggleSelection(item.id)}
              />
              <Text onPress={() => toggleSelection(item.id)}>{item.description}</Text>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity onPress={handleSelect} style={styles.button}>
          <Text style={styles.buttonText}>Select</Text>
        </TouchableOpacity>
      </View>
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
    padding: normalize(22),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    // maxHeight: '50%',
  },
  item: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#e4eaf7',
    borderColor: '#B87333',
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#B87333',
    fontSize: 16,
  },
});

export default CheckboxList;
