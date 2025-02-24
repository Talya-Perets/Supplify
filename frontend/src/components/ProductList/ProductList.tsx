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

const ProductList = () => {
  const {businessProducts, isLoading} = useBusinessProducts();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {addToCart} = useCart();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});

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
  }, [businessProducts]);

  const updateQuantity = (productId: string, increment: boolean) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, prev[productId] + (increment ? 1 : -1)),
    }));
  };

  const handleAddToCart = (businessProduct: BusinessProduct) => {
    const quantity = quantities[businessProduct.product.id] || 0;
    if (quantity > 0) {
      addToCart({
        businessProduct,
        quantity,
      });

      setSuccessMessage('מוצר נוסף לסל בהצלחה');

      // Hide the message after 2 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
    } else {
      Alert.alert('שגיאה', 'נא לבחור כמות לפני הוספה לסל');
    }
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
                  updateQuantity={updateQuantity}
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
