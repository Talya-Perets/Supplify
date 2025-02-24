import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
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
      let hasChanges = false;

      filteredProducts.forEach(product => {
        if (prevQuantities[product.product.id]) {
          updatedQuantities[product.product.id] =
            prevQuantities[product.product.id];
        } else {
          updatedQuantities[product.product.id] = 0; // Reset to zero if not in prevQuantities
          hasChanges = true;
        }
      });

      // Remove old quantities if products are no longer visible
      if (
        Object.keys(prevQuantities).length !==
        Object.keys(updatedQuantities).length
      ) {
        hasChanges = true;
      }

      return hasChanges ? updatedQuantities : prevQuantities;
    });
  }, [filteredProducts]);

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
          <Text style={styles.headerTitle}>Search Product</Text>
        </View>

        {/* 🔹 Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter product name"
            value={searchText}
            onChangeText={setSearchText} // 🔹 Updates searchText state
          />
          <TouchableOpacity style={styles.searchButton}>
            <Icon name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* 🔹 Show Loading Indicator */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text>Loading products...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderProductCard}
            keyExtractor={item => item.product.id.toString()}
            ListEmptyComponent={
              searchText ? (
                <Text style={styles.noResultsText}>No matching products.</Text>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default SearchProductScreen;
