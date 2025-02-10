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

type AddSupplierScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddSupplier'
>;

const AddSupplierScreen = () => {
  const navigation = useNavigation<AddSupplierScreenNavigationProp>();
  const [userRole] = useState<'manager' | 'employee'>('manager');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const [supplierData, setSupplierData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
  });

  const handleAddSupplier = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/suppliers/business/20`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(supplierData),
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Supplier added successfully:', data);

        Alert.alert('הודעה', 'הספק נוסף בהצלחה', [
          {
            text: 'אישור',
            onPress: () => {
              // Reset form with appropriate fields
              setSupplierData({
                companyName: '',
                contactPerson: '',
                email: '',
                phone: '',
              });
            },
          },
        ]);
      } else {
        const errorData = await response.json();
        console.error('Error adding supplier:', errorData);
        Alert.alert('שגיאה', errorData.message || 'אירעה שגיאה בהוספת הספק', [
          {text: 'אישור'},
        ]);
      }
    } catch (error) {
      console.error('Error adding supplier:', error);
      Alert.alert('שגיאה', 'שגיאת רשת, נסה שוב.', [{text: 'אישור'}]);
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
