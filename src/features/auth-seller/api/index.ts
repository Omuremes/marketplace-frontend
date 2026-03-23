import { apiClient } from '@/shared/api';

export const authSellerApi = {
  async register(name: string, email: string, password: string) {
    const res = await apiClient.post('/public/sellers/register', { name, email, password });
    return res.data;
  },
  
  async login(email: string, password: string) {
    const res = await apiClient.post('/public/sellers/login', { email, password });
    return res.data;
  }
};
