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
      </div>
    </header>
  );
};