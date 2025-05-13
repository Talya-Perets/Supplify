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


  