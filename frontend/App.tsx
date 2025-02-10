import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StackNavigationProp} from '@react-navigation/stack';

import LoginScreen from './src/components/login/login';
import RegisterScreen from './src/components/registration/registration';
// import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import HomeScreen from './src/components/Home/Home';
import AddSupplierScreen from './src/components/AddSupplier/AddSupplier';
import AddProductScreen from './src/components/AddProduct/AddProduct';
import SuppliersListScreen from './src/components/SuppliersList/SuppliersList';
import EmployeeRegistrationScreen from './src/components/EmployeeRegistration/EmployeeRegistration';
import ProductListScreen from './src/components/ProductList/ProductList';
import ShoppingCartScreen from './src/components/ShoppingCart/ShoppingCart';
export const API_BASE_URL = 'http://10.0.2.2:8080';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  AddSupplier: undefined;
  AddProduct: undefined;
  SuppliersList: undefined;
  ProductList:undefined;
  ShoppingCart:undefined;
  EmployeeRegistration:undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddSupplier" component={AddSupplierScreen} />
        <Stack.Screen name="SuppliersList" component={SuppliersListScreen} />
        <Stack.Screen name="AddProduct" component={AddProductScreen} />
        <Stack.Screen name="ProductList" component={ProductListScreen} />
        <Stack.Screen name="ShoppingCart" component={ShoppingCartScreen} />
        <Stack.Screen name="EmployeeRegistration" component={EmployeeRegistrationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
