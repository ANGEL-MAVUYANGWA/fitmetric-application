
import React, { useState } from 'react';
import { BodyMeasurement } from '../types';
import { Plus, Trash2, Ruler, Calendar } from 'lucide-react';

interface MeasurementTrackerProps {
  measurements: BodyMeasurement[];
  onAdd: (m: Omit<BodyMeasurement, 'id'>) => void;
  onDelete: (id: string) => void;
}

const MeasurementTracker: React.FC<MeasurementTrackerProps> = ({ measurements, onAdd, onDelete }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [form, setForm] = useState({
    waist: '',
    chest: '',
    hips: '',
    thighs: '',
    arms: '',
    neck: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      date,
      waist: form.waist ? parseFloat(form.waist) : undefined,
      chest: form.chest ? parseFloat(form.chest) : undefined,
      hips: form.hips ? parseFloat(form.hips) : undefined,
      thighs: form.thighs ? parseFloat(form.thighs) : undefined,
      arms: form.arms ? parseFloat(form.arms) : undefined,
      neck: form.neck ? parseFloat(form.neck) : undefined,
    });
    setForm({ waist: '', chest: '', hips: '', thighs: '', arms: '', neck: '' });
  };

  const fields = [
    { key: 'waist', label: 'Waist' },
    { key: 'chest', label: 'Chest' },
    { key: 'hips', label: 'Hips' },
    { key: 'thighs', label: 'Thighs' },
    { key: 'arms', label: 'Arms' },
    { key: 'neck', label: 'Neck' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Body Measurements</h2>
        <p className="text-slate-500 mt-1">Track non-scale victories and physical changes.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Plus size={20} className="text-amber-600" />
              New Entry
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {fields.map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{f.label} (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={(form as any)[f.key]}
                      onChange={(e) => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm"
                      placeholder="0.0"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-amber-100 transition-all active:scale-[0.98] mt-2"
              >
                Log Measurements
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {measurements.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ruler size={32} />
              </div>
              <p className="text-slate-500 font-medium">No measurements yet. Visualizing progress helps!</p>
            </div>
          ) : (
            measurements.map((m) => (
              <div key={m.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-amber-500" />
                    <h4 className="font-bold text-slate-900">{new Date(m.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</h4>
                  </div>
                  <button 
                    onClick={() => onDelete(m.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {fields.map((f) => {
                    const val = (m as any)[f.key];
                    return (
                      <div key={f.key} className="text-center p-3 bg-slate-50 rounded-2xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{f.label}</p>
                        <p className="text-lg font-bold text-slate-800">{val || '—'}<span className="text-[10px] ml-1">cm</span></p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MeasurementTracker;
