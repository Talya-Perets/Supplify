import React, { useEffect, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import styles from './Home.styles';
import { globals } from '../../util/Globals';
import { doGet } from '../../util/HTTPRequests';
import { useOrder } from '../../contexts/OrderContext';

// Define navigation type
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { setSelectedOrderId } = useOrder();  // Access setSelectedOrderId from context
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [pendingOrders, setPendingOrders] = useState<number[]>([]); // Assuming the backend returns order IDs as numbers
  const [loading, setLoading] = useState<boolean>(true); // Properly define `loading` state
  const [error, setError] = useState<string | null>(null);

  // Fetch pending orders
  const fetchPendingOrders = async () => {
    try {
      const response = await doGet(`${globals.ORDER.getPendingOrders}`);
      console.log("API Response:", response); // Log response to check data

      // Check if the response is valid and contains the `data` field
      if (!response || !response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response from server");
      }

      setPendingOrders(response.data); // Set the list of order IDs from the `data` field
    } catch (err) {
      console.error("Error fetching pending orders:", err);
      setError("Failed to fetch pending orders. Please try again later.");
    } finally {
      setLoading(false); // Ensure `setLoading` is properly defined
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  // Handle order press to set selected orderId in context and navigate
  const handleOrderPress = (id: number) => {
    setSelectedOrderId(id);  // Set the selected order ID in context
    navigation.navigate('OrderDetails');  // Navigate to the OrderDetails screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {isSidebarVisible && <Sidebar />}
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setIsSidebarVisible(!isSidebarVisible)}
            >
              <Icon
                name={isSidebarVisible ? "x" : "menu"}
                size={24}
                color="#4A90E2"
              />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>דף הבית</Text>
          </View>

          <ScrollView style={styles.scrollView}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>הזמנות ממתינות לאישור</Text>
              {loading ? (
                <ActivityIndicator size="large" color="#4A90E2" />
              ) : error ? (
                <Text style={{ color: "red" }}>{error}</Text>
              ) : pendingOrders.length === 0 ? (
                <Text>אין הזמנות ממתינות</Text>
              ) : (
                pendingOrders.map((orderId) => (
                  <TouchableOpacity
                    key={orderId}
                    style={styles.orderItem}
                    onPress={() => handleOrderPress(orderId)} // Trigger handleOrderPress on press
                  >
                    <Text style={styles.orderDescription}>
                      הזמנה מס' {orderId}
                    </Text>
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