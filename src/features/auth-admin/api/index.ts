import { apiClient } from '@/shared/api';

export const authAdminApi = {
  async login(username: string, password: string) {
    // Note: OAuth2PasswordBearer usually expects application/x-www-form-urlencoded
    // But we swapped to HTTPBearer + JSON login according to Session 5 logs
    const res = await apiClient.post('/admin/auth/login', { username, password });
    return res.data;
  }
};
