
import React, { useState, useEffect } from 'react';
import { UserProfile, Reminder } from '../types.ts';
import { 
  User, 
  Save, 
  Target, 
  Droplets, 
  Info, 
  Calculator, 
  Flame, 
  TrendingUp, 
  TrendingDown, 
  Bell, 
  Plus, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  CheckCircle2,
  Crown,
  Zap
} from 'lucide-react';
import MedicalDisclaimer from './MedicalDisclaimer.tsx';

interface SettingsProps {
  profile: UserProfile;
  currentWeight: number;
  onUpdate: (profile: UserProfile) => void;
  onUpgrade: () => void;
}

export default function ProfileSettings({ profile, currentWeight, onUpdate, onUpgrade }: SettingsProps) {
  const [form, setForm] = useState<UserProfile>(profile);
  const [saved, setSaved] = useState(false);
  const [autoCalibrate, setAutoCalibrate] = useState(true);

  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: '',
    time: '08:00',
    type: 'general',
    enabled: true
  });

  const calculateCalorieGoal = () => {
    const { height, age, gender, weeklyWeightLossGoal, goalType } = form;
    const weight = currentWeight;

    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    const maintenance = bmr * 1.375;
    const adjustment = (weeklyWeightLossGoal * 7700) / 7;
    
    let suggested;
    if (goalType === 'lose') {
      suggested = Math.max(1200, Math.round(maintenance - adjustment));
    } else {
      suggested = Math.round(maintenance + adjustment);
    }
    return suggested;
  };

  useEffect(() => {
    if (autoCalibrate) {
      const suggested = calculateCalorieGoal();
      if (suggested !== form.dailyCalorieGoal) {
        setForm(prev => ({ ...prev, dailyCalorieGoal: suggested }));
      }
    }
  }, [form.weeklyWeightLossGoal, form.goalType, form.height, form.age, form.gender, autoCalibrate, currentWeight]);

  const addReminder = () => {
    if (!newReminder.title || !newReminder.time) return;
    const reminder: Reminder = {
      id: crypto.randomUUID(),
      title: newReminder.title,
      time: newReminder.time,
      type: newReminder.type as any,
      enabled: true
    };
    setForm(prev => ({
      ...prev,
      reminders: [...prev.reminders, reminder]
    }));
    setNewReminder({ title: '', time: '08:00', type: 'general', enabled: true });
  };

  const removeReminder = (id: string) => {
    setForm(prev => ({
      ...prev,
      reminders: prev.reminders.filter(r => r.id !== id)
    }));
  };

  const toggleReminder = (id: string) => {
    setForm(prev => ({
      ...prev,
      reminders: prev.reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const isPremium = profile.isPremium;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Health Configuration</h2>
          <p className="text-slate-500 mt-1">Recalibrate your health strategy and preferences.</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${isPremium ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
          {isPremium ? <Crown size={16} className="text-amber-400" /> : <Zap size={16} />}
          <span className="text-xs font-black uppercase tracking-widest">{isPremium ? 'PRO MEMBER' : 'BASIC ACCOUNT'}</span>
        </div>
      </header>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 space-y-12">
              <section>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Target size={16} />
                  Primary Health Objective
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, goalType: 'lose' }))}
                    className={`flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all ${
                      form.goalType === 'lose' ? 'bg-rose-50 border-rose-200 ring-2 ring-rose-500/20' : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className={`p-4 rounded-2xl ${form.goalType === 'lose' ? 'bg-rose-500 text-white' : 'bg-slate-50 text-slate-400'}`}>
                      <TrendingDown size={32} />
                    </div>
                    <div className="text-center">
                      <p className={`font-bold ${form.goalType === 'lose' ? 'text-rose-900' : 'text-slate-900'}`}>Lose Weight</p>
                      <p className="text-xs text-slate-500">Deficit focus</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, goalType: 'gain' }))}
                    className={`flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all ${
                      form.goalType === 'gain' ? 'bg-emerald-50 border-emerald-200 ring-2 ring-emerald-500/20' : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className={`p-4 rounded-2xl ${form.goalType === 'gain' ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400'}`}>
                      <TrendingUp size={32} />
                    </div>
                    <div className="text-center">
                      <p className={`font-bold ${form.goalType === 'gain' ? 'text-emerald-900' : 'text-slate-900'}`}>Gain Weight</p>
                      <p className="text-xs text-slate-500">Surplus focus</p>
                    </div>
                  </button>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <User size={16} />
                  Personal Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">Your Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">Age</label>
                    <input
                      type="number"
                      value={form.age}
                      onChange={(e) => setForm(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">Gender</label>
                    <select
                      value={form.gender}
                      onChange={(e) => setForm(prev => ({ ...prev, gender: e.target.value as any }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:outline-none"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">Height (cm)</label>
                    <input
                      type="number"
                      value={form.height}
                      onChange={(e) => setForm(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:outline-none"
                    />
                  </div>
                </div>
              </section>

              <section className={`p-8 rounded-3xl border ${form.goalType === 'lose' ? 'bg-rose-50/30 border-rose-100/50' : 'bg-emerald-50/30 border-emerald-100/50'}`}>
                <div className="flex items-center justify-between mb-8">
                  <h3 className={`text-sm font-bold uppercase tracking-widest flex items-center gap-2 ${form.goalType === 'lose' ? 'text-rose-900' : 'text-emerald-900'}`}>
                    <Calculator size={16} />
                    Dynamic Nutrition Planning
                  </h3>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                    <span className="text-xs font-bold text-slate-600">Auto-Calibrate</span>
                    <input 
                      type="checkbox" 
                      checked={autoCalibrate} 
                      onChange={e => setAutoCalibrate(e.target.checked)}
                      className="accent-indigo-600"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-slate-700">Weekly Pace</label>
                      <span className={`font-bold px-3 py-1 rounded-full text-xs ${form.goalType === 'lose' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {form.weeklyWeightLossGoal} kg/week
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1.5"
                      step="0.1"
                      value={form.weeklyWeightLossGoal}
                      onChange={(e) => setForm(prev => ({ ...prev, weeklyWeightLossGoal: parseFloat(e.target.value) }))}
                      className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${form.goalType === 'lose' ? 'bg-rose-200 accent-rose-600' : 'bg-emerald-200 accent-emerald-600'}`}
                    />
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Target Daily Intake</p>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-3xl font-black ${form.goalType === 'lose' ? 'text-rose-600' : 'text-emerald-600'}`}>{form.dailyCalorieGoal}</span>
                        <span className="text-sm font-bold text-slate-400">kcal</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${form.goalType === 'lose' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      <Flame size={24} />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Droplets size={16} />
                  Other Health Targets
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">Target Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.targetWeight}
                      onChange={(e) => setForm(prev => ({ ...prev, targetWeight: parseFloat(e.target.value) }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">Hydration Goal (ml)</label>
                    <input
                      type="number"
                      step="50"
                      value={form.dailyWaterGoal}
                      onChange={(e) => setForm(prev => ({ ...prev, dailyWaterGoal: parseFloat(e.target.value) }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:outline-none"
                    />
                  </div>
                </div>
              </section>

              {!isPremium && (
                <section className="bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-3xl text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-16 -mt-16"></div>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/10 rounded-2xl">
                        <Crown size={24} className="text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-black uppercase tracking-tight text-lg">PRO Membership</h4>
                        <p className="text-sm text-slate-400">R19 / Month • Cancel Anytime</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={onUpgrade}
                      className="bg-white text-indigo-900 px-8 py-3 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all active:scale-95"
                    >
                      UPGRADE NOW
                    </button>
                  </div>
                </section>
              )}
            </div>

            <div className="bg-slate-50/50 p-8 flex items-center justify-between border-t border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 max-w-xs">
                <Info size={16} />
                <p className="text-[10px] font-medium leading-tight">
                  Calorie goal updated for <strong>{currentWeight}kg</strong> baseline.
                </p>
              </div>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-12 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center gap-3 active:scale-95"
              >
                <Save size={20} />
                UPDATE MY STRATEGY
                {saved && <CheckCircle2 size={20} className="text-white animate-in zoom-in" />}
              </button>
            </div>
          </div>
        </form>
      </div>
      <MedicalDisclaimer />
    </div>
  );
}
