import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../../components/sidebar-component';

interface CartItem {
  supplierId: number;
  supplierName: string;
  isExpanded: boolean;
  items: {
    id: number;
    name: string;
    quantity: number;
    recentlyOrdered: number;
    returned: number;
  }[];
}

const ShoppingCartScreen = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      supplierId: 1,
      supplierName: 'שטראוס',
      isExpanded: true,
      items: [
        {
          id: 1,
          name: 'חלב מעדנות',
          quantity: 20,
          recentlyOrdered: 15,
          returned: 5,
        },
        {
          id: 2,
          name: 'גבינה צהובה',
          quantity: 15,
          recentlyOrdered: 10,
          returned: 3,
        },
      ],
    },
    {
      supplierId: 2,
      supplierName: 'תנובה',
      isExpanded: false,
      items: [
        {
          id: 3,
          name: 'חלב',
          quantity: 10,
          recentlyOrdered: 8,
          returned: 2,
        },
        {
          id: 4,
          name: 'יוגורט',
          quantity: 8,
          recentlyOrdered: 6,
          returned: 1,
        },
      ],
    },
  ]);

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSupplierExpand = (supplierId: number) => {
    setCartItems(prev =>
      prev.map(supplier =>
        supplier.supplierId === supplierId
          ? {...supplier, isExpanded: !supplier.isExpanded}
          : supplier,
      ),
    );
  };

  const updateQuantity = (
    supplierId: number,
    itemId: number,
    isIncrement: boolean,
  ) => {
    setCartItems(prev =>
      prev.map(supplier =>
        supplier.supplierId === supplierId
          ? {
              ...supplier,
              items: supplier.items.map(item =>
                item.id === itemId
                  ? {
                      ...item,
                      quantity: isIncrement
                        ? item.quantity + 1
                        : Math.max(0, item.quantity - 1),
                    }
                  : item,
              ),
            }
          : supplier,
      ),
    );
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
          <Text style={styles.headerTitle}>סל קניות</Text>
        </View>

        <ScrollView style={styles.content}>
          {cartItems.map(supplier => (
            <View key={supplier.supplierId} style={styles.supplierSection}>
              <TouchableOpacity
                style={styles.supplierHeader}
                onPress={() => toggleSupplierExpand(supplier.supplierId)}>
                <Text style={styles.supplierName}>{supplier.supplierName}</Text>
                <TouchableOpacity style={styles.approveButton}>
                  <Text style={styles.approveButtonText}>שלח להזמנת מנהל</Text>
                </TouchableOpacity>
              </TouchableOpacity>

              {supplier.isExpanded &&
                supplier.items.map(item => (
                  <View key={item.id} style={styles.itemRow}>
                    <View style={styles.itemControls}>
                      <TouchableOpacity>
                        <Icon name="trash-2" size={20} color="red" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          updateQuantity(supplier.supplierId, item.id, false)
                        }>
                        <Icon name="minus" size={20} color="#4A90E2" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() =>
                          updateQuantity(supplier.supplierId, item.id, true)
                        }>
                        <Icon name="plus" size={20} color="#4A90E2" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <View style={styles.itemStats}>
                        <Text style={styles.itemStatLabel}>
                          הוזמן לאחרונה: {item.recentlyOrdered}
                        </Text>
                        <Text style={styles.itemStatLabel}>
                          הוחזר: {item.returned}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.finalSubmitButton}>
          <Text style={styles.finalSubmitText}>שלח לאישור מנהל</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row-reverse',
    backgroundColor: '#F6F7FC',
  },
  mainContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  content: {
    flex: 1,
  },
  supplierSection: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  supplierHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  supplierName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  approveButton: {
    backgroundColor: '#E6F2FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  approveButtonText: {
    color: '#4A90E2',
    fontSize: 14,
  },
  itemRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemControls: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDetails: {
    alignItems: 'flex-end',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  itemStats: {
    alignItems: 'flex-end',
  },
  itemStatLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  finalSubmitButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    alignItems: 'center',
  },
  finalSubmitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ShoppingCartScreen;
