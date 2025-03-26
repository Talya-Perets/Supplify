import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../Sidebar/sidebar';
import { doGet } from '../../util/HTTPRequests';
import { globals } from '../../util/Globals';
import styles from './OrderDetails.styles';
import { LoginContext } from '../../contexts/LoginContext';
import { LoginContextType } from '../../contexts/UserContext';
import { RootStackParamList } from '../../../App';

// Navigation Type Definition
type OrderDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OrderDetails'>;

interface OrderProductDetails {
  barcode?: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  status?: string;
  userName?: string;
  supplierName?: string;
  imageUrl?: string;
  productId: number;
}

interface OrderDetails {
  id: number;
  items: OrderProductDetails[];
  totalAmount: number;
  status: string;
  orderDate: string;
  userName: string;
  supplierName: string;
}

const OrderDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<OrderDetailsScreenNavigationProp>(); 
  const { userInfo } = useContext(LoginContext) as LoginContextType;
  
  const { orderId } = route.params as { orderId: number };
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  useEffect(() => {
    if (!orderId) {
      navigation.goBack();
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
    
        const response = await doGet(`${globals.ORDER.getOrderInfo}?orderId=${orderId}`);
        const orderItems: OrderProductDetails[] = response?.data || [];
    
        // Debug logging
        console.log("📦 Order details received from the server:");
        console.log("🆔 Order ID:", orderId);
        console.log("🛒 Products in this order:", orderItems);
    
        // Enhanced logging for product details
        orderItems.forEach((item: OrderProductDetails) => {
          console.log("📋 Product ID:", item.productId);
          console.log("🔢 Barcode:", item.barcode || 'No barcode');
          console.log("📦 Product Name:", item.productName);
          console.log("🔢 Quantity:", item.quantity);
          console.log("💰 Unit Price:", item.unitPrice);
        });
    
        const formattedOrder: OrderDetails = {
          id: orderId,
          userName: orderItems?.[0]?.userName || 'Unknown',
          supplierName: orderItems?.[0]?.supplierName || 'Unknown',
          items: Array.isArray(orderItems) ? orderItems : [],
          totalAmount: Array.isArray(orderItems)
            ? orderItems.reduce((sum, item) => sum + item.subtotal, 0)
            : 0,
          status: orderItems?.[0]?.status || 'Undefined',
          orderDate: new Date().toISOString(),
        };
    
        setOrderDetails(formattedOrder);
      } catch (err) {
        setError('Failed to load order details');
        console.error('❌ Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigation]);

  const handleConfirmOrder = () => {
    if (orderDetails) {
      const transformedItems = orderDetails.items.map(item => ({
        productName: item.productName,
        barcode: item.barcode || String(item.productId), // Use barcode or productId
        imageUrl: item.imageUrl || "",
        orderedQuantity: item.quantity,
        deliveredQuantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      }));
      
      navigation.navigate('ConfirmOrder', {
        orderDetails: transformedItems,
        orderId: orderId,
      });
    }
  };

  if (!orderId) return null;

  return (
    <SafeAreaView style={styles.container}>
      {isSidebarVisible && <Sidebar />}
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsSidebarVisible(!isSidebarVisible)}>
            <Icon name={isSidebarVisible ? 'x' : 'menu'} size={24} color="#4A90E2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>פרטי הזמנה</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-right" size={24} color="#4A90E2" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4A90E2" style={styles.centerContent} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : orderDetails ? (
          <ScrollView style={styles.content}>
            <Text style={styles.orderId}>הזמנה #{orderDetails.id}</Text>
            <Text style={styles.label}>תאריך: {new Date(orderDetails.orderDate).toLocaleDateString('he-IL')}</Text>
            <Text style={styles.label}>ספק: {orderDetails.supplierName}</Text>
            <Text style={styles.label}>מזמין: {orderDetails.userName}</Text>
            <Text style={styles.sectionTitle}>פריטים</Text>
            {orderDetails.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.productName}</Text>
                <Text style={styles.itemQuantity}>כמות: {item.quantity}</Text>
                <Text style={styles.itemBarcode}>
                  ברקוד: {item.barcode || String(item.productId)}
                </Text>
              </View>
            ))}
            <TouchableOpacity style={styles.sendOrderButton} onPress={handleConfirmOrder}>
              <Text style={styles.sendOrderButtonText}>אשר הזמנה</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <Text style={styles.errorText}>לא נמצאו פרטי הזמנה</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default OrderDetailsScreen;