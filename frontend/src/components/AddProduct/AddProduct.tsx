import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../../components/sidebar-component';
import { RootStackParamList, API_BASE_URL } from '../../../App';
import { doPost } from "../../util/HTTPRequests.ts";
import { globals } from '../../util/Globals.ts';
import styles from './AddProduct.styles';
import { LoginContext } from '../../contexts/LoginContext.tsx';
import { LoginContextType } from '../../contexts/UserContext.tsx';

type AddProductScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddProduct'
>;

const AddProductScreen = () => {
  const navigation = useNavigation<AddProductScreenNavigationProp>();
  const [userRole] = useState<'manager' | 'employee'>('manager');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { userInfo } = useContext(LoginContext) as LoginContextType;

  const [productData, setProductData] = useState({
    id: '',
    productName: '',
    productDescription: '',
    supplierId: '',
    stock: '',
    price: '',
  });

  const handleAddProduct = async () => {
    if (!productData.id || !productData.productName || !productData.supplierId || !productData.price) {
        Alert.alert('Error', 'Please fill in all required product details');
        return;
    }

    if (!userInfo?.businessId) {
        Alert.alert('Error', 'Business ID is missing or invalid.');
        return;
    }

    const payload = {
      id: productData.id,
      productName: productData.productName,
      productDescription: productData.productDescription || '',
      supplierId: parseInt(productData.supplierId, 10), 
      stock: parseInt(productData.stock, 10) || 0, 
      price: parseFloat(productData.price),
      businessId: userInfo.businessId, 
    };

    console.log('Payload:', payload); // Log the payload

    try {
        const response = await doPost(globals.PRODUCT.createProduct, payload);
        // Handle success response
    } catch (error) {
        console.error('Error adding product:', error);
        Alert.alert('Error', 'Failed to add product. Please try again.');
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
          <Text style={styles.headerTitle}>הוספת מוצר חדש</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="ברקוד"
              value={productData.id}
              onChangeText={text =>
                setProductData({ ...productData, id: text })
              }
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
              placeholder="שם ספק"
              value={productData.supplierId}
              onChangeText={text =>
                setProductData({ ...productData, supplierId: text })
              }
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
