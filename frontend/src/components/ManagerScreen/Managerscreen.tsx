import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../Sidebar/sidebar';
import styles from './ManagerScreen.styles';
import { LoginContext } from '../../contexts/LoginContext';
import { LoginContextType } from '../../contexts/UserContext';
import { doGetBusinessUsers, doDeleteUser } from '../../util/HTTPRequests';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';

// Define navigation type for this screen
type ManagerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Managerscreen'>;

// Define interfaces for different list item types
interface Supplier {
  id: string;
  companyName: string;
  totalOrdered: number;
  totalReturned: number;
  returnValue: number;
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  username: string; // Email
  phone: string;
  role: {
    name: string;
  };
}

// Mock data for suppliers - you'll replace this with actual data from your backend
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

const ManagementScreen = () => {
  const navigation = useNavigation<ManagerScreenNavigationProp>();
  const { userInfo } = useContext(LoginContext) as LoginContextType;
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'suppliers' | 'employees'>('suppliers');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch employees when the tab changes to 'employees'
  useEffect(() => {
    if (activeTab === 'employees') {
      fetchEmployees();
    }
  }, [activeTab]);

  // Function to fetch employees from the server
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the API to get all users for the business
      const response = await doGetBusinessUsers(userInfo.businessId);
      
      if (response.status === 200 && response.data) {
        // Filter out the current user (don't show the logged-in user in the list)
        const filteredEmployees = response.data.filter(
          (employee: Employee) => employee.id !== userInfo.userId
        );
        setEmployees(filteredEmployees);
      } else {
        setError('Failed to fetch employees. Please try again.');
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('An error occurred while fetching employees.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle employee deletion
  const handleDeleteEmployee = (employee: Employee) => {
    Alert.alert(
      'אישור מחיקת עובד',
      `האם אתה בטוח שברצונך למחוק את ${employee.firstName} ${employee.lastName}?`,
      [
        { text: 'לא', style: 'cancel' },
        {
          text: 'כן',
          style: 'destructive',
          // onPress: async () => {
          //   try {
          //     setLoading(true);
              
          //     // Call the API to delete the user
          //     const response = await doDeleteUser(employee.id);
              
          //     if (response.status === 200) {
          //       // Remove the employee from the list
          //       setEmployees(employees.filter(emp => emp.id !== employee.id));
          //       Alert.alert('הצלחה', 'העובד נמחק בהצלחה');
          //     } else {
          //       Alert.alert('שגיאה', 'מחיקת העובד נכשלה. אנא נסה שוב.');
          //     }
          //   } catch (error) {
          //     console.error('Error deleting employee:', error);
          //     Alert.alert('שגיאה', 'אירעה שגיאה בעת מחיקת העובד.');
          //   } finally {
          //     setLoading(false);
          //   }
          // },
        },
      ]
    );
  };

  // Function to navigate to employee registration screen
  const navigateToAddEmployee = () => {
    navigation.navigate('EmployeeRegistration');
  };

  // Render supplier item
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

  // Render employee item
  const renderEmployeeItem = ({ item }: { item: Employee }) => (
    <View style={styles.supplierCard}>
      <View style={styles.supplierHeader}>
        <Text style={styles.supplierName}>{item.firstName} {item.lastName}</Text>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleDeleteEmployee(item)}
        >
          <Icon name="trash-2" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
      <View style={styles.supplierDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>תפקיד:</Text>
          <Text style={styles.detailText}>{item.role.name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>אימייל:</Text>
          <Text style={styles.detailText}>{item.username}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>טלפון:</Text>
          <Text style={styles.detailText}>{item.phone}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
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

          {/* Add New Employee Button (only visible in employees tab) */}
          {activeTab === 'employees' && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={navigateToAddEmployee}
            >
              <Icon name="user-plus" size={20} color="white" style={styles.buttonIcon} />
              <Text style={styles.addButtonText}>הוסף עובד חדש</Text>
            </TouchableOpacity>
          )}

          {/* Loading indicator */}
          {loading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#4A90E2" />
              <Text style={styles.loadingText}>טוען נתונים...</Text>
            </View>
          ) : error && activeTab === 'employees' ? (
            <View style={styles.centerContent}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={fetchEmployees}
              >
                <Text style={styles.retryButtonText}>נסה שנית</Text>
              </TouchableOpacity>
            </View>
          ) : activeTab === 'employees' && employees.length === 0 ? (
            <View style={styles.centerContent}>
              <Text style={styles.emptyText}>אין עובדים להצגה</Text>
            </View>
          ) : (
            <FlatList
              data={activeTab === 'suppliers' ? mockSuppliers : employees}
              renderItem={activeTab === 'suppliers' ? renderSupplierItem : renderEmployeeItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ManagementScreen;