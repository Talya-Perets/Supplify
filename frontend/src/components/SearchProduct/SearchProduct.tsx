import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import {RootStackParamList, API_BASE_URL} from '../../../App';
import styles from './SearchProduct.styles';
import {doPost} from '../../util/HTTPRequests';
import {globals} from '../../util/Globals';
import Sidebar from '../sidebar-component';

type SearchProductScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SearchProduct'
>;

const SearchProductScreen = () => {
  const navigation = useNavigation<SearchProductScreenNavigationProp>();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const [productData, setProductData] = useState({
    id: '',
    productName: '',
    productDescription: '',
    supplierId: '',
    stock: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]); // List of products fetched from API

  const handleSearchProduct = async () => {
    setIsLoading(true);
    try {
      const response = await doPost(globals.PRODUCT.fetchProduct, {
        productName: productData.productName,
      });

      if (response) {
        setProducts(response.data);
      } else {
        Alert.alert(
          'No products found',
          'No matching products found for your search.',
        );
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      Alert.alert('Error', 'There was an issue fetching the product.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderProductCard = ({item}: {item: any}) => (
    <View style={styles.productCard}>
      <Text style={styles.productName}>{item.productName}</Text>
      <Text style={styles.productDescription}>{item.productDescription}</Text>
      <Text style={styles.productStock}>Stock: {item.stock}</Text>
    </View>
  );

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
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter product name"
            value={productData.productName}
            onChangeText={text =>
              setProductData({...productData, productName: text})
            }
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearchProduct}>
            <Icon name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text>Loading products...</Text>
          </View>
        ) : (
          <FlatList
            data={products}
            renderItem={renderProductCard}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.noResultsText}>No products found.</Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default SearchProductScreen;
