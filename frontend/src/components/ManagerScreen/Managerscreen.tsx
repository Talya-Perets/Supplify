import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../Sidebar/sidebar';
import styles from './ManagerScreen.styles';

// Define interfaces for different list item types
interface Supplier {
  id: string;
  companyName: string;
  totalOrdered: number;
  totalReturned: number;
  returnValue: number;
}

interface Employee {
  id: string;
  name: string;
  role: string;
}

// Mock data - you'll replace this with actual data from your backend
const mockSuppliers: Supplier[] = [
  {
    id: '1',
    companyName: 'ספק A',
    totalOrdered: 500,
    totalReturned: 50,
    returnValue: 1000,
  },
  {
    id: '2',
    companyName: 'ספק B',
    totalOrdered: 750,
    totalReturned: 100,
    returnValue: 2000,
  },
];

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'יוסי כהן',
    role: 'מנהל משמרת',
  },
  {
    id: '2',
    name: 'שרה לוי',
    role: 'עובד מחסן',
  },
];

const ManagementScreen = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'suppliers' | 'employees'>('suppliers');

  const handleDeleteEmployee = (employee: Employee) => {
    Alert.alert(
      'אישור מחיקת עובד',
      `האם אתה בטוח שברצונך למחוק את ${employee.name}?`,
      [
        { text: 'לא', style: 'cancel' },
        {
          text: 'כן',
          onPress: () => {
            // Implement delete logic here
            console.log(`Deleting employee ${employee.name}`);
          },
        },
      ]
    );
  };

  const renderSupplierItem = ({ item }: { item: Supplier }) => (
    <View style={styles.supplierCard}>
      <View style={styles.supplierHeader}>
        <Text style={styles.supplierName}>{item.companyName}</Text>
      </View>
      <View style={styles.supplierDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>הוזמן:</Text>
          <Text style={styles.detailText}>{item.totalOrdered}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>הוחזר:</Text>
          <Text style={styles.detailText}>{item.totalReturned}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>ערך החזרה:</Text>
          <Text style={styles.detailText}>{item.returnValue} ₪</Text>
        </View>
      </View>
    </View>
  );

  const renderEmployeeItem = ({ item }: { item: Employee }) => (
    <View style={styles.supplierCard}>
      <View style={styles.supplierHeader}>
        <Text style={styles.supplierName}>{item.name}</Text>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleDeleteEmployee(item)}
        >
          <Icon name="trash-2" size={20} color="#4A90E2" />
        </TouchableOpacity>
      </View>
      <View style={styles.supplierDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>תפקיד:</Text>
          <Text style={styles.detailText}>{item.role}</Text>
        </View>
      </View>
    </View>
  );

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
          <Text style={styles.headerTitle}>
            {activeTab === 'suppliers' ? 'רשימת ספקים' : 'רשימת עובדים'}
          </Text>
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[
                styles.tabButton, 
                activeTab === 'suppliers' && styles.activeTab
              ]}
              onPress={() => setActiveTab('suppliers')}
            >
              <Text style={styles.tabText}>ספקים</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.tabButton, 
                activeTab === 'employees' && styles.activeTab
              ]}
              onPress={() => setActiveTab('employees')}
            >
              <Text style={styles.tabText}>עובדים</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={activeTab === 'suppliers' ? mockSuppliers : mockEmployees}
          renderItem={activeTab === 'suppliers' ? renderSupplierItem : renderEmployeeItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
};

export default ManagementScreen;