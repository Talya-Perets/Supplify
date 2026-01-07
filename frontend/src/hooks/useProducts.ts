// src/hooks/productHooks.ts
import { useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { doPostAddProduct } from '../util/HTTPRequests';
import { globals } from '../util/Globals';
import { LoginContext } from '../contexts/LoginContext';
import { LoginContextType } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';
import { BusinessProduct } from '../types/models';
import useBusinessProducts from './useBusinessProducts';

// Interface for product form data
interface ProductFormData {
  id: string;
  productName: string;
  productDescription: string;
  stock: string;
  price: string;
}

// Hook for adding/editing products
export const useProductForm = () => {
  const { userInfo } = useContext(LoginContext) as LoginContextType;
  const { refetchProducts } = useBusinessProducts();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number>(-1);
  const [productImageUri, setProductImageUri] = useState<string | null>(null);
  const [productImageData, setProductImageData] = useState<any>(null);
  
  // Product form data
  const [productData, setProductData] = useState<ProductFormData>({
    id: '',
    productName: '',
    productDescription: '',
    stock: '',
    price: '',
  });

  // Handle image selection
  const handleImageSelected = (imageUri: string, imageData: any) => {
    setProductImageUri(imageUri);
    setProductImageData(imageData);
  };

  // Reset product form
  const resetProductForm = () => {
    setProductData({
      id: '',
      productName: '',
      productDescription: '',
      stock: '',
      price: '',
    });
    setSelectedSupplierId(-1);
    setProductImageUri(null);
    setProductImageData(null);
  };

  // Add new product
  const handleAddProduct = async () => {
    // Validate form data
    if (
      !productData.id ||
      !productData.productName ||
      selectedSupplierId === -1 ||
      !productData.price
    ) {
      Alert.alert('Error', 'Please fill in all required product details');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert the payload object to JSON string
      const payload = JSON.stringify({
        id: productData.id,
        productName: productData.productName,
        productDescription: productData.productDescription || '',
        supplierId: selectedSupplierId,
        stock: parseInt(productData.stock, 10) || 0,
        price: parseFloat(productData.price),
        businessId: userInfo.businessId,
      });

      console.log('Payload:', payload);

      const formData = new FormData();
      formData.append('request', payload);

      // Add image if selected
      if (productImageUri && productImageData) {
        formData.append('file', {
          uri: productImageUri,
          name: productImageData.fileName || 'product.jpg',
          type: productImageData.type || 'image/jpeg',
        });
      }

      // Send the request
      const response = await doPostAddProduct(
        globals.PRODUCT.createProduct,
        formData,
      );
      
      Alert.alert('Success', 'Product added successfully!');
      resetProductForm();
      refetchProducts(); // Refresh product list
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product. Please try again.');
      Alert.alert('Error', 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    productData,
    setProductData,
    selectedSupplierId,
    setSelectedSupplierId,
    productImageUri,
    productImageData,
    loading,
    error,
    handleImageSelected,
    handleAddProduct,
    resetProductForm
  };
};

// Hook for product list management
export const useProductList = () => {
  const { businessProducts, isLoading, refetchProducts } = useBusinessProducts();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});
  const [returnQuantities, setReturnQuantities] = useState<{[key: string]: number}>({});

  // Initialize quantities when products are fetched
  useEffect(() => {
    if (businessProducts && businessProducts.length > 0) {
      const initialQuantities = businessProducts.reduce(
        (acc: {[key: string]: number}, businessProduct: BusinessProduct) => {
          acc[businessProduct.product.id] = 0;
          return acc;
        },
        {},
      );
      setQuantities(initialQuantities);
      setReturnQuantities(initialQuantities);
    }
  }, [businessProducts]);

  // Update order quantity
  const updateQuantity = (productId: string, increment: boolean) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + (increment ? 1 : -1)),
    }));
  };

  // Update return quantity
  const updateReturnQuantity = (productId: string, increment: boolean) => {
    setReturnQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + (increment ? 1 : -1)),
    }));
  };

  // Add product to cart
  const handleAddToCart = (businessProduct: BusinessProduct) => {
    const quantity = quantities[businessProduct.product.id] || 0;
    const returnQuantity = returnQuantities[businessProduct.product.id] || 0;
    
    // Check if at least one of quantity or returnQuantity is greater than 0
    if (quantity > 0 || returnQuantity > 0) {
      addToCart({
        businessProduct,
        quantity,
        returnQuantity,
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

  return {
    businessProducts,
    isLoading,
    successMessage,
    quantities,
    returnQuantities,
    updateQuantity,
    updateReturnQuantity,
    handleAddToCart,
    refetchProducts
  };
};