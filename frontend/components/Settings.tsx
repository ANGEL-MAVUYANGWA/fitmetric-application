
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Save, Target, Droplets } from 'lucide-react';

interface SettingsProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

const Settings: React.FC<SettingsProps> = ({ profile, onUpdate }) => {
  const [form, setForm] = useState<UserProfile>(profile);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Configuration</h2>
        <p className="text-slate-500 mt-1">Adjust your health profiles and goals.</p>
      </header>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 space-y-10">
            {/* Personal Info */}
            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <User size={16} />
                User Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">Your Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
              </div>
            </section>

            {/* Goals Info */}
            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Target size={16} />
                Health Objectives
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
                  <label className="text-xs font-bold text-slate-500 ml-1">Calorie Goal (kcal)</label>
                  <input
                    type="number"
                    value={form.dailyCalorieGoal}
                    onChange={(e) => setForm(prev => ({ ...prev, dailyCalorieGoal: parseFloat(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:outline-none"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-1">
                    <Droplets size={12} className="text-blue-500" />
                    Water Goal (ml)
                  </label>
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
          </div>

          <div className="bg-slate-50/50 p-6 flex items-center justify-between border-t border-slate-100">
            <div>
              {saved && (
                <p className="text-emerald-600 font-bold text-sm animate-in fade-in slide-in-from-left-2 flex items-center gap-2">
                  <Save size={14} /> Profile updated!
                </p>
              )}
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center gap-2 active:scale-95"
            >
              <Save size={18} />
              Save All Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
