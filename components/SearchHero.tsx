import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchHeroProps {
  onSearch: (drugName: string) => void;
  isLoading: boolean;
}

export const SearchHero: React.FC<SearchHeroProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white pt-16 pb-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Stop overpaying for prescriptions.
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Compare prices, find free coupons, and save up to 80% instantly at pharmacies near you. Powered by AI.
        </p>

        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto flex items-center shadow-2xl shadow-blue-100/50 bg-white p-2 rounded-2xl border border-slate-100">
          <div className="flex-1 flex items-center px-4 py-3">
            <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Enter drug name (e.g. Lipitor)"
              className="w-full bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 font-medium text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading || !query}
            className="bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all transform active:scale-95 flex items-center justify-center min-w-[140px] h-[52px]"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              'Find Prices'
            )}
          </button>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-500">
          <span className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>100% Free to use</span>
          <span className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>No insurance required</span>
          <span className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>Accepted at 70k+ pharmacies</span>
        </div>
      </div>
    </div>
  );
};