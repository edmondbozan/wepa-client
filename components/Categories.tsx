import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BASE_URL } from '@/constants/Endpoints';

export interface ICategories {
    id: number;
    description: string    
}

export const Categories: React.FC = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await fetch(BASE_URL + '/Category');
          const data = await response.json();
          setCategories(data);
          Alert.alert(JSON.stringify(data));
        } catch (error) {
          console.error('Error fetching categories:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchCategories();
    }, []);
  
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Categories Component</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Picker
            selectedValue={selectedCategory}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          >
            <Picker.Item label="Select a category" value={null} />
            {categories.map((category: any) => (                                
              <Picker.Item key={category.id} label={category.description} value={category.id} />
            ))}
          </Picker>
        )}
        <Text style={styles.text}>
          Selected Category: {selectedCategory ? selectedCategory : "None"}
        </Text>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    text: {
      fontSize: 18,
      color: '#000',
      marginBottom: 10,
    },
    picker: {
      height: 50,
      width: 250,
    },
  });
  
  export default Categories;