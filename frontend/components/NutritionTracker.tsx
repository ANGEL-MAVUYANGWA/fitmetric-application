
import React, { useState, useRef } from 'react';
import { FoodEntry, WaterLog, PlannedMeal, UserProfile } from '../types.ts';
import { 
  Plus, 
  Trash2, 
  Utensils, 
  Sparkles, 
  Loader2, 
  Apple, 
  Droplets, 
  Coffee, 
  Beer, 
  Wine,
  GlassWater,
  Camera,
  X,
  Check,
  Scale as ScaleIcon,
  Calendar,
  ShoppingCart,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  Info,
  Keyboard,
  Save
} from 'lucide-react';
import { analyzeFood, analyzeNutritionalLabel, getMealPlanSuggestions, generateShoppingList } from '../services/geminiService.ts';

interface NutritionTrackerProps {
  entries: FoodEntry[];
  waterLogs: WaterLog[];
  mealPlan: PlannedMeal[];
  profile: UserProfile;
  calorieGoal: number;
  waterGoal: number;
  onAdd: (entry: Omit<FoodEntry, 'id'>) => void;
  onAddWater: (amount: number) => void;
  onSetMealPlan: (plan: PlannedMeal[]) => void;
  onDelete: (id: string) => void;
  onDeleteWater: (id: string) => void;
}

interface PendingScan {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSizeWeight?: number;
  ingredients?: string[];
}

