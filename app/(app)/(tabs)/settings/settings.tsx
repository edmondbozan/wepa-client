import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, Linking, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { useSession } from '@/context/ctx';
import { FontAwesome, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import fetchWithAuth from '@/context/FetchWithAuth';
import { BASE_URL } from '@/constants/Endpoints';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { ExternalLink } from '@/components/ExternalLink';
import { normalize } from 'react-native-elements';
import InputModal from '@/components/InputModal';
import { fetchUserData } from '@/http/apiUser';
import { User } from '@/interfaces/IProject';
import ProModal from '@/components/ProModal';
import InputPhoneModal from '@/components/InputPhoneModal';
import { validateZip } from '@/http/validateZip';
import InputZipModal from '@/components/InputZipModal';
import { isNullOrEmpty } from '@/functions/stringfunctions';

const UserSettings: React.FC = () => {
  const { signOut, userId, setNewZip, setNewUserType } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTextModalVisible, setTextInputModeVisible] = useState(false);
  const [modalValue, setModalValue] = useState('');
  const [modalTitle, setModalTitle] = useState("");
  const [modalRequired, setModalRequired] = useState(false);
  const [modalValidate, setModalValidate] = useState(null);
  const [user, setUser] = useState(null);
  const [proModalVisible, setProModalVisible] = useState(false);
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);
  const [zipModalVisible, setZipModalVisible] = useState(false);
  const [isPro, setPro] = useState<boolean>((user?.userType === "professional") ? true : false)
  const [license, setLicense] = useState(user?.license);
  const [userName, setUserName] = useState(user?.userName);
  const [email, setEmail] = useState(user?.email);
  const [phone, setPhone] = useState(user?.phoneNumber);
  const [zip, setZip] = useState(user?.zip);  
  const [refreshKey, setRefreshKey] = useState(0);

  const patchUser = async (patches: PatchModel[]) => {
    try {
      const response = await fetchWithAuth(BASE_URL + '/api/Auth/users/' + userId, {
        method: 'Patch',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patches)       
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
      } else {
        Alert.alert('Error', data.message || 'Registration failed');
      }
    } catch (error) {
      console.log("Caught error:", error);
      Alert.alert('Error', 'An error occurred while registering. Please try again.');
    }
  }






  const handleSignOut = () => {
    signOut();
    router.navigate("auth/login");
  };

  const handleDisplay = () => {
    setModalTitle("Display Name");
    setModalValue(userName);
    setTextInputModeVisible(true);
  };

  const handleEmail = () => {
    setModalTitle("Email");
    setModalValue(email);
    setTextInputModeVisible(true);
  };

  const handlePhone = () => {
    setModalTitle("Phone");
    setModalValue(phone);
    setPhoneModalVisible(true);
  };
  const handleZip = () => {
    setModalTitle("Zip");
    setModalValue(zip);
    setModalRequired(false);
    setZipModalVisible(true);
  };

  const handlePrivacy = () => {
    Linking.openURL('https://app.termly.io/policy-viewer/policy.html?policyUUID=92b8a492-eea6-4e68-9727-7430bc07dac5');
  }

  const handleToS = () => {
    Linking.openURL('https://app.termly.io/policy-viewer/policy.html?policyUUID=e7fd608a-64a0-4e12-91b9-e154a15eb707');
  }

  const handleDeleteAccount = () => {
    Alert.alert(
      "Are you sure you want to delete your account?",
      "All data will be permanently deleted.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Delete", onPress: deleteUser }
      ],
      { cancelable: false }
    );
  };


  const savePro = async (isPro: boolean, license: string) => {    
    const patches: PatchModel[] =               
    [{ key:"usertype", value: isPro ? "professional" : "user" },          
    { key:"license", value: license}]
    await setNewUserType(isPro ? "professional" : "user");              
    setProModalVisible(false);
    patchUser(patches);

  }
  const deleteUser = async () => {
    setIsDeleting(true);
    try {
      const response = await fetchWithAuth(`${BASE_URL}/api/auth/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        signOut();
        router.navigate("auth/login");
      } else {
        Alert.alert('Failed to Delete User.', 'Please try again.');
      }
    } catch (error) {
      Alert.alert('Failed to Delete User.', 'Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };


  useEffect(() => {
    setUserName(user?.userName);
    setEmail(user?.email);
    setPhone(user?.phoneNumber);
    setZip(user?.zipCode);
    setPro((user?.userType === "professional") ? true : false);
  }, [user]);


  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (userId) {
          try {
            const usr = await fetchUserData(userId);          
            setUser(usr);
          } catch (error) {
            console.error('Failed to fetch user data:', error);
          }
        }
      }
      fetchData();
      setRefreshKey((prevKey) => prevKey + 1);
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const usr = await fetchUserData((userId) ? userId : 0);
        setUser(usr);
        setRefreshKey((prevKey) => prevKey + 1);
      }
      fetchData();
    }, [])
  );



  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.optionContainer}></View>
        <Text style={{ margin: 10, fontWeight: '600' }}>User Settings</Text>
        <View style={styles.separator} />

        <View style={[styles.container, { flexDirection: 'row' }]}>
          <Text style={{ alignSelf: 'center' }}> I am a professional:</Text>

          <Switch
            trackColor={{ false: "#C0C0C0", true: "#C0C0C0" }}
            thumbColor={(isPro) ? "#B87333" : "#000"}
            ios_backgroundColor="#C0C0C0"
            value={isPro ? true : false}
            onValueChange={() => { setProModalVisible(true) }}
          />
        </View>
        <View style={styles.separator} />

        <TouchableOpacity onPress={handleDisplay}>
          <View style={styles.container}>
            <Text>Display Name:</Text>
            <Text>{userName} <FontAwesome6 name="chevron-right" />
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity onPress={handleEmail}>
          <View style={styles.container}>
            <Text>Email:</Text>
            <Text> {email} <FontAwesome6 name="chevron-right" />
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity onPress={handlePhone}>
          <View style={styles.container}>
            <Text>Phone:</Text>
            <Text> {phone} <FontAwesome6 name="chevron-right" />
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity onPress={handleZip}>
          <View style={styles.container}>
            <Text>Zip:</Text>
            <Text>{zip} <FontAwesome6 name="chevron-right" />
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />



        <TouchableOpacity onPress={handlePrivacy}>
          <View style={styles.container}>
            <Text> Privacy Policy</Text>
            <FontAwesome6 name="chevron-right" />
          </View>
        </TouchableOpacity>

        <View style={styles.separator} />
        <TouchableOpacity onPress={handleToS}>
          <View style={styles.container}>
            <Text> Terms of Service</Text>
            <FontAwesome6 name="chevron-right" />
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity onPress={handleSignOut} disabled={isDeleting}>
          <View style={styles.container}>
            <Text> Sign Out</Text>
            <FontAwesome6 name="chevron-right" />
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity onPress={handleDeleteAccount} disabled={isDeleting}>
          <View style={styles.container}>
            <Text> Delete Account</Text>
            <FontAwesome6 name="chevron-right" />
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        {isTextModalVisible &&
          <InputModal isVisible={isTextModalVisible} title={modalTitle} initialValue={modalValue} isRequired={true} onClose={() => setTextInputModeVisible(false)} onSave={(text) => {

            const patches: PatchModel[] =               
            [{ key:modalTitle, value: text }]              
            setTextInputModeVisible(false);
            patchUser(patches);
          }} maxLength={50} />
        }
        {zipModalVisible &&
          <InputZipModal isVisible={zipModalVisible} title={modalTitle} initialValue={modalValue} isRequired={false} onClose={() => setZipModalVisible(false)} onSave={(text) => {
            const patches: PatchModel[] =               
            [{ key:modalTitle, value: text }]              
            setZipModalVisible(false);
            patchUser(patches);
          }} />
        }


        {phoneModalVisible &&
          <InputPhoneModal isVisible={phoneModalVisible} title={modalTitle} initialValue={modalValue} onClose={() => setPhoneModalVisible(false)} onSave={(text) => {
            const patches: PatchModel[] =               
            [{ key:modalTitle, value: text }]              
            setPhoneModalVisible(false);
            patchUser(patches);
          }} maxLength={50} />
        }
        {proModalVisible &&
          <ProModal isVisible={proModalVisible} initialIsPro={isPro} initialLicenseNumber={license} maxLength={25} onSave={savePro} onClose={function (): void {
            setProModalVisible(false);
          }} />
        }
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  itemContainer: {
    borderColor: '#B87333',
    borderWidth: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    margin: 20,
  },
  optionContainer: {
    margin: 20
  },
  separator: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  label: {
    color: '#000000',
    fontWeight: '300',
    fontSize: normalize(14)
  },
  safeArea: {
    flex: 1,
    //margin: 20,
    backgroundColor: "white"
  },
});

export default UserSettings;
