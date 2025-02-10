import React, {useState} from 'react';
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
        Alert.alert('Success', data, [
          {text: 'OK', onPress: () => navigation.navigate('Login')},
        ]);
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
            placeholder="שם משפחה"
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor="#A0A0A0"
          />
          <TextInput
            style={styles.halfInput}
            placeholder="שם פרטי"
            value={firstName}
            onChangeText={setFirstName}
            placeholderTextColor="#A0A0A0"
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="שם משתמש"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#A0A0A0"
        />

        <TextInput
          style={styles.input}
          placeholder="שם העסק"
          value={businessName}
          onChangeText={setBusinessName}
          placeholderTextColor="#A0A0A0"
        />

        <TextInput
          style={styles.input}
          placeholder="טלפון"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholderTextColor="#A0A0A0"
          maxLength={10}
        />

        <TextInput
          style={styles.input}
          placeholder="כתובת"
          value={address}
          onChangeText={setAddress}
          placeholderTextColor="#A0A0A0"
        />

        <TextInput
          style={styles.input}
          placeholder="סיסמא"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#A0A0A0"
        />

        <TextInput
          style={styles.input}
          placeholder="אישור סיסמא"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor="#A0A0A0"
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={isLoading}>
          <Text style={styles.buttonText}>
            {isLoading ? 'מבצע הרשמה...' : 'הירשם'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;
