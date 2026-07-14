import { httpClient } from './httpClient'

export const walletsApi = {
  async getWallets() {
    const response = await httpClient.get('/wallets/balance')

    return response.data.data
  },
}