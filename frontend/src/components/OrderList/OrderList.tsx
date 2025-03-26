import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../Sidebar/sidebar';
import {RootStackParamList} from '../../../App';
import styles from './OrderList.styles';
import {doGet, doPost} from '../../util/HTTPRequests';
import {globals} from '../../util/Globals';
import {useOrder} from '../../contexts/OrderContext';
import {LoginContext} from '../../contexts/LoginContext';
import {LoginContextType} from '../../contexts/UserContext';

type OrderListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'OrderList'
>;

interface Order {
  id: number;
  user: {
    id: number;
    name: string;
  };
  business: {
    id: number;
    name: string;
  };
  supplierName: string;
  totalAmount: number;
  status: string;
  orderDate: string;
}

const OrderListScreen = ({
  navigation,
}: {
  navigation: OrderListScreenNavigationProp;
}) => {
  const {setSelectedOrderId} = useOrder();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Track error messages
  const {userInfo} = useContext(LoginContext) as LoginContextType;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!userInfo.userId || !userInfo.businessId) {
          console.error('No business ID available in userInfo');
          setErrorMessage('לא נמצא מזהה עסק זמין'); // Set error message
          setIsLoading(false);
          return;
        }

        const businessId = userInfo.businessId; // Use the business ID from context
        const response = await doGet(`${globals.ORDER.getOrders}`, {
          businessId: businessId,
        });
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          // Map the response data to match the Order interface structure
          const formattedOrders = response.data.map((responseItem: any) => {
            // Extract the order object and supplierName from the response
            const { order, supplierName } = responseItem;
            
            // Create a formatted user object with a single name field
            const user = order?.user ? {
              id: order.user.id,
              // Combine firstName and lastName into a single name field
              name: `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || 'לא ידוע'
            } : { id: 0, name: 'לא ידוע' };
            
            return {
              id: order?.id || 0,
              user: user,
              business: order?.business || { id: 0, name: 'לא ידוע' },
              supplierName: supplierName || "לא ידוע",
              totalAmount: order?.totalAmount || 0,
              status: order?.status || "לא ידוע",
              orderDate: order?.orderDate || new Date().toISOString()
            };
          });
        
          setOrders(formattedOrders);
        } else {
          setOrders([]);
          setErrorMessage("לא נמצאו הזמנות להצגה");
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setErrorMessage('אירעה שגיאה בטעינת ההזמנות. אנא נסה שוב מאוחר יותר'); // Set error message
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchOrders();
  }, [userInfo]);

  const handleOrderPress = (id: number) => {
    navigation.navigate('OrderDetails',{ orderId: id });
  };

  const renderOrderItem = ({item}: {item: Order}) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => handleOrderPress(item.id)}>
      <View style={styles.orderInfo}>
        <Text style={styles.orderId}>הזמנה #{item.id}</Text>
        <Text style={styles.orderDate}>
          תאריך: {new Date(item.orderDate).toLocaleDateString()}
        </Text>
        <Text style={styles.orderStatus}>סטטוס: {item.status || 'לא ידוע'}</Text>
        <Text style={styles.orderAmount}>סכום: ₪{item.totalAmount}</Text>
        <Text style={styles.orderSupplier}>ספק: {item.supplierName}</Text>
        <Text style={styles.orderUser}>משתמש: {item.user?.name || 'לא ידוע'}</Text>
      </View>
      <Text>
        <Icon name="chevron-left" size={20} color="#4A90E2" />
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
    <View style={{flex: 1, flexDirection: 'row-reverse'}}>
      {isSidebarVisible && <Sidebar />}
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>רשימת הזמנות</Text>
          <TouchableOpacity onPress={() => setIsSidebarVisible(!isSidebarVisible)}>
            <Icon name={isSidebarVisible ? 'x' : 'menu'} size={24} color="#4A90E2" />
          </TouchableOpacity>
        </View>
  
        {isLoading ? (
          <ActivityIndicator size="large" color="#4A90E2" />
        ) : errorMessage ? (
          <View style={styles.errorState}>
            <Text style={styles.errorStateText}>{errorMessage}</Text>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>אין הזמנות להצגה</Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item, index) => item.id.toString()}
            contentContainerStyle={styles.orderList}
          />
        )}
      </View>
    </View>
  </SafeAreaView>
  
  );
};

export default OrderListScreen;
