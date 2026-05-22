
import React from 'react';
import { 
  Scale, 
  Sparkles, 
  Target, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Utensils, 
  Pill, 
  BarChart3,
  CheckCircle2,
  Crown,
  LogIn
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Scale size={24} />
          </div>
          <span className="text-xl font-black tracking-tight">FitMetric <span className="text-indigo-600">Pro</span></span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onStart}
            className="text-slate-600 font-bold text-sm hover:text-indigo-600 transition-colors flex items-center gap-2"
          >
            <LogIn size={18} /> Login
          </button>
          <button 
            onClick={onStart}
            className="hidden md:block bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95"
          >
            Join Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-16 pb-24 md:pt-24 md:pb-32 max-w-7xl mx-auto text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-indigo-50/50 blur-[120px] rounded-full -z-10"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles size={14} /> AI-Powered Health Intelligence
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          Transform your body with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">precision data.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
          The all-in-one weight tracking application. From AI food analysis to vitamin protocols and deep analytics. Everything you need to succeed.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <button 
            onClick={onStart}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            Create Your Account <ArrowRight size={20} />
          </button>
          <div className="flex items-center gap-4 px-6 py-3 rounded-2xl border border-slate-100 bg-white/50 backdrop-blur-sm">
             <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="user" />
                  </div>
                ))}
             </div>
             <div className="text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Joined by</p>
                <p className="text-xs font-bold text-slate-900">1,200+ achievers</p>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Engineered for results</h2>
            <p className="text-slate-500 font-medium">Why FitMetric Pro stands in a class of its own.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Vision Scanner</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Scan nutrition labels with your camera. Our Gemini AI extracts macros instantly, so you don't have to type.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Precision Weight Logs</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Track morning and evening fluctuations. Understand how your body changes throughout the 24-hour cycle.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Deep Analytics</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Visualize your trajectory. Our advanced charts show you exactly where you're headed and when you'll reach your goal.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Utensils size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Meal Prep</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                AI-generated weekly meal plans and shopping lists tailored to your specific caloric and macro goals.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Pill size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Medication Protocols</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Never miss a vitamin or medication. Track adherence alongside your weight logs for a holistic health view.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Crown size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Health Assistant</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Chat with your dedicated AI health coach. Get answers to nutrition questions based on your real data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[100px] -mr-32 -mt-32"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8">Ready to start?</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="text-indigo-400" size={24} />
                  <p className="font-bold text-lg">No subscription required for basic features</p>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="text-indigo-400" size={24} />
                  <p className="font-bold text-lg">Your data is stored locally and securely</p>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="text-indigo-400" size={24} />
                  <p className="font-bold text-lg">Cancel PRO membership anytime with one click</p>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full max-w-sm">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-900">
                      <Zap size={24} />
                   </div>
                   <div>
                      <p className="font-black uppercase tracking-widest text-xs text-indigo-400">Limited Time</p>
                      <h3 className="font-black text-2xl">PRO Membership</h3>
                   </div>
                </div>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-5xl font-black">R19</span>
                  <span className="text-slate-400 font-bold">/ mo</span>
                </div>
                <button 
                  onClick={onStart}
                  className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all active:scale-95"
                >
                  GET STARTED
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-slate-100 max-w-7xl mx-auto text-center">
        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">© 2025 FitMetric Pro Intelligence. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
