import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../Sidebar/sidebar';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import styles from './Home.styles';
import {globals} from '../../util/Globals';
import {LoginContext} from '../../contexts/LoginContext';
import {LoginContextType} from '../../contexts/UserContext';
import {doGet} from '../../util/HTTPRequests';
import {useOrder} from '../../contexts/OrderContext';


// Define navigation type
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {userInfo} = useContext(LoginContext) as LoginContextType;
  const {setSelectedOrderId} = useOrder();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [pendingOrders, setPendingOrders] = useState<number[]>([]);
  const [activeOrders, setActiveOrders] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pending orders
  const fetchPendingOrders = async () => {
    try {
      console.log("Fetching pending orders");
      const response = await doGet(`${globals.ORDER.getPendingOrders}?businessId=${userInfo.businessId}`);
      console.log("API Response:", response.data);

      if (!response || !response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response from server');
      }

      setPendingOrders([...new Set(response.data)]); // Remove duplicate order IDs
    } catch (err) {
      console.error('Error fetching pending orders:', err);
      setError('Failed to fetch pending orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch active orders
  const fetchActiveOrders = async () => {
    try {
      console.log("Fetching active orders");
      const response = await doGet(`${globals.ORDER.getActiveOrders}?businessId=${userInfo.businessId}`);
      console.log("API Response:", response.data);

      if (!response || !response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response from server');
      }

      setActiveOrders([...new Set(response.data)]); // Remove duplicate order IDs
    } catch (err) {
      console.error('Error fetching active orders:', err);
      setError('Failed to fetch active orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchPendingOrders();
    fetchActiveOrders();
  }, []);

  const handleOrderPress = (id: number) => {
    console.log("🔵 handleOrderPress הופעל עם ID:", id);
    setTimeout(() => {
      navigation.navigate('OrderDetails', { orderId: id });
    }, 500);
      };
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {isSidebarVisible && <Sidebar />}
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setIsSidebarVisible(!isSidebarVisible)}>
              <Icon name={isSidebarVisible ? 'x' : 'menu'} size={24} color="#4A90E2" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>דף הבית</Text>
          </View>

          <ScrollView style={styles.scrollView}>
            {/* Pending Orders */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>הזמנות ממתינות לאישור</Text>
              {loading ? (
                <ActivityIndicator size="large" color="#4A90E2" />
              ) : error ? (
                <Text style={{color: 'red'}}>{error}</Text>
              ) : pendingOrders.length === 0 ? (
                <Text>אין הזמנות ממתינות</Text>
              ) : (
                pendingOrders.map(orderId => (
                  <TouchableOpacity
                    key={orderId.toString()} // Ensure key is a string
                    style={styles.orderItem}
                    onPress={() => handleOrderPress(orderId)}>
                    <Text style={styles.orderDescription}>הזמנה מס' {orderId}</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>

            {/* Active Orders */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>הזמנות פעילות</Text>
              {loading ? (
                <ActivityIndicator size="large" color="#4A90E2" />
              ) : error ? (
                <Text style={{color: 'red'}}>{error}</Text>
              ) : activeOrders.length === 0 ? (
                <Text>אין הזמנות פעילות</Text>
              ) : (
                activeOrders.map(orderId => (
                  <TouchableOpacity
                    key={orderId.toString()} // Ensure key is a string
                    style={styles.orderItem}
                    onPress={() => handleOrderPress(orderId)}>
                    <Text style={styles.orderDescription}>הזמנה מס' {orderId}</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
