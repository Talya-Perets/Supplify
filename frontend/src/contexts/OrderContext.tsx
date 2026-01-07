import React, { createContext, useContext, useState } from 'react';

type OrderContextType = {
  selectedOrderId: number | null;
  setSelectedOrderId: (id: number | null) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  return (
    <OrderContext.Provider value={{ selectedOrderId, setSelectedOrderId }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
