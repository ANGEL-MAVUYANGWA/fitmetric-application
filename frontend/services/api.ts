// services/api.ts
// API service for communicating with the Spring Boot backend

// Use a hardcoded URL for now to avoid import.meta issues
const API_BASE_URL = 'http://localhost:5000/api';

export interface User {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
}

export interface AuthResponse {
  userId: string;
  email: string;
  name: string;
  token: string;
  tokenType: string;
  premium: boolean;
  expiresIn: number;
}

export interface WeightLog {
  id: string;
  date: string;
  weight: number;
  timeOfDay?: string;
  note?: string;
}

export interface NutritionEntry {
  id: string;
  date: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface BodyMeasurement {
  id: string;
  date: string;
  waistCm?: number;
  chestCm?: number;
  hipsCm?: number;
  thighsCm?: number;
  armsCm?: number;
  neckCm?: number;
}

export interface WaterLog {
  id: string;
  date: string;
  amountMl: number;
}

export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  type: string;
  purpose?: string;
  frequency: string;
}

export interface SupplementLog {
  id: string;
  supplementId: string;
  date: string;
  taken: boolean;
}

export interface PlannedMeal {
  id: string;
  dayOfWeek: number;
  mealType: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients?: string[];
}

export interface UserProfile {
  name: string;
  age: number;
  startingWeight: number;
  targetWeight: number;
  goalType: string;
  weeklyWeightLossGoal: number;
  dailyCalorieGoal: number;
  dailyWaterGoal: number;
  height: number;
  gender: string;
  isPremium: boolean;
  reminders: any[];
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('fitmetric_current_user');
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
      this.clearToken();
      window.dispatchEvent(new CustomEvent('auth:logout'));
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch {
        // Ignore JSON parsing error
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // ==================== AUTHENTICATION ENDPOINTS ====================

  async signup(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    this.setToken(response.token);
    return response;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.token);
    return response;
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  async upgradeToPremium(userId: string): Promise<{ success: boolean; message: string }> {
    return this.request('/auth/upgrade', {
      method: 'POST',
      headers: { 'X-User-Id': userId },
    });
  }

  // ==================== WEIGHT TRACKING ENDPOINTS ====================

  async addWeightLog(userId: string, data: { weight: number; date: string; timeOfDay?: string; note?: string }): Promise<WeightLog> {
    return this.request('/weight/log', {
      method: 'POST',
      headers: { 'X-User-Id': userId },
      body: JSON.stringify(data),
    });
  }

  async getWeightLogs(userId: string): Promise<WeightLog[]> {
    return this.request('/weight/logs', {
      headers: { 'X-User-Id': userId },
    });
  }

  async deleteWeightLog(userId: string, logId: string): Promise<{ success: boolean }> {
    return this.request(`/weight/log/${logId}`, {
      method: 'DELETE',
      headers: { 'X-User-Id': userId },
    });
  }

  // ==================== NUTRITION TRACKING ENDPOINTS ====================

  async addNutritionEntry(userId: string, data: { name: string; date: string; calories: number; protein: number; carbs: number; fat: number }): Promise<NutritionEntry> {
    return this.request('/nutrition/log', {
      method: 'POST',
      headers: { 'X-User-Id': userId },
      body: JSON.stringify(data),
    });
  }

  async getNutritionEntries(userId: string): Promise<NutritionEntry[]> {
    return this.request('/nutrition/logs', {
      headers: { 'X-User-Id': userId },
    });
  }

  async deleteNutritionEntry(userId: string, entryId: string): Promise<{ success: boolean }> {
    return this.request(`/nutrition/log/${entryId}`, {
      method: 'DELETE',
      headers: { 'X-User-Id': userId },
    });
  }

  // ==================== WATER TRACKING ENDPOINTS ====================

  async addWaterLog(userId: string, date: string, amountMl: number): Promise<WaterLog> {
    return this.request('/water/log', {
      method: 'POST',
      headers: { 'X-User-Id': userId },
      body: JSON.stringify({ date, amountMl }),
    });
  }

  async getWaterLogs(userId: string): Promise<WaterLog[]> {
    return this.request('/water/logs', {
      headers: { 'X-User-Id': userId },
    });
  }

  async deleteWaterLog(userId: string, logId: string): Promise<{ success: boolean }> {
    return this.request(`/water/log/${logId}`, {
      method: 'DELETE',
      headers: { 'X-User-Id': userId },
    });
  }

  // ==================== BODY MEASUREMENTS ENDPOINTS ====================

  async addMeasurement(userId: string, data: { date: string; waistCm?: number; chestCm?: number; hipsCm?: number; thighsCm?: number; armsCm?: number; neckCm?: number }): Promise<BodyMeasurement> {
    return this.request('/measurements', {
      method: 'POST',
      headers: { 'X-User-Id': userId },
      body: JSON.stringify(data),
    });
  }

  async getMeasurements(userId: string): Promise<BodyMeasurement[]> {
    return this.request('/measurements', {
      headers: { 'X-User-Id': userId },
    });
  }

  async deleteMeasurement(userId: string, measurementId: string): Promise<{ success: boolean }> {
    return this.request(`/measurements/${measurementId}`, {
      method: 'DELETE',
      headers: { 'X-User-Id': userId },
    });
  }

  // ==================== SUPPLEMENT ENDPOINTS ====================

  async addSupplement(userId: string, data: { name: string; dosage: string; type: string; purpose?: string; frequency: string }): Promise<Supplement> {
    return this.request('/supplements', {
      method: 'POST',
      headers: { 'X-User-Id': userId },
      body: JSON.stringify(data),
    });
  }

  async getSupplements(userId: string): Promise<Supplement[]> {
    return this.request('/supplements', {
      headers: { 'X-User-Id': userId },
    });
  }

  async deleteSupplement(userId: string, supplementId: string): Promise<{ success: boolean }> {
    return this.request(`/supplements/${supplementId}`, {
      method: 'DELETE',
      headers: { 'X-User-Id': userId },
    });
  }

  async logSupplement(userId: string, supplementId: string, date: string): Promise<SupplementLog> {
    return this.request(`/supplements/${supplementId}/log?date=${date}`, {
      method: 'POST',
      headers: { 'X-User-Id': userId },
    });
  }

  async unlogSupplement(userId: string, logId: string): Promise<{ success: boolean }> {
    return this.request(`/supplements/log/${logId}`, {
      method: 'DELETE',
      headers: { 'X-User-Id': userId },
    });
  }

  async getSupplementLogs(userId: string, date: string): Promise<SupplementLog[]> {
    return this.request(`/supplements/logs?date=${date}`, {
      headers: { 'X-User-Id': userId },
    });
  }

  // ==================== MEAL PLAN ENDPOINTS ====================

  async getMealPlan(userId: string): Promise<PlannedMeal[]> {
    return this.request('/meal-plan', {
      headers: { 'X-User-Id': userId },
    });
  }

  async saveMealPlan(userId: string, meals: any[]): Promise<PlannedMeal[]> {
    return this.request('/meal-plan', {
      method: 'POST',
      headers: { 'X-User-Id': userId },
      body: JSON.stringify({ meals }),
    });
  }

  async deleteMealPlan(userId: string): Promise<{ success: boolean }> {
    return this.request('/meal-plan', {
      method: 'DELETE',
      headers: { 'X-User-Id': userId },
    });
  }

  // ==================== USER PROFILE ENDPOINTS ====================

  async getUserProfile(userId: string): Promise<UserProfile> {
    return this.request('/user/profile', {
      headers: { 'X-User-Id': userId },
    });
  }

  async updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    return this.request('/user/profile', {
      method: 'PUT',
      headers: { 'X-User-Id': userId },
      body: JSON.stringify(profileData),
    });
  }

  async getDashboardSummary(userId: string): Promise<any> {
    return this.request('/user/dashboard-summary', {
      headers: { 'X-User-Id': userId },
    });
  }

  async getUserInfo(userId: string): Promise<any> {
    return this.request('/user/info', {
      headers: { 'X-User-Id': userId },
    });
  }
}

export const apiService = new ApiService();