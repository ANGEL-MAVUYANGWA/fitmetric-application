// services/geminiService.ts
// This service forwards AI requests to the Spring Boot backend

const API_BASE_URL = 'http://localhost:5000/api';

export interface DetailedInsight {
  category: 'Macro Balance' | 'Weight Trend' | 'Nutritional Quality' | 'Hydration' | 'Action Plan';
  title: string;
  description: string;
  impact: 'positive' | 'neutral' | 'negative';
  sources?: { uri: string; title: string }[];
}

/**
 * Helper function to get user ID from local storage
 */
function getUserIdFromStorage(): string | null {
  const userStr = localStorage.getItem('fitmetric_current_user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user.id;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Helper function to get auth token
 */
function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

/**
 * Analyzes a food description using the backend Gemini API
 */
export const analyzeFood = async (foodDescription: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/gemini/analyze-food`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description: foodDescription }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Food analysis error: - geminiService.ts:56', error);
    // Return mock data as fallback
    return {
      name: foodDescription.substring(0, 50),
      calories: 250,
      protein: 15,
      carbs: 30,
      fat: 10,
      ingredients: ['Analysis unavailable - check backend connection']
    };
  }
};

/**
 * Analyzes a nutrition label image using the backend Gemini API
 */
export const analyzeNutritionalLabel = async (base64Image: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/gemini/scan-label`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64Image }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Label scan error: - geminiService.ts:88', error);
    return {
      name: 'Scanned Item',
      calories: 200,
      protein: 10,
      carbs: 25,
      fat: 8,
      servingSizeWeight: 100
    };
  }
};

/**
 * Gets AI-generated health insights using the backend
 */
export const getHealthInsights = async (
  weightData: any[], 
  nutritionData: any[], 
  profile: any
): Promise<DetailedInsight[]> => {
  try {
    const token = getAuthToken();
    const userId = getUserIdFromStorage();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (userId) {
      headers['X-User-Id'] = userId;
    }
    
    const response = await fetch(`${API_BASE_URL}/gemini/insights`, {
      method: 'GET',
      headers: headers,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Insights error: - geminiService.ts:134', error);
    // Return mock insights as fallback
    return [{
      category: 'Action Plan',
      title: 'Maintain Consistency',
      description: 'Continue logging your meals and weight daily for more accurate AI insights.',
      impact: 'neutral'
    }];
  }
};

/**
 * Gets meal plan suggestions from the backend
 */
export const getMealPlanSuggestions = async (profile: any) => {
  try {
    const token = getAuthToken();
    const userId = getUserIdFromStorage();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (userId) {
      headers['X-User-Id'] = userId;
    }
    
    const response = await fetch(`${API_BASE_URL}/gemini/suggest-meal-plan`, {
      method: 'POST',
      headers: headers,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Meal plan error: - geminiService.ts:176', error);
    return [];
  }
};

/**
 * Generates a shopping list from meal plan using the backend
 */
export const generateShoppingList = async (meals: any[]) => {
  try {
    const token = getAuthToken();
    const userId = getUserIdFromStorage();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (userId) {
      headers['X-User-Id'] = userId;
    }
    
    const response = await fetch(`${API_BASE_URL}/gemini/shopping-list`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ meals }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Shopping list error: - geminiService.ts:212', error);
    return [];
  }
};

/**
 * Creates or gets a health chat session
 */
export const createHealthChat = (data: any) => {
  // Store chat session info in localStorage for continuity
  let sessionId = localStorage.getItem('chat_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('chat_session_id', sessionId);
  }
  
  return {
    sendMessage: async ({ message }: { message: string }) => {
      try {
        const token = getAuthToken();
        const userId = getUserIdFromStorage();
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        if (userId) {
          headers['X-User-Id'] = userId;
        }
        
        const response = await fetch(`${API_BASE_URL}/gemini/chat`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ 
            message, 
            sessionId 
          }),
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Chat error: - geminiService.ts:260', error);
        return {
          text: "I'm sorry, I encountered an error. Please check if the backend server is running and try again.",
          candidates: [],
          sessionId: sessionId
        };
      }
    }
  };
};