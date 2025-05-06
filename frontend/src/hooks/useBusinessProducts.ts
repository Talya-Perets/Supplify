import { useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import { doGet } from '../util/HTTPRequests';
import { globals } from '../util/Globals';
import { BusinessProduct } from '../types/models';
import { LoginContextType } from '../contexts/UserContext';
import { LoginContext } from '../contexts/LoginContext';

const useBusinessProducts = () => {
  const { userInfo } = useContext(LoginContext) as LoginContextType;
  const [businessProducts, setBusinessProducts] = useState<BusinessProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await doGet(
        `${globals.BUSINESS.getBusinessProducts}/${userInfo.businessId}`
      );

      if (response.status === 200) {
        setBusinessProducts(response.data);
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

  useEffect(() => {
    fetchProducts();
  }, []);

  return { businessProducts, isLoading, refetchProducts: fetchProducts };
};

export default useBusinessProducts;
