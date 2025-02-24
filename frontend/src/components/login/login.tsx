import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import {API_BASE_URL, RootStackParamList} from '../../../App.tsx';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {doPost} from '../../util/HTTPRequests.ts';
import {globals} from '../../util/Globals.ts';
import styles from './login.styles';
import {LoginContext} from '../../contexts/LoginContext.tsx';
import {LoginContextType} from '../../contexts/UserContext.tsx';
import messaging from '@react-native-firebase/messaging';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {login} = useContext(LoginContext) as LoginContextType;

  const configureGoogleSignIn = () => {
    GoogleSignin.configure();
  };

  useEffect(() => {
    configureGoogleSignIn();
  });

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();

      if (userInfo && userInfo.type === 'success') {
        console.log('Google Sign-In successful:', userInfo);

        try {
          const response = await doPost(globals.AUTH.google, {
            username: userInfo.data.user.email,
          });

          Alert.alert(
            'Success',
            response.data.message
              ? response.data.message
              : 'Successful login via Google Sign-In',
          );

          login(
            response.data.businessId,
            response.data.userId,
            response.data.role,
          );

          navigation.navigate('Home');
        } catch (error) {
          console.error('Failed to login via Google Sign-In:', error);
        }
      } else {
        console.log('Google Sign-In failed:', userInfo);
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
    }
  };

  const handleLogin = async () => {
    // Validate inputs first
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await doPost(globals.AUTH.login, {
        username,
        password,
      });

      if (response.status === 200) {
        // Successful login
        Alert.alert('Success', 'Successful login');

        login(
          response.data.businessId,
          response.data.userId,
          response.data.role,
        );

       // Get FCM token
       const fcmToken = await messaging().getToken();
       console.log('FCM Token:', fcmToken);

       // Send FCM token to backend
       await doPost(globals.AUTH.Token, {
         userId: response.data.userId,
         deviceToken: fcmToken,
       });


        navigation.navigate('Home');
      } else {
        // Failed login
        Alert.alert(
          'Error',
          response.data.message || 'Invalid username or password',
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} accessible={false}>
      <View style={styles.card} accessible={false}>
        <Text style={styles.title}>Supplify</Text>

        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="#4A90E2" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#A0A0A0"
            autoCapitalize="none"
            keyboardType="email-address"
            testID="email-input"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#4A90E2" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#A0A0A0"
            testID="password-input"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
          testID="login-button">
          <Icon
            name="log-in"
            size={20}
            color="white"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>
            {isLoading ? 'Login...' : 'Login'}
          </Text>
        </TouchableOpacity>

        {/* Google Sign-In Button */}
        <View style={styles.button}>
          <GoogleSigninButton
            style={{width: 192, height: 48}}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={handleGoogleSignIn}
          />
        </View>

        <View style={styles.linkContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.link}>Forgot password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            testID="register-link">
            <Text style={styles.link}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
