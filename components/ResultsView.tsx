import React, { useState, useEffect } from 'react';
import { DrugDetails, PharmacyPricing } from '../types';
import { Tag, ExternalLink, AlertCircle, CheckCircle2, MapPin, ArrowRight, Settings2, DollarSign, Info, X, Share2, Check } from 'lucide-react';

interface ResultsViewProps {
  data: DrugDetails;
  onConfigurationChange: (drugName: string, dosage: string) => void;
}

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DrugDetails;
  pricing: PharmacyPricing;
  quantity: number;
  dosage: string;
}

const CouponModal: React.FC<CouponModalProps> = ({ isOpen, onClose, data, pricing, quantity, dosage }) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;
  
  const quantityMultiplier = quantity / data.pricingBasis.quantity;
  const finalPrice = pricing.couponPrice * quantityMultiplier;

  // Simulated codes for demonstration
  const bin = "015995";
  const pcn = "GDC";
  const group = "DR33";
  const memberId = `W${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

  const handleShare = async () => {
    const shareText = `RxSaver Coupon\n${data.brandName} (${data.genericName})\n${quantity} ${data.form}s • ${dosage}\n\nPrice: $${finalPrice.toFixed(2)} at ${pricing.pharmacyName}\n\nProcessing Info:\nBIN: ${bin}\nPCN: ${pcn}\nGRP: ${group}\nID: ${memberId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `RxSaver Coupon: ${data.brandName}`,
          text: shareText,
        });
      } catch (err) {
        // User cancelled or error
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
        <style>
          {`
            @media print {
              @page {
                margin: 0.5cm;
                size: auto;
              }

              body {
                visibility: hidden;
                background-color: white;
              }
              
              /* Hide all elements by default */
              body * {
                visibility: hidden;
              }

              /* Coupon Container - Fixed positioning relative to page */
              #printable-coupon {
                visibility: visible !important;
                position: fixed !important;
                left: 50% !important;
                top: 20px !important;
                transform: translateX(-50%) !important;
                width: 100% !important;
                max-width: 500px !important; 
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
                z-index: 9999 !important;
                background-color: white !important;
                border: 1px solid #e2e8f0 !important;
                border-radius: 12px !important;
              }

              /* Make sure children of the card are visible */
              #printable-coupon * {
                visibility: visible !important;
              }

              /* Ensure background colors/images are printed */
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              /* Hide the buttons (Print, Share, Close) */
              .print\\:hidden {
                display: none !important;
              }
              
              /* Reset body height to ensure content fits */
              html, body {
                height: auto !important;
                overflow: visible !important;
              }
            }
          `}
        </style>
        <div id="printable-coupon" className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden scale-100 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="bg-teal-600 p-6 text-white relative overflow-hidden print-exact">
                <div className="absolute top-0 right-0 p-4 z-20 print:hidden">
                  <button onClick={onClose} className="text-teal-100 hover:text-white hover:bg-teal-500/50 rounded-full p-1 transition-colors">
                      <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="relative z-10 text-center mt-2">
                    <h3 className="text-2xl font-bold mb-1">Digital Coupon</h3>
                    <p className="text-teal-100 font-medium">Present this card to the pharmacist</p>
                </div>
                
                {/* Decorative circles */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-teal-500 rounded-full opacity-50 blur-2xl print:hidden"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-teal-400 rounded-full opacity-30 blur-2xl print:hidden"></div>
            </div>

            <div className="p-6">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">{data.brandName}</h2>
                    <p className="text-slate-500 font-medium">{data.genericName}</p>
                    <div className="inline-flex items-center mt-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600 uppercase tracking-wide border border-slate-200 print-exact">
                        {quantity} {data.form}s • {dosage}
                    </div>
                </div>

                <div className="flex justify-between items-stretch bg-slate-50 rounded-xl border border-slate-200 mb-6 overflow-hidden print-exact">
                    <div className="flex-1 p-4 border-r border-slate-200">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pharmacy</p>
                        <p className="font-bold text-slate-800 leading-tight">{pricing.pharmacyName}</p>
                    </div>
                     <div className="flex-1 p-4 text-right bg-teal-50/50 print-exact">
                        <p className="text-[10px] font-bold text-teal-600/70 uppercase tracking-wider mb-1">Your Price</p>
                        <p className="font-bold text-teal-700 text-2xl leading-none">${finalPrice.toFixed(2)}</p>
                    </div>
                </div>

                <div className="space-y-3 mb-8">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="text-sm font-medium text-slate-500">RxBIN</span>
                        <span className="font-mono font-bold text-slate-900 tracking-wider">{bin}</span>
                    </div>
                     <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="text-sm font-medium text-slate-500">RxPCN</span>
                        <span className="font-mono font-bold text-slate-900 tracking-wider">{pcn}</span>
                    </div>
                     <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="text-sm font-medium text-slate-500">RxGRP</span>
                        <span className="font-mono font-bold text-slate-900 tracking-wider">{group}</span>
                    </div>
                     <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="text-sm font-medium text-slate-500">Member ID</span>
                        <span className="font-mono font-bold text-slate-900 tracking-wider">{memberId}</span>
                    </div>
                </div>

                <div className="print:hidden">
                   <button 
                      onClick={handleShare}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-sm transition-colors"
                   >
                      {isCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                      {isCopied ? 'Copied' : 'Share Coupon'}
                   </button>
                </div>
            </div>
        </div>
    </div>
  )
}

interface PharmacyCardProps { 
  pricing: PharmacyPricing; 
  quantityMultiplier: number; 
  isLowest: boolean;
  onGetCoupon: () => void;
}

const PharmacyCard: React.FC<PharmacyCardProps> = ({ pricing, quantityMultiplier, isLowest, onGetCoupon }) => {
  const retailPrice = pricing.retailPrice * quantityMultiplier;
  const couponPrice = pricing.couponPrice * quantityMultiplier;

  return (
    <div className={`bg-white border ${isLowest ? 'border-teal-400 ring-1 ring-teal-100' : 'border-slate-200'} rounded-xl p-4 sm:p-6 mb-4 hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group relative overflow-hidden`}>
      {isLowest && (
        <div className="absolute top-0 right-0 bg-teal-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">
          Lowest Price
        </div>
      )}
      
      <div className="flex items-start gap-4">
        {/* Placeholder Logo */}
        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center text-xs font-bold uppercase tracking-wider shrink-0 ${isLowest ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-400'}`}>
           {pricing.pharmacyName.substring(0, 3)}
        </div>
        
        <div>
          <h3 className="font-bold text-lg text-slate-900 group-hover:text-teal-600 transition-colors flex items-center gap-2">
            {pricing.pharmacyName}
          </h3>
          <div className="flex items-center text-sm text-slate-500 mt-1">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            <span>{pricing.distance || '1.2 miles'} • {pricing.isOpen ? 'Open Now' : 'Closed'}</span>
          </div>
          <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
             Via {pricing.couponProvider}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <div className="text-right">
          <div className="text-xs text-slate-500 font-medium mb-0.5 uppercase tracking-wide">Retail Price</div>
          <div className="text-sm text-slate-400 line-through decoration-slate-400 mb-1">
            ${retailPrice.toFixed(2)}
          </div>
        </div>
        
        <div className="text-right">
             <div className="text-xs text-teal-600 font-bold mb-0.5 uppercase tracking-wide">Coupon Price</div>
             <div className="text-2xl font-bold text-slate-900">
                ${couponPrice.toFixed(2)}
             </div>
        </div>

        <button 
          onClick={onGetCoupon}
          className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm flex items-center shrink-0 h-full"
        >
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
  const [selectedCoupon, setSelectedCoupon] = useState<PharmacyPricing | null>(null);

  useEffect(() => {
    setSelectedDosage(data.pricingBasis.dosage);
    setSelectedQuantity(data.pricingBasis.quantity);
  }, [data]);

  const handleDosageChange = (newDosage: string) => {
    setSelectedDosage(newDosage);
    onConfigurationChange(data.brandName, newDosage);
  };

  const quantityMultiplier = selectedQuantity / data.pricingBasis.quantity;
  const sortedPricing = [...data.pricingOptions].sort((a, b) => a.couponPrice - b.couponPrice);
  const bestPrice = (sortedPricing[0]?.couponPrice || 0) * quantityMultiplier;
  
  const quantities = data.commonQuantities?.length > 0 ? data.commonQuantities : [30, 60, 90];
  const dosages = data.commonDosages?.length > 0 ? data.commonDosages : [data.pricingBasis.dosage];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Configuration & Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{data.brandName}</h2>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-semibold rounded-full border border-slate-200">
                {data.genericName}
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-semibold rounded-full border border-slate-200">
                {data.form}
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed max-w-3xl">
              {data.description}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2 text-slate-700 font-semibold min-w-max">
            <Settings2 className="w-5 h-5 text-teal-500" />
            <span>Settings:</span>
          </div>
          
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Dosage</label>
              <div className="relative">
                <select 
                  value={selectedDosage}
                  onChange={(e) => handleDosageChange(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block p-2.5 font-medium transition-shadow hover:bg-slate-100 cursor-pointer"
                >
                  {dosages.map((dose) => (
                    <option key={dose} value={dose}>{dose}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Form</label>
              <div className="relative">
                <select 
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block p-2.5 font-medium transition-shadow hover:bg-slate-100 cursor-pointer"
                  defaultValue={data.form || "Tablet"}
                >
                  <option value={data.form || "Tablet"}>{data.form || "Tablet"}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Quantity</label>
              <div className="relative">
                <select 
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block p-2.5 font-medium transition-shadow hover:bg-slate-100 cursor-pointer"
                >
                  {quantities.map((qty) => (
                    <option key={qty} value={qty}>{qty} {data.form ? data.form.toLowerCase() + 's' : 'count'}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 order-2 lg:order-1">
          {/* Pharmacy List */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-800">Available Coupons</h3>
            <div className="hidden sm:flex text-xs text-slate-500 items-center bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              <Info className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              Compare retail vs coupon price
            </div>
          </div>

          <div className="space-y-0">
            {sortedPricing.map((pricing, idx) => (
              <PharmacyCard 
                key={`${pricing.pharmacyName}-${idx}`} 
                pricing={pricing} 
                quantityMultiplier={quantityMultiplier}
                isLowest={idx === 0}
                onGetCoupon={() => setSelectedCoupon(pricing)}
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-80 shrink-0 order-1 lg:order-2">
           <div className="sticky top-24 space-y-6">
              {/* Manufacturer Coupon Card - High Priority */}
              {data.manufacturerCoupon?.available && (
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-1 shadow-lg shadow-blue-200/50">
                  <div className="bg-white rounded-[14px] p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                        <Tag className="w-6 h-6" />
                      </div>
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                        Manufacturer
                      </span>
                    </div>
                    
                    <h4 className="font-bold text-slate-900 text-lg mb-1 leading-tight">
                      {data.manufacturerCoupon.programName || "Manufacturer Savings"}
                    </h4>
                    <p className="text-blue-600 font-bold text-xl mb-3">
                      {data.manufacturerCoupon.savingsSummary || "Special Savings Available"}
                    </p>
                    
                    <div className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {data.manufacturerCoupon.details}
                      {data.manufacturerCoupon.eligibility && (
                        <div className="mt-2 text-xs text-slate-500 pt-2 border-t border-slate-200">
                          Requires: {data.manufacturerCoupon.eligibility}
                        </div>
                      )}
                    </div>

                    <a 
                      href={data.manufacturerCoupon.url || '#'} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      Activate Savings <ExternalLink className="w-3.5 h-3.5 ml-2" />
                    </a>
                  </div>
                </div>
              )}

              {/* Best Price Card */}
              <div className="bg-teal-500 rounded-2xl p-6 text-white shadow-xl shadow-teal-200/50">
                <div className="text-teal-100 text-xs font-bold uppercase tracking-wide mb-1">Lowest Found Price</div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold">${bestPrice.toFixed(2)}</span>
                  <span className="text-teal-100 text-sm">for {selectedQuantity} {data.form ? data.form.toLowerCase() + 's' : 'units'}</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-teal-50">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-teal-200" />
                    <span>Using free coupon</span>
                  </div>
                  <div className="flex items-center text-sm text-teal-50">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-teal-200" />
                    <span>No insurance needed</span>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </div>
      
      <div className="mt-12 text-center text-slate-400 text-xs max-w-2xl mx-auto space-y-2">
        <p>Prices are for {selectedQuantity} {data.form?.toLowerCase() || 'tablets'} of {data.brandName} {selectedDosage}.</p>
        <p>Disclaimer: This data is AI-generated for demonstration purposes. "Retail Price" represents the estimated cash price without insurance. "Coupon Price" represents the estimated price with a savings card.</p>
      </div>

      {/* Coupon Modal */}
      {selectedCoupon && (
        <CouponModal 
          isOpen={true}
          onClose={() => setSelectedCoupon(null)}
          data={data}
          pricing={selectedCoupon}
          quantity={selectedQuantity}
          dosage={selectedDosage}
        />
      )}
    </div>
  );
};