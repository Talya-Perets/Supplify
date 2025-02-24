import React, {useContext} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../App';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {LoginContext} from '../../contexts/LoginContext';
import {LoginContextType} from '../../contexts/UserContext';
import styles from './sidebar.styles';

type SidebarNavigationProp = StackNavigationProp<RootStackParamList>;

const menuItems = [
  {id: 'Home', title: 'דף הבית', icon: 'home'},
  {id: 'AddSupplier', title: 'הוספת ספק', icon: 'user-plus'},
  {id: 'AddProduct', title: 'הוספת מוצר', icon: 'plus-square-o'},
  {id: 'OrderList', title: 'רשימת הזמנות', icon: 'list-alt'},
  {id: 'ProductList', title: 'רשימת מוצרים', icon: 'cube'},
  {id: 'SuppliersList', title: 'רשימת ספקים', icon: 'users'},
  {id: 'SearchProduct', title: 'חיפוש מוצר', icon: 'search'},
  {id: 'ShoppingCart', title: 'סל קניות', icon: 'shopping-cart'},
];

const managerItems = [
  {id: 'ManagerApproval', title: 'מסך ניהול', icon: 'cog'},
  {id: 'EmployeeRegistration', title: 'הרשמת עובד', icon: 'user-plus'},
];

const Sidebar: React.FC = () => {
  const {userInfo, logout} = useContext(LoginContext) as LoginContextType;

  const navigation = useNavigation<SidebarNavigationProp>();

  const handleNavigation = (route: keyof RootStackParamList) => {
    console.log('Available routes:', navigation.getState().routeNames);
    console.log('Attempting to navigate to:', route);
    if (navigation.getState().routeNames.includes(route)) {
      console.log('Navigation successful');
      navigation.navigate(route);
    } else {
      console.warn(`Screen ${route} is not yet implemented`);

      console.warn(`Route ${route} is not defined in the navigator`);
    }
  };

  return (
    <View style={styles.sidebar}>
      <View style={styles.header}>
        <Text style={styles.logo}>Supplify</Text>
      </View>

      <ScrollView contentContainerStyle={styles.menuItems}>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() =>
              handleNavigation(item.id as keyof RootStackParamList)
            }>
            <FontAwesome
              name={item.icon}
              size={20}
              color="#4A90E2"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}

        {userInfo.userRole === 'Manager' &&
          managerItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() =>
                handleNavigation(item.id as keyof RootStackParamList)
              }>
              <FontAwesome
                name={item.icon}
                size={20}
                color="#4A90E2"
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            logout();
            navigation.navigate('Login');
            navigation.reset({index: 0, routes: [{name: 'Login'}]});
          }}>
          <FontAwesome
            name="sign-out"
            size={20}
            color="#4A90E2"
            style={styles.menuIcon}
          />
          <Text style={styles.menuText}>התנתק</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Sidebar;
