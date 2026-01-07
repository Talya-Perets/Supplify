import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App.tsx';
import { doPost } from '../../util/HTTPRequests.ts';
import { globals } from '../../util/Globals.ts';
import styles from './ForgotPassword.styles'; 

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ForgotPassword'
>;

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>(); // Use navigation hook
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordSection, setIsPasswordSection] = useState(false); // Track password reset section
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await doPost(globals.AUTH.forgotPassword, { email });

      if (response.status === 200) {
        // Show password fields
        setIsPasswordSection(true);
        Alert.alert('Success', 'Enter your new password below!');
      } else {
        Alert.alert('Error', response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please enter both password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      // Assuming you have an endpoint to reset the password directly
      const response = await doPost(globals.USER.resetPassword, { email, newPassword });

      if (response.status === 200) {
        Alert.alert('Success', 'Your password has been reset successfully.');
        // After successful reset, navigate to the Login screen
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to reset password.');
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
        <Text style={styles.title}>Forgot Password</Text>

        {/* Email Input Section */}
        {!isPasswordSection && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#A0A0A0"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        )}

        {/* Password Input Section */}
        {isPasswordSection && (
          <>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                placeholderTextColor="#A0A0A0"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderTextColor="#A0A0A0"
              />
            </View>
          </>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={isPasswordSection ? handleResetPassword : handleForgotPassword}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Processing...' : isPasswordSection ? 'Reset Password' : 'Reset Password'}
          </Text>
        </TouchableOpacity>

        {/* Back to Login Link */}
        <View style={styles.linkContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
