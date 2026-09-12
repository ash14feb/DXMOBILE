import { AuthData, Card, Customer, HistoryResponse, RechargePackage, BillingRecord, RechargeHistoryResponse } from "../types";

const BASE_URL = 'https://dxmobileapi.vercel.app/mobapp_api';

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('mobapp_token', token);
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('mobapp_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('mobapp_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    
    const token = this.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    if (response.status === 401) {
      this.clearToken();
      window.location.reload();
      throw new Error('Unauthorized');
    }

    if (!response.ok || data.success === false) {
      throw new Error(data.message || 'API Error');
    }

    return data as T;
  }

  async sendOtp(phone: string) {
    return this.request<{success: boolean, message: string, data: {phone: string}}>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone })
    });
  }

  async verifyOtp(phone: string, otp: string) {
    return this.request<{success: boolean, data: AuthData}>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp })
    });
  }

  async getProfile() {
    return this.request<{success: boolean, data: Customer}>('/customer/profile');
  }

  async getCards() {
    return this.request<{success: boolean, data: Card[]}>('/customer/cards');
  }

  async getBalance(rfid: string) {
    return this.request<{success: boolean, data: {balance_main: number, balance_bonus: number}}>('/customer/balance/' + rfid);
  }

  async switchCard(rfid: string) {
    return this.request<{success: boolean, data: {token: string, customer: Customer}}>('/customer/switch-card', {
      method: 'POST',
      body: JSON.stringify({ rfid })
    });
  }

  async getHistory(rfid: string, limit = 20, offset = 0) {
    return this.request<{success: boolean, data: HistoryResponse}>(`/billing/history/${rfid}?limit=${limit}&offset=${offset}`);
  }

  async getRecent(rfid: string) {
    return this.request<{success: boolean, data: BillingRecord[]}>(`/billing/recent/${rfid}`);
  }

  async getRechargePackages() {
    return this.request<{success: boolean, data: RechargePackage[]}>('/recharges/packages');
  }

  async getRechargeHistory(rfid: string, limit = 20, offset = 0) {
    return this.request<{success: boolean, data: RechargeHistoryResponse}>(`/recharges/history/${rfid}?limit=${limit}&offset=${offset}`);
  }
}

export const api = new ApiClient();
