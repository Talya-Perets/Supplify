import { useState, useEffect, useContext } from 'react';
import { doGet } from '../util/HTTPRequests';
import { globals } from '../util/Globals';
import { LoginContext } from '../contexts/LoginContext';
import { LoginContextType } from '../contexts/UserContext';

const useOrders = () => {
  const { userInfo } = useContext(LoginContext) as LoginContextType;
  const [pendingOrders, setPendingOrders] = useState<number[]>([]);
  const [activeOrders, setActiveOrders] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pending orders
  const fetchPendingOrders = async () => {
    try {
      console.log("Fetching pending orders");
      const response = await doGet(`${globals.ORDER.getPendingOrders}?businessId=${userInfo.businessId}`);
      console.log("API Response:", response.data);

      if (!response || !response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response from server');
      }

      setPendingOrders([...new Set(response.data)]); // Remove duplicate order IDs
    } catch (err) {
      console.error('Error fetching pending orders:', err);
      setError('Failed to fetch pending orders. Please try again later.');
    }
  };

  // Fetch active orders
  const fetchActiveOrders = async () => {
    try {
      console.log("Fetching active orders");
      const response = await doGet(`${globals.ORDER.getActiveOrders}?businessId=${userInfo.businessId}`);
      console.log("API Response:", response.data);

      if (!response || !response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response from server');
      }

      setActiveOrders([...new Set(response.data)]); // Remove duplicate order IDs
    } catch (err) {
      console.error('Error fetching active orders:', err);
      setError('Failed to fetch active orders. Please try again later.');
    }
  };

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Execute both fetch operations in parallel
      await Promise.all([
        fetchPendingOrders(),
        fetchActiveOrders()
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  // Load orders when the component mounts
  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    pendingOrders,
    activeOrders,
    loading,
    error,
    refreshOrders: fetchOrders  // Expose refresh function to allow manual refresh
  };
};

export default useOrders;