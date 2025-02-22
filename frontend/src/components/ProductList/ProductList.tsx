import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../../components/sidebar-component';
import {doGet, doPost} from '../../util/HTTPRequests';
import {globals} from '../../util/Globals';

interface Product {
  id: string;
  supplier: {
    supplierId: number;
    companyName: string;
  };
  productName: string;
  description: string;
  stock: number;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});

  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await doGet(globals.PRODUCT.displayProducts);
      console.log('API Response:', data);

      if (data) {
        setProducts(data);

        // Initialize product quantities
        const initialQuantities = data.reduce(
          (acc: {[key: string]: number}, product: Product) => {
            acc[product.id] = 0;
            return acc;
          },
          {},
        );
        setQuantities(initialQuantities);
      } else {
        throw new Error('No data received from API');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('שגיאה', 'אירעה שגיאה בטעינת רשימת המוצרים');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = (productId: string, increment: boolean) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, prev[productId] + (increment ? 1 : -1)),
    }));
  };

  // Filtering products based on search query

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

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 0;
    if (quantity === 0) {
      Alert.alert('שגיאה', 'נא לבחור כמות');
      return;
    }
    if (quantity > product.stock) {
      Alert.alert('שגיאה', 'הכמות שנבחרה עולה על המלאי הקיים');
      return;
    }
    // Add your cart logic here
  };

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

        {products.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>אין מוצרים להצגה</Text>
          </View>
        ) : (
          <ScrollView style={styles.productList}>
            {products.map(product => (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.cardContent}>
                  <View style={styles.imageContainer} />

                  <View style={styles.detailsSection}>
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>
                        {product.productName}
                      </Text>
                    </View>

                    <View style={styles.actionsSection}>
                      <View style={styles.quantityControls}>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => updateQuantity(product.id, false)}>
                          <Icon name="minus" size={16} color="#4A90E2" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>
                          {quantities[product.id] || 0}
                        </Text>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => updateQuantity(product.id, true)}>
                          <Icon name="plus" size={16} color="#4A90E2" />
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        style={styles.addToCartButton}
                        onPress={() => handleAddToCart(product)}>
                        <Icon name="shopping-cart" size={16} color="white" />
                        <Text style={styles.addToCartText}>הוסף לסל</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4A90E2',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#777',
  },
  mainContent: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  productList: {
    marginTop: 10,
  },
  productCard: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 10,
  },
  imageContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#f1f1f1',
    marginRight: 10,
  },
  detailsSection: {
    flex: 1,
  },
  productInfo: {
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productBarcode: {
    fontSize: 12,
    color: '#777',
  },
  productPrice: {
    fontSize: 14,
    color: '#4A90E2',
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 5,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    padding: 8,
    borderRadius: 4,
  },
  addToCartText: {
    color: 'white',
    marginLeft: 5,
  },
});

export default ProductList;
