import axios, { AxiosInstance } from 'axios';
import { ProductCategoryDto } from '../dto';
import { IProductCategoryRpc } from '../product.interface';
import { ApiResponseDto } from 'src/share/dto';

export class ProductCategoryRpc implements IProductCategoryRpc {
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string, token: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: token,
      },
    });
  }

  async get(id: string): Promise<ProductCategoryDto | null> {
    try {
      const { data } = await this.axiosInstance.get<
        ApiResponseDto<ProductCategoryDto>
      >(`/internal/categories/${id}`);
      return data.data;
    } catch (error) {
      console.error(
        '[ERROR] ********** ProductCategoryRpc get error:',
        error.response?.data || error.message,
      );
    }
    return null;
  }
}
