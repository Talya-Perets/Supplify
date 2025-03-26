import React, { useState } from 'react';
import {
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../../components/Sidebar/sidebar';

interface ApprovalItem {
  id: number;
  supplierName: string;
  status: 'pending' | 'approved' | 'rejected';
  items: {
    id: number;
    name: string;
    requestedQuantity: number;
    recentlyOrdered: number;
    recentlyReturned: number;
  }[]; 
}

const ManagerApprovalScreen = () => {
  const [approvalItems, setApprovalItems] = useState<ApprovalItem[]>([ 
    {
      id: 1,
      supplierName: 'שטראוס',
      status: 'pending',
      items: [
        { 
          id: 1, 
          name: 'חלב מעדנות', 
          requestedQuantity: 20,
          recentlyOrdered: 15,
          recentlyReturned: 5
        },
        { 
          id: 2, 
          name: 'גבינה צהובה', 
          requestedQuantity: 15,
          recentlyOrdered: 10,
          recentlyReturned: 3
        }
      ]
    },
    {
      id: 2,
      supplierName: 'תנובה',
      status: 'pending',
      items: [
        { 
          id: 3, 
          name: 'חלב', 
          requestedQuantity: 10,
          recentlyOrdered: 8,
          recentlyReturned: 2
        },
        { 
          id: 4, 
          name: 'יוגורט', 
          requestedQuantity: 8,
          recentlyOrdered: 6,
          recentlyReturned: 1
        }
      ]
    }
  ]);

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [expandedSuppliers, setExpandedSuppliers] = useState<Set<number>>(new Set());

  const toggleSupplierItems = (supplierId: number) => {
    setExpandedSuppliers(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(supplierId)) {
        newExpanded.delete(supplierId);
      } else {
        newExpanded.add(supplierId);
      }
      return newExpanded;
    });
  };

  const handleQuantityChange = (supplierId: number, itemId: number, increment: boolean) => {
    setApprovalItems(prev => 
      prev.map(supplier => 
        supplier.id === supplierId
          ? {
              ...supplier,
              items: supplier.items.map(item =>
                item.id === itemId
                  ? { ...item, requestedQuantity: increment ? item.requestedQuantity + 1 : Math.max(item.requestedQuantity - 1, 0) }
                  : item
              )
          }
          : supplier
      )
    );
  };

  const handleCommunication = (supplier: ApprovalItem, method: 'whatsapp' | 'email') => {
    const orderDetails = supplier.items.map(item => 
      `${item.name}: ${item.requestedQuantity}`
    ).join('\n');

    const message = `הזמנה מ-${supplier.supplierName}:\n${orderDetails}`;

    switch(method) {
      case 'whatsapp':
        Linking.openURL(`whatsapp://send?text=${encodeURIComponent(message)}`);
        break;
      case 'email':
        Linking.openURL(`mailto:?subject=הזמנה מ-${supplier.supplierName}&body=${encodeURIComponent(message)}`);
        break;
    }
  };

  const handleReject = (supplierId: number) => {
    setApprovalItems(prev => 
      prev.map(supplier => 
        supplier.id === supplierId 
          ? {...supplier, status: 'rejected'}
          : supplier
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
     {/* {isSidebarVisible && <Sidebar userRole="manager" />} */}
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsSidebarVisible(!isSidebarVisible)}>
            <Icon name={isSidebarVisible ? "x" : "menu"} size={24} color="#4A90E2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>אישור הזמנות</Text>
        </View>

        <ScrollView style={styles.content}>
          {approvalItems.map(supplier => (
            <View key={supplier.id} style={styles.supplierSection}>
              <View style={styles.supplierHeader}>
                <Text style={styles.supplierName}>{supplier.supplierName}</Text>
                <TouchableOpacity onPress={() => toggleSupplierItems(supplier.id)}>
                  <Icon 
                    name={expandedSuppliers.has(supplier.id) ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color="#4A90E2"
                  />
                </TouchableOpacity>
              </View>

              {expandedSuppliers.has(supplier.id) && supplier.items.map(item => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={styles.itemControls}>
                    <TouchableOpacity onPress={() => handleQuantityChange(supplier.id, item.id, false)}>
                      <Icon name="minus-circle" size={20} color="#FF0000" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.requestedQuantity}</Text>
                    <TouchableOpacity onPress={() => handleQuantityChange(supplier.id, item.id, true)}>
                      <Icon name="plus-circle" size={20} color="#4A90E2" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemStatLabel}>הוזמן לאחרונה: {item.recentlyOrdered}</Text>
                    <Text style={styles.itemStatLabel}>הוחזר לאחרונה: {item.recentlyReturned}</Text>
                  </View>
                </View>
              ))}

              <View style={styles.communicationButtons}>
                <TouchableOpacity 
                  style={styles.communicationButton}
                  onPress={() => handleCommunication(supplier, 'whatsapp')}
                >
                  <Icon name="message-circle" size={20} color="#4A90E2" />
                  <Text style={styles.communicationButtonText}>שלח בווטסאפ</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.communicationButton}
                  onPress={() => handleCommunication(supplier, 'email')}
                >
                  <Icon name="mail" size={20} color="#4A90E2" />
                  <Text style={styles.communicationButtonText}>שלח במייל</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.communicationButton, styles.cancelButton]}
                  onPress={() => handleReject(supplier.id)} 
                  disabled={supplier.status !== 'pending'}
                >
                  <Icon name="x-circle" size={20} color="#FF0000" />
                  <Text style={styles.cancelButtonText}>בטל הזמנה</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
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
        gap: 8,
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
    itemStatLabel: {
      fontSize: 13,
      color: '#6B7280',
      marginBottom: 4,
    },
    communicationButtons: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-around',
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
    },
    communicationButton: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 8,
      backgroundColor: '#E6F2FF',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 6,
    },
    communicationButtonText: {
      color: '#4A90E2',
      fontSize: 14,
    },
    cancelButton: {
      backgroundColor: '#FFE6E6',
    },
    cancelButtonText: {
      color: '#FF0000',
      fontSize: 14,
    },
});

export default ManagerApprovalScreen;