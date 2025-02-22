import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StackNavigationProp} from '@react-navigation/stack';

import LoginScreen from './src/components/login/login';
import RegisterScreen from './src/components/registration/registration';
import HomeScreen from './src/components/Home/Home';
import AddSupplierScreen from './src/components/AddSupplier/AddSupplier';
import AddProductScreen from './src/components/AddProduct/AddProduct';
import SuppliersListScreen from './src/components/SuppliersList/SuppliersList';
import EmployeeRegistrationScreen from './src/components/EmployeeRegistration/EmployeeRegistration';
import ProductListScreen from './src/components/ProductList/ProductList';
import ShoppingCartScreen from './src/components/ShoppingCart/ShoppingCart';
//import ManagerApprovalScreen from './src/components/ManagerScreen/Managerscreen';
import {LoginProvider} from './src/contexts/LoginContext';
import {CartProvider} from './src/contexts/CartContext';
import SearchProductScreen from './src/components/SearchProduct/SearchProduct';
import ForgotPasswordScreen from './src/components/ForgotPassword/ForgotPassword';
import OrderListScreen from './src/components/OrderList/OrderList';
import OrderDetailsScreen from './src/components/OrderList/OrderDetails';
import { OrderProvider } from './src/contexts/OrderContext';

export const API_BASE_URL = 'http://10.0.2.2:8080';

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
  OrderDetails: undefined; 
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return ( 
    <LoginProvider>
      <CartProvider>
        <OrderProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
            }}>
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
            <Stack.Screen
              name="EmployeeRegistration"
              component={EmployeeRegistrationScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
        </OrderProvider>
      </CartProvider>
    </LoginProvider>
  );
};

export default App;