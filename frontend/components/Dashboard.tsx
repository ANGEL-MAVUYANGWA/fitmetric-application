
import React, { useState, useEffect, useMemo } from 'react';
import { HealthData, View } from '../types.ts';
import { 
  TrendingDown, 
  TrendingUp,
  Target, 
  Zap, 
  ChevronRight, 
  Sparkles, 
  Scale, 
  Utensils, 
  Droplets,
  AlertCircle,
  CheckCircle2,
  Info,
  Trophy,
  Loader2,
  Award
} from 'lucide-react';
import { getHealthInsights, DetailedInsight } from '../services/geminiService.ts';
import MedicalDisclaimer from './MedicalDisclaimer.tsx';

interface DashboardProps {
  data: HealthData;
  setView: (view: View) => void;
  onUpgrade: () => void;
}

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  isEarned: boolean;
  progress: number; 
}

const Dashboard: React.FC<DashboardProps> = ({ data, setView, onUpgrade }) => {
  const [insights, setInsights] = useState<DetailedInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const currentWeight = data.weightLogs[0]?.weight || data.profile.startingWeight;
  const isLossGoal = data.profile.goalType === 'lose';
  
  const progressPercent = Math.min(100, Math.max(0, 
    isLossGoal 
      ? ((data.profile.startingWeight - currentWeight) / (data.profile.startingWeight - data.profile.targetWeight)) * 100
      : ((currentWeight - data.profile.startingWeight) / (data.profile.targetWeight - data.profile.startingWeight)) * 100
  ));

  const today = new Date().toDateString();
  const todayNutrition = data.nutritionLogs
    .filter(n => new Date(n.date).toDateString() === today)
    .reduce((acc, curr) => acc + curr.calories, 0);

  const todayWater = data.waterLogs
    .filter(w => new Date(w.date).toDateString() === today)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const badges = useMemo(() => {
    const uniqueWeightDates = new Set(data.weightLogs.map(l => new Date(l.date).toDateString()));
    const weightStreak = Array.from({length: 7}).filter((_, i) => {
      const d = new Date(); d.setDate(d.getDate() - i);
      return uniqueWeightDates.has(d.toDateString());
    }).length;

    const uniqueNutritionDates = new Set(data.nutritionLogs.map(l => new Date(l.date).toDateString()));
    const waterMetCount = Object.values(data.waterLogs.reduce((acc: any, curr) => {
      const d = new Date(curr.date).toDateString();
      acc[d] = (acc[d] || 0) + curr.amount;
      return acc;
    }, {})).filter(amt => (amt as number) >= data.profile.dailyWaterGoal).length;

    return [
      {
        id: 'weight-streak',
        title: 'Consistency',
        description: '7 Day Streak',
        icon: <Scale size={16} />,
        color: 'bg-indigo-500',
        isEarned: weightStreak >= 7,
        progress: weightStreak / 7
      },
      {
        id: 'meal-master',
        title: 'Gourmet',
        description: '30 Days Logged',
        icon: <Utensils size={16} />,
        color: 'bg-emerald-500',
        isEarned: uniqueNutritionDates.size >= 30,
        progress: Math.min(1, uniqueNutritionDates.size / 30)
      },
      {
        id: 'water-hero',
        title: 'Hydrated',
        description: '5 Goals Met',
        icon: <Droplets size={16} />,
        color: 'bg-blue-500',
        isEarned: waterMetCount >= 5,
        progress: Math.min(1, waterMetCount / 5)
      }
    ];
  }, [data]);

  useEffect(() => {
    const fetchInsights = async () => {
      if (data.weightLogs.length === 0 && data.nutritionLogs.length === 0) return;
      setLoadingInsights(true);
      try {
        const res = await getHealthInsights(data.weightLogs, data.nutritionLogs, data.profile);
        setInsights(res);
      } catch (e) { console.error(e); }
      setLoadingInsights(false);
    };
    fetchInsights();
  }, [data.weightLogs.length, data.nutritionLogs.length]);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome, {data.profile.name}!</h2>
          <p className="text-sm text-slate-500 mt-1">Here is your health overview for today.</p>
        </div>
        <div className="bg-indigo-600 px-4 py-2 rounded-2xl text-white flex items-center gap-2 shadow-lg shadow-indigo-100 self-start md:self-auto">
          <Zap size={16} className="text-amber-300" />
          <span className="text-xs font-black uppercase tracking-widest">Active Plan</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
            <Trophy size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Target Progress</p>
                <h3 className="text-3xl font-black text-slate-900">{progressPercent.toFixed(1)}%</h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Remaining</p>
                <h3 className="text-xl font-black text-slate-900">
                  {Math.abs(currentWeight - data.profile.targetWeight).toFixed(1)} <span className="text-xs font-bold text-slate-400 uppercase">kg</span>
                </h3>
              </div>
            </div>
            
            <div className="h-4 bg-slate-50 rounded-full overflow-hidden mb-6 border border-slate-100 p-1">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Start</p>
                <p className="text-sm font-black text-slate-900">{data.profile.startingWeight}kg</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                <p className="text-[9px] font-black text-indigo-400 uppercase mb-1">Current</p>
                <p className="text-sm font-black text-indigo-900">{currentWeight}kg</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Goal</p>
                <p className="text-sm font-black text-slate-900">{data.profile.targetWeight}kg</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                <Target size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-0.5">Calories</p>
                <p className="text-lg font-black text-slate-900">{todayNutrition} <span className="text-xs font-bold text-slate-300">/ {data.profile.dailyCalorieGoal}</span></p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <Droplets size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-0.5">Hydration</p>
                <p className="text-lg font-black text-slate-900">{todayWater} <span className="text-xs font-bold text-slate-300">/ {data.profile.dailyWaterGoal}ml</span></p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm">Health Insights</h3>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">Generated by Gemini AI</p>
            </div>
          </div>
          {loadingInsights && <Loader2 className="animate-spin text-indigo-600" size={20} />}
        </div>
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.length > 0 ? (
            insights.map((insight, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-xl transition-all">
                <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                  insight.impact === 'positive' ? 'bg-emerald-100 text-emerald-600' : 
                  insight.impact === 'negative' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {insight.impact === 'positive' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{insight.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{insight.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-slate-400 font-bold text-sm">Log more data to unlock personalized AI insights.</p>
            </div>
          )}
        </div>
      </section>

      {/* Badges Section */}
      <section>
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {badges.map(badge => (
            <div key={badge.id} className={`p-5 rounded-[2rem] border transition-all ${badge.isEarned ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50/50 border-slate-200/50 opacity-60'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${badge.color}`}>
                  {badge.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-tight">{badge.title}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-tight">{badge.description}</p>
                </div>
              </div>
              <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${badge.color}`}
                  style={{ width: `${badge.progress * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <MedicalDisclaimer />
    </div>
  );
};

export default Dashboard;
