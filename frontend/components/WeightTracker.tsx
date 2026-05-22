
import React, { useState, useEffect } from 'react';
import { WeightLog } from '../types';
import { Plus, Trash2, Scale, Calendar, FileText, Sun, Moon, Clock } from 'lucide-react';

interface WeightTrackerProps {
  logs: WeightLog[];
  onAdd: (log: Omit<WeightLog, 'id'>) => void;
  onDelete: (id: string) => void;
  targetWeight: number;
}

const WeightTracker: React.FC<WeightTrackerProps> = ({ logs, onAdd, onDelete, targetWeight }) => {
  // Helper to determine time of day based on current hour
  const getAutoTimeOfDay = (): 'morning' | 'evening' => {
    const hour = new Date().getHours();
    return hour < 12 ? 'morning' : 'evening';
  };

  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'evening'>(getAutoTimeOfDay());
  const [note, setNote] = useState('');
  const [isManualTime, setIsManualTime] = useState(false);

  // Re-run auto-detection if the user hasn't manually overridden it yet
  useEffect(() => {
    if (!isManualTime) {
      setTimeOfDay(getAutoTimeOfDay());
    }
  }, [isManualTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;
    onAdd({
      weight: parseFloat(weight),
      date,
      timeOfDay,
      note
    });
    setWeight('');
    setNote('');
    // Reset manual flag for next entry
    setIsManualTime(false);
  };

  const handleTimeChange = (type: 'morning' | 'evening') => {
    setTimeOfDay(type);
    setIsManualTime(true);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      <header className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Weight Tracker</h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">Track morning and evening fluctuations.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm lg:sticky lg:top-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Plus size={20} className="text-indigo-600" />
              New Log
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-base md:text-sm"
                    placeholder="0.0"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">kg</div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-slate-700">Time of Day</label>
                  {!isManualTime && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 uppercase tracking-tight bg-indigo-50 px-2 py-0.5 rounded-full animate-pulse">
                      <Clock size={10} /> Auto-detected
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleTimeChange('morning')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-xs md:text-sm transition-all ${
                      timeOfDay === 'morning' 
                        ? 'bg-amber-50 border-amber-200 text-amber-700 ring-2 ring-amber-500/10' 
                        : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <Sun size={18} />
                    Morning
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTimeChange('evening')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-xs md:text-sm transition-all ${
                      timeOfDay === 'evening' 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ring-2 ring-indigo-500/10' 
                        : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <Moon size={18} />
                    Evening
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-base md:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Note (Optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all h-20 md:h-24 resize-none text-base md:text-sm"
                  placeholder="Notes..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
              >
                Log Weight
              </button>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-4 px-1 md:px-0">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold">History</h3>
            <div className="text-xs text-slate-500">
              <span className="font-semibold text-indigo-600">{logs.length}</span> logs
            </div>
          </div>

          <div className="space-y-3">
            {logs.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scale size={32} />
                </div>
                <p className="text-slate-500 font-medium">No logs yet. Get started!</p>
              </div>
            ) : (
              logs.map((log) => {
                const diff = targetWeight - log.weight;
                return (
                  <div key={log.id} className="bg-white p-4 md:p-5 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between group hover:border-indigo-100 transition-all gap-4">
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="text-center min-w-[50px] md:min-w-[60px]">
                        <p className="text-xl md:text-2xl font-black text-slate-900 leading-none">{log.weight}</p>
                        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">kg</p>
                      </div>
                      <div className="h-10 w-[1px] bg-slate-100"></div>
                      <div>
                        <div className="flex items-center gap-2 md:gap-3 mb-1">
                          {log.timeOfDay === 'evening' ? (
                            <Moon size={14} className="text-indigo-500" />
                          ) : (
                            <Sun size={14} className="text-amber-500" />
                          )}
                          <p className="text-xs font-bold text-slate-700">
                            {log.timeOfDay === 'evening' ? 'Evening' : 'Morning'}
                          </p>
                          <span className="text-slate-300">•</span>
                          <p className="text-[10px] md:text-xs font-medium text-slate-500">
                            {new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        {log.note && (
                          <div className="flex items-center gap-2">
                            <FileText size={12} className="text-slate-400" />
                            <p className="text-[10px] md:text-sm text-slate-400 italic truncate max-w-[150px] sm:max-w-[200px]">{log.note}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 pt-3 sm:pt-0">
                      <div className={`px-2 py-1 rounded-lg text-[9px] md:text-xs font-bold ${diff > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {Math.abs(diff).toFixed(1)} kg {diff > 0 ? 'above' : 'below'} goal
                      </div>
                      <button 
                        onClick={() => onDelete(log.id)}
                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeightTracker;
