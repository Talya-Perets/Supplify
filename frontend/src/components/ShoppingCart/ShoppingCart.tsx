import React, { useState } from 'react';
import {
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../../components/sidebar-component';
import styles from './ShoppingCart.styles';
import { useCart } from '../../contexts/CartContext';

const ShoppingCartScreen = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [userRole] = useState<'manager' | 'employee'>('manager');


  
  return (
    <SafeAreaView style={styles.container}>
      {isSidebarVisible && <Sidebar userRole={userRole} />}
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsSidebarVisible(!isSidebarVisible)}>
            <Icon name={isSidebarVisible ? "x" : "menu"} size={24} color="#4A90E2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>סל קניות</Text>
        </View>

        <ScrollView style={styles.content}>
          {cartItems.length === 0 ? (
            <Text style={styles.emptyCart}>הסל שלך ריק</Text>
          ) : (
            cartItems.map(item => (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemControls}>
                  <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                    <Icon name="trash-2" size={20} color="red" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, false)}>
                    <Icon name="minus" size={20} color="#4A90E2" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, true)}>
                    <Icon name="plus" size={20} color="#4A90E2" />
                  </TouchableOpacity>
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemStatLabel}>הוזמן לאחרונה: {item.recentlyOrdered}</Text>
                  <Text style={styles.itemStatLabel}>הוחזר: {item.returned}</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <TouchableOpacity style={styles.finalSubmitButton}>
          <Text style={styles.finalSubmitText}>שלח לאישור מנהל</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ShoppingCartScreen;
