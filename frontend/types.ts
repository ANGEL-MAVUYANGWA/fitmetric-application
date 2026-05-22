
export interface UserAccount {
  id: string;
  email: string;
  password?: string; // In a real app, this would be hashed on the server
  name: string;
}

export interface WeightLog {
  id: string;
  date: string;
  weight: number;
  timeOfDay?: 'morning' | 'evening';
  note?: string;
}

export interface BodyMeasurement {
  id: string;
  date: string;
  waist?: number;
  chest?: number;
  hips?: number;
  thighs?: number;
  arms?: number;
  neck?: number;
}

export interface FoodEntry {
  id: string;
  date: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface PlannedMeal extends FoodEntry {
  dayOfWeek: number; // 0-6 (Sun-Sat)
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack1' | 'snack2' | 'snack3';
  ingredients?: string[];
}

export interface WaterLog {
  id: string;
  date: string;
  amount: number; // in ml
}

export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  type: 'vitamin' | 'medicine' | 'supplement';
  purpose?: string;
  frequency: 'daily' | 'weekly' | 'as-needed';
}

export interface SupplementLog {
  id: string;
  supplementId: string;
  date: string;
  taken: boolean;
}

export interface Reminder {
  id: string;
  title: string;
  time: string; // "HH:MM"
  type: 'weight' | 'nutrition' | 'water' | 'general' | 'medicine';
  enabled: boolean;
}

export interface UserProfile {
  name: string;
  age: number;
  startingWeight: number;
  targetWeight: number;
  goalType: 'lose' | 'gain';
  weeklyWeightLossGoal: number; // kg per week change
  dailyCalorieGoal: number;
  dailyWaterGoal: number; // in ml
  height: number; // in cm
  gender: 'male' | 'female';
  reminders: Reminder[];
  isPremium: boolean;
}

export interface HealthData {
  weightLogs: WeightLog[];
  measurements: BodyMeasurement[];
  nutritionLogs: FoodEntry[];
  waterLogs: WaterLog[];
  mealPlan: PlannedMeal[];
  supplements: Supplement[];
  supplementLogs: SupplementLog[];
  profile: UserProfile;
}

export enum View {
  Dashboard = 'dashboard',
  Weight = 'weight',
  Measurements = 'measurements',
  Nutrition = 'nutrition',
  Medicine = 'medicine',
  Analytics = 'analytics',
  Settings = 'settings',
  Assistant = 'assistant'
}
