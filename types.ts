export enum CouponType {
  GENERIC_COUPON = 'GENERIC_COUPON',
  MANUFACTURER_REBATE = 'MANUFACTURER_REBATE',
  SAVINGS_CARD = 'SAVINGS_CARD',
  INSURANCE_PRICE = 'INSURANCE_PRICE'
}

export interface PharmacyPricing {
  pharmacyName: string;
  retailPrice: number;
  couponPrice: number;
  savingsPercentage: number;
  couponType: CouponType;
  couponProvider: string; // e.g., "GoodRx", "SingleCare", "Manufacturer"
  distance?: string;
  isOpen?: boolean;
}

export interface PricingBasis {
  quantity: number;
  dosage: string;
  form: string;
}

export interface DrugDetails {
  brandName: string;
  genericName: string;
  description: string;
  commonDosages: string[];
  commonQuantities: number[];
  form: string; // e.g. "Tablet", "Capsule", "Cream"
  pricingBasis: PricingBasis; // The specific configuration these prices are for
  manufacturerCoupon?: {
    available: boolean;
    details: string;
    url?: string;
  };
  pricingOptions: PharmacyPricing[];
  lastUpdated: string;
}

export interface SearchState {
  isLoading: boolean;
  error: string | null;
  data: DrugDetails | null;
  hasSearched: boolean;
}