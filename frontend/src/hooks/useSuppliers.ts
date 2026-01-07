// src/hooks/supplierHooks.ts
import { useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import { doGet, doPost } from '../util/HTTPRequests';
import { globals } from '../util/Globals';
import { Supplier, SupplierDetails, Agent } from '../types/models';
import { LoginContext } from '../contexts/LoginContext';
import { LoginContextType } from '../contexts/UserContext';

// Type for supplier/agent form data
interface SupplierFormData {
  companyName: string;
  name: string;
  email: string;
  phone: string;
}

// Shared state between hooks
let suppliersUpdated = false;
const toggleSuppliersUpdated = () => {
  suppliersUpdated = !suppliersUpdated;
};

// Hook for adding suppliers and agents
export const useSupplierForm = () => {
  const { userInfo } = useContext(LoginContext) as LoginContextType;
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [supplierData, setSupplierData] = useState<SupplierFormData>({
    companyName: '',
    name: '',
    email: '',
    phone: '',
  });

  // Handle supplier selection change
  const handleSupplierChange = (value: number) => {
    setSelectedSupplierId(value);

    if (value !== -1) {
      setSupplierData(prev => ({ ...prev, companyName: '' }));
    }
  };

  // Reset form
  const resetForm = () => {
    setSupplierData({
      companyName: '',
      name: '',
      email: '',
      phone: '',
    });
    setSelectedSupplierId(-1);
  };

  // Add supplier or agent
  const handleAddSupplier = async () => {
    if (!supplierData.name || !supplierData.email || !supplierData.phone) {
      Alert.alert('Error', 'Please fill in all required details');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // If existing supplier is selected - add agent
      if (selectedSupplierId !== -1) {
        const response = await doPost(globals.AGENTS.addAgent, {
          supplierId: selectedSupplierId,
          businessId: userInfo.businessId,
          name: supplierData.name,
          email: supplierData.email,
          phone: supplierData.phone,
        });

        if (response.status === 200) {
          Alert.alert('Success', 'Agent added successfully', [{ text: 'OK' }]);
          resetForm();
          toggleSuppliersUpdated(); // Trigger refresh
        } else {
          throw new Error(response.data.message || 'Failed to add agent');
        }
        return;
      }

      // If no supplier selected and company name provided - add new supplier
      if (supplierData.companyName) {
        const response = await doPost(globals.SUPPLIERS.createSupplier, {
          companyName: supplierData.companyName,
          name: supplierData.name,
          email: supplierData.email,
          phone: supplierData.phone,
          businessId: userInfo.businessId,
        });

        if (response.status === 200) {
          Alert.alert('Success', 'Supplier added successfully', [{ text: 'OK' }]);
          resetForm();
          toggleSuppliersUpdated(); // Trigger refresh
        } else {
          throw new Error(response.data.message || 'Failed to add supplier');
        }
        return;
      }

      Alert.alert('Error', 'Please fill in all supplier details');
    } catch (error) {
      console.error('Error:', error);
      setError('Network error. Please try again.');
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all suppliers (for dropdown selection)
  const fetchAllSuppliers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await doGet(globals.SUPPLIERS.getAllSuppliers);
      if (response.status === 200) {
        setSuppliers(response.data);
      } else {
        throw new Error('Failed to fetch suppliers');
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setError('Error fetching suppliers');
    } finally {
      setLoading(false);
    }
  };

  // Load suppliers for dropdown selection
  useEffect(() => {
    fetchAllSuppliers();
  }, [suppliersUpdated]);

  return {
    suppliers,
    supplierData,
    setSupplierData,
    selectedSupplierId,
    loading,
    error,
    handleSupplierChange,
    handleAddSupplier,
    resetForm
  };
};

// Hook for managing supplier list
export const useSupplierList = () => {
  const { userInfo } = useContext(LoginContext) as LoginContextType;
  const [suppliersList, setSuppliersList] = useState<SupplierDetails[]>([]);
  const [editingAgent, setEditingAgent] = useState<string | null>(null);
  const [editedAgent, setEditedAgent] = useState<Agent | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch business suppliers and agents
  const fetchBusinessSuppliersAndAgents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await doGet(
        `${globals.BUSINESS.getBusinessSuppliersAndAgents}/${userInfo.businessId}`,
      );
      if (response.data) {
        setSuppliersList(response.data);
      } else {
        throw new Error('No data received from API');
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setError('Error loading suppliers list');
      Alert.alert('Error', 'Error loading suppliers list');
    } finally {
      setLoading(false);
    }
  };

  // Start editing agent
  const handleEditAgent = (supplier: SupplierDetails) => {
    setEditingAgent(supplier.companyName);
    setEditedAgent({...supplier.agent});
  };

  // Save agent details
  const handleSaveAgent = async (supplier: SupplierDetails) => {
    setLoading(true);
    setError(null);
    
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
        setSuppliersList(prevSuppliers =>
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
        toggleSuppliersUpdated(); // Trigger refresh
      } else {
        throw new Error(response.data.message || 'Failed to update supplier');
      }
    } catch (error) {
      console.error('Error updating supplier:', error);
      setError('Error updating supplier');
      Alert.alert('Error', 'Error updating supplier');
    } finally {
      setLoading(false);
    }
  };

  // Delete supplier
  const handleDeleteSupplier = async (supplier: SupplierDetails, confirmDelete: boolean = true) => {
    const deleteSupplier = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await doPost(
          `${globals.BUSINESS.deleteSupplierFromBusiness}${userInfo.businessId}`,
          {agentid: supplier.agent.id},
        );

        if (response.status === 200) {
          setSuppliersList(prevSuppliers =>
            prevSuppliers.filter(
              s => s.companyName !== supplier.companyName,
            ),
          );
          toggleSuppliersUpdated(); // Trigger refresh
        } else {
          throw new Error(
            response.data.message || 'Failed to delete supplier',
          );
        }
      } catch (error) {
        console.error('Error deleting supplier:', error);
        setError('Error deleting supplier');
        Alert.alert('Error', 'Error deleting supplier');
      } finally {
        setLoading(false);
      }
    };

    if (confirmDelete) {
      Alert.alert('Confirm Supplier Removal', 'Are you sure you want to remove this supplier?', [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: deleteSupplier,
        },
      ]);
    } else {
      await deleteSupplier();
    }
  };

  // Update edited agent field
  const updateEditedAgentField = (field: keyof Agent, value: string) => {
    setEditedAgent(prev => {
      if (!prev) return undefined;
      return { ...prev, [field]: value };
    });
  };

  // Load suppliers on initial load
  useEffect(() => {
    fetchBusinessSuppliersAndAgents();
  }, [suppliersUpdated]);

  return {
    suppliersList,
    loading,
    error,
    editingAgent,
    editedAgent,
    fetchBusinessSuppliersAndAgents,
    handleEditAgent,
    handleSaveAgent,
    handleDeleteSupplier,
    updateEditedAgentField
  };
};

