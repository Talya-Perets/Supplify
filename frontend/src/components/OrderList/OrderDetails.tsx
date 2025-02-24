import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useOrder } from '../../contexts/OrderContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../Sidebar/sidebar';
import {doGet, doPost} from '../../util/HTTPRequests';
import {globals} from '../../util/Globals';
import styles from './OrderDetails.styles';
import {LoginContext} from '../../contexts/LoginContext';
import {LoginContextType} from '../../contexts/UserContext';

interface CreateOrderRequest {
  orderId: number;
}

interface OrderProductDetails {
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface OrderDetails {
  id: number;
  user: {
    id: number;
    name: string;
  };
  business: {
    id: number;
    name: string;
  };
  items: OrderProductDetails[];
  totalAmount: number;
  status: string;
  orderDate: string;
}

const OrderDetailsScreen = () => {
  const { selectedOrderId } = useOrder();
  const navigation = useNavigation();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { userInfo } = useContext(LoginContext) as LoginContextType;

  useEffect(() => {
    if (!selectedOrderId) {
      navigation.goBack();
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const orderRequest: CreateOrderRequest = { orderId: selectedOrderId };
        const response = await doGet(`${globals.ORDER.getOrderInfo}?orderId=${orderRequest.orderId}`);

        const orderItems = response?.data || [];  // Assuming response has a `data` field
        const order_status = orderItems.length > 0 ? orderItems[0].status : 'undefined';  // Extract the status from the first item if available

        const formattedOrder: OrderDetails = {
          id: selectedOrderId,
          user: { id: 1, name: 'Default User' },
          business: { id: 1, name: 'Default Business' },
          items: Array.isArray(orderItems) ? orderItems : [],
          totalAmount: Array.isArray(orderItems)
            ? orderItems.reduce((sum, item) => sum + item.subtotal, 0)
            : 0,
            status: order_status || 'Undefined', // Convert to string explicitly
          orderDate: new Date().toISOString(),
        };
        console.log('Order Status:', order_status);

        setOrderDetails(formattedOrder);
      } catch (err) {
        setError('Failed to load order details');
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [selectedOrderId]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('he-IL', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
    } catch (err) {
      return 'תאריך לא זמין';
    }
  };

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [orderSent, setOrderSent] = useState(false); // Track if order was sent

const handleSendOrder = async () => {
  try {
    const response = await doPost(
      `${globals.ORDER.OrderConfirm}?orderId=${selectedOrderId}`,  // Pass orderId in the query string
      {}
    );

    if (response.status === 200) {
      // Success message
      setStatusMessage('הזמנה בוצעה בהצלחה');
      setOrderSent(true);
    } else {
      // Failure message
      setStatusMessage('הזמנה לא בוצעה, אנא נסה שנית');
    }

    setTimeout(() => {
      setStatusMessage(null);
    }, 2000);
  } catch (err) {
    setStatusMessage('הזמנה לא בוצעה, אנא נסה שנית');
    console.error('Error updating order status:', err);

    setTimeout(() => {
      setStatusMessage(null);
    }, 2000);
  }
};

  if (!selectedOrderId) return null;
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
          <Text style={styles.headerTitle}>פרטי הזמנה</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-right" size={24} color="#4A90E2" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#4A90E2" />
          </View>
        ) : error ? (
          <View style={styles.centerContent}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => navigation.goBack()}>
              <Text style={styles.retryButtonText}>חזור אחורה</Text>
            </TouchableOpacity>
          </View>
        ) : orderDetails ? (
          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.orderId}>הזמנה #{orderDetails.id}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>תאריך:</Text>
                <Text style={styles.value}>{formatDate(orderDetails.orderDate)}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>ספק:</Text>
                <Text style={styles.value}>{orderDetails.business.name}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>מזמין:</Text>
                <Text style={styles.value}>{orderDetails.user.name}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>פריטים</Text>
              {orderDetails.items && orderDetails.items.length > 0 ? (
                orderDetails.items.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.productName}</Text>
                      <Text style={styles.itemQuantity}>
                        כמות: {item.quantity}
                      </Text>
                    </View>
                    <Text style={styles.itemPrice}>₪{item.subtotal.toFixed(2)}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noItemsText}>אין פריטים בהזמנה זו</Text>
              )}
            </View>

            {orderDetails.totalAmount > 0 && (
              <View style={styles.totalSection}>
                <Text style={styles.totalLabel}>סה"כ:</Text>
                <Text style={styles.totalAmount}>
                  ₪{orderDetails.totalAmount.toFixed(2)}
                </Text>
              </View>
            )}

            {orderDetails.status === 'pending' && userInfo.userRole === 'Manager' && !orderSent && (
              <TouchableOpacity
                style={styles.sendOrderButton}
                onPress={handleSendOrder}  // Attach handleSendOrder here
              >
                <Text style={styles.sendOrderButtonText}>שלח הזמנה</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        ) : (
          <View style={styles.centerContent}>
            <Text style={styles.errorText}>לא נמצאו פרטי הזמנה</Text>
          </View>
        )}

        {statusMessage && (
          <View style={styles.statusMessageContainer}>
            <Text style={styles.statusMessage}>{statusMessage}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default OrderDetailsScreen;