import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { Button, TextInput, Provider, Card, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import CameraButton from '@/components/CameraButton';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Item {
    id: number;
    description: string;
    beforeImage: string | null;
    afterImage: string | null;
}

const App: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [description, setDescription] = useState<string>('');
    const [beforeImage, setBeforeImage] = useState<string | null>(null);
    const [afterImage, setAfterImage] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);


    const pickImage = async (setImage: React.Dispatch<React.SetStateAction<string | null>>) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };



    const addItem = () => {
        const newItem: Item = {
            id: items.length + 1,
            description,
            beforeImage,
            afterImage,
        };
        setItems([...items, newItem]);
        // Reset form
        setDescription('');
        setBeforeImage(null);
        setAfterImage(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Provider>
                <View style={styles.form}>

                    <View style={styles.photoBox}>
                        <Text style={{marginBottom:10}}>Show off your work with before and after pics </Text>
                        <View style={styles.photoRow}>
                            <CameraButton label="After" onPress={() => pickImage(setAfterImage)} imageUri={afterImage} />
                            <CameraButton label="Before" onPress={() => pickImage(setBeforeImage)} imageUri={beforeImage} />
                        </View>
                    </View>
                    <View>
                        <TextInput
                            label="Description"
                            value={description}
                            onChangeText={setDescription}
                            style={styles.input}
                            multiline={true}
                            maxLength={500}
                        />
                    </View>
                </View>
                <Button mode="contained" onPress={addItem} disabled={!description || !beforeImage || !afterImage}>
                    Add Item
                </Button>
                <Button mode="contained">
                    Cancel
                </Button>
            </Provider>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    photoBox: {
        //  margin: 20,
        borderWidth: .5,
        padding: 10,
        borderRadius: 10,
        marginBottom:10
    },
    photoRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        borderRadius: 10
    },
    form: {
        marginTop: 20,
    },
    input: {
        marginBottom: 10,
        height: 250,
    },
    card: {
        marginBottom: 10,
    },
    image: {
        width: 100,
        height: 100,
        marginVertical: 10,
    },
    space: {
        // width:50
    }
});

export default App;
