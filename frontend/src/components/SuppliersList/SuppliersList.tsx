// src/components/SuppliersList/SuppliersList.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../Sidebar/sidebar';
import { RootStackParamList } from '../../types/models';
import styles from './SuppliersList.styles';
import { LoginContext } from '../../contexts/LoginContext';
import { LoginContextType } from '../../contexts/UserContext';
import { useContext } from 'react';
import useSupplierList from '../../hooks/useSuppliers';

type SuppliersListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SuppliersList'
>;

const SuppliersListScreen = () => {
  const navigation = useNavigation<SuppliersListScreenNavigationProp>();
  const { userInfo } = useContext(LoginContext) as LoginContextType;
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  
  // השתמש בהוק useSuppliers
  const {
    suppliersList,
    loading,
    fetchBusinessSuppliersAndAgents,
    editingAgent,
    editedAgent,
    handleEditAgent,
    handleSaveAgent,
    handleDeleteSupplier,
    updateEditedAgentField
  } = useSupplierList();

  // טען את רשימת הספקים בעת טעינת המסך
  useEffect(() => {
    fetchBusinessSuppliersAndAgents();
  }, []);

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
        
        {loading ? (
          <View style={styles.loadingContainer }>
            <ActivityIndicator size="large" color="#4A90E2" />
          </View>
        ) : (
          <FlatList
            data={suppliersList}
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
                        onChangeText={text => updateEditedAgentField('name', text)}
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
                        onChangeText={text => updateEditedAgentField('phone', text)}
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
                        onChangeText={text => updateEditedAgentField('email', text)}
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
        )}
      </View>
    </SafeAreaView>
  );
};

export default SuppliersListScreen;