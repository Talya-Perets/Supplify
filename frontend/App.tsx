import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './src/components/login/login';
import RegisterScreen from './src/components/registration/registration';
import HomeScreen from './src/components/Home/Home';
import AddSupplierScreen from './src/components/AddSupplier/AddSupplier';
import AddProductScreen from './src/components/AddProduct/AddProduct';
import SuppliersListScreen from './src/components/SuppliersList/SuppliersList';
import EmployeeRegistrationScreen from './src/components/EmployeeRegistration/EmployeeRegistration';
import ProductListScreen from './src/components/ProductList/ProductList';
import ShoppingCartScreen from './src/components/ShoppingCart/ShoppingCart';
import messaging from '@react-native-firebase/messaging';
import ConfirmOrderScreen from './src/components/ConfirmOrder/ConfirmOrder';
import { LoginProvider } from './src/contexts/LoginContext';
import { CartProvider } from './src/contexts/CartContext';
import SearchProductScreen from './src/components/SearchProduct/SearchProduct';
import ForgotPasswordScreen from './src/components/ForgotPassword/ForgotPassword';
import OrderListScreen from './src/components/OrderList/OrderList';
import OrderDetailsScreen from './src/components/OrderList/OrderDetails';
import { OrderProvider } from './src/contexts/OrderContext';
import Managerscreen from './src/components/ManagerScreen/Managerscreen';
import ApprovalOrderScreen from './src/components/ApprovalOrder';


import notifee, { AndroidImportance } from '@notifee/react-native';

export const API_BASE_URL = 'http://10.0.2.2:8080';

// Define OrderProductDetails interface for better type safety across the app
export interface OrderProductDetails {
  productName: string;
  barcode: string;
  imageUrl: string;
  orderedQuantity: number;
  deliveredQuantity: number;
  unitPrice: number;
  subtotal: number;
  return_requested: number;
  return_approved:number;

}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  AddSupplier: undefined;
  AddProduct: undefined;
  SuppliersList: undefined;
  ProductList: undefined;
  OrderList: undefined;
  ShoppingCart: undefined;
  EmployeeRegistration: undefined;
  SearchProduct: undefined;
  Managerscreen: undefined; 
  OrderDetails: { orderId?: number };
  ApprovalOrder: { orderId: number };
  ConfirmOrder: { 
    orderDetails: OrderProductDetails[];
    orderId: number;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Notification permission granted.');
  }
};

const setupNotificationChannel = async () => {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
};

const App = () => {
  useEffect(() => {
    // Setup notification permissions and channels
    requestUserPermission();
    setupNotificationChannel();
    
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground message received:', remoteMessage);

      // Display a push notification even when the app is open
      await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'New Notification',
        body: remoteMessage.notification?.body || 'You have a new message',
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
        },
      });
    });

    return unsubscribe; // Cleanup on unmount
  }, []);

  return (
    <LoginProvider>
      <CartProvider>
        <OrderProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="AddSupplier" component={AddSupplierScreen} />
              <Stack.Screen name="SuppliersList" component={SuppliersListScreen} />
              <Stack.Screen name="AddProduct" component={AddProductScreen} />
              <Stack.Screen name="ProductList" component={ProductListScreen} />
              <Stack.Screen name="OrderList" component={OrderListScreen} />
              <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
              <Stack.Screen name="SearchProduct" component={SearchProductScreen} />
              <Stack.Screen name="ShoppingCart" component={ShoppingCartScreen} />
              <Stack.Screen name="EmployeeRegistration" component={EmployeeRegistrationScreen} />
              <Stack.Screen name="ConfirmOrder" component={ConfirmOrderScreen} />
              <Stack.Screen name="Managerscreen" component={Managerscreen} />
              <Stack.Screen name="ApprovalOrder" component={ApprovalOrderScreen} />


            </Stack.Navigator>
          </NavigationContainer>
        </OrderProvider>
      </CartProvider>
    </LoginProvider>
  );
};

export default App;
