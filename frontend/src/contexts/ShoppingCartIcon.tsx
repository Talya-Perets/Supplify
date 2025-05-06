import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';

// You can import your cart context here if you have one
// import {CartContext} from '../../contexts/CartContext';

interface ShoppingCartIconProps {
  onPress?: () => void;
}

const ShoppingCartIcon: React.FC<ShoppingCartIconProps> = ({onPress}) => {
  // Use your actual cart context
  // For example:
  // import {CartContext} from '../../contexts/CartContext';
  // const {cart} = useContext(CartContext);
  // 
  // For now, let's use a dummy state that you can replace with your real implementation
  const [itemCount, setItemCount] = useState(0);
  const navigation = useNavigation();

  // You would update this effect to listen to your actual cart
  useEffect(() => {
    // This is a placeholder. In a real app, you would get the cart items count
    // from your cart context or from an API
    // Example: setItemCount(cart.length);
    
    // You can connect to your real cart context here
    // For now, we'll set it to 0 as default
    setItemCount(0);
  }, []);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Default navigation if no onPress is provided
      navigation.navigate('ShoppingCart');
    }
  };

  return (
    <TouchableOpacity style={styles.cartButton} onPress={handlePress}>
      <View style={styles.notificationContainer}>
        <FontAwesome name="shopping-cart" size={24} color="#4A90E2" />
        {itemCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{itemCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cartButton: {
    padding: 8,
  },
  notificationContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ShoppingCartIcon;