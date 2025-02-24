import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../Sidebar/sidebar';
import {API_BASE_URL, RootStackParamList} from '../../../App';
import {Alert} from 'react-native';
import styles from './SuppliersList.styles';
import {doGet, doPost} from '../../util/HTTPRequests';
import {globals} from '../../util/Globals';
import {LoginContext} from '../../contexts/LoginContext';
import {LoginContextType} from '../../contexts/UserContext';
import {SupplierDetails, Agent} from '../../types/models';

type SuppliersListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SuppliersList'
>;

const SuppliersListScreen = () => {
  const navigation = useNavigation<SuppliersListScreenNavigationProp>();
  const {userInfo} = useContext(LoginContext) as LoginContextType;
  const [suppliers, setSuppliers] = useState<SupplierDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [editingAgent, setEditingAgent] = useState<string | null>(null);
  const [editedAgent, setEditedAgent] = useState<Agent>();

  useEffect(() => {
    const getBusinessSuppliersAndAgents = async () => {
      setIsLoading(true);
      try {
        const response = await doGet(
          `${globals.BUSINESS.getBusinessSuppliersAndAgents}/${userInfo.businessId}`,
        );
        if (response.data) {
          setSuppliers(response.data);
        } else {
          throw new Error('No data received from API');
        }
      } catch (error) {
        console.error('Error fetching suppliers:', error);
        Alert.alert('שגיאה', 'אירעה שגיאה בטעינת רשימת הספקים');
      } finally {
        setIsLoading(false);
      }
    };
    getBusinessSuppliersAndAgents();
  }, []);

  const handleEditAgent = (supplier: SupplierDetails) => {
    setEditingAgent(supplier.companyName);
    setEditedAgent({...supplier.agent});
  };

  const handleSaveAgent = async (supplier: SupplierDetails) => {
    try {
      const response = await doPost(
        `${globals.BUSINESS.updateAgent}/${userInfo.businessId}`,
        {
          id: supplier.agent.id,
          name: editedAgent?.name,
          phone: editedAgent?.phone,
          email: editedAgent?.email,
        },
      );

      if (response.status === 200) {
        setSuppliers(prevSuppliers =>
          prevSuppliers.map(s =>
            s.companyName === supplier.companyName
              ? {
                  ...s,
                  agent: {
                    id: supplier.agent?.id ?? 0,
                    name: editedAgent?.name ?? supplier.agent.name,
                    email: editedAgent?.email ?? supplier.agent.email,
                    phone: editedAgent?.phone ?? supplier.agent.phone,
                  },
                }
              : s,
          ),
        );
        setEditingAgent(null);
      } else {
        throw new Error(response.data.message || 'Failed to update supplier');
      }
    } catch (error) {
      console.error('Error updating supplier:', error);
      Alert.alert('שגיאה', 'אירעה שגיאה בעדכון הספק');
    }
  };

  const handleDeleteSupplier = async (supplier: SupplierDetails) => {
    Alert.alert('אישור הסרת ספק', 'האם אתה בטוח שברצונך להסיר ספק זה?', [
      {
        text: 'לא',
        style: 'cancel',
      },
      {
        text: 'כן',
        onPress: async () => {
          console.log('מחיקת ספק:', supplier);
          try {
            const response = await doPost(
              `${globals.BUSINESS.deleteSupplierFromBusiness}${userInfo.businessId}`,
              {agentid: supplier.agent.id},
            );

            if (response.status === 200) {
              setSuppliers(prevSuppliers =>
                prevSuppliers.filter(
                  s => s.companyName !== supplier.companyName,
                ),
              );
            } else {
              throw new Error(
                response.data.message || 'Failed to delete supplier',
              );
            }
          } catch (error) {
            console.error('Error deleting supplier:', error);
            Alert.alert('שגיאה', 'אירעה שגיאה במחיקת הספק');
          }
        },
      },
    ]);
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
          <Text style={styles.headerTitle}>רשימת ספקים</Text>
          {userInfo.userRole === 'Manager' && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddSupplier')}>
              <Icon name="plus" size={24} color="#4A90E2" />
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={suppliers}
          renderItem={({item}) => (
            <View style={styles.supplierCard}>
              <View style={styles.supplierHeader}>
                <Text style={styles.supplierName}>{item.companyName}</Text>
                {userInfo.userRole === 'Manager' && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      onPress={
                        () =>
                          editingAgent === item.companyName
                            ? handleSaveAgent(item) // Save when already editing
                            : handleEditAgent(item) // Edit otherwise
                      }
                      style={styles.actionButton}>
                      <Icon
                        name={
                          editingAgent === item.companyName ? 'save' : 'edit-2'
                        }
                        size={20}
                        color="#4A90E2"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteSupplier(item)}
                      style={styles.actionButton}>
                      <Icon name="trash-2" size={20} color="#4A90E2" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <View style={styles.supplierDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>סוכן :</Text>
                  {editingAgent === item.companyName ? (
                    <TextInput
                      style={styles.input}
                      value={editedAgent?.name ?? item.agent.name}
                      onChangeText={text =>
                        setEditedAgent(prev => ({...prev!, name: text}))
                      }
                    />
                  ) : (
                    <Text style={styles.detailText}>{item.agent.name}</Text>
                  )}
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>טלפון:</Text>
                  {editingAgent === item.companyName ? (
                    <TextInput
                      style={styles.input}
                      value={editedAgent?.phone ?? item.agent.phone}
                      onChangeText={text =>
                        setEditedAgent(prev => ({...prev!, phone: text}))
                      }
                    />
                  ) : (
                    <Text style={styles.detailText}>{item.agent.phone}</Text>
                  )}
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>מייל:</Text>
                  {editingAgent === item.companyName ? (
                    <TextInput
                      style={styles.input}
                      value={editedAgent?.email ?? item.agent.email}
                      onChangeText={text =>
                        setEditedAgent(prev => ({...prev!, email: text}))
                      }
                    />
                  ) : (
                    <Text style={styles.detailText}>{item.agent.email}</Text>
                  )}
                </View>
              </View>
            </View>
          )}
          keyExtractor={item => item.companyName.toString()}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
};

export default SuppliersListScreen;
