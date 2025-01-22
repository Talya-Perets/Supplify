import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, SafeAreaView, Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { API_BASE_URL, RootStackParamList } from '../../../App.tsx';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const SignUpScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
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
    // Validate phone number format
   // const phoneRegex = /^[0-9]{10}$/;
  //  if (!phoneRegex.test(phone)) {
  //    Alert.alert('שגיאה', 'מספר טלפון לא תקין');
  //    return false;
  //  }
    if (!role.trim()) {
      Alert.alert('שגיאה', 'נא להזין תפקיד');
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
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          user_name: username,
          password: password,
          business_name: businessName,  
          phone_number: phone,         
          role: role,
        }),
      });
    
      let data;
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Response text:', text);
        throw new Error('Invalid JSON response from server');
      }
    
      if (response.ok) {
        Alert.alert('הצלחה', 'ההרשמה בוצעה בהצלחה', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        Alert.alert('שגיאה', data?.message || 'אירעה שגיאה בתהליך ההרשמה');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('שגיאה', 'אירעה שגיאה בתהליך ההרשמה. נא לנסות שוב מאוחר יותר');
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

        <TextInput
          style={styles.input}
          placeholder="תפקיד"
          value={role}
          onChangeText={setRole}
          placeholderTextColor="#A0A0A0"
        />

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'מבצע הרשמה...' : 'הירשם'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6F1FB',
    padding: 16,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfInput: {
    width: '48%',
    height: 50,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 8,
    paddingHorizontal: 16,
    textAlign: 'right',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#4A90E2',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;