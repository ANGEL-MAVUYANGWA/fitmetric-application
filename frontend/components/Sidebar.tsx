
import React from 'react';
import { View } from '../types';
import { 
  LayoutDashboard, 
  Scale, 
  Ruler, 
  Utensils, 
  BarChart3, 
  Settings as SettingsIcon,
  Crown,
  MessageSquare,
  Pill,
  LogOut,
  User
} from 'lucide-react';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  isPremium: boolean;
  onUpgrade: () => void;
  onLogout: () => void;
  userName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isPremium, onUpgrade, onLogout, userName }) => {
  const navItems = [
    { id: View.Dashboard, label: 'Dash', icon: LayoutDashboard },
    { id: View.Weight, label: 'Weight', icon: Scale },
    { id: View.Nutrition, label: 'Log', icon: Utensils },
    { id: View.Medicine, label: 'Meds', icon: Pill },
    { id: View.Assistant, label: 'AI', icon: MessageSquare },
    { id: View.Settings, label: 'Profile', icon: SettingsIcon },
  ];

  const desktopNavItems = [
    { id: View.Dashboard, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.Weight, label: 'Weight Log', icon: Scale },
    { id: View.Measurements, label: 'Measurements', icon: Ruler },
    { id: View.Nutrition, label: 'Nutrition', icon: Utensils },
    { id: View.Medicine, label: 'Meds & Vitamins', icon: Pill },
    { id: View.Assistant, label: 'AI Assistant', icon: MessageSquare },
    { id: View.Analytics, label: 'Analytics', icon: BarChart3 },
    { id: View.Settings, label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 flex justify-around items-center p-1 z-50 pb-safe">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all flex-1 ${
              currentView === id ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${currentView === id ? 'bg-indigo-50 scale-110 shadow-sm' : ''}`}>
               <Icon size={20} />
            </div>
            <span className={`text-[9px] font-black mt-1 uppercase tracking-tighter ${currentView === id ? 'opacity-100' : 'opacity-40'}`}>
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 flex-col p-6 z-40">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white relative shadow-lg shadow-indigo-100">
            <Scale size={24} />
            {isPremium && (
              <div className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 p-1 rounded-full border-2 border-white shadow-md">
                <Crown size={10} />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 leading-none tracking-tight text-nowrap">FitMetric</h1>
            <p className="text-[10px] font-black text-indigo-600 tracking-widest uppercase mt-1">
              PRO EDITION
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {desktopNavItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                currentView === id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-4 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
              <User size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-900 truncate">{userName}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active User</p>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>

          {!isPremium && (
            <button 
              onClick={onUpgrade}
              className="w-full bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-5 rounded-3xl flex items-center gap-3 hover:scale-[1.02] transition-all group shadow-xl shadow-indigo-100"
            >
              <div className="p-2 bg-white/20 rounded-xl group-hover:rotate-12 transition-transform">
                <Crown size={20} className="text-amber-300" />
              </div>
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-widest leading-none">Upgrade Pro</p>
                <p className="text-[10px] opacity-70 font-bold mt-1">R19 / Month</p>
              </div>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