// Legacy hook for backward compatibility
// (אופציונלי - אם תרצה לשמור על תאימות לאחור)
export const useSuppliers = () => {
  const supplierForm = useSupplierForm();
  const supplierList = useSupplierList();
  
  return {
    // Shared states
    loading: supplierForm.loading || supplierList.loading,
    error: supplierForm.error || supplierList.error,
    
    // From useSupplierForm
    suppliers: supplierForm.suppliers,
    supplierData: supplierForm.supplierData,
    setSupplierData: supplierForm.setSupplierData,
    selectedSupplierId: supplierForm.selectedSupplierId,
    handleSupplierChange: supplierForm.handleSupplierChange,
    handleAddSupplier: supplierForm.handleAddSupplier,
    resetForm: supplierForm.resetForm,
    
    // From useSupplierList
    suppliersList: supplierList.suppliersList,
    fetchBusinessSuppliersAndAgents: supplierList.fetchBusinessSuppliersAndAgents,
    editingAgent: supplierList.editingAgent,
    editedAgent: supplierList.editedAgent,
    handleEditAgent: supplierList.handleEditAgent,
    handleSaveAgent: supplierList.handleSaveAgent,
    handleDeleteSupplier: supplierList.handleDeleteSupplier,
    updateEditedAgentField: supplierList.updateEditedAgentField
  };
};

export default useSuppliers;