
import { SystemSettings } from '@/data/settingsData';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const API_BASE = '/api/settings';

export const settingsAPI = {
  async get(): Promise<ApiResponse<SystemSettings>> {
    const res = await fetch(API_BASE);
    return res.json();
  },

  async update(section: keyof SystemSettings, data: any): Promise<ApiResponse<SystemSettings>> {
    const res = await fetch(API_BASE, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, data }),
    });
    return res.json();
  }
};
