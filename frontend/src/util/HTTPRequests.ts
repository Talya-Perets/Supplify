import axios from 'axios';
import { globals } from '../util/Globals'; 
export const doGet = async (url: string, params?: any) => {
    try {
        const response = await axios.get(url, { 
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
        },
          params });
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const doPost = async (url: string, data: any, params?: any) => {
    try {
        const response = await axios.post(url, data, {params});
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const doPostAddProduct = async (url: string, data: any, params?: any) => {
    try {
      const response = await axios.post(url, data, {
        params,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
    
  };
  // Function to get all users for a business
export const doGetBusinessUsers = async (businessId: number) => {
  try {
    const url = `${globals.USER.getBusinessUsers}/${businessId}`;
    console.log('Fetching users for business ID:', businessId);
    
    const response = await doGet(url);
    return response;
  } catch (error) {
    console.error('Error fetching business users:', error);
    throw error;
  }
};

// Function to delete a user
export const doDeleteUser = async (userId: number) => {
  try {
    const url = `${globals.USER.deleteUser}/${userId}`;
    console.log('Deleting user with ID:', userId);
    
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
  