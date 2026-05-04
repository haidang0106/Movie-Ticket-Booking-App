import apiClient from '../api/apiClient';

export const customerService = {
  getProfile: async () => {
    const response = await apiClient.get('/customer/profile');
    return response.data;
  },

  updateProfile: async (payload: { FullName?: string; PhoneNumber?: string; DateOfBirth?: string; Gender?: string }) => {
    if (__DEV__) {
      console.log('[CustomerService] Updating profile with:', JSON.stringify(payload, null, 2));
    }
    const response = await apiClient.put('/customer/profile', payload);
    if (__DEV__) {
      console.log('[CustomerService] Update response:', response.data);
    }
    return response.data;
  },
};
