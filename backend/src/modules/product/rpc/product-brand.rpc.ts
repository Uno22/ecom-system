import axios, { AxiosInstance } from 'axios';
import { ProductBrandDto } from '../dto';
import { IProductBrandRpc } from '../product.interface';
import { ApiResponseDto } from 'src/share/dto';

export class ProductBrandRpc implements IProductBrandRpc {
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string, token: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: token,
      },
    });
  }

  async get(id: string): Promise<ProductBrandDto | null> {
    try {
      const { data } = await this.axiosInstance.get<
        ApiResponseDto<ProductBrandDto>
      >(`/internal/brands/${id}`);
      return data.data;
    } catch (error) {
      console.error(
        '[ERROR] ********** ProductBrandRpc get error:',
        error.response?.data || error.message,
      );
    }
    return null;
  }
}
