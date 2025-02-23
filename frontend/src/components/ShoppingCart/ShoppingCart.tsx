import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../../components/sidebar-component';
import styles from './ShoppingCart.styles';
import {useCart} from '../../contexts/CartContext';
import {globals} from '../../util/Globals';
import {doPost} from '../../util/HTTPRequests';
import {LoginContextType} from '../../contexts/UserContext';
import {LoginContext} from '../../contexts/LoginContext';

type CartItem = {
  id: string; // Ensure the ID is a string
  name: string;
  stock: number;
  price?: number;
  quantity: number;
  supplier: {
    supplierId: number;
    companyName: string;
  };
  recentlyOrdered?: string;
  returned?: string;
};

interface Order {
  id?: number; // Optional because the backend might generate it
  user: {
    id: number;
    name: string;
  };
  business: {
    id: number;
    name: string;
  };
  items: CartItem[]; // Include items in the order
  totalAmount: number;
  status: string;
  orderDate: string;
}

const groupItemsBySupplier = (items: CartItem[]) => {
  return items.reduce((groups, item) => {
    const supplierId = item.supplier.supplierId;
    if (!groups[supplierId]) {
      groups[supplierId] = {
        supplierName: item.supplier.companyName,
        items: [],
      };
    }
    groups[supplierId].items.push(item);
    return groups;
  }, {} as Record<number, {supplierName: string; items: CartItem[]}>);
};

const ShoppingCartScreen = () => {
  const {cartItems, updateQuantity, removeFromCart} = useCart();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {userInfo} = useContext(LoginContext) as LoginContextType;

  const createOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert('שגיאה', 'לא ניתן ליצור הזמנה עם סל ריק');
      return;
    }

    try {
      setIsSubmitting(true);

      // Group items by supplier
      const supplierGroups = groupItemsBySupplier(cartItems);

      // Create and send orders for each supplier
      const orderPromises = Object.entries(supplierGroups).map(
        async ([supplierId, group]) => {
          // Calculate the total amount for the order
          const totalAmount = group.items.reduce((sum, item) => {
            return sum + (item.price || 0) * item.quantity;
          }, 0);

          // Ensure userId is a number
          const userId = userInfo.userId;

          // Create the new order object
          const newOrder = {
            userId: userInfo.userId,
            businessId: userInfo.businessId,
            items: group.items,
            totalAmount: totalAmount,
            status: 'pending',
            orderDate: new Date().toISOString(),
          };
          // Send the order to the backend
          const response = await doPost(
            `${globals.ORDER.CreateOrder}`,
            newOrder,
          );
          return response;
        },
      );

      // Wait for all orders to be created
      await Promise.all(orderPromises);

      // Show success message
      Alert.alert('הצלחה', 'ההזמנות נשלחו בהצלחה לאישור מנהל', [
        {
          text: 'אישור',
          onPress: () => {
            // Clear cart items for the processed orders
            cartItems.forEach(item => removeFromCart(item.id));
          },
        },
      ]);
    } catch (error) {
      // Show error message
      Alert.alert('שגיאה', 'אירעה שגיאה ביצירת ההזמנה. אנא נסה שוב מאוחר יותר');
      console.error('Error creating orders:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const supplierGroups = groupItemsBySupplier(cartItems);

  return (
    <SafeAreaView style={styles.container}>
      {isSidebarVisible && <Sidebar />}
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
          <Text style={styles.headerTitle}>סל קניות</Text>
        </View>

        <ScrollView style={styles.content}>
          {cartItems.length === 0 ? (
            <Text style={styles.emptyCart}>הסל שלך ריק</Text>
          ) : (
            Object.entries(supplierGroups).map(([supplierId, group]) => (
              <View key={supplierId} style={styles.supplierSection}>
                <View style={styles.supplierHeader}>
                  <Text style={styles.supplierName}>{group.supplierName}</Text>
                </View>
                {group.items.map(item => (
                  <View key={item.id} style={styles.itemRow}>
                    <View style={styles.itemControls}>
                      <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                        <Icon name="trash-2" size={20} color="red" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, false)}
                        disabled={item.quantity <= 1}>
                        <Icon
                          name="minus"
                          size={20}
                          color={item.quantity <= 1 ? '#ccc' : '#4A90E2'}
                        />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, true)}
                        disabled={item.quantity >= item.stock}>
                        <Icon
                          name="plus"
                          size={20}
                          color={
                            item.quantity >= item.stock ? '#ccc' : '#4A90E2'
                          }
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      {item.recentlyOrdered && (
                        <Text style={styles.itemStatLabel}>
                          הוזמן לאחרונה: {item.recentlyOrdered}
                        </Text>
                      )}
                      {item.returned && (
                        <Text style={styles.itemStatLabel}>
                          הוחזר: {item.returned}
                        </Text>
                      )}
                      <Text style={styles.stockLabel}>מלאי: {item.stock}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ))
          )}
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.finalSubmitButton,
            isSubmitting && styles.finalSubmitButton,
          ]}
          onPress={createOrder}
          disabled={isSubmitting || cartItems.length === 0}>
          <Text style={styles.finalSubmitText}>
            {isSubmitting ? 'שולח...' : 'שלח לאישור מנהל'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ShoppingCartScreen;
