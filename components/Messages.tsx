import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Button, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { BASE_URL } from '@/constants/Endpoints';
import fetchWithAuth from '@/context/FetchWithAuth';

interface Message {
    comment: string;
    userName: string;
    id:number;
  }
  

interface MessagesModalProps {
  projectId: string;
  visible: boolean;
  onClose: () => void;
}

const MessagesModal: React.FC<MessagesModalProps> = ({ projectId, visible, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(projectId); 
    console.log(BASE_URL + "/api/projects/"+ projectId + "/messages");        
    const getMessages = async () => {
      setLoading(true);     
        try {
          const response = await fetchWithAuth(BASE_URL + "/api/projects/"+ projectId + "/messages");
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setMessages(data);
          console.log(data);
          console.log(messages); 
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
        finally{
        setLoading(false);
    }
    };

    if (visible) {    
      getMessages();
    }
  }, [projectId, visible]);

//   useEffect(()=>{
//     console.log(BASE_URL + {projectId} + "/messages");        
//   }, [])

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Button title="Close" color="#fff" onPress={onClose} />
        {loading ? (
          <ActivityIndicator size="large" color="#000000" />
        ) : (
         <><Button title="Close" onPress={onClose} />
          <FlatList 
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.messageContainer}>
                <Text style={styles.userName}>{item.userName}</Text>
                <Text style={styles.comment}>{item.comment}</Text>
              </View>
            )}
          />
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  userName: {
    fontWeight: 'bold',
  },
  comment: {
    marginTop: 5,
  },
});

export default MessagesModal;
