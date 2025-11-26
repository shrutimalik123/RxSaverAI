import { GoogleGenAI, Type } from "@google/genai";
import { DrugDetails, CouponType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchDrugPricing = async (drugName: string, dosage?: string): Promise<DrugDetails> => {
  const model = "gemini-2.5-flash";

  let prompt = `
    Generate realistic pharmaceutical pricing data for the drug "${drugName}" in the US market. 
  `;

  if (dosage) {
    prompt += ` The user is specifically looking for the dosage: "${dosage}". Base pricing on this dosage.`;
  } else {
    prompt += ` Base pricing on the most common prescribed dosage.`;
  }
    
  prompt += `
    Include:
    1. Basic drug info (brand name, generic name, short medical description).
    2. A list of common dosages (e.g., 10mg, 20mg) and common quantities (e.g., 30, 90).
    3. The specific "pricingBasis" (dosage, quantity, form) that the prices below correspond to.
    4. Manufacturer coupon availability details if applicable.
    5. A list of 5-8 pricing options from major US pharmacy chains (e.g., CVS, Walgreens, Walmart, Rite Aid, Kroger, Costco).
    
    For pricing:
    - "retailPrice" should be the high cash price (cost price) without insurance.
    - "couponPrice" should be a significantly lower discounted price found via coupons.
    - "couponProvider" should vary (e.g., "GoodRx", "SingleCare", "Manufacturer", "RxSaver").
    - Ensure realistic price variations.
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
          form: { type: Type.STRING, description: "e.g. Tablet, Capsule, Tube" },
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
              details: { type: Type.STRING },
              url: { type: Type.STRING }
            }
          },
          pricingOptions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                pharmacyName: { type: Type.STRING },
                retailPrice: { type: Type.NUMBER },
                couponPrice: { type: Type.NUMBER },
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