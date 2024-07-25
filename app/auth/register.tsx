import TypingText from '@/components/TypingComponent';
import { BASE_URL } from '@/constants/Endpoints';
import { useSession } from '@/context/ctx';
import GlobalStyles from '@/styles/styles';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInputMask } from 'react-native-masked-text';
import { normalize } from 'react-native-elements';

const Register: React.FC = () => {
  const { signIn } = useSession();
  const [userType, setUserType] = useState<'professional' | 'consumer' | null>('consumer');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [zipcode, setZipcode] = useState<string>('');
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [isUserNameValid, setUsernameValid] = useState<boolean>(true);
  const [isPasswordValid, setPasswordValid] = useState<boolean>(true);
  const [isPhoneValid, setPhoneValid] = useState<boolean>(true);
  const [isEmailValid, setEmailValid] = useState<boolean>(true);
  const [isZipValid, setZipValid] = useState<boolean>(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProfessional, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const validateUserName = () : boolean => {
    if (username.length > 0) {
      setUsernameValid(true);
      return true;
    } else {
      setUsernameValid(false);
      return false;
    }
  }

  const validatePassword = () : boolean => {
    if (password.length > 6) {
      setPasswordValid(true);
      return true;
    } else {
      setPasswordValid(false);
      return false;
    }
  }

  const validatePhone = () : boolean => {
    const phoneRegex = /^\+1 \(\d{3}\) \d{3}-\d{4}$/; // US phone number format: +1 (123) 456-7890
    if (phoneRegex.test(phone)) {
      setPhoneValid(true);
      return true;
    } else {
      setPhoneValid(false);
      return false;
    }
  }

  const validateEmail = () : boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)){
      setEmailValid(true);
      return true;
    } else {
      setEmailValid(false);
      return false;
    }
  };

  const  validateZip= () : boolean => {
    if (zipcode.length == 5) {
      setZipValid(true);
      return true;
    } else {
      setZipValid(false);
      return false;
    }
  }

  const handleValidation = (): boolean => {
    const validationErrors: string[] = [];

    if (!validateUserName()) validationErrors.push('Invalid username');
    if (!validateEmail()) validationErrors.push('Invalid email');
    if (!validatePassword()) validationErrors.push('Invalid password');
    if (!validatePhone()) validationErrors.push('Invalid phone number');
    if (!validateZip()) validationErrors.push('Invalid ZIP code');

    setErrors(validationErrors);

    // Return true if there are no validation errors
    return validationErrors.length === 0;
  };


  const handleRegister = async () => {
    const isValid = handleValidation();
    if (isValid) 
    {
    try {
      const response = await fetch(BASE_URL + '/api/Auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userType: (isProfessional) ? 'professional' : 'user',
          Username: username,
          Email: email,
          Password: password,
          ZipCode: zipcode,
          PhoneNumber: phone
        }),
      });

      const data = await response.json();
      if (response.ok) {
        await signIn(data.token, JSON.stringify(data.userId), data.userType);
        router.replace('/');
      } else {
        Alert.alert('Error', data.message || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while registering. Please try again.');
      console.error('Registration error:', error);
    }
  }
  }

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} automaticallyAdjustKeyboardInsets={true}>
        <View style={styles.container}>
          <Text style={{ color: "#000", fontSize: 16, marginTop: 10 }} onPress={() => { router.replace('/auth/login'); }}>
            <FontAwesome name="arrow-left" /> Login
          </Text>
          <ImageBackground source={require('.././../assets/images/register-background.jpg')} style={styles.background} imageStyle={{ opacity: 0.45, backgroundColor: "#000" }}>
            <TypingText text={'Find your forever professional'}></TypingText>
            {/* <Text style={{color:"#fff", marginLeft:20, fontWeight:'bold'}}></Text> */}
          </ImageBackground>
          <View style={{flexDirection:'row', alignItems:'center',marginTop:normalize(20)}}>
          <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
         thumbColor={isProfessional ? "#f5dd4b" : "#f4f3f4"}
         ios_backgroundColor="#a7abb5"
         onValueChange={toggleSwitch}
         value={isProfessional}
      />
      <Text> 
            <Text style={{fontWeight:'bold', color:'#B87333'}}>{isProfessional?' I am a professional.':' I am not a professional.'}</Text>
            <Text style={{fontWeight:'bold', color:'red'}}>{isProfessional && `${'\n'} Your phone number will be displayed.` }</Text>
      </Text>
      </View>
          {/* <View style={styles.radioContainer}>
            <TouchableOpacity style={styles.radio} onPress={() => setUserType('professional')}>
              <View style={userType === 'professional' ? styles.radioSelected : styles.radioUnselected} />
              <Text style={styles.label}>Professional</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.radio} onPress={() => setUserType('consumer')}>
              <View style={userType === 'consumer' ? styles.radioSelected : styles.radioUnselected} />
              <Text style={styles.label}>Consumer</Text>
            </TouchableOpacity>
          </View> */}

          <Text style={styles.label}>Display Name:</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#000"
            style={[styles.input, !isUserNameValid && styles.inputError]}
            onBlur={validateUserName}
          />
          {!isUserNameValid &&
            (<Text style={{ color: 'red' }}>Display Name is required</Text>)}
          <Text style={styles.label}>Password:</Text>
          <TextInput
            value={password}
            // onChangeText={setPassword}
            placeholderTextColor="#000"
            secureTextEntry
            onBlur={validatePassword}
            onTextInput={validatePassword}
            style={[styles.input, !isPasswordValid && styles.inputError]}
          />
          {!isPasswordValid &&
            (<Text style={{ color: 'red' }}>Password is required and must be {'>'} 6 charchters </Text>)}

          {/* <Text style={styles.label}>Verify Password:</Text>
          <TextInput
            value={verifyPassword}
            onChangeText={setVerifyPassword}
            placeholder="Verify password"
            placeholderTextColor="#fff"
            secureTextEntry
            style={[styles.input, validationErrors.verifyPassword && styles.inputError]}
          /> */}
          <Text style={styles.label}>Phone:</Text>
          <TextInputMask
            type={'custom'}
            options={{
              mask: '+1 (999) 999-9999',
            }}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#000"
            returnKeyType="done"
            onBlur={validatePhone}
            style={[styles.input, !isPhoneValid && styles.inputError]}
          />
          {!isPhoneValid &&
            (<Text style={{ color: 'red' }}>Proper phone number is required.</Text>)}

          <Text style={styles.label}>Email:</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#000"
            onBlur={validateEmail}
            style={[styles.input, !isEmailValid && styles.inputError]}
          />
          {!isEmailValid &&
            (<Text style={{ color: 'red' }}>Proper email is required.</Text>)}
          
          <Text style={styles.label}>Zipcode:</Text>
          <TextInput
            value={zipcode}
            onChangeText={setZipcode}
            keyboardType="number-pad"
            placeholderTextColor="#000"
            onBlur={validateZip}
            style={[styles.input, !isZipValid && styles.inputError]}
          />
          {!isZipValid &&
            (<Text style={{ color: 'red' }}>Proper zip is required.</Text>)}
          
          <TouchableOpacity onPress={handleRegister} style={styles.button}>
            <Text style={styles.buttonText}>REGISTER</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    resizeMode: 'cover',
    height: 200,
    width: null,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginTop: 20,
    justifyContent: 'space-evenly',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(221, 221, 221, 0.5)',
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  label: {
    color: '#B87333',
    marginBottom: 5,
    marginTop: 15,
    fontWeight: 'bold'

  },
  input: {
    height: 50,
    borderColor: '#FFF',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#000',
    backgroundColor: 'rgba(255, 255, 255, 0.3)', 
    borderRadius: 5,
  },
  inputError: {
    borderColor: 'red',
    color: 'red'
  },
  buttonDisabled: {
    backgroundColor: '#ccc', // Grey background for disabled button
  },
  button: {
    height: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#B87333'
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  }

});

export default Register;
