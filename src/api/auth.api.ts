import { httpClient } from './httpClient';

export const authApi = {
  login: async (credentials: any) => {
    const response = await httpClient.post('/auth/login', credentials);
    return response.data;
  },
};
