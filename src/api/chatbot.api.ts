import { httpClient } from './httpClient';

export const chatbotApi = {
  sendMessage: async (message: string) => {
    const response = await httpClient.post('/chatbot/message', { message });
    return response.data;
  },
};
