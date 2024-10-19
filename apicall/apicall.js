import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = "http://192.168.0.213:813/GMPMob";
const createAxiosInstance = async () => {
  const token = await AsyncStorage.getItem('token') || '';
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.replace(/"/g, '')}`,
      "Accept": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    },
  });
};

export const getTemplate = async (endpoint) => {
  const axiosInstance = await createAxiosInstance();
  try {
    const response = await axiosInstance.get(endpoint, { responseType: 'blob' });
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getFromAPI = async (endpoint) => {
  const axiosInstance = await createAxiosInstance();
  try {
    const response = await axiosInstance.get(endpoint);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const postToAPI = async (endpoint, data) => {
  const axiosInstance = await createAxiosInstance();
  try {
    const response = await axiosInstance.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
