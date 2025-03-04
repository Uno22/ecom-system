import axios, { AxiosInstance } from 'axios';
import { ICartProductRpc } from '../cart.interface';
import { CartProductDto } from '../dto/cart-product.dto';
import { ApiResponseDto } from 'src/share/dto';

export class CartProductRpc implements ICartProductRpc {
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string, token: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: token,
      },
    });
  }

  async findById(id: string): Promise<CartProductDto | null> {
    try {
      const { data } = await this.axiosInstance.get<
        ApiResponseDto<CartProductDto>
      >(`/internal/product-items/${id}`);

      return data.data;
    } catch (error) {
      console.error(
        '[ERROR] ********** CartProductRpc findById get error:',
        error.response?.data || error.message,
      );
    }
    return null;
  }

  async findByIds(
    ids: string[],
    attributes?: string[],
  ): Promise<Array<CartProductDto>> {
    try {
      const { data } = await this.axiosInstance.post<
        ApiResponseDto<Array<CartProductDto>>
      >(`/internal/product-items/list-by-ids`, { ids, attributes });
      return data.data || [];
    } catch (error) {
      console.error(
        '[ERROR] ********** CartProductRpc findByIds get error:',
        error.response?.data || error.message,
      );
    }
    return [];
  }
}
