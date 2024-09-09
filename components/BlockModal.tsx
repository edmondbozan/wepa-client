import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import Modal from 'react-native-modal';
import { BASE_URL } from '@/constants/Endpoints';
import { normalize } from 'react-native-elements';
import fetchWithAuth from '@/context/FetchWithAuth';
import { FontAwesome, FontAwesome6, MaterialIcons } from '@expo/vector-icons';


interface BlockModalProps {
  onClose: () => void;
  userId: string;
  projectId: number;
  blockUserId: number;
  visible: boolean;
  onRebind:() => void;
}


const BlockModal: React.FC<BlockModalProps> = ({ onClose, userId, projectId, blockUserId, visible,onRebind }) => {


  const report = async (action:string) => {
    try {
      const response = await fetchWithAuth(BASE_URL + '/api/report/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId, projectId:projectId, blockedUserId: blockUserId, action:action })
      },
      );
      if (!response.ok) {
        Alert.alert('Error.', 'Please try again.');
        return;
      }
      onRebind();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Please try again.');
    }
  };


  const handleReport = (action:string) => {
    // console.log("enter");
    // console.log(projectId);
    Alert.alert(
      "Are you sure you want to " + action + " this account?",
      "This action cannot be undone.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: action.charAt(0).toUpperCase() + action.slice(1), onPress: () => report(action) }
      ],
      { cancelable: false }
    );
  };



  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={styles.modal}>
      <View style={styles.modalContent}>
        <View style={{ marginBottom: 10 }}>
          <TouchableOpacity onPress={()=>{handleReport("report")}}>
            <Text style={styles.label}><FontAwesome size={normalize(18)} name="exclamation-circle" color="#B87333"/> Report Content</Text>
          </TouchableOpacity>
          <View style={styles.horizontalRule}></View>
          <TouchableOpacity onPress={()=>{handleReport("block")}}>          
            <Text style={styles.label}><FontAwesome6 size={normalize(18)} name="ban" color="#B87333"/> Block User</Text>
          </TouchableOpacity>
          <View style={styles.horizontalRule}></View>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.label}>Cancel</Text>
          </TouchableOpacity>
        </View>
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
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    width: '100%'
  },
  horizontalRule: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: normalize(10),
  },
  label:{
    fontSize:normalize(18)
  }
});

export default BlockModal;
