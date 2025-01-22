import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import { API_BASE_URL, RootStackParamList } from '../../../App.tsx';
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async () => {
    // Validate inputs first
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      console.log(data); // Keep for debugging
  
      if (response.ok) {
        // Successful login
        Alert.alert('Success', 'Login successful');
        navigation.navigate('Home');
      } else {
        // Failed login
        Alert.alert('Error', data.message || 'Invalid username or password');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Supplify</Text>

        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="#4A90E2" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="email"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#A0A0A0"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#4A90E2" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="סיסמא"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#A0A0A0"
          />
        </View>

         <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleLogin} 
        disabled={isLoading}
      >
        <Icon name="log-in" size={20} color="white" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>{isLoading ? 'מתחבר...' : 'התחבר'}</Text>
      </TouchableOpacity>

        <View style={styles.linkContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.link}>שכחתי סיסמא</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>הירשם</Text>
          </TouchableOpacity>
        </View>
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
    maxWidth: 400,
    backgroundColor: 'white',
    padding: 32,
    borderRadius: 16,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderTopWidth: 4,
    borderTopColor: '#4A90E2',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  icon: {
    position: 'absolute',
    top: '50%',
    left: 10,
    transform: [{ translateY: -12 }],
  },
  input: {
    width: '100%',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#D1D1D1',
    backgroundColor: '#F9F9F9',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  link: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;