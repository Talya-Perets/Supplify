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

type AddProductScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddProduct'
>;

const AddProductScreen = () => {
  const navigation = useNavigation<AddProductScreenNavigationProp>();
  const [userRole] = useState<'manager' | 'employee'>('manager');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const [productData, setProductData] = useState({
    barcode: '',
    name: '',
    description: '',
    supplier: '',
    cost: '',
    // מכיוון שאין צורך במחיר מכירה, נמחק את השדה הזה
    stockQuntity: '',
  });

  const handleAddProduct = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Product added successfully:', data);

        Alert.alert(
          "הודעה",
          "המוצר נוסף בהצלחה",
          [
            { 
              text: "אישור",
              onPress: () => {
                // Reset form with appropriate fields
                setProductData({
                  barcode: '',
                  name: '',
                  cost: '',
                  description: '',
                  supplier: '',
                  stockQuntity: '',
                });
              }
            }
          ]
        );
      } else {
        const errorData = await response.json();
        console.error('Error adding product:', errorData);
        Alert.alert(
          "שגיאה",
          errorData.message || "אירעה שגיאה בהוספת המוצר",
          [{ text: "אישור" }]
        );
      }
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert(
        "שגיאה",
        "שגיאת רשת, נסה שוב.",
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
          <Text style={styles.headerTitle}>הוספת מוצר חדש</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="ברקוד"
              value={productData.barcode}
              onChangeText={(text) => setProductData({ ...productData, barcode: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="שם מוצר"
              value={productData.name}
              onChangeText={(text) => setProductData({ ...productData, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="מחיר (אופציונלי)"
              value={productData.cost}
              onChangeText={(text) => setProductData({ ...productData, cost: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="תיאור מוצר"
              value={productData.description}
              onChangeText={(text) => setProductData({ ...productData, description: text })}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="שם ספק"
              value={productData.supplier}
              onChangeText={(text) => setProductData({ ...productData, supplier: text })}
            />
            {userRole === 'manager' && (
              <TextInput
                style={styles.input}
                placeholder="מלאי מתבקש"
                value={productData.stockQuntity}
                onChangeText={(text) => setProductData({ ...productData, stockQuntity: text })}
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
