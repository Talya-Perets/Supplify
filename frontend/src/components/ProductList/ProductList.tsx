import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../Sidebar/sidebar';
import {useCart} from '../../contexts/CartContext';
import styles from './ProductList.styles';
import {BusinessProduct} from '../../types/models';
import {LoginContextType} from '../../contexts/UserContext';
import ProductCard from './ProductCard/ProductCard';
import useBusinessProducts from '../../hooks/useBusinessProducts';
import ShoppingCartIcon from '../../contexts/ShoppingCartIcon'; // Import the ShoppingCartIcon
import {useNavigation} from '@react-navigation/native';

const ProductList = () => {
  const {businessProducts, isLoading} = useBusinessProducts();
  console.log('Fetched Products:', businessProducts);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {addToCart} = useCart();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});
  const [returnQuantities, setReturnQuantities] = useState<{[key: string]: number}>({});
  const navigation = useNavigation();

  // Initialize product quantities when products are fetched
  React.useEffect(() => {
    const initialQuantities = businessProducts.reduce(
      (acc: {[key: string]: number}, businessProduct: BusinessProduct) => {
        acc[businessProduct.product.id] = 0;
        return acc;
      },
      {},
    );
    setQuantities(initialQuantities);
    setReturnQuantities(initialQuantities); // Initialize return quantities as well
  }, [businessProducts]);

  const updateQuantity = (productId: string, increment: boolean) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, prev[productId] + (increment ? 1 : -1)),
    }));
  };

  const updateReturnQuantity = (productId: string, increment: boolean) => {
    setReturnQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, prev[productId] + (increment ? 1 : -1)),
    }));
  };

  const handleAddToCart = (businessProduct: BusinessProduct) => {
    const quantity = quantities[businessProduct.product.id] || 0;
    const returnQuantity = returnQuantities[businessProduct.product.id] || 0;
    
    // Check if at least one of quantity or returnQuantity is greater than 0
    if (quantity > 0 || returnQuantity > 0) {
      addToCart({
        businessProduct,
        quantity,
        returnQuantity, // Add return quantity to cart item
      });

      setSuccessMessage('מוצר נוסף לסל בהצלחה');

      // Reset quantities after adding to cart
      setQuantities(prev => ({
        ...prev,
        [businessProduct.product.id]: 0,
      }));
      
      setReturnQuantities(prev => ({
        ...prev,
        [businessProduct.product.id]: 0,
      }));

      // Hide the message after 2 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
    } else {
      Alert.alert('שגיאה', 'נא לבחור כמות להזמנה או החזרה לפני הוספה לסל');
    }
  };

  // Function to navigate to ShoppingCart screen
  const navigateToShoppingCart = () => {
    navigation.navigate('ShoppingCart');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>טוען מוצרים...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerTitle}>רשימת מוצרים</Text>
          <View style={{flex: 1}} />
          <ShoppingCartIcon onPress={navigateToShoppingCart} />
        </View>

        {/* Success message */}
        {successMessage && (
          <View style={styles.successMessage}>
            <Text style={styles.successMessageText}>{successMessage}</Text>
          </View>
        )}

        {businessProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>אין מוצרים להצגה</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.productList}>
              {businessProducts.map(businessProduct => (
                <ProductCard
                  key={businessProduct.product.id}
                  businessProduct={businessProduct}
                  quantity={quantities[businessProduct.product.id] || 0}
                  returnQuantity={returnQuantities[businessProduct.product.id] || 0}
                  updateQuantity={updateQuantity}
                  updateReturnQuantity={updateReturnQuantity}
                  handleAddToCart={handleAddToCart}
                />
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProductList;