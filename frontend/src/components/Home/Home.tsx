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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Sidebar from '../Sidebar/sidebar';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/models';
import styles from './Home.styles';
import {LoginContext} from '../../contexts/LoginContext';
import {LoginContextType} from '../../contexts/UserContext';
import {useOrder} from '../../contexts/OrderContext';
import ShoppingCartIcon from '../../contexts/ShoppingCartIcon';
import useOrders from '../../hooks/useOrders';


// Define navigation type
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {userInfo} = useContext(LoginContext) as LoginContextType;
  const {setSelectedOrderId} = useOrder();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [showAllPending, setShowAllPending] = useState(false);
  const [showAllActive, setShowAllActive] = useState(false);
  const { pendingOrders, activeOrders, loading, error, refreshOrders } = useOrders();


  // Number of orders to show initially
  const initialOrdersToShow = 4;

  // Handle click on pending order item - navigate to ApprovalOrder screen
  const handlePendingOrderPress = (id: number) => {
    console.log("🔵 handlePendingOrderPress with ID:", id);
    navigation.navigate('ApprovalOrder', { orderId: id });
  };

  // Handle click on active order item - navigate to OrderDetails screen
  const handleActiveOrderPress = (id: number) => {
    console.log("🔵 handleActiveOrderPress with ID:", id);
    navigation.navigate('OrderDetails', { orderId: id });
  };

  // Function to navigate to ShoppingCart screen
  const navigateToShoppingCart = () => {
    navigation.navigate('ShoppingCart');
  };

  // Function to get the orders to display based on show all state
const getOrdersToDisplay = (orders: number[], showAll: boolean): number[] => {
    if (showAll || orders.length <= initialOrdersToShow) {
      return orders;
    }
    return orders.slice(0, initialOrdersToShow);
  };

  // Orders to display
  const pendingOrdersToDisplay = getOrdersToDisplay(pendingOrders, showAllPending);
  const activeOrdersToDisplay = getOrdersToDisplay(activeOrders, showAllActive);

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
            <View style={{flex: 1}} />
            <ShoppingCartIcon onPress={navigateToShoppingCart} />
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
                <Text style={{textAlign: 'right'}}>אין הזמנות ממתינות</Text>
              ) : (
                <>
                  {pendingOrdersToDisplay.map(orderId => (
                    <TouchableOpacity
                      key={orderId.toString()}
                      style={styles.orderItem}
                      onPress={() => handlePendingOrderPress(orderId)}>
                      <View style={{flexDirection: 'row-reverse', alignItems: 'center', flex: 1}}>
                        <FontAwesome name="clock-o" size={18} color="#F0A500" style={{marginLeft: 10}} />
                        <View>
                          <Text style={styles.orderDescription}>הזמנה מס' {orderId}</Text>
                          <Text style={styles.orderDate}>ממתינה לאישור</Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.approveButton}
                        onPress={() => handlePendingOrderPress(orderId)}>
                        <Text style={styles.approveButtonText}>אישור</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                  {pendingOrders.length > initialOrdersToShow && (
                    <TouchableOpacity
                      style={{flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', marginTop: 10}}
                      onPress={() => setShowAllPending(!showAllPending)}>
                      <Text style={{color: '#4A90E2', marginLeft: 5}}>
                        {showAllPending ? 'הצג פחות' : `הצג עוד (${pendingOrders.length - initialOrdersToShow})`}
                      </Text>
                      <FontAwesome
                        name={showAllPending ? 'chevron-up' : 'chevron-down'}
                        size={16}
                        color="#4A90E2"
                      />
                    </TouchableOpacity>
                  )}
                </>
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
                <Text style={{textAlign: 'right'}}>אין הזמנות פעילות</Text>
              ) : (
                <>
                  {activeOrdersToDisplay.map(orderId => (
                    <TouchableOpacity
                      key={orderId.toString()}
                      style={styles.orderItem}
                      onPress={() => handleActiveOrderPress(orderId)}>
                      <View style={{flexDirection: 'row-reverse', alignItems: 'center', flex: 1}}>
                        <FontAwesome name="check-circle" size={18} color="#33CC66" style={{marginLeft: 10}} />
                        <View>
                          <Text style={styles.orderDescription}>הזמנה מס' {orderId}</Text>
                          <Text style={styles.orderDate}>מאושרת</Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.approveButton}
                        onPress={() => handleActiveOrderPress(orderId)}>
                        <Text style={styles.approveButtonText}>פרטים</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                  {activeOrders.length > initialOrdersToShow && (
                    <TouchableOpacity
                      style={{flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', marginTop: 10}}
                      onPress={() => setShowAllActive(!showAllActive)}>
                      <Text style={{color: '#4A90E2', marginLeft: 5}}>
                        {showAllActive ? 'הצג פחות' : `הצג עוד (${activeOrders.length - initialOrdersToShow})`}
                      </Text>
                      <FontAwesome
                        name={showAllActive ? 'chevron-up' : 'chevron-down'}
                        size={16}
                        color="#4A90E2"
                      />
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;