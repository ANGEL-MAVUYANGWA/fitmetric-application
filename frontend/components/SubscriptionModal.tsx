
import React, { useState } from 'react';
import { X, CheckCircle2, Crown, ShieldCheck, CreditCard, Sparkles, Zap, Loader2 } from 'lucide-react';

interface SubscriptionModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function SubscriptionModal({ onClose, onSuccess }: SubscriptionModalProps) {
  const [step, setStep] = useState<'benefits' | 'payment'>('benefits');
  const [processing, setProcessing] = useState(false);

  const handleSubscribe = () => {
    setProcessing(true);
    // Mock payment processing delay
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl md:rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300 my-auto">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:top-8 md:right-8 p-2 text-slate-400 hover:text-slate-600 transition-colors z-20 bg-white/10 md:bg-transparent rounded-full backdrop-blur-sm"
        >
          <X size={24} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Side: Visuals */}
          <div className="bg-slate-900 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-3xl rounded-full -mr-20 -mt-20"></div>
            
            <div className="relative z-10 mb-8 md:mb-0">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 md:mb-8 shadow-xl shadow-indigo-600/30">
                <Crown size={32} className="text-amber-300" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-none mb-3 md:mb-4">FitMetric <span className="text-indigo-500">PRO</span></h2>
              <p className="text-slate-400 font-medium text-sm md:text-base">Elevate your health journey with advanced AI and tracking features.</p>
            </div>

            <div className="relative z-10 space-y-4 md:space-y-6 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 size={16} />
                </div>
                <p className="text-sm font-bold text-slate-200">AI Nutrient Label Scanning</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <CheckCircle2 size={16} />
                </div>
                <p className="text-sm font-bold text-slate-200">Advanced AI Insights</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <CheckCircle2 size={16} />
                </div>
                <p className="text-sm font-bold text-slate-200">Custom Log Reminders</p>
              </div>
            </div>

            <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/10 relative z-10">
              <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Total Monthly</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-black text-white">R19</span>
                <span className="text-slate-500 font-bold text-sm md:text-base">/ month</span>
              </div>
            </div>
          </div>

          {/* Right Side: Action */}
          <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
            {step === 'benefits' ? (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-6 md:space-y-8 mb-10 md:mb-12">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm md:text-base">Limitless AI Insights</h4>
                      <p className="text-[10px] md:text-sm text-slate-500">Personalized macro and trend analysis powered by Gemini.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm md:text-base">Custom Automation</h4>
                      <p className="text-[10px] md:text-sm text-slate-500">Smart reminders that fit your unique daily schedule.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm md:text-base">Cloud Sync</h4>
                      <p className="text-[10px] md:text-sm text-slate-500">Your health data is safe, encrypted, and synced everywhere.</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setStep('payment')}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 md:py-5 rounded-xl md:rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  UPGRADE NOW
                </button>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 mb-6 md:mb-8">Secure Checkout</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="space-y-1">
                    <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase ml-1">Card Holder</label>
                    <input 
                      type="text" 
                      placeholder="NAME ON CARD" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 md:px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase ml-1">Card Number</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="•••• •••• •••• ••••" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 md:px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                      <CreditCard className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase ml-1">Expiry</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 md:px-5 py-3 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase ml-1">CVC</label>
                      <input 
                        type="password" 
                        placeholder="•••" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 md:px-5 py-3 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                  <button 
                    onClick={() => setStep('benefits')}
                    className="order-2 md:order-1 flex-1 py-3 md:py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors text-sm md:text-base"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleSubscribe}
                    disabled={processing}
                    className="order-1 md:order-2 flex-[2] bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-black py-4 rounded-xl md:rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    {processing ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                    {processing ? 'Processing...' : 'ACTIVATE PRO'}
                  </button>
                </div>
                
                <p className="text-[9px] text-center text-slate-400 font-medium mt-6">
                  By upgrading, you agree to monthly billing of R19. Cancel anytime in settings.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
