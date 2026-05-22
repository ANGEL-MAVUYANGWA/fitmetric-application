
import React from 'react';
import { HealthData } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Target, 
  Calendar,
  ChevronLeft,
  Scale,
  TrendingDown
} from 'lucide-react';

interface AnalyticsProps {
  data: HealthData;
}

const Analytics: React.FC<AnalyticsProps> = ({ data }) => {
  const logs = [...data.weightLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const currentWeight = data.weightLogs[0]?.weight || data.profile.startingWeight;
  const startingWeight = data.profile.startingWeight;
  const targetWeight = data.profile.targetWeight;
  
  const isLossGoal = data.profile.goalType === 'lose';
  const weightDiff = startingWeight - currentWeight;
  const totalChange = isLossGoal ? weightDiff : -weightDiff;
  const remaining = isLossGoal ? (currentWeight - targetWeight) : (targetWeight - currentWeight);

  const weights = logs.length > 0 ? logs.map(l => l.weight) : [startingWeight];
  const maxW = Math.max(...weights, startingWeight, targetWeight);
  const minW = Math.min(...weights, startingWeight, targetWeight);
  const range = maxW - minW || 10;
  
  // Define safe internal paddings for the SVG coordinate system
  const chartPaddingLeft = 60;
  const chartPaddingRight = 20;
  const chartPaddingTop = 40;
  const chartPaddingBottom = 40;
  
  const chartWidth = 1000;
  const chartHeight = 400;

  const getX = (index: number) => {
    if (logs.length <= 1) return (chartWidth - chartPaddingLeft - chartPaddingRight) / 2 + chartPaddingLeft;
    return (index / (logs.length - 1)) * (chartWidth - chartPaddingLeft - chartPaddingRight) + chartPaddingLeft;
  };

  const getY = (val: number) => {
    return (chartHeight - chartPaddingBottom) - ((val - minW) / range) * (chartHeight - chartPaddingTop - chartPaddingBottom);
  };

  const linePath = logs.length > 1 
    ? logs.map((log, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(log.weight)}`).join(' ')
    : '';

  const areaPath = logs.length > 1 
    ? `${linePath} L ${getX(logs.length - 1)} ${chartHeight - chartPaddingBottom} L ${getX(0)} ${chartHeight - chartPaddingBottom} Z`
    : '';

  return (
    <div className="space-y-6 md:space-y-8 view-transition pb-12 w-full max-w-full overflow-x-hidden">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 px-1">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">Health Analytics</h2>
          <p className="text-slate-500 text-sm font-medium">Trajectory & Performance</p>
        </div>
        <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2 self-start md:self-auto">
          <Calendar size={14} className="text-indigo-600" />
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
            {logs.length} Datapoints
          </span>
        </div>
      </header>

      {/* Stats Cards - Adaptive Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-3">
            <TrendingUp size={20} />
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Net Change</p>
          <div className="flex items-baseline gap-1">
            <h4 className={`text-2xl font-black ${totalChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(1)}<span className="text-xs ml-0.5">kg</span>
            </h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-3">
            <Target size={20} />
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Target Delta</p>
          <div className="flex items-baseline gap-1">
            <h4 className="text-2xl font-black text-slate-900">{remaining.toFixed(1)}<span className="text-xs ml-0.5">kg</span></h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-3">
            <Award size={20} />
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Weekly Pace</p>
          <div className="flex items-baseline gap-1">
            <h4 className="text-2xl font-black text-slate-900">
              {logs.length > 2 
                ? (Math.abs(logs[logs.length-1].weight - logs[0].weight) / (Math.max(1, logs.length / 7))).toFixed(2)
                : '—'}<span className="text-xs ml-0.5">kg</span>
            </h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-3">
            <BarChart3 size={20} />
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Log Consistency</p>
          <div className="flex items-baseline gap-1">
            <h4 className="text-2xl font-black text-slate-900">
              {Math.min(100, (logs.length * 5)).toFixed(0)}<span className="text-xs ml-0.5">%</span>
            </h4>
          </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="bg-white p-5 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-10">
          <div>
            <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight uppercase">Evolution</h3>
            <p className="text-[10px] md:text-xs text-slate-400 font-medium tracking-wide uppercase">Baseline: {startingWeight}kg • Target: {targetWeight}kg</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Weight</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-0.5 bg-slate-200"></div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Goal</span>
            </div>
          </div>
        </div>

        <div className="relative w-full aspect-[16/9] min-h-[220px] max-h-[400px]">
          {logs.length < 2 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 p-6 text-center">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-3">
                <Scale size={24} className="text-slate-200" />
              </div>
              <p className="text-slate-400 font-bold text-xs max-w-[160px]">Not enough data to visualize trends yet.</p>
            </div>
          ) : (
            <div className="w-full h-full overflow-hidden">
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
                  const y = chartPaddingTop + p * (chartHeight - chartPaddingTop - chartPaddingBottom);
                  const val = maxW - p * range;
                  return (
                    <g key={i}>
                      <line x1={chartPaddingLeft} y1={y} x2={chartWidth - chartPaddingRight} y2={y} stroke="#f8fafc" strokeWidth="2" />
                      <text x={chartPaddingLeft - 10} y={y + 5} textAnchor="end" className="text-[18px] font-black fill-slate-300">{Math.round(val)}</text>
                    </g>
                  );
                })}
                <line x1={chartPaddingLeft} y1={getY(targetWeight)} x2={chartWidth - chartPaddingRight} y2={getY(targetWeight)} stroke="#e2e8f0" strokeWidth="2" strokeDasharray="8 8" />
                <path d={areaPath} fill="url(#chartGradient)" className="opacity-10" />
                <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                {logs.map((log, i) => (
                  <circle key={log.id} cx={getX(i)} cy={getY(log.weight)} r="10" className="fill-white stroke-indigo-600 stroke-[5px]" />
                ))}
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#fff" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-5 pt-8 border-t border-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <ChevronLeft size={16} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Base</p>
              <p className="text-sm font-black text-slate-900">{startingWeight}kg</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Award size={16} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Peak</p>
              <p className="text-sm font-black text-slate-900">
                {isLossGoal ? Math.min(...weights).toFixed(1) : Math.max(...weights).toFixed(1)}kg
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 xs:col-span-2 md:col-span-1">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <Target size={16} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Last Update</p>
              <p className="text-sm font-black text-slate-900">
                {logs.length > 1 ? (logs[logs.length-1].weight - logs[logs.length-2].weight).toFixed(1) : '0.0'}kg
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
