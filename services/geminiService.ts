import { GoogleGenAI, Type } from "@google/genai";
import { DrugDetails, CouponType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchDrugPricing = async (drugName: string, dosage?: string): Promise<DrugDetails> => {
  const model = "gemini-2.5-flash";

  let prompt = `
    Act as a pharmaceutical pricing aggregator. Generate realistic pricing data for the drug "${drugName}" in the US market.
    
    You must simulate data from three specific sources:
    1. **Manufacturer Coupon Database**: Search for official manufacturer copay cards, savings programs, or rebates. 
    2. **Low Price API**: Identify the single absolute lowest cash price available at a major chain (often Walmart, Costco, or a specific grocery chain).
    3. **Price Comparison API**: Identify 3-4 competitive prices from other major nationwide chains (CVS, Walgreens, Rite Aid) to allow for comparison.

  `;

  if (dosage) {
    prompt += ` The user is specifically looking for the dosage: "${dosage}". Base pricing on this dosage.`;
  } else {
    prompt += ` Base pricing on the most common prescribed dosage.`;
  }
    
  prompt += `
    Output Requirements:
    1. Basic drug info (brand name, generic name, medical description).
    2. List common dosages and quantities.
    3. The "pricingBasis" used.
    4. **Manufacturer Coupon**: If exists, provide program name, savings summary (e.g., "Pay as little as $5"), and eligibility.
    5. **Pricing Options**: Combine the result of the "Low Price API" and "Price Comparison API" into a list of 4-6 pharmacies.
    
    For pricing fields:
    - "retailPrice": The high "U&C" (Usual & Customary) cost price of the drug without insurance/coupons.
    - "couponPrice": The discounted price using a coupon.
    - "couponProvider": e.g., "GoodRx", "SingleCare", "Manufacturer", "RxSaver".
    - Ensure significant savings are shown between retailPrice and couponPrice.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          brandName: { type: Type.STRING },
          genericName: { type: Type.STRING },
          description: { type: Type.STRING },
          commonDosages: { type: Type.ARRAY, items: { type: Type.STRING } },
          commonQuantities: { type: Type.ARRAY, items: { type: Type.NUMBER } },
          form: { type: Type.STRING },
          pricingBasis: {
            type: Type.OBJECT,
            properties: {
              quantity: { type: Type.NUMBER },
              dosage: { type: Type.STRING },
              form: { type: Type.STRING }
            }
          },
          manufacturerCoupon: {
            type: Type.OBJECT,
            properties: {
              available: { type: Type.BOOLEAN },
              programName: { type: Type.STRING, description: "Name of the savings program" },
              savingsSummary: { type: Type.STRING, description: "Short headline of savings, e.g. Pay $0" },
              details: { type: Type.STRING },
              url: { type: Type.STRING },
              eligibility: { type: Type.STRING }
            }
          },
          pricingOptions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                pharmacyName: { type: Type.STRING },
                retailPrice: { type: Type.NUMBER, description: "High cash/cost price" },
                couponPrice: { type: Type.NUMBER, description: "Low coupon price" },
                savingsPercentage: { type: Type.NUMBER },
                couponType: { type: Type.STRING, enum: Object.values(CouponType) },
                couponProvider: { type: Type.STRING },
                distance: { type: Type.STRING },
                isOpen: { type: Type.BOOLEAN }
              }
            }
          },
          lastUpdated: { type: Type.STRING }
        }
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No data returned from AI");
  }

  try {
    return JSON.parse(text) as DrugDetails;
  } catch (e) {
    console.error("Failed to parse pricing data", e);
    throw new Error("Failed to parse pricing data");
  }
};