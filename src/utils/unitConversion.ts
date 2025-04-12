
import { CaffeineBeverage, UnitPreference } from './types';

// Helper functions for unit conversion
export const convertOzToMl = (oz: number): number => {
  return Math.round(oz * 29.5735);
};

export const convertOzToCup = (oz: number): number => {
  return parseFloat((oz / 8).toFixed(2));
};

export const formatServingSizeWithUnit = (beverage: CaffeineBeverage, unit: UnitPreference): string => {
  if (!beverage.servingSizeOz) {
    return beverage.servingSize;
  }
  
  switch (unit) {
    case "ml":
      return `${convertOzToMl(beverage.servingSizeOz)} ml`;
    case "cup":
      const cups = convertOzToCup(beverage.servingSizeOz);
      return `${cups} ${cups === 1 ? 'cup' : 'cups'}`;
    case "oz":
    default:
      return `${beverage.servingSizeOz} oz`;
  }
};
