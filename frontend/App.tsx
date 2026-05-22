// App.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, HealthData, UserProfile, WeightLog, BodyMeasurement, FoodEntry, WaterLog, Reminder, PlannedMeal, Supplement, SupplementLog } from './types';
import { apiService } from './services/api';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import WeightTracker from './components/WeightTracker';
import MeasurementTracker from './components/MeasurementTracker';
import NutritionTracker from './components/NutritionTracker';
import Analytics from './components/Analytics';
import ProfileSettings from './components/ProfileSettings';
import SubscriptionModal from './components/SubscriptionModal';
import HealthAssistant from './components/HealthAssistant';
import MedicineTracker from './components/MedicineTracker';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';

const createDefaultProfile = (name: string): UserProfile => ({
  name: name,
  age: 30,
  startingWeight: 80,
  targetWeight: 75,
  goalType: 'lose',
  weeklyWeightLossGoal: 0.5,
  dailyCalorieGoal: 2000,
  dailyWaterGoal: 2500,
  height: 175,
  gender: 'male',
  isPremium: false,
  reminders: [
    { id: '1', title: 'Morning Weigh-in', time: '08:00', type: 'weight', enabled: true },
    { id: '2', title: 'Hydration Check', time: '14:00', type: 'water', enabled: true },
    { id: '3', title: 'Log Dinner', time: '19:30', type: 'nutrition', enabled: true }
  ]
});

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(() => {
    return !localStorage.getItem('fitmetric_onboarded_v1');
  });
  const [showAuth, setShowAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; isPremium?: boolean } | null>(() => {
    const saved = localStorage.getItem('fitmetric_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [showSubscription, setShowSubscription] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [data, setData] = useState<HealthData>({
    weightLogs: [],
    measurements: [],
    nutritionLogs: [],
    waterLogs: [],
    mealPlan: [],
    supplements: [],
    supplementLogs: [],
    profile: createDefaultProfile('User')
  });

  const lastCheckedRef = useRef<string>('');

  const loadUserData = useCallback(async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      const [profile, weightLogs, nutritionLogs, measurements, waterLogs, mealPlan, supplements] = await Promise.all([
        apiService.getUserProfile(currentUser.id),
        apiService.getWeightLogs(currentUser.id),
        apiService.getNutritionEntries(currentUser.id),
        apiService.getMeasurements(currentUser.id),
        apiService.getWaterLogs(currentUser.id),
        apiService.getMealPlan(currentUser.id),
        apiService.getSupplements(currentUser.id)
      ]);

      setData({
        profile: { ...createDefaultProfile(currentUser.name), ...profile } as UserProfile,
        weightLogs: Array.isArray(weightLogs) ? weightLogs.map(w => ({
          ...w,
          // normalize timeOfDay to the expected union type "morning" | "evening" | undefined
          timeOfDay: w.timeOfDay === 'morning' || w.timeOfDay === 'evening' ? w.timeOfDay as 'morning' | 'evening' : undefined
        })) : [],
        nutritionLogs: Array.isArray(nutritionLogs) ? nutritionLogs : [],
        measurements: Array.isArray(measurements) ? measurements : [],
        waterLogs: Array.isArray(waterLogs) ? waterLogs.map(w => ({
          id: w.id,
          date: w.date,
          amount: w.amountMl || w.amountMl || 0
        })) : [],
        mealPlan: Array.isArray(mealPlan) ? mealPlan.map(m => ({
          ...m,
          date: (m as any).date || new Date().toISOString().split('T')[0],
          mealType: m.mealType as PlannedMeal['mealType']
        })) : [],
        supplements: Array.isArray(supplements) ? supplements.map(s => ({
          ...s,
          type: s.type === 'vitamin' || s.type === 'medicine' || s.type === 'supplement'
            ? s.type
            : 'supplement',
          frequency: s.frequency === 'daily' || s.frequency === 'weekly' || s.frequency === 'as-needed'
            ? s.frequency
            : 'daily'
        })) : [],
        supplementLogs: []
      });
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadUserData();
    }
  }, [currentUser, loadUserData]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('fitmetric_current_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const interval = setInterval(() => {
      const now = new Date();
      const currentHM = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      if (currentHM !== lastCheckedRef.current) {
        lastCheckedRef.current = currentHM;
        
        data.profile.reminders.forEach(reminder => {
          if (reminder.enabled && reminder.time === currentHM) {
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('FitMetric Pro Reminder', {
                body: reminder.title,
                icon: '/favicon.ico'
              });
            }
          }
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [data.profile.reminders]);

  const handleEnterApp = () => {
    localStorage.setItem('fitmetric_onboarded_v1', 'true');
    setShowLanding(false);
    if (!currentUser) {
      setShowAuth(true);
    }
  };

  const handleAuthSuccess = useCallback((user: { id: string; email: string; name: string; isPremium?: boolean }) => {
    setCurrentUser({
      id: user.id,
      name: user.name,
      email: user.email,
      isPremium: user.isPremium || false
    });
    setShowAuth(false);
  }, []);

  const handleLogout = () => {
    apiService.logout();
    setCurrentUser(null);
    setShowAuth(true);
    setCurrentView(View.Dashboard);
  };

  const updateProfile = (profile: UserProfile) => {
    setData(prev => ({ ...prev, profile }));
    if (currentUser) {
      apiService.updateUserProfile(currentUser.id, profile).catch(console.error);
    }
  };

  const setPremium = (status: boolean) => {
    setData(prev => ({
      ...prev,
      profile: { ...prev.profile, isPremium: status }
    }));
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, isPremium: status } : null);
    }
  };

  const addWeightLog = async (log: Omit<WeightLog, 'id'>) => {
    if (!currentUser) return;
    try {
      const newLog = await apiService.addWeightLog(currentUser.id, {
        weight: log.weight,
        date: log.date,
        timeOfDay: log.timeOfDay || 'MORNING',
        note: log.note
      });
      setData(prev => ({
        ...prev,
        weightLogs: [newLog as WeightLog, ...prev.weightLogs].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      }));
    } catch (error) {
      console.error('Failed to add weight log:', error);
    }
  };

  const deleteWeightLog = async (id: string) => {
    if (!currentUser) return;
    try {
      await apiService.deleteWeightLog(currentUser.id, id);
      setData(prev => ({
        ...prev,
        weightLogs: prev.weightLogs.filter(log => log.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete weight log:', error);
    }
  };

  const addMeasurement = async (measurement: Omit<BodyMeasurement, 'id'>) => {
    if (!currentUser) return;
    try {
      const newEntry = await apiService.addMeasurement(currentUser.id, {
        date: measurement.date,
        waistCm: measurement.waist,
        chestCm: measurement.chest,
        hipsCm: measurement.hips,
        thighsCm: measurement.thighs,
        armsCm: measurement.arms,
        neckCm: measurement.neck
      });
      setData(prev => ({
        ...prev,
        measurements: [newEntry as BodyMeasurement, ...prev.measurements].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      }));
    } catch (error) {
      console.error('Failed to add measurement:', error);
    }
  };

  const deleteMeasurement = async (id: string) => {
    if (!currentUser) return;
    try {
      await apiService.deleteMeasurement(currentUser.id, id);
      setData(prev => ({
        ...prev,
        measurements: prev.measurements.filter(m => m.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete measurement:', error);
    }
  };

  const addNutritionEntry = async (entry: Omit<FoodEntry, 'id'>) => {
    if (!currentUser) return;
    try {
      const newEntry = await apiService.addNutritionEntry(currentUser.id, {
        name: entry.name,
        date: entry.date,
        calories: entry.calories,
        protein: entry.protein || 0,
        carbs: entry.carbs || 0,
        fat: entry.fat || 0
      });
      setData(prev => ({
        ...prev,
        nutritionLogs: [newEntry as FoodEntry, ...prev.nutritionLogs].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      }));
    } catch (error) {
      console.error('Failed to add nutrition entry:', error);
    }
  };

  const deleteNutritionEntry = async (id: string) => {
    if (!currentUser) return;
    try {
      await apiService.deleteNutritionEntry(currentUser.id, id);
      setData(prev => ({
        ...prev,
        nutritionLogs: prev.nutritionLogs.filter(entry => entry.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete nutrition entry:', error);
    }
  };

  const addWaterLog = async (amount: number) => {
    if (!currentUser) return;
    try {
      const date = new Date().toISOString().split('T')[0];
      const newEntry = await apiService.addWaterLog(currentUser.id, date, amount);
      setData(prev => ({
        ...prev,
        waterLogs: [{ ...newEntry, amount: newEntry.amountMl } as WaterLog, ...prev.waterLogs]
      }));
    } catch (error) {
      console.error('Failed to add water log:', error);
    }
  };

  const deleteWaterLog = async (id: string) => {
    if (!currentUser) return;
    try {
      await apiService.deleteWaterLog(currentUser.id, id);
      setData(prev => ({
        ...prev,
        waterLogs: prev.waterLogs.filter(log => log.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete water log:', error);
    }
  };

  const setMealPlan = async (plan: PlannedMeal[]) => {
    if (!currentUser) return;
    try {
      await apiService.saveMealPlan(currentUser.id, plan);
      setData(prev => ({ ...prev, mealPlan: plan }));
    } catch (error) {
      console.error('Failed to save meal plan:', error);
    }
  };

  const updateSupplements = async (supplements: Supplement[]) => {
    if (!currentUser) return;
    setData(prev => ({ ...prev, supplements }));
  };

  const addSupplementLog = async (log: Omit<SupplementLog, 'id'>) => {
    if (!currentUser) return;
    try {
      const newLog = await apiService.logSupplement(currentUser.id, log.supplementId, log.date);
      setData(prev => ({
        ...prev,
        supplementLogs: [...prev.supplementLogs, newLog as SupplementLog]
      }));
    } catch (error) {
      console.error('Failed to add supplement log:', error);
    }
  };

  const removeSupplementLog = async (id: string) => {
    if (!currentUser) return;
    try {
      await apiService.unlogSupplement(currentUser.id, id);
      setData(prev => ({
        ...prev,
        supplementLogs: prev.supplementLogs.filter(log => log.id !== id)
      }));
    } catch (error) {
      console.error('Failed to remove supplement log:', error);
    }
  };

  const deleteItem = (type: 'weight' | 'measurement' | 'nutrition' | 'water', id: string) => {
    switch (type) {
      case 'weight':
        deleteWeightLog(id);
        break;
      case 'measurement':
        deleteMeasurement(id);
        break;
      case 'nutrition':
        deleteNutritionEntry(id);
        break;
      case 'water':
        deleteWaterLog(id);
        break;
    }
  };

  // Show landing page for new users
  if (showLanding) {
    return <LandingPage onStart={handleEnterApp} />;
  }

  // Show auth modal for unauthenticated users
  if (showAuth || !currentUser) {
    return (
      <Auth 
        onAuthSuccess={handleAuthSuccess}
        onBack={() => setShowLanding(true)}
      />
    );
  }

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Main app render
  return (
    <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        isPremium={data.profile.isPremium} 
        onUpgrade={() => setShowSubscription(true)}
        onLogout={handleLogout}
        userName={currentUser.name}
      />
      
      <main className="flex-1 lg:ml-64 p-4 md:p-8 pb-24 lg:pb-8 w-full max-w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          {currentView === View.Dashboard && (
            <Dashboard 
              data={data} 
              setView={setCurrentView} 
              onUpgrade={() => setShowSubscription(true)}
            />
          )}
          {currentView === View.Weight && (
            <WeightTracker 
              logs={data.weightLogs} 
              onAdd={addWeightLog} 
              onDelete={(id) => deleteItem('weight', id)}
              targetWeight={data.profile.targetWeight}
            />
          )}
          {currentView === View.Measurements && (
            <MeasurementTracker 
              measurements={data.measurements} 
              onAdd={addMeasurement}
              onDelete={(id) => deleteItem('measurement', id)}
            />
          )}
          {currentView === View.Nutrition && (
            <NutritionTracker 
              entries={data.nutritionLogs} 
              waterLogs={data.waterLogs}
              mealPlan={data.mealPlan}
              profile={data.profile}
              calorieGoal={data.profile.dailyCalorieGoal}
              waterGoal={data.profile.dailyWaterGoal}
              onAdd={addNutritionEntry}
              onAddWater={addWaterLog}
              onSetMealPlan={setMealPlan}
              onDelete={(id) => deleteItem('nutrition', id)}
              onDeleteWater={(id) => deleteItem('water', id)}
            />
          )}
          {currentView === View.Medicine && (
            <MedicineTracker
              supplements={data.supplements}
              logs={data.supplementLogs}
              onUpdateSupplements={updateSupplements}
              onAddLog={addSupplementLog}
              onRemoveLog={removeSupplementLog}
            />
          )}
          {currentView === View.Assistant && (
            <HealthAssistant 
              data={data}
              onUpgrade={() => setShowSubscription(true)}
            />
          )}
          {currentView === View.Analytics && (
            <Analytics data={data} />
          )}
          {currentView === View.Settings && (
            <ProfileSettings 
              profile={data.profile} 
              currentWeight={data.weightLogs[0]?.weight || data.profile.startingWeight} 
              onUpdate={updateProfile}
              onUpgrade={() => setShowSubscription(true)}
            />
          )}
        </div>
      </main>

      {showSubscription && (
        <SubscriptionModal 
          onClose={() => setShowSubscription(false)} 
          onSuccess={() => {
            setPremium(true);
            setShowSubscription(false);
            if (currentUser) {
              apiService.upgradeToPremium(currentUser.id).catch(console.error);
            }
          }}
        />
      )}
    </div>
  );
};

export default App;