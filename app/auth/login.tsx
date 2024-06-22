import { router } from 'expo-router';
import { Alert, Button, Text, TextInput, View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, ImageBackground } from 'react-native';
import { useSession } from '@/context/ctx';
import { useState } from 'react';
import { BASE_URL } from '@/constants/Endpoints';
import PhotoCarousel from '@/components/PhotoCarousel';
import normalize from '@/fonts/fonts';
import TypingText from '@/components/TypingComponent';

export default function SignIn() {
  const { signIn } = useSession();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleRegister = async () => {
    router.push('/auth/register');
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(BASE_URL + '/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        await signIn(data.token, JSON.stringify(data.userId));
        router.replace('/');
      } else {
        Alert.alert('Login failed', 'Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('An error occurred', 'Please try again later');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} >
      <ImageBackground source={require('../../assets/images/background.jpg')} style={styles.background} >
      <View style={styles.overlay}>
      <ScrollView contentContainerStyle={styles.scrollContainer} automaticallyAdjustKeyboardInsets={true}>
         <View  style={styles.loginTextContainer}>
          <TypingText text="Find Styles You Love...And Professionals You Can Trust." speed={100} />
         {/* <Text style={styles.loginText}>Find Styles You Love</Text>
         <View style={styles.spacerFontHeight}></View>
         <Text style={styles.loginText}>And Professionals You Can Trust</Text> */}
          {/* <PhotoCarousel /> */}
        </View> 

        <View style={styles.inputView}>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Enter Email"
            style={styles.input}
            placeholderTextColor={"#e4eaf7"}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter Password"
            secureTextEntry
            style={styles.input}
            placeholderTextColor={"#e4eaf7"}

          />
          <View style={styles.buttons}>
          <View style={[styles.buttonContainer]}>
          <TouchableOpacity  onPress={handleLogin} >
              <Text style={styles.button} >Sign In</Text>
            </TouchableOpacity>

            </View>
            <View style={styles.space} /> 
            <View style={styles.buttonContainer}>
            <TouchableOpacity  onPress={handleRegister} >
              <Text style={styles.button}>Register</Text>
            </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity  onPress={handleLogin} >
              <Text style={styles.forgotText}>Forgot my Password</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
      </View>

      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)', // Semi-transparent overlay
  },
  buttonContainer: {
    backgroundColor: '#e4eaf7',
    borderColor:'#B87333',
    borderWidth:1.5,
    borderRadius: 15, // Rounded edges
    paddingHorizontal: 20,    
    paddingVertical:8,
    // alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', // Shadow for a subtle depth effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 5, // For Android shadow
    color:'#000',


  },
  button:{
    fontSize:18,
    fontWeight: 'black',
    color:'#000'
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#faf9f2',
  },
  buttons: {
    flexDirection: 'row',
     justifyContent: 'flex-start',
    padding: 30,
  },
  scrollContainer: {
    flexGrow: 1,
    //justifyContent: 'center',
    // padding: 10,
  },
  photos: {
  //   height: '50%',
    // justifyContent: 'center',
//    alignItems: 'center',
  },
  inputView: {
     height: normalize(200),
    justifyContent: 'center',
    alignItems: 'center',
    color:'#000',
    margin:normalize(30),
  },
  input: {
    height: normalize(40),
    borderColor: '#B87333',
    borderRadius:10,
    shadowColor:'#000',
    color: "#e4eaf7",
    elevation:5,
    borderWidth: normalize(3),
    marginBottom: normalize(10),
    paddingHorizontal: normalize(10),
    width: '100%',
  },
  space: {
    width: normalize(7), // or whatever size you need
    height: 1,
  },

  loginText:{
    // margin: 50,
    color:'#fff',
    fontSize:normalize(35),
    // fontWeight:'',
    fontFamily: 'Pacifico-Regular',
//    fontWeight:'900'

  },
  loginTextContainer:{
    margin: normalize(50),
    height: normalize(300)
  },
  forgotText:{
//    fontFamily: 'Pacifico-Regular',
    color:"#B87333",
    fontWeight:"bold",
    fontSize:normalize(15)

  }
});

