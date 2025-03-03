import axios, { AxiosInstance } from 'axios';
import { OrderCartDto } from '../dto';
import { IOrderCartRpc } from '../order.interface';
import { ApiResponseDto } from 'src/share/dto';

export class OrderCartRpc implements IOrderCartRpc {
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string, token: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: token,
      },
    });
  }

  async getCartByUserId(userId: string): Promise<OrderCartDto | null> {
    try {
      const { data } = await this.axiosInstance.post<
        ApiResponseDto<OrderCartDto>
      >(`/internal/carts/`, { userId });
      return data.data;
    } catch (error) {
      console.error(
        '[ERROR] ********** OrderCartRpc getCartByUserId error:',
        error.response?.data || error.message,
      );
    }
    return null;
  }

  async deleteCartItemByIds(ids: string[]): Promise<boolean> {
    try {
      const { data } = await this.axiosInstance.post<ApiResponseDto<boolean>>(
        `/internal/carts/items/delete`,
        { ids },
      );
      return !!data.data;
    } catch (error) {
      console.error(
        '[ERROR] ********** OrderCartRpc deleteCartItemByIds error:',
        error.response?.data || error.message,
      );
    }
    return false;
  }
}
