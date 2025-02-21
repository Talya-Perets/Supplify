import React, {useState, useContext} from 'react';
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
import {RootStackParamList} from '../../../App.tsx';
import {doPost} from '../../util/HTTPRequests.ts';
import {globals} from '../../util/Globals.ts';
import styles from './registration.styles';
import {LoginContext} from '../../contexts/LoginContext.tsx';
import {LoginContextType} from '../../contexts/UserContext.tsx';

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

const SignUpScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {login} = useContext(LoginContext) as LoginContextType;

  const validateForm = () => {
    if (!firstName.trim()) {
      Alert.alert('שגיאה', 'נא להזין שם פרטי');
      return false;
    }
    if (!lastName.trim()) {
      Alert.alert('שגיאה', 'נא להזין שם משפחה');
      return false;
    }
    if (!username.trim()) {
      Alert.alert('שגיאה', 'נא להזין שם משתמש');
      return false;
    }
    if (!businessName.trim()) {
      Alert.alert('שגיאה', 'נא להזין שם עסק');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('שגיאה', 'נא להזין מספר טלפון');
      return false;
    }
    if (!address.trim()) {
      Alert.alert('שגיאה', 'נא להזין כתובת');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('שגיאה', 'סיסמה חייבת להכיל לפחות 6 תווים');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('שגיאה', 'סיסמאות לא תואמות');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await doPost(globals.AUTH.register, {
        username,
        password,
        firstName,
        lastName,
        businessName,
        phone,
        address,
      });
      const data = response?.data;
      if (response.status === 201) {
        Alert.alert('Success', data.message, [
          {text: 'OK', onPress: () => navigation.navigate('Login')},
        ]);

        login(data.businessId, data.userId, data.role);
      } else {
        Alert.alert('Error', data || 'אירעה שגיאה בתהליך ההרשמה');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(
        'שגיאה',
        'אירעה שגיאה בתהליך ההרשמה. נא לנסות שוב מאוחר יותר',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Supplify</Text>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.halfInput}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor="#A0A0A0"
            testID="lastName-input"
          />
          <TextInput
            style={styles.halfInput}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            placeholderTextColor="#A0A0A0"
            testID="firstName-input"
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#A0A0A0"
          testID="email-input"
        />

        <TextInput
          style={styles.input}
          placeholder="Business Name"
          value={businessName}
          onChangeText={setBusinessName}
          placeholderTextColor="#A0A0A0"
          testID="businessName-input"
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholderTextColor="#A0A0A0"
          maxLength={10}
          testID="phone-input"
        />

        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          placeholderTextColor="#A0A0A0"
          testID="address-input"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#A0A0A0"
          testID="password-input"
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor="#A0A0A0"
          testID="confirmPassword-input"
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={isLoading}
          testID="signUp-button">
          <Text style={styles.buttonText}>
            {isLoading ? 'Signing up...' : 'Sign up'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;
