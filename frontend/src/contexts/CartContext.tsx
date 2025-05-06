import React, {createContext, useState, useContext, ReactNode} from 'react';
import {BusinessProduct} from '../types/models';

// Update the CartItem interface to include returnQuantity
export interface CartItem {
  businessProduct: BusinessProduct;
  quantity: number;
  returnQuantity?: number; // Optional for backward compatibility
}

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, increment: boolean) => void;
  updateReturnQuantity: (productId: string, increment: boolean) => void; // New function
  clearCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({children}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (newItem: CartItem) => {
    setCartItems(prevItems => {
      // Check if the product is already in the cart
      const existingItemIndex = prevItems.findIndex(
        item => item.businessProduct.product.id === newItem.businessProduct.product.id,
      );

      if (existingItemIndex !== -1) {
        // Update existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newItem.quantity,
          returnQuantity: newItem.returnQuantity || 0,
        };
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, {...newItem, returnQuantity: newItem.returnQuantity || 0}];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.businessProduct.product.id !== productId),
    );
  };

  const updateQuantity = (productId: string, increment: boolean) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.businessProduct.product.id === productId) {
          return {
            ...item,
            quantity: Math.max(0, item.quantity + (increment ? 1 : -1)),
          };
        }
        return item;
      }),
    );
  };

  const updateReturnQuantity = (productId: string, increment: boolean) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.businessProduct.product.id === productId) {
          return {
            ...item,
            returnQuantity: Math.max(0, (item.returnQuantity || 0) + (increment ? 1 : -1)),
          };
        }
        return item;
      }),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateReturnQuantity,
        clearCart,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};