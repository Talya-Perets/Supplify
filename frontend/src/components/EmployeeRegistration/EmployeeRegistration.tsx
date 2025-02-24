import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../Sidebar/sidebar';
import {styles} from './EmployeeRegistration.styles';
import {Dropdown} from 'react-native-element-dropdown';
import {doPost} from '../../util/HTTPRequests';
import {globals} from '../../util/Globals';
import {LoginContext} from '../../contexts/LoginContext';
import {LoginContextType} from '../../contexts/UserContext';

const EmployeeRegistrationScreen = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Employee');
  const {userInfo} = useContext(LoginContext) as LoginContextType;

  const validateForm = () => {
    if (!firstName.trim()) {
      Alert.alert('שגיאה', 'נא להזין שם פרטי');
      return false;
    }
    if (!lastName.trim()) {
      Alert.alert('שגיאה', 'נא להזין שם משפחה');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('שגיאה', 'נא להזין כתובת מייל');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('שגיאה', 'נא להזין מספר טלפון');
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

  const createUser = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await doPost(globals.USER.createUser, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        phone: phone,
        businessId: userInfo.businessId,
        role: role,
      });
      if (response.status === 200) {
        Alert.alert('Success', 'עובד חדש נוסף בהצלחה');
      } else {
        Alert.alert('שגיאה', 'אירעה שגיאה בתהליך ההרשמה');
      }
    } catch (error: any) {
      Alert.alert('שגיאה', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isSidebarVisible && <Sidebar />}
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setIsSidebarVisible(!isSidebarVisible)}>
            <Icon
              name={isSidebarVisible ? 'x' : 'menu'}
              size={24}
              color="#4A90E2"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>רישום עובד חדש</Text>
        </View>

        <View style={styles.formContainer}>
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
            placeholder="אימייל"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#A0A0A0"
          />

          <TextInput
            style={styles.input}
            placeholder="פלאפון"
            value={phone}
            onChangeText={setPhone}
            keyboardType="numeric"
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

          <Dropdown
            data={[
              {label: 'עובד', value: 'Employee'},
              {label: 'מנהל', value: 'Manager'},
            ]}
            labelField="label"
            valueField="value"
            placeholder="עובד"
            value={role}
            onChange={item => {
              setRole(item.value);
            }}
            style={styles.dropdownContainer}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
            itemTextStyle={{textAlign: 'right', writingDirection: 'rtl'}}
          />

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText} onPress={createUser}>
              רשום עובד
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EmployeeRegistrationScreen;