export default function NutritionTracker({ 
  entries, 
  waterLogs, 
  mealPlan,
  profile,
  calorieGoal, 
  waterGoal, 
  onAdd, 
  onAddWater, 
  onSetMealPlan,
  onDelete, 
  onDeleteWater 
}: NutritionTrackerProps) {
  const [activeTab, setActiveTab] = useState<'daily' | 'mealprep'>('daily');
  const [description, setDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [pendingScan, setPendingScan] = useState<PendingScan | null>(null);
  const [portion, setPortion] = useState<number>(1);
  const [customWeight, setCustomWeight] = useState<string>('');
  const [generatingList, setGeneratingList] = useState(false);
  const [shoppingList, setShoppingList] = useState<{ category: string, items: string[] }[] | null>(null);
  
  // Manual Entry State
  const [showManual, setShowManual] = useState(false);
  const [manualForm, setManualForm] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const today = new Date().toDateString();
  const todayEntries = entries.filter(e => new Date(e.date).toDateString() === today);
  const todayWaterLogs = waterLogs.filter(w => new Date(w.date).toDateString() === today);
  
  const totals = todayEntries.reduce((acc, curr) => ({
    calories: acc.calories + curr.calories,
    protein: acc.protein + curr.protein,
    carbs: acc.carbs + curr.carbs,
    fat: acc.fat + curr.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const waterTotal = todayWaterLogs.reduce((acc, curr) => acc + curr.amount, 0);

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Could not access camera.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext('2d');
    if (!context) return;
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    const base64Image = canvasRef.current.toDataURL('image/jpeg', 0.8).split(',')[1];
    stopCamera();
    setAnalyzing(true);
    try {
      const result = await analyzeNutritionalLabel(base64Image);
      setPendingScan(result);
      setPortion(1);
      setCustomWeight('');
    } catch (error) {
      alert("Label scanning failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAIAnalyze = async () => {
    if (!description) return;
    setAnalyzing(true);
    try {
      const result = await analyzeFood(description);
      onAdd({ ...result, date: new Date().toISOString() });
      setDescription('');
    } catch (error) {
      alert("AI analysis failed.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.name || !manualForm.calories) return;
    
    onAdd({
      name: manualForm.name,
      calories: parseInt(manualForm.calories) || 0,
      protein: parseFloat(manualForm.protein) || 0,
      carbs: parseFloat(manualForm.carbs) || 0,
      fat: parseFloat(manualForm.fat) || 0,
      date: new Date().toISOString()
    });
    
    setManualForm({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    setShowManual(false);
  };

  const savePendingScan = () => {
    if (!pendingScan) return;
    let multiplier = portion;
    if (customWeight && pendingScan.servingSizeWeight) {
      multiplier = parseFloat(customWeight) / pendingScan.servingSizeWeight;
    }
    onAdd({
      name: pendingScan.name,
      calories: Math.round(pendingScan.calories * multiplier),
      protein: parseFloat((pendingScan.protein * multiplier).toFixed(1)),
      carbs: parseFloat((pendingScan.carbs * multiplier).toFixed(1)),
      fat: parseFloat((pendingScan.fat * multiplier).toFixed(1)),
      date: new Date().toISOString()
    });
    setPendingScan(null);
  };

  const suggestMealPlan = async () => {
    setAnalyzing(true);
    try {
      const suggestions = await getMealPlanSuggestions(profile);
      if (suggestions && suggestions.length > 0) {
        const newPlan = suggestions.map((s: any) => ({
          ...s,
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          dayOfWeek: typeof s.dayOfWeek === 'number' ? s.dayOfWeek : 0 
        }));
        onSetMealPlan(newPlan);
      }
    } catch (error) {
      console.error("Failed to fetch plan:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerateShoppingList = async () => {
    if (mealPlan.length === 0) return;
    setGeneratingList(true);
    const list = await generateShoppingList(mealPlan);
    setShoppingList(list);
    setGeneratingList(false);
  };

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const mealTypes = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner', 'snack3'];

  const weeklyStats = mealPlan.reduce((acc, curr) => ({
    calories: acc.calories + curr.calories,
    protein: acc.protein + curr.protein,
    carbs: acc.carbs + curr.carbs,
    fat: acc.fat + curr.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <div className="space-y-6 md:space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12 w-full max-w-full overflow-x-hidden">
      <canvas ref={canvasRef} className="hidden" />
      
      {showCamera && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-0 md:p-4">
          <div className="relative w-full h-full md:h-auto md:max-w-lg md:aspect-[3/4] md:rounded-3xl overflow-hidden bg-slate-900 shadow-2xl">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 border-2 border-dashed border-white/30 pointer-events-none m-12 md:m-8 rounded-2xl"></div>
            <button onClick={stopCamera} className="absolute top-10 right-6 md:top-6 md:right-6 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all">
              <X size={24} />
            </button>
            <div className="absolute bottom-16 md:bottom-10 inset-x-0 flex flex-col items-center gap-4 px-8">
              <button onClick={captureAndScan} className="w-20 h-20 bg-white border-8 border-white/20 rounded-full flex items-center justify-center transition-transform active:scale-90">
                <div className="w-12 h-12 bg-indigo-600 rounded-full"></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingScan && (
        <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-6 md:p-8">
            <h3 className="text-xl font-black mb-6">Confirm Scan</h3>
            <div className="space-y-4 mb-8">
              <p className="font-bold text-slate-900">{pendingScan.name}</p>
              <div className="bg-slate-50 p-4 rounded-xl flex justify-between">
                <span>{Math.round(pendingScan.calories * portion)} kcal</span>
                <span className="text-slate-400">P:{Math.round(pendingScan.protein * portion)}g</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setPendingScan(null)} className="flex-1 font-bold text-slate-400">Cancel</button>
              <button onClick={savePendingScan} className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl">Add</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex bg-slate-100 p-1 rounded-2xl md:rounded-[2rem] w-fit mx-auto md:mx-0">
        <button 
          onClick={() => setActiveTab('daily')}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl md:rounded-[1.5rem] font-bold text-xs md:text-sm transition-all ${activeTab === 'daily' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
        >
          <LayoutGrid size={16} /> Daily Tracker
        </button>
        <button 
          onClick={() => setActiveTab('mealprep')}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl md:rounded-[1.5rem] font-bold text-xs md:text-sm transition-all ${activeTab === 'mealprep' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
        >
          <Calendar size={16} /> Meal Prep
        </button>
      </div>

      {activeTab === 'daily' ? (
        <>
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 px-1">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Nutrition & Hydration</h2>
              <p className="text-xs md:text-sm text-slate-500 mt-1">Live updates for {new Date().toLocaleDateString(undefined, { weekday: 'long' })}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="bg-white px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Energy</p>
                  <p className="text-xl font-black text-slate-900">{totals.calories} <span className="text-xs text-slate-400 font-medium lowercase">/ {calorieGoal}</span></p>
                </div>
                <div className="flex gap-3">
                  <div className="text-center">
                    <p className="text-[9px] font-bold text-indigo-400 uppercase leading-none mb-1">P</p>
                    <p className="text-sm font-bold leading-none">{Math.round(totals.protein)}g</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-bold text-amber-400 uppercase leading-none mb-1">C</p>
                    <p className="text-sm font-bold leading-none">{Math.round(totals.carbs)}g</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-bold text-rose-400 uppercase leading-none mb-1">F</p>
                    <p className="text-sm font-bold leading-none">{Math.round(totals.fat)}g</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-1 space-y-4 md:space-y-6">
              <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden relative">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
                <h3 className="text-lg font-bold mb-3 md:mb-4 flex items-center gap-2 text-indigo-600">
                  <Camera size={20} />
                  Label Scanner
                </h3>
                <button onClick={startCamera} className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 text-sm">
                  <Camera size={20} /> Open Scanner
                </button>
              </div>

              <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-violet-600">
                    <Sparkles size={20} />
                    AI Food Search
                  </h3>
                  <button 
                    onClick={() => setShowManual(!showManual)}
                    className="text-[10px] font-black uppercase text-indigo-500 hover:text-indigo-700 underline tracking-widest"
                  >
                    {showManual ? 'Close Manual' : 'Log Manually'}
                  </button>
                </div>
                
                {!showManual ? (
                  <div className="animate-in fade-in duration-300">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={analyzing}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 h-28 resize-none mb-4 text-sm"
                      placeholder="E.g., 'Large avocado toast with one egg...'"
                    />
                    <button
                      onClick={handleAIAnalyze}
                      disabled={analyzing || !description}
                      className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-slate-100 text-white font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 text-sm"
                    >
                      {analyzing ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={18} />}
                      Analyze Entry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleManualAdd} className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Food Name</label>
                      <input 
                        type="text" 
                        required
                        value={manualForm.name}
                        onChange={e => setManualForm({...manualForm, name: e.target.value})}
                        placeholder="E.g., Chicken Salad"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Calories</label>
                        <input 
                          type="number" 
                          required
                          value={manualForm.calories}
                          onChange={e => setManualForm({...manualForm, calories: e.target.value})}
                          placeholder="kcal"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Protein (g)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          value={manualForm.protein}
                          onChange={e => setManualForm({...manualForm, protein: e.target.value})}
                          placeholder="g"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Carbs (g)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          value={manualForm.carbs}
                          onChange={e => setManualForm({...manualForm, carbs: e.target.value})}
                          placeholder="g"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Fat (g)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          value={manualForm.fat}
                          onChange={e => setManualForm({...manualForm, fat: e.target.value})}
                          placeholder="g"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 text-sm"
                    >
                      <Save size={18} />
                      Save Log
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">Today's Log</h3>
                </div>
                <div className="divide-y divide-slate-50">
                  {todayEntries.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                      <Utensils className="mx-auto mb-4 opacity-20" size={40} />
                      <p className="font-bold text-sm">No records for today yet.</p>
                    </div>
                  ) : (
                    todayEntries.map(entry => (
                      <div key={entry.id} className="p-4 md:p-5 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-slate-50 text-slate-600 rounded-2xl">
                            <Apple size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{entry.name}</p>
                            <p className="text-[10px] font-medium text-slate-400 mt-0.5">{entry.calories} kcal • P:{entry.protein}g C:{entry.carbs}g F:{entry.fat}g</p>
                          </div>
                        </div>
                        <button onClick={() => onDelete(entry.id)} className="p-2 text-slate-300 hover:text-rose-500 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-6 md:space-y-8 animate-in slide-in-from-right-4 duration-300">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Meal Prep Planner</h2>
              <p className="text-xs md:text-sm text-slate-500 mt-1">Plan your weekly nutrition strategy with AI assistance.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={suggestMealPlan}
                disabled={analyzing}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-indigo-100 disabled:bg-slate-300"
              >
                {analyzing ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                Suggest Week Plan
              </button>
              <button 
                onClick={handleGenerateShoppingList}
                disabled={generatingList || mealPlan.length === 0}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-100 disabled:bg-slate-300"
              >
                {generatingList ? <Loader2 className="animate-spin" size={16} /> : <ShoppingCart size={16} />}
                Generate Shop List
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl">
                <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-indigo-400">Weekly Target</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1">
                      <span>Calories</span>
                      <span>{Math.round(weeklyStats.calories / 7)} avg/day</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full" style={{ width: `${Math.min(100, (weeklyStats.calories / (calorieGoal * 7)) * 100)}%` }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-4">
                    <div className="bg-white/5 p-3 rounded-2xl text-center">
                      <p className="text-[8px] font-black text-slate-400 uppercase">Prot</p>
                      <p className="text-xs font-bold">{Math.round(weeklyStats.protein / 7)}g</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-2xl text-center">
                      <p className="text-[8px] font-black text-slate-400 uppercase">Carb</p>
                      <p className="text-xs font-bold">{Math.round(weeklyStats.carbs / 7)}g</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-2xl text-center">
                      <p className="text-[8px] font-black text-slate-400 uppercase">Fat</p>
                      <p className="text-xs font-bold">{Math.round(weeklyStats.fat / 7)}g</p>
                    </div>
                  </div>
                </div>
              </div>

              {shoppingList && (
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black uppercase tracking-tight text-sm flex items-center gap-2">
                      <ShoppingCart size={16} className="text-emerald-600" /> Shopping List
                    </h3>
                    <button onClick={() => setShoppingList(null)} className="text-slate-300 hover:text-slate-500"><X size={16} /></button>
                  </div>
                  <div className="space-y-4 h-[400px] overflow-y-auto pr-2 scrollbar-none">
                    {shoppingList.map((cat, i) => (
                      <div key={i}>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">{cat.category}</p>
                        <div className="space-y-2">
                          {cat.items.map((item, j) => (
                            <div key={j} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                              <div className="w-1 h-1 rounded-full bg-emerald-400" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {days.map((day, dayIdx) => {
                  const dayMeals = mealPlan.filter(m => m.dayOfWeek === dayIdx);
                  const dayCalories = dayMeals.reduce((sum, m) => sum + m.calories, 0);
                  
                  return (
                    <div key={dayIdx} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                      <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-50 flex items-center justify-between">
                        <span className="font-black text-xs uppercase tracking-tight text-slate-900">{day}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${dayCalories > calorieGoal ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                            {dayCalories} kcal
                          </span>
                        </div>
                      </div>
                      <div className="p-4 space-y-3 flex-1">
                        {mealTypes.map(type => {
                          const meal = dayMeals.find(m => m.mealType === type);
                          const label = type.startsWith('snack') ? 'Snack ' + type.slice(-1) : type;
                          return (
                            <div key={type} className="flex items-center justify-between p-3 bg-slate-50/50 border border-slate-100 rounded-2xl group transition-all hover:bg-white hover:shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-[10px] font-black uppercase shadow-sm ${
                                  type === 'breakfast' ? 'bg-amber-400' :
                                  type === 'lunch' ? 'bg-blue-400' :
                                  type === 'dinner' ? 'bg-indigo-400' : 'bg-emerald-400'
                                }`}>
                                  {type[0]}
                                </div>
                                <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
                                  <p className="text-xs font-bold text-slate-900 line-clamp-1">{meal ? meal.name : 'Not planned'}</p>
                                </div>
                              </div>
                              {meal && (
                                <button 
                                  onClick={() => onSetMealPlan(mealPlan.filter(m => m.id !== meal.id))}
                                  className="p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
