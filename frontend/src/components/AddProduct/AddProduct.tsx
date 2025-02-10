import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../../components/sidebar-component';
import {RootStackParamList, API_BASE_URL} from '../../../App';
import {launchImageLibrary} from 'react-native-image-picker';
import styles from './AddProduct.styles';
import {doPost} from "../../util/HTTPRequests.ts";
import { globals } from '../../util/Globals.ts';

type AddProductScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddProduct'
>;

const AddProductScreen = () => {
  const navigation = useNavigation<AddProductScreenNavigationProp>();
  const [userRole] = useState<'manager' | 'employee'>('manager');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const [productData, setProductData] = useState({
    id: '',
    productName: '',
    productDescription: '',
    supplierId: '',
    stock: '',
  });

  const handleAddProduct = async () => {
    // Validate input fields
    if (!productData.id || !productData.productName  || !productData.supplierId) {
      Alert.alert('Error', 'Please fill in all required product details');
      return;
    }

    try {
      const response = await doPost(globals.PRODUCT.createProduct, {
        id: productData.id,
        productName: productData.productName,
        productDescription: productData.productDescription || '',
        supplierId: productData.supplierId,
        stock: productData.stock || 0,
      });

      if (response.status === 201) {
        Alert.alert(
          'Success',
          'Product added successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form fields
                setProductData({
                  id: '',
                  productName: '',
                  productDescription: '',
                  supplierId: '',
                  stock: ''
                });
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Error',
          response.data?.message || 'Failed to add product'
        );
      }
    } catch (error) {
      console.error('Error adding product:', error);

      Alert.alert(
        'Error',
        'Network error. Please try again.'
      );
    }
  };

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets[0].uri) {
        // setProductData({ ...productData, image: response.assets[0].uri });
      }
    });
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
          <Text style={styles.headerTitle}>הוספת מוצר חדש</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="ברקוד"
              value={productData.id}
              onChangeText={text =>
                setProductData({...productData, id: text})
              }
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
              placeholder="שם ספק"
              value={productData.supplierId}
              onChangeText={text =>
                setProductData({...productData, supplierId: text})
              }
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
