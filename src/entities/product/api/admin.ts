import { apiClient } from '@/shared/api';
import type { ProductAttribute, Money } from '../model/types';

export interface AdminProductCreate {
  name: string;
  price: Money;
  stock: number;
  attributes: ProductAttribute[];
}

export interface AdminProductResponse {
  id: string;
  name: string;
  price: Money;
  stock: number;
  image_url?: string;
  thumbnail_url?: string;
  attributes: ProductAttribute[];
}

export interface AdminPaginatedProducts {
  items: AdminProductResponse[];
  next_cursor?: string;
}

export const adminProductApi = {
  async getList(limit = 50, cursor?: string | null, search?: string | null): Promise<AdminPaginatedProducts> {
    const params: Record<string, any> = { limit };
    if (cursor) params.cursor = cursor;
    if (search) params.search = search;
    const res = await apiClient.get<AdminPaginatedProducts>('/admin/products', { params });
    return res.data;
  },

  async getOne(id: string): Promise<AdminProductResponse> {
    const res = await apiClient.get<AdminProductResponse>(`/admin/products/${id}`);
    return res.data;
  },

  async create(data: AdminProductCreate): Promise<AdminProductResponse> {
    const res = await apiClient.post<AdminProductResponse>('/admin/products', data);
    return res.data;
  },

  async update(id: string, data: Partial<AdminProductCreate>): Promise<AdminProductResponse> {
    const res = await apiClient.put<AdminProductResponse>(`/admin/products/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/admin/products/${id}`);
  },

  async uploadImage(id: string, file: File): Promise<{ image_url: string; thumbnail_url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post(`/admin/products/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }
};
