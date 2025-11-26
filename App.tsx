import React, { useState } from 'react';
import { Header } from './components/Header';
import { SearchHero } from './components/SearchHero';
import { ResultsView } from './components/ResultsView';
import { fetchDrugPricing } from './services/geminiService';
import { SearchState } from './types';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<SearchState>({
    isLoading: false,
    error: null,
    data: null,
    hasSearched: false,
  });
  
  const performSearch = async (drugName: string, dosage?: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const data = await fetchDrugPricing(drugName, dosage);
      setState({
        isLoading: false,
        error: null,
        data,
        hasSearched: true,
      });
    } catch (error) {
      console.error(error);
      setState({
        isLoading: false,
        error: "We couldn't find pricing information for that drug right now. Please try again or try a different drug name.",
        data: null,
        hasSearched: true,
      });
    }
  };

  const handleInitialSearch = (drugName: string) => {
    performSearch(drugName);
  };

  const handleConfigurationChange = (drugName: string, dosage: string) => {
    performSearch(drugName, dosage);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      
      {!state.hasSearched ? (
        <div className="flex-1 flex flex-col">
          <SearchHero onSearch={handleInitialSearch} isLoading={state.isLoading} />
          
          {/* Features Grid - Only shown on home */}
          <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-12">
                <div className="text-center px-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Compare Prices</h3>
                  <p className="text-slate-600 leading-relaxed">Instantly search for your medication to see prices at all major pharmacies near you.</p>
                </div>
                <div className="text-center px-4">
                  <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-teal-600">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Get Free Coupons</h3>
                  <p className="text-slate-600 leading-relaxed">Show the coupon to your pharmacist and save up to 80% off the retail price instantly.</p>
                </div>
                <div className="text-center px-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-600">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Save Money</h3>
                  <p className="text-slate-600 leading-relaxed">Americans save millions every year. No fees, no obligations, just savings.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="flex-1">
           <div className="bg-white border-b border-slate-200">
             <div className="max-w-6xl mx-auto px-4 py-4">
                <button 
                  onClick={() => setState(prev => ({ ...prev, hasSearched: false, data: null }))}
                  className="text-sm font-medium text-slate-500 hover:text-teal-600 flex items-center"
                >
                  ← Back to search
                </button>
             </div>
           </div>

           {state.isLoading ? (
             <div className="flex flex-col items-center justify-center py-32">
               <Loader2 className="w-10 h-10 text-teal-500 animate-spin mb-4" />
               <h3 className="text-xl font-medium text-slate-900">Finding the best prices...</h3>
               <p className="text-slate-500 mt-2">Checking pharmacy discounts for you</p>
             </div>
           ) : state.error ? (
             <div className="max-w-md mx-auto mt-20 text-center px-4">
               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
               </div>
               <h3 className="text-lg font-bold text-slate-900 mb-2">Search Failed</h3>
               <p className="text-slate-600 mb-6">{state.error}</p>
               <button 
                 onClick={() => setState(prev => ({ ...prev, hasSearched: false }))}
                 className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors"
               >
                 Try Again
               </button>
             </div>
           ) : (
             state.data && <ResultsView data={state.data} onConfigurationChange={handleConfigurationChange} />
           )}
        </div>
      )}
      
      <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">© 2024 RxSaver AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;