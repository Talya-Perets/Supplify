import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../../components/sidebar-component';
import { RootStackParamList } from '../../../App'; 
import axios from 'axios';
import { Alert } from 'react-native';
type AddSupplierScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddSupplier'>;

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
    try {
      const response = await axios.post(
        'http://10.9.15.52:8080/api/suppliers/business/20',
        supplierData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('Supplier added successfully:', response.data);
      
      Alert.alert(
        "הודעה",
        "הספק נוסף בהצלחה",
        [
          { 
            text: "אישור",
            onPress: () => {
              // איפוס הטופס עם השדות הנכונים
              setSupplierData({
                companyName: '',
                contactPerson: '',
                email: '',
                phone: ''
              });
            }
          }
        ]
      );
  
    } catch (error) {
      console.error('Error adding supplier:', error);
      Alert.alert(
        "שגיאה",
        "אירעה שגיאה בהוספת הספק",
        [{ text: "אישור" }]
      );
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {isSidebarVisible && <Sidebar userRole={userRole} />}
      <View style={styles.mainContent}>
        <View style={styles.header}>
           <TouchableOpacity onPress={() => setIsSidebarVisible(!isSidebarVisible)}>
            <Icon name={isSidebarVisible ? "x" : "menu"} size={24} color="#4A90E2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>הוספת ספק חדש</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="שם ספק"
              value={supplierData.companyName}
              onChangeText={(text) => setSupplierData({ ...supplierData, companyName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="איש קשר"
              value={supplierData.contactPerson}
              onChangeText={(text) => setSupplierData({ ...supplierData, contactPerson: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="מייל"
              value={supplierData.email}
              onChangeText={(text) => setSupplierData({ ...supplierData, email: text })}
              keyboardType="email-address"
            />
             <TextInput
              style={styles.input}
              placeholder="טלפון"
              value={supplierData.phone}
              onChangeText={(text) => setSupplierData({ ...supplierData, phone: text })}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row-reverse',
    backgroundColor: '#F6F7FC',
  },
  mainContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginRight: 16,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    marginTop: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default AddSupplierScreen;