import React, { useState, useContext } from 'react';
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
import { useCart } from '../../contexts/CartContext';
import { globals } from '../../util/Globals';
import { doPost } from '../../util/HTTPRequests';
import { LoginContextType } from '../../contexts/UserContext';
import { LoginContext } from '../../contexts/LoginContext';
import { CartItem  } from '../../contexts/CartContext';


const validateCartItem = (item: CartItem): boolean => {
  if (!item.productId) {
    console.warn(`Invalid cart item - missing productId:`, item);
    return false;
  }
  if (!item.supplier?.supplierId) {
    console.warn(`Invalid cart item - missing supplier info:`, item);
    return false;
  }
  return true;
};

const groupItemsBySupplier = (items: CartItem[]) => {
  console.log("Grouping items by supplier. Total items:", items.length);
  const validItems = items.filter(validateCartItem);
  console.log("Valid items after validation:", validItems.length);

  return validItems.reduce((groups, item) => {
    const supplierId = item.supplier.supplierId;
    
    if (!groups[supplierId]) {
      groups[supplierId] = {
        supplierName: item.supplier.companyName,
        items: [],
      };
    }
    groups[supplierId].items.push(item);
    return groups;
  }, {} as Record<number, { supplierName: string; items: CartItem[] }>);
};

const ShoppingCartScreen = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userInfo } = useContext(LoginContext) as LoginContextType;


  const createOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert('שגיאה', 'לא ניתן ליצור הזמנה עם סל ריק');
      return;
    }
  
    try {
      setIsSubmitting(true);
      const businessId = userInfo.businessId;

      console.log("Supplier Groups:", supplierGroups);
      const orderPromises = Object.entries(supplierGroups).map(async ([supplierId, group]) => {
        group.items.forEach(item => {
          console.log(`Item ${item.id} data:`, {
            productId: item.productId,
            quantity: item.quantity,
            supplier: item.supplier
          });
        });

        const newOrder = {
          userId: userInfo.userId,
          businessId: businessId,
          supplierId: supplierId,
          orderItems: group.items.map((item) => {
            const orderItem = {
              productId: item.productId,
              quantity: item.quantity,
            };

            if (!orderItem.productId) {
              console.error(`Missing productId for item: ${item.id}`);
            }
            return orderItem;
          }),
          status: 'pending',
          orderDate: new Date().toISOString(),
        };
        console.log("Sending order:", JSON.stringify(newOrder, null, 2));
        return await doPost(globals.ORDER.CreateOrder, newOrder);
      });

      const results = await Promise.all(orderPromises);
      console.log("Order creation results:", results);

      Alert.alert('הצלחה', 'ההזמנות נשלחו בהצלחה לאישור מנהל', [
        {
          text: 'אישור',
          onPress: () => {
            cartItems.forEach((item) => removeFromCart(item.id));
          },
        },
      ]);
    } catch (error) {
      console.error('Error creating orders:', error);
      Alert.alert('שגיאה', 'אירעה שגיאה ביצירת ההזמנה. אנא נסה שוב מאוחר יותר');
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
                      <TouchableOpacity
                        onPress={() => {
                          console.log(`Removing item: ${item.id}, productId: ${item.productId}`);
                          removeFromCart(item.id);
                        }}
                      >
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
                      <Text style={styles.itemId}>Product ID: {item.productId}</Text>
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
