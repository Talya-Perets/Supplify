import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import {RootStackParamList} from '../../../App';
import styles from './SearchProduct.styles';
import Sidebar from '../Sidebar/sidebar';
import useBusinessProducts from '../../hooks/useBusinessProducts';
import ProductCard from '../ProductList/ProductCard/ProductCard';
import {BusinessProduct} from '../../types/models';
import {useCart} from '../../contexts/CartContext';

type SearchProductScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SearchProduct'
>;

const SearchProductScreen = () => {
  const navigation = useNavigation<SearchProductScreenNavigationProp>();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const {addToCart} = useCart();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 🔹 Fetch all products using the hook
  const {businessProducts, isLoading} = useBusinessProducts();

  // 🔹 Manage product quantities
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});

  const updateQuantity = (productId: string, increment: boolean) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + (increment ? 1 : -1)), // Ensure default value is 0
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

  // 🔹 Filter products dynamically based on searchText
  const filteredProducts = businessProducts.filter(businessProduct => {
    if (!searchText) return false; // Show no products initially
    const name = businessProduct.product.productName.toLowerCase();
    const query = searchText.toLowerCase();
    return name.startsWith(query) || name.includes(query); // Prefix + Substring search
  });

  // 🔹 Render each product card
  const renderProductCard = ({item}: {item: any}) => (
    <ProductCard
      key={item.product.id}
      businessProduct={item}
      quantity={quantities[item.product.id] || 0}
      updateQuantity={updateQuantity}
      handleAddToCart={handleAddToCart}
    />
  );

  useEffect(() => {
    setQuantities(prevQuantities => {
      const updatedQuantities: {[key: string]: number} = {};

      filteredProducts.forEach(product => {
        updatedQuantities[product.product.id] =
          prevQuantities[product.product.id] || 0;
      });

      // Only update state if there are changes
      return JSON.stringify(prevQuantities) !==
        JSON.stringify(updatedQuantities)
        ? updatedQuantities
        : prevQuantities;
    });
  }, [filteredProducts]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
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
            <Text style={styles.headerTitle}>חיפוש מוצר</Text>
          </View>

          {/* 🔹 Search Input */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="הכנס שם מוצר"
              value={searchText}
              onChangeText={setSearchText} // 🔹 Updates searchText state
            />
            <TouchableOpacity style={styles.searchButton}>
              <Icon name="search" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          {/* Success message */}
          {successMessage && (
            <View style={styles.successMessage}>
              <Text style={styles.successMessageText}>{successMessage}</Text>
            </View>
          )}

          {/* 🔹 Show Loading Indicator */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4A90E2" />
              <Text>טוען מוצרים...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredProducts}
              renderItem={renderProductCard}
              keyExtractor={item => item.product.id.toString()}
              ListEmptyComponent={
                searchText ? (
                  <Text style={styles.noResultsText}>
                    לא נמצאו מוצרים תואמים
                  </Text>
                ) : null
              }
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SearchProductScreen;
