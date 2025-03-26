import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../Sidebar/sidebar.tsx';
import {RootStackParamList, API_BASE_URL} from '../../../App';
import {doGet, doPostAddProduct} from '../../util/HTTPRequests';
import {globals} from '../../util/Globals.ts';
import styles from './AddProduct.styls';
import {LoginContext} from '../../contexts/LoginContext.tsx';
import {LoginContextType} from '../../contexts/UserContext.tsx';
import {Supplier} from '../../types/models.ts';
import {Dropdown} from 'react-native-element-dropdown';
import ImagePickerComponent from '../../util/ImagePickerComponent.tsx';
import useBusinessProducts from '../../hooks/useBusinessProducts.ts';

type AddProductScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddProduct'
>;

const AddProductScreen = () => {
  const navigation = useNavigation<AddProductScreenNavigationProp>();
  const [userRole] = useState<'manager' | 'employee'>('manager');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const {userInfo} = useContext(LoginContext) as LoginContextType;
  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [value, setValue] = useState(-1);
  const [productImageUri, setProductImageUri] = useState<string | null>(null);
  const [productImageData, setProductImageData] = useState<any>(null);
  const {refetchProducts} = useBusinessProducts();

  const [productData, setProductData] = useState({
    id: '',
    productName: '',
    productDescription: '',
    stock: '',
    price: '',
  });

  const handleImageSelected = (imageUri: string, imageData: any) => {
    setProductImageUri(imageUri);
    setProductImageData(imageData);
  };

  const handleAddProduct = async () => {
    if (
      !productData.id ||
      !productData.productName ||
      value == -1 ||
      !productData.price
    ) {
      Alert.alert('Error', 'Please fill in all required product details');
      return;
    }

    // Convert the payload object to JSON string
    const payload = JSON.stringify({
      id: productData.id,
      productName: productData.productName,
      productDescription: productData.productDescription || '',
      supplierId: value,
      stock: parseInt(productData.stock, 10) || 0,
      price: parseFloat(productData.price),
      businessId: userInfo.businessId,
    });

    console.log('Payload:', payload); // Log the payload

    const formData = new FormData();
    formData.append('request', payload); // Send JSON data as a string

    if (productImageUri && productImageData) {
      formData.append('file', {
        uri: productImageUri,
        name: productImageData.fileName || 'product.jpg',
        type: productImageData.type || 'image/jpeg',
      });
    }

    try {
      const response = await doPostAddProduct(
        globals.PRODUCT.createProduct,
        formData,
      );
      Alert.alert('Success', 'Product added successfully!');
      refetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Failed to add product. Please try again.');
    }
  };

  useEffect(() => {
    const getBusinessSuppliers = async () => {
      setIsLoading(true);
      try {
        const response = await doGet(
          `${globals.BUSINESS.getBusinessSuppliers}/${userInfo.businessId}`,
        );
        if (response.data) {
          setSuppliers(response.data);
          console.log('Suppliers:', response.data); 
          
        } else {
          throw new Error('No data received from API');
        }
      } catch (error) {
        console.error('Error fetching suppliers:', error);
        Alert.alert('שגיאה', 'אירעה שגיאה בטעינת רשימת הספקים');
      } finally {
        setIsLoading(false);
      }
    };
    getBusinessSuppliers();
  }, []);

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
                {label: 'בחר ספק', value: -1},
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
              }}
              style={styles.dropdownContainer}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
              itemTextStyle={{textAlign: 'right', writingDirection: 'rtl'}}
            />
            <TextInput
              style={styles.input}
              placeholder="ברקוד"
              value={productData.id}
              onChangeText={text => setProductData({...productData, id: text})}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="שם מוצר"
              value={productData.productName}
              onChangeText={text =>
                setProductData({...productData, productName: text})
              }
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="תיאור מוצר"
              value={productData.productDescription}
              onChangeText={text =>
                setProductData({...productData, productDescription: text})
              }
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="מחיר מוצר"
              value={productData.price}
              onChangeText={text =>
                setProductData({...productData, price: text})
              }
              keyboardType="numeric"
            />
            {userRole === 'manager' && (
              <TextInput
                style={styles.input}
                placeholder="מלאי מתבקש"
                value={productData.stock}
                onChangeText={text =>
                  setProductData({...productData, stock: text})
                }
                keyboardType="numeric"
              />
            )}
            <ImagePickerComponent onImageSelected={handleImageSelected} />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
            <Text style={styles.buttonText}>הוסף מוצר</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AddProductScreen;
