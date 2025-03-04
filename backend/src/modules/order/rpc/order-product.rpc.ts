import { ReserveProductItemDto } from 'src/modules/product-item/dto';
import { IOrderProductRpc } from '../order.interface';
import { ApiResponseDto } from 'src/share/dto';
import axios, { AxiosInstance } from 'axios';

export class OrderProductRpc implements IOrderProductRpc {
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string, token: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: token,
      },
    });
  }

  async reserveProduct(
    productItems: ReserveProductItemDto[],
  ): Promise<boolean> {
    try {
      const { data } = await this.axiosInstance.post<ApiResponseDto<boolean>>(
        `/internal/product-items/reserve`,
        { productItems },
      );
      return !!data.data;
    } catch (error) {
      console.error(
        '[ERROR] ********** OrderProductRpc reserveProduct error:',
        error.response?.data || error.message,
      );
    }
    return false;
  }
}
