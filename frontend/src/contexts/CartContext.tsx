import React, {createContext, useState, useContext, ReactNode} from 'react';
import {BusinessProduct} from '../types/models';

export type CartItem = {
  businessProduct: BusinessProduct;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, isIncrement: boolean) => void;
  removeFromCart: (id: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({children}: {children: ReactNode}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      // Check if the item already exists in the cart
      const existingItem = prev.find(
        i => i.businessProduct.product.id === item.businessProduct.product.id,
      );

      if (existingItem) {
        // If the item exists, update its quantity
        return prev.map(i =>
          i.businessProduct.product.id === item.businessProduct.product.id
            ? {...i, quantity: i.quantity + item.quantity}
            : i,
        );
      } else {
        // If the item doesn't exist, add it to the cart with the specified quantity
        return [...prev, item];
      }
    });
  };

  const updateQuantity = (id: string, isIncrement: boolean) => {
    setCartItems(
      prev =>
        prev
          .map(i =>
            i.businessProduct.product.id === id
              ? {
                  ...i,
                  quantity: isIncrement
                    ? i.quantity + 1
                    : Math.max(0, i.quantity - 1),
                }
              : i,
          )
          .filter(i => i.quantity > 0), // Remove items with quantity 0
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(i => i.businessProduct.product.id !== id));
  };

  return (
    <CartContext.Provider
      value={{cartItems, addToCart, updateQuantity, removeFromCart}}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
