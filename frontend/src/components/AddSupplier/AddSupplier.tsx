import React, {useState, useEffect, useContext} from 'react';
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
import {doGet, doPost} from '../../util/HTTPRequests';
import {globals} from '../../util/Globals';
import {Supplier} from '../../types/models';
import {LoginContext} from '../../contexts/LoginContext';
import {LoginContextType} from '../../contexts/UserContext';
import {Dropdown} from 'react-native-element-dropdown';

type AddSupplierScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddSupplier'
>;
const AddSupplierScreen = () => {
  const navigation = useNavigation<AddSupplierScreenNavigationProp>();
  const {userInfo} = useContext(LoginContext) as LoginContextType;
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(-1);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [value, setValue] = useState(null);
  const [suppliersUpdated, setSuppliersUpdated] = useState(false);

  const [supplierData, setSupplierData] = useState({
    companyName: '',
    name: '',
    email: '',
    phone: '',
  });

  const handleSupplierChange = (value: number) => {
    setSelectedSupplierId(value);

    if (value) {
      setSupplierData(prev => ({...prev, companyName: ''}));
    }
  };

  const handleAddSupplier = async () => {
    if (!supplierData.name || !supplierData.email || !supplierData.phone) {
      Alert.alert('Error', 'Please fill in all required details');
      return;
    }
    try {
      //If a supplier is selected but companyName is empty → Add Agent
      if (selectedSupplierId !== -1) {
        const response = await doPost(globals.AGENTS.addAgent, {
          supplierId: selectedSupplierId,
          businessId: userInfo.businessId,
          name: supplierData.name,
          email: supplierData.email,
          phone: supplierData.phone,
        });

        if (response.status === 200) {
          Alert.alert('Success', 'Agent added successfully', [{text: 'OK'}]);
          resetForm();
        } else {
          throw new Error(response.data.message || 'Failed to add agent');
        }
        return;
      }

      //If companyName is not empty → Add Supplier
      if (supplierData.companyName) {
        const response = await doPost(globals.SUPPLIERS.createSupplier, {
          companyName: supplierData.companyName,
          name: supplierData.name,
          email: supplierData.email,
          phone: supplierData.phone,
          businessId: userInfo.businessId,
        });

        if (response.status === 200) {
          Alert.alert('Success', 'Supplier added successfully', [{text: 'OK'}]);
          resetForm();
          setSuppliersUpdated(prev => !prev);
        } else {
          throw new Error(response.data.message || 'Failed to add supplier');
        }
        return;
      }

      Alert.alert('Error', 'Please fill in all supplier details');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  // Helper function to reset form fields
  const resetForm = () => {
    setSupplierData({
      companyName: '',
      name: '',
      email: '',
      phone: '',
    });
    setSelectedSupplierId(-1);
  };

  useEffect(() => {
    const getAllSuppliers = async () => {
      try {
        const response = await doGet(globals.SUPPLIERS.getAllSuppliers);
        if (response.status === 200) {
          setSuppliers(response.data);
        }
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    getAllSuppliers();
  }, [suppliersUpdated]);

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
          <Text style={styles.headerTitle}>הוספת ספק חדש</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.inputContainer}>
            <Dropdown
              data={[
                {label: 'בחר ספק קיים', value: -1},
                ...suppliers.map(supplier => ({
                  label: supplier.companyName,
                  value: supplier.supplierId,
                })),
              ]}
              labelField="label"
              valueField="value"
              placeholder="בחר ספק קיים"
              value={value}
              onChange={item => {
                setValue(item.value);
                handleSupplierChange(item.value);
              }}
              style={styles.dropdownContainer}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
              itemTextStyle={{textAlign: 'right', writingDirection: 'rtl'}}
            />
            <TextInput
              style={[
                styles.input,
                selectedSupplierId !== -1 && styles.disabledInput,
              ]}
              placeholder="שם ספק"
              editable={selectedSupplierId === -1}
              value={supplierData.companyName}
              onChangeText={text =>
                setSupplierData({...supplierData, companyName: text})
              }
            />
            <TextInput
              style={styles.input}
              placeholder="שם סוכן"
              value={supplierData.name}
              onChangeText={text =>
                setSupplierData({...supplierData, name: text})
              }
            />
            <TextInput
              style={styles.input}
              placeholder="מייל סוכן"
              value={supplierData.email}
              onChangeText={text =>
                setSupplierData({...supplierData, email: text})
              }
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="פלאפון סוכן"
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
