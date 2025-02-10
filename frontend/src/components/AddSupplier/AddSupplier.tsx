import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../sidebar-component';
import {API_BASE_URL, RootStackParamList} from '../../../App';
import {Alert} from 'react-native';
import styles from './AddSupplier.styles';
import { doPost } from '../../util/HTTPRequests';
import { globals } from '../../util/Globals';

type AddSupplierScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddSupplier'
>;
const AddSupplierScreen = () => {
  const navigation = useNavigation<AddSupplierScreenNavigationProp>();
  const [userRole] = useState<'manager' | 'employee'>('manager');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const [supplierData, setSupplierData] = useState({
     companyName:'',
    contactPerson: '',
    email: '',
    phone:''
  }
  );

  const handleAddSupplier = async () => {
    // Validate input fields
    if (!supplierData.companyName || !supplierData.contactPerson || !supplierData.email || !supplierData.phone) {
      Alert.alert('Error', 'Please fill in all supplier details');
      return;
    }  
    try {
      const response = await doPost(globals.SUPPLIERS.createSupplier, {
        companyName: supplierData.companyName,
        contactPerson: supplierData.contactPerson,
        email: supplierData.email,
        phone: supplierData.phone
      });
  
      if (response.status === 200) {
        Alert.alert(
          'Success', 
          'Supplier added successfully',
          [{ 
            text: 'OK', 
            onPress: () => {
              // Reset form fields
              setSupplierData({
                companyName: '',
                contactPerson: '',
                email: '',
                phone: ''
              });
            } 
          }]
        );
      } else {
        Alert.alert(
          'Error', 
          response.data.message || 'Failed to add supplier'
        );
      }
    } catch (error) {
      console.error('Error adding supplier:', error);
      
      Alert.alert(
        'Error', 
        'Network error. Please try again.'
      );
    } 

  };
  
  return (
    <SafeAreaView style={styles.container}>
      {isSidebarVisible && <Sidebar userRole={userRole} />}
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
          <Text style={styles.headerTitle}>הוספת ספק חדש</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="שם ספק"
              value={supplierData.companyName}
              onChangeText={text =>
                setSupplierData({...supplierData, companyName: text})
              }
            />
            <TextInput
              style={styles.input}
              placeholder="איש קשר"
              value={supplierData.contactPerson}
              onChangeText={text =>
                setSupplierData({...supplierData, contactPerson: text})
              }
            />
            <TextInput
              style={styles.input}
              placeholder="מייל"
              value={supplierData.email}
              onChangeText={text =>
                setSupplierData({...supplierData, email: text})
              }
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="טלפון"
              value={supplierData.phone}
              onChangeText={text =>
                setSupplierData({...supplierData, phone: text})
              }
              keyboardType="phone-pad"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleAddSupplier}>
            <Text style={styles.buttonText}>הוסף ספק</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AddSupplierScreen;
