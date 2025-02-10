import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../../components/sidebar-component';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../App'; 
import { StackNavigationProp } from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';



type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [userRole] = useState<'manager' | 'employee'>('manager');
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    const pendingOrders = [
    {
      id: '1234',
      description: 'הזמנה חדשה מ-ספק A',
      date: '01/01/2025'
    },
    {
      id: '1235',
      description: 'הזמנה חדשה מ-ספק B',
      date: '31/12/2024'
    }
  ];


  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.content}>
            {isSidebarVisible && <Sidebar userRole={userRole} />}
            <View style={styles.mainContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setIsSidebarVisible(!isSidebarVisible)}>
                        <Icon name={isSidebarVisible ? "x" : "menu"} size={24} color="#4A90E2" />
                    </TouchableOpacity>
                    <Text style={styles.pageTitle}>דף הבית</Text>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity style={styles.cartButton}>
                            <Icon name="shopping-cart" size={24} color="#4A90E2" />
                        </TouchableOpacity>
                        <View style={styles.notificationContainer}>
                            <Icon name="bell" size={24} color="#4A90E2" />
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>3</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <ScrollView style={styles.scrollView}>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>הזמנות ממתינות לאישור</Text>
                        {pendingOrders.map(order => (
                            <View key={order.id} style={styles.orderItem}>
                                <View style={styles.orderInfo}>
                                    <Text style={styles.orderDescription}>{order.description}</Text>
                                    <Text style={styles.orderDate}>{order.date}</Text>
                                </View>
                                <TouchableOpacity style={styles.approveButton}>
                                    <Text style={styles.approveButtonText}>אשר הזמנה</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </View>
    </SafeAreaView>
);
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#F6F7FC',
},
content: {
    flex: 1,
    flexDirection: 'row-reverse', // שינוי לימין לשמאל
},
mainContent: {
    flex: 1,
},
header: {
    flexDirection: 'row-reverse', // שינוי לימין לשמאל
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
},
headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
},
notificationContainer: {
    marginLeft: 16,
    position: 'relative',
},
cartButton: {  
    padding: 8,
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
pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E3A59',
},
    scrollView: {
      padding: 16,
    },
    card: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#2E3A59',
      marginBottom: 16,
      textAlign: 'right',
    },
    orderItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#F8F9FF',
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
    },
    orderInfo: {
      flex: 1,
      marginRight: 12,
    },
    orderDescription: {
      fontSize: 14,
      color: '#2E3A59',
      textAlign: 'right',
    },
    orderDate: {
      fontSize: 12,
      color: '#8F9BB3',
      textAlign: 'right',
      marginTop: 4,
    },
    approveButton: {
      backgroundColor: '#4A90E2',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    approveButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '500',
    },
    quickActionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 16,
    },
    quickActionButton: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      width: '48%',
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    quickActionText: {
      marginTop: 8,
      fontSize: 14,
      color: '#2E3A59',
      textAlign: 'center',
    },
  });

export default HomeScreen;