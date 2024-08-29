import React from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text, Alert } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import { normalize } from 'react-native-elements';

WebBrowser.maybeCompleteAuthSession();

interface UserAuthData {
  userId: string;
  email?: string | null;
  fullName?: {
    givenName?: string | null;
    familyName?: string | null;
    middleName?: string | null;
  };
  idToken: string;
  provider: 'apple' | 'google';
}

interface AuthLoginButtonProps {
  onLoginSuccess: (data: UserAuthData) => void;
  onLoginFailure: (error: any) => void;
}

const AuthLoginButton: React.FC<AuthLoginButtonProps> = ({ onLoginSuccess, onLoginFailure }) => {
  const [loading, setLoading] = React.useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  React.useEffect(() => {
    if (response?.type === 'success' && response.authentication) {
      const { idToken } = response.authentication;
      const userAuthData: UserAuthData = {
        userId: response.params.sub,
        email: response.params.email ?? null,
        fullName: {
          givenName: response.params.given_name ?? null,
          familyName: response.params.family_name ?? null,
        },
        idToken: idToken!,
        provider: 'google',
      };

      onLoginSuccess(userAuthData);
    } else if (response?.type === 'error') {
      onLoginFailure(response.error);
    }
  }, [response]);

  const handleAppleLogin = async () => {
    setLoading(true);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const userAuthData: UserAuthData = {
        userId: credential.user,
        email: credential.email ?? null,
        fullName: credential.fullName
          ? {
              givenName: credential.fullName.givenName,
              familyName: credential.fullName.familyName,
              middleName: credential.fullName.middleName,
            }
          : null,
        idToken: credential.identityToken!,
        provider: 'apple',
      };

      onLoginSuccess(userAuthData);
    } catch (error) {
      onLoginFailure(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={styles.appleButton}
        onPress={handleAppleLogin}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  appleButton: {
    width: normalize(200),
    height: normalize(44),
    marginBottom: normalize(20),
    marginTop: normalize(20),
  },
  googleButton: {
    width: 200,
    height: 44,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  googleButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AuthLoginButton;
