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
import Sidebar from '../../components/sidebar-component';
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
  const [userRole] = useState<'manager' | 'employee'>('manager');
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
        console.log('Order Response:', response);

        if (response.data && response.data.length > 0) {
          setOrders(response.data); // Set orders if response is not empty
        } else {
          setOrders([]); // Set orders to an empty array if no orders are returned
          setErrorMessage('לא נמצאו הזמנות להצגה'); // Set message for no orders
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
    setSelectedOrderId(id);
    navigation.navigate('OrderDetails');
  };

  const renderOrderItem = ({ item }: { item: Order }) => (

    <TouchableOpacity style={styles.orderItem} onPress={() => handleOrderPress(item.id)}>
      <View style={styles.orderInfo}>
        <Text style={styles.orderId}>הזמנה #{item.id}</Text>
        <Text style={styles.orderDate}>
          תאריך: {new Date(item.orderDate).toLocaleDateString()}
        </Text>
        <Text style={styles.orderStatus}>סטטוס: {item.status}</Text>
        <Text style={styles.orderAmount}>סכום: ₪{item.totalAmount}</Text>
        <Text style={styles.orderBusiness}>עסק: {item.business.name}</Text>
        <Text style={styles.orderUser}>משתמש: {item.user.name}</Text>
      </View>
      <Text>
        <Icon name="chevron-left" size={20} color="#4A90E2" />
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Sidebar */}
      {isSidebarVisible && <Sidebar />}

      {/* Main Content */}
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
          <Text style={styles.headerTitle}>רשימת הזמנות</Text>
        </View>

        {/* Loading Spinner */}
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#4A90E2"
            style={styles.loadingIndicator}
          />
        ) : errorMessage ? (
          <View style={styles.errorState}>
            <Text style={styles.errorStateText}>{errorMessage}</Text>
          </View>
        ) : // Order List
        orders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>אין הזמנות להצגה</Text>{' '}
            {/* No orders to display */}
          </View>
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.orderList}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default OrderListScreen;