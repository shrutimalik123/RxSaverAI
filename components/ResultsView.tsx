import React, { useState, useEffect } from 'react';
import { DrugDetails, PharmacyPricing } from '../types';
import { Tag, ExternalLink, AlertCircle, CheckCircle2, MapPin, ArrowRight, Settings2 } from 'lucide-react';

interface ResultsViewProps {
  data: DrugDetails;
  onConfigurationChange: (drugName: string, dosage: string) => void;
}

const PharmacyCard: React.FC<{ pricing: PharmacyPricing; quantityMultiplier: number }> = ({ pricing, quantityMultiplier }) => {
  // Calculate dynamic prices based on quantity selection
  // Note: In a real app, bulk pricing isn't always linear, but this is a good approximation for a demo
  const retailPrice = pricing.retailPrice * quantityMultiplier;
  const couponPrice = pricing.couponPrice * quantityMultiplier;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 mb-4 hover:shadow-lg transition-shadow duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
      <div className="flex items-start gap-4">
        {/* Placeholder Logo */}
        <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
           {pricing.pharmacyName.substring(0, 3)}
        </div>
        
        <div>
          <h3 className="font-bold text-lg text-slate-900 group-hover:text-teal-600 transition-colors">
            {pricing.pharmacyName}
          </h3>
          <div className="flex items-center text-sm text-slate-500 mt-1">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            <span>{pricing.distance || '1.2 miles'} • {pricing.isOpen ? 'Open Now' : 'Closed'}</span>
          </div>
          <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
             Via {pricing.couponProvider}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <div className="text-right">
          <div className="text-xs text-slate-500 font-medium mb-0.5 uppercase tracking-wide">Est. Cash Price</div>
          <div className="text-sm text-slate-400 line-through decoration-slate-400">
            ${retailPrice.toFixed(2)}
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            ${couponPrice.toFixed(2)}
          </div>
        </div>

        <button className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm flex items-center shrink-0 h-full">
          Get Coupon
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export const ResultsView: React.FC<ResultsViewProps> = ({ data, onConfigurationChange }) => {
  const [selectedDosage, setSelectedDosage] = useState(data.pricingBasis.dosage);
  const [selectedQuantity, setSelectedQuantity] = useState(data.pricingBasis.quantity);

  // Update local state if data changes (e.g. after a re-fetch)
  useEffect(() => {
    setSelectedDosage(data.pricingBasis.dosage);
    setSelectedQuantity(data.pricingBasis.quantity);
  }, [data]);

  const handleDosageChange = (newDosage: string) => {
    setSelectedDosage(newDosage);
    // Changing dosage usually changes base unit price significantly, so we fetch new data
    onConfigurationChange(data.brandName, newDosage);
  };

  // Calculate multiplier for quantity changes relative to the base price returned by API
  const quantityMultiplier = selectedQuantity / data.pricingBasis.quantity;

  // Sort pricing: lowest coupon price first (considering multiplier)
  const sortedPricing = [...data.pricingOptions].sort((a, b) => a.couponPrice - b.couponPrice);
  const bestPrice = (sortedPricing[0]?.couponPrice || 0) * quantityMultiplier;

  // Combine defaults with API values if not present
  const quantities = data.commonQuantities?.length > 0 ? data.commonQuantities : [30, 60, 90];
  const dosages = data.commonDosages?.length > 0 ? data.commonDosages : [data.pricingBasis.dosage];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Info */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-slate-900">{data.brandName}</h2>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-semibold rounded-full">
                {data.genericName}
              </span>
            </div>
            <p className="text-slate-600 mb-6 leading-relaxed max-w-2xl">
              {data.description}
            </p>
          </div>
        </div>

        {/* Configuration Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-2 text-slate-700 font-semibold min-w-max">
            <Settings2 className="w-5 h-5 text-teal-500" />
            <span>Configure Prescription:</span>
          </div>
          
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Dosage (mg)</label>
              <div className="relative">
                <select 
                  value={selectedDosage}
                  onChange={(e) => handleDosageChange(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block p-3 font-medium transition-shadow hover:bg-slate-100 cursor-pointer"
                >
                  {dosages.map((dose) => (
                    <option key={dose} value={dose}>{dose}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Form</label>
              <div className="relative">
                <select 
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block p-3 font-medium transition-shadow hover:bg-slate-100 cursor-pointer"
                  defaultValue={data.form || "Tablet"}
                >
                  <option value={data.form || "Tablet"}>{data.form || "Tablet"}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Quantity</label>
              <div className="relative">
                <select 
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block p-3 font-medium transition-shadow hover:bg-slate-100 cursor-pointer"
                >
                  {quantities.map((qty) => (
                    <option key={qty} value={qty}>{qty} {data.form ? data.form.toLowerCase() + 's' : 'tablets'}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 order-2 lg:order-1">
          {/* Pharmacy List */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800">Pharmacy Prices</h3>
            <div className="hidden sm:flex text-sm text-slate-500 items-center bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
              <AlertCircle className="w-4 h-4 mr-1.5 text-yellow-600" />
              Prices are estimates
            </div>
          </div>

          <div className="space-y-0">
            {sortedPricing.map((pricing, idx) => (
              <PharmacyCard 
                key={`${pricing.pharmacyName}-${idx}`} 
                pricing={pricing} 
                quantityMultiplier={quantityMultiplier}
              />
            ))}
          </div>
        </div>

        {/* Sidebar / Best Price Box */}
        <div className="lg:w-80 shrink-0 order-1 lg:order-2">
           <div className="sticky top-24">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl shadow-teal-200/50 mb-6">
                <div className="text-teal-100 text-sm font-medium mb-1">Lowest price for {selectedQuantity} {data.form || 'tablets'}</div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold">${bestPrice.toFixed(2)}</span>
                  <span className="text-teal-100 text-sm">est.</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-teal-50">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-teal-200" />
                    <span>Save up to 80%</span>
                  </div>
                  <div className="flex items-center text-sm text-teal-50">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-teal-200" />
                    <span>Free coupons</span>
                  </div>
                </div>
              </div>

              {/* Manufacturer Coupon Banner */}
              {data.manufacturerCoupon?.available && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <Tag className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-blue-900 leading-tight">Manufacturer Savings</h4>
                  </div>
                  <p className="text-sm text-blue-700 mb-4">
                    {data.manufacturerCoupon.details}
                  </p>
                  <a 
                    href={data.manufacturerCoupon.url || '#'} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-4 py-2 bg-white text-blue-600 text-sm font-semibold rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                  >
                    Visit Manufacturer Site <ExternalLink className="w-3.5 h-3.5 ml-2" />
                  </a>
                </div>
              )}
           </div>
        </div>
      </div>
      
      <div className="mt-12 text-center text-slate-400 text-xs max-w-2xl mx-auto">
        <p>Disclaimer: This application is a demo using AI-generated data. The prices shown are estimates for {selectedDosage}, {selectedQuantity} count. Always verify with the pharmacist. Trademarks are property of their respective owners.</p>
      </div>
    </div>
  );
};