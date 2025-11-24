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
import styles from './ProductList.styles';
import ProductCard from './ProductCard/ProductCard';
import ShoppingCartIcon from '../../contexts/ShoppingCartIcon'; // Import the ShoppingCartIcon
import {useNavigation} from '@react-navigation/native';
import {useProductList}  from '../../hooks/useProducts'; 
import {RootStackParamList} from '../../types/models';
import { StackNavigationProp } from '@react-navigation/stack';


const ProductList = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  
  // Use our product hook
  const {
    businessProducts,
    isLoading,
    successMessage,
    quantities,
    returnQuantities,
    updateQuantity,
    updateReturnQuantity,
    handleAddToCart
  } = useProductList();

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