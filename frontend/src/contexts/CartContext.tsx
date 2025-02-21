import React, { createContext, useState, useContext, ReactNode } from 'react';

type CartItem = {
  id: string;
  name: string;
  stock: number;
  quantity: number;
  supplier: {
    supplierId: number;
    companyName: string;
  };
  recentlyOrdered?: string; // Optional field
  returned?: string; // Optional field
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  updateQuantity: (id: string, isIncrement: boolean) => void;
  removeFromCart: (id: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number) => {
    setCartItems(prev => {
      // Check if the item already exists in the cart
      const existingItem = prev.find(i => i.id === item.id);
  
      if (existingItem) {
        // If the item exists, update its quantity
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        // If the item doesn't exist, add it to the cart with the specified quantity
        return [...prev, { ...item, quantity }];
      }
    });
  };
  
  const updateQuantity = (id: string, isIncrement: boolean) => {
    setCartItems(prev =>
      prev.map(i =>
        i.id === id ? { ...i, quantity: isIncrement ? i.quantity + 1 : Math.max(0, i.quantity - 1) } : i
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart }}>
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