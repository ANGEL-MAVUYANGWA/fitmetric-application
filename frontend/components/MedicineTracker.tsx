
import React, { useState } from 'react';
import { Supplement, SupplementLog } from '../types.ts';
import { 
  Pill, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Search, 
  AlertCircle,
  Calendar,
  Settings,
  ShieldAlert,
  Dna,
  X
} from 'lucide-react';
import MedicalDisclaimer from './MedicalDisclaimer.tsx';

interface MedicineTrackerProps {
  supplements: Supplement[];
  logs: SupplementLog[];
  onUpdateSupplements: (supplements: Supplement[]) => void;
  onAddLog: (log: Omit<SupplementLog, 'id'>) => void;
  onRemoveLog: (id: string) => void;
}

export default function MedicineTracker({ supplements, logs, onUpdateSupplements, onAddLog, onRemoveLog }: MedicineTrackerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSupp, setNewSupp] = useState<Partial<Supplement>>({
    name: '',
    dosage: '',
    type: 'supplement',
    frequency: 'daily',
    purpose: ''
  });

  const today = new Date().toDateString();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupp.name || !newSupp.dosage) return;
    const supp: Supplement = {
      id: crypto.randomUUID(),
      name: newSupp.name!,
      dosage: newSupp.dosage!,
      type: newSupp.type as any || 'supplement',
      frequency: newSupp.frequency as any || 'daily',
      purpose: newSupp.purpose || ''
    };
    onUpdateSupplements([...supplements, supp]);
    setNewSupp({ name: '', dosage: '', type: 'supplement', frequency: 'daily', purpose: '' });
    setShowAddModal(false);
  };

  const removeSupp = (id: string) => {
    onUpdateSupplements(supplements.filter(s => s.id !== id));
  };

  const toggleTaken = (suppId: string) => {
    const existingLog = logs.find(l => l.supplementId === suppId && new Date(l.date).toDateString() === today);
    if (existingLog) {
      onRemoveLog(existingLog.id);
    } else {
      onAddLog({
        supplementId: suppId,
        date: new Date().toISOString(),
        taken: true
      });
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Medicine & Vits</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your supplement stack and medication adherence.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95"
        >
          <Plus size={20} /> Add New
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Checklist */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden h-full">
            <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm">Today's Protocol</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Consistency is key for efficiency</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 md:p-8 space-y-4">
              {supplements.length === 0 ? (
                <div className="py-20 text-center text-slate-400">
                  <Pill className="mx-auto mb-4 opacity-20" size={48} />
                  <p className="font-bold text-sm">Your protocol is empty.</p>
                  <p className="text-xs mt-1">Add your daily vitamins or medications to track them.</p>
                </div>
              ) : (
                supplements.filter(s => s.frequency === 'daily').map(supp => {
                  const isTaken = logs.some(l => l.supplementId === supp.id && new Date(l.date).toDateString() === today);
                  return (
                    <button 
                      key={supp.id}
                      onClick={() => toggleTaken(supp.id)}
                      className={`w-full flex items-center justify-between p-5 rounded-3xl border transition-all ${
                        isTaken 
                        ? 'bg-emerald-50 border-emerald-100' 
                        : 'bg-white border-slate-100 hover:border-indigo-100 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${
                          isTaken ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400'
                        }`}>
                          {supp.type === 'vitamin' ? <Dna size={24} /> : <Pill size={24} />}
                        </div>
                        <div className="text-left">
                          <p className={`font-black text-sm ${isTaken ? 'text-emerald-900' : 'text-slate-900'}`}>{supp.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{supp.dosage} • {supp.purpose || 'General Health'}</p>
                        </div>
                      </div>
                      <div className={isTaken ? 'text-emerald-500' : 'text-slate-200'}>
                        {isTaken ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Info & Management */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-16 -mt-16"></div>
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-indigo-400 flex items-center gap-2">
              <ShieldAlert size={16} /> Stack Management
            </h3>
            <div className="space-y-4">
              {supplements.map(supp => (
                <div key={supp.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 group">
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">{supp.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{supp.frequency} • {supp.dosage}</p>
                  </div>
                  <button 
                    onClick={() => removeSupp(supp.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-400">
              <AlertCircle size={16} /> Strategy Note
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed italic">
              "Recording your intake helps FitMetric AI identify potential nutrient gaps in your weight loss plan. High-protein diets often benefit from specific micronutrient supplementation."
            </p>
          </div>
        </div>
      </div>

      <MedicalDisclaimer />

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-900">Add to Protocol</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleAdd} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Name</label>
                  <input 
                    type="text" 
                    required
                    value={newSupp.name}
                    onChange={e => setNewSupp({...newSupp, name: e.target.value})}
                    placeholder="E.g., Vitamin D3" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Dosage</label>
                    <input 
                      type="text" 
                      required
                      value={newSupp.dosage}
                      onChange={e => setNewSupp({...newSupp, dosage: e.target.value})}
                      placeholder="E.g., 5000 IU" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Type</label>
                    <select 
                      value={newSupp.type}
                      onChange={e => setNewSupp({...newSupp, type: e.target.value as any})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:outline-none"
                    >
                      <option value="supplement">Supplement</option>
                      <option value="vitamin">Vitamin</option>
                      <option value="medicine">Medicine</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Frequency</label>
                  <select 
                    value={newSupp.frequency}
                    onChange={e => setNewSupp({...newSupp, frequency: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:outline-none"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="as-needed">As Needed</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Purpose (Optional)</label>
                  <input 
                    type="text" 
                    value={newSupp.purpose}
                    onChange={e => setNewSupp({...newSupp, purpose: e.target.value})}
                    placeholder="E.g., Bone Health" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:outline-none"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                Add to Stack
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
