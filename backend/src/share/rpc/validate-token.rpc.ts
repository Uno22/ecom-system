import { IValidateTokenRpc, TokenPayload } from '../interfaces';
import axios from 'axios';

export class ValidateTokenRpc implements IValidateTokenRpc {
  constructor(readonly url: string) {}

  async validateToken(token: string): Promise<TokenPayload | null> {
    try {
      const { data } = await axios.post(`${this.url}/auth/validate-token`, {
        token,
      });
      return data.data;
    } catch (error) {
      console.info('[INFO] ********** validateToken token:', token);
      console.error(
        '[ERROR] ********** validateToken error:',
        error.response?.data || error.message,
      );
    }
    return null;
  }
}
