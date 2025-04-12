
// Type definitions for caffeine data

export interface CaffeineBeverage {
  id: string;
  name: string;
  category: "coffee" | "tea" | "energy" | "soda" | "other";
  caffeine: number; // mg per serving
  servingSize: string;
  servingSizeOz?: number; // Optional numerical value in oz for conversion
  image?: string;
}

export interface CaffeineEntry {
  id: string;
  beverageId: string;
  beverageName: string;
  caffeineAmount: number;
  servingSize: string;
  date: string; // ISO string
  notes?: string;
  userId?: string; // Add userId to track which user created the entry
}

export type UnitPreference = "oz" | "ml" | "cup";
