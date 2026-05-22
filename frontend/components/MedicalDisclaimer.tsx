
import React from 'react';
import { Info } from 'lucide-react';

const MedicalDisclaimer: React.FC = () => (
  <div className="mt-12 p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
      <Info size={20} className="text-slate-400" />
    </div>
    <div className="space-y-1">
      <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Medical Disclaimer</p>
      <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed">
        FitMetric Pro is a measurement application designed to assist users in tracking and managing their weight. 
        It is <span className="font-bold text-slate-900">not a dietician service</span> and does <span className="font-bold text-slate-900">not provide medical or weight loss advice</span>. 
        All information, including AI-generated insights, is for educational and tracking purposes only. Always consult with a qualified healthcare professional 
        before starting any new diet, nutrition, or exercise program.
      </p>
    </div>
  </div>
);

export default MedicalDisclaimer;
