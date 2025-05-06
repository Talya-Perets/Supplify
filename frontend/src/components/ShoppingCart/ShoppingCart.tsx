import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../Sidebar/sidebar';
import styles from './ShoppingCart.styles';
import {useCart} from '../../contexts/CartContext';
import {globals} from '../../util/Globals';
import {doPost} from '../../util/HTTPRequests';
import {LoginContextType} from '../../contexts/UserContext';
import {LoginContext} from '../../contexts/LoginContext';
import {CartItem} from '../../contexts/CartContext';
import ProductCard from '../ProductList/ProductCard/ProductCard';

const validateCartItem = (item: CartItem): boolean => {
  if (!item.businessProduct.product.id) {
    console.warn(`Invalid cart item - missing productId:`, item);
    return false;
  }
  if (!item.businessProduct.product.supplier?.supplierId) {
    console.warn(`Invalid cart item - missing supplier info:`, item);
    return false;
  }
  return true;
};

const groupItemsBySupplier = (items: CartItem[]) => {
  console.log('Grouping items by supplier. Total items:', items.length);
  const validItems = items.filter(validateCartItem);
  console.log('Valid items after validation:', validItems.length);

  return validItems.reduce((groups, item) => {
    const supplierId = item.businessProduct.product.supplier.supplierId;
    if (!groups[supplierId]) {
      groups[supplierId] = {
        supplierName: item.businessProduct.product.supplier.companyName,
        items: [],
      };
    }
    groups[supplierId].items.push(item);
    return groups;
  }, {} as Record<number, {supplierName: string; items: CartItem[]}>);
};

const ShoppingCartScreen = () => {
  const {cartItems, updateQuantity, updateReturnQuantity, removeFromCart} = useCart();
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
      const businessId = userInfo.businessId;

      console.log('Supplier Groups:', supplierGroups);
      const orderPromises = Object.entries(supplierGroups).map(
        async ([supplierId, group]) => {
          console.log('Creating order for supplier:', group.supplierName);

          const newOrder = {
            supplierId: supplierId,
            userId: userInfo.userId,
            businessId: businessId,
            orderItems: group.items.map(item => {
              const orderItem = {
                productId: item.businessProduct.product.id,
                quantity: item.quantity,
                returnQuantity: item.returnQuantity || 0, // Include return quantity
              };

              return orderItem;
            }),
            status: 'pending',
            orderDate: new Date().toISOString(),
          };
          console.log('Sending order:', JSON.stringify(newOrder, null, 2));
          return await doPost(globals.ORDER.CreateOrder, newOrder);
        },
      );

      const results = await Promise.all(orderPromises);
      console.log('Order creation results:', results);

      Alert.alert('הצלחה', 'ההזמנות נשלחו בהצלחה לאישור מנהל', [
        {
          text: 'אישור',
          onPress: () => {
            cartItems.forEach(item =>
              removeFromCart(item.businessProduct.product.id),
            );
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

        <ScrollView
          contentContainerStyle={
            cartItems.length === 0 ? styles.emptyCart : null
          }
          style={styles.content}>
          {cartItems.length === 0 ? (
            <Text style={styles.emptyCartText}>הסל שלך ריק</Text>
          ) : (
            Object.entries(supplierGroups).map(([supplierId, group]) => (
              <View key={supplierId} style={styles.supplierSection}>
                <View style={styles.supplierHeader}>
                  <Text style={styles.supplierName}>{group.supplierName}</Text>
                </View>
                {group.items.map(item => (
                  <View key={item.businessProduct.product.id} style={styles.cartItemContainer}>
                    <ProductCard
                      businessProduct={item.businessProduct}
                      quantity={item.quantity}
                      returnQuantity={item.returnQuantity || 0}
                      updateQuantity={(productId, increment) => updateQuantity(productId, increment)}
                      updateReturnQuantity={(productId, increment) => updateReturnQuantity(productId, increment)}
                      handleRemoveFromCart={() =>
                        removeFromCart(item.businessProduct.product.id)
                      }
                    />
                    
                    {/* Add a summary of the order if needed */}
                    {(item.quantity > 0 || (item.returnQuantity && item.returnQuantity > 0)) && (
                      <View style={styles.orderSummary}>
                        {item.quantity > 0 && (
                          <Text style={styles.orderSummaryText}>
                            הזמנה: {item.quantity} יחידות
                          </Text>
                        )}
                        {item.returnQuantity && item.returnQuantity > 0 && (
                          <Text style={styles.returnSummaryText}>
                            החזרה: {item.returnQuantity} יחידות
                          </Text>
                        )}
                      </View>
                    )}
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