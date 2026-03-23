import { apiClient } from '@/shared/api';
import type { PaginatedProducts, ProductDetails } from '../model/types';

export const productApi = {
  /**
   * Получить список товаров с пагинацией (курсор)
   */
  async getPublicProducts(limit = 20, cursor?: string | null, search?: string | null): Promise<PaginatedProducts> {
    const params: Record<string, string | number> = { limit };
    if (cursor) {
      params.cursor = cursor;
    }
    if (search) {
      params.search = search;
    }
    const response = await apiClient.get<PaginatedProducts>('/public/products', { params });
    return response.data;
  },

  /**
   * Получить детали товара (атрибуты + офферы)
   */
  async getProductDetails(id: string): Promise<ProductDetails> {
    const response = await apiClient.get<ProductDetails>(`/public/products/${id}`);
    return response.data;
  }
};
