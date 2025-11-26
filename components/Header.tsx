import React from 'react';
import { Pill } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="bg-teal-500 p-1.5 rounded-lg">
            <Pill className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">RxSaver<span className="text-teal-500">AI</span></span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <span className="text-slate-600 hover:text-slate-900 font-medium text-sm cursor-pointer">Drugs A-Z</span>
          <span className="text-slate-600 hover:text-slate-900 font-medium text-sm cursor-pointer">Coupons</span>
          <span className="text-slate-600 hover:text-slate-900 font-medium text-sm cursor-pointer">Savings Tips</span>
        </nav>

        <div className="flex items-center gap-4">
          <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors shadow-sm shadow-teal-200">
            Get Savings Card
          </button>
        </div>
      </div>
    </header>
  );
};