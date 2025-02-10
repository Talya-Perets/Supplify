import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../../components/sidebar-component';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import styles from './Home.styles';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [userRole] = useState<'manager' | 'employee'>('manager');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const pendingOrders = [
    {
      id: '1234',
      description: 'הזמנה חדשה מ-ספק A',
      date: '01/01/2025',
    },
    {
      id: '1235',
      description: 'הזמנה חדשה מ-ספק B',
      date: '31/12/2024',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {isSidebarVisible && <Sidebar userRole={userRole} />}
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
                    <Text style={styles.orderDescription}>
                      {order.description}
                    </Text>
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

export default HomeScreen;
