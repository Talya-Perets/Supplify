// src/components/AddProduct/AddProduct.tsx
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../Sidebar/sidebar.tsx';
import { RootStackParamList } from '../../types/models.ts';
import styles from './AddProduct.styls';
import { LoginContext } from '../../contexts/LoginContext.tsx';
import { LoginContextType } from '../../contexts/UserContext.tsx';
import { Dropdown } from 'react-native-element-dropdown';
import ImagePickerComponent from '../../util/ImagePickerComponent.tsx';

// Import the hooks we need
import useSupplierList from '../../hooks/useSuppliers';
import { useProductForm } from '../../hooks/useProducts.ts';

type AddProductScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddProduct'
>;

const AddProductScreen = () => {
  const navigation = useNavigation<AddProductScreenNavigationProp>();
  const [userRole] = useState<'manager' | 'employee'>('manager');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { userInfo } = useContext(LoginContext) as LoginContextType;
  
  // Use suppliers hook to get suppliers list
  const { suppliers, loading: suppliersLoading } = useSupplierList();
  
  // Use products hook for product management
  const {
    productData,
    setProductData,
    selectedSupplierId,
    setSelectedSupplierId,
    loading: productLoading,
    handleImageSelected,
    handleAddProduct
  } =  useProductForm();

  // Dropdown selected value
  const [value, setValue] = useState(-1);

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
          <Text style={styles.headerTitle}>הוספת מוצר חדש</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.inputContainer}>
            <Dropdown
              data={[
                { label: 'בחר ספק', value: -1 },
                ...suppliers.map(supplier => ({
                  label: supplier.companyName,
                  value: supplier.supplierId,
                })),
              ]}
              labelField="label"
              valueField="value"
              placeholder="בחר ספק"
              value={value}
              onChange={item => {
                setValue(item.value);
                setSelectedSupplierId(item.value);
              }}
              style={styles.dropdownContainer}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
              itemTextStyle={{ textAlign: 'right', writingDirection: 'rtl' }}
            />
            <TextInput
              style={styles.input}
              placeholder="ברקוד"
              value={productData.id}
              onChangeText={text => setProductData({ ...productData, id: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="שם מוצר"
              value={productData.productName}
              onChangeText={text =>
                setProductData({ ...productData, productName: text })
              }
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="תיאור מוצר"
              value={productData.productDescription}
              onChangeText={text =>
                setProductData({ ...productData, productDescription: text })
              }
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="מחיר מוצר"
              value={productData.price}
              onChangeText={text =>
                setProductData({ ...productData, price: text })
              }
              keyboardType="numeric"
            />
            {userRole === 'manager' && (
              <TextInput
                style={styles.input}
                placeholder="מלאי מתבקש"
                value={productData.stock}
                onChangeText={text =>
                  setProductData({ ...productData, stock: text })
                }
                keyboardType="numeric"
              />
            )}
            <ImagePickerComponent onImageSelected={handleImageSelected} />
          </View>
          <TouchableOpacity 
            style={[styles.button, (suppliersLoading || productLoading) && styles.disabledButton]} 
            onPress={handleAddProduct}
            disabled={suppliersLoading || productLoading}
          >
            <Text style={styles.buttonText}>
              {(suppliersLoading || productLoading) ? 'טוען...' : 'הוסף מוצר'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AddProductScreen;