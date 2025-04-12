
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
}

export type UnitPreference = "oz" | "ml" | "cup";

// Sample catalog of caffeine beverages
export const BEVERAGE_CATALOG: CaffeineBeverage[] = [
  {
    id: "coffee-1",
    name: "Espresso",
    category: "coffee",
    caffeine: 63,
    servingSize: "1 oz shot",
    servingSizeOz: 1,
  },
  {
    id: "coffee-2",
    name: "Brewed Coffee",
    category: "coffee",
    caffeine: 95,
    servingSize: "8 oz cup",
    servingSizeOz: 8,
  },
  {
    id: "coffee-3",
    name: "Cold Brew",
    category: "coffee",
    caffeine: 120,
    servingSize: "12 oz cup",
    servingSizeOz: 12,
  },
  {
    id: "coffee-4",
    name: "Starbucks Coffee",
    category: "coffee",
    caffeine: 155,
    servingSize: "8 oz cup",
    servingSizeOz: 8,
  },
  {
    id: "coffee-5",
    name: "Dunkin' Donuts Coffee",
    category: "coffee",
    caffeine: 112,
    servingSize: "10 oz cup",
    servingSizeOz: 10,
  },
  {
    id: "coffee-6",
    name: "Starbucks Caffè Latte",
    category: "coffee",
    caffeine: 75,
    servingSize: "12 oz cup",
    servingSizeOz: 12,
  },
  {
    id: "coffee-7",
    name: "Starbucks Nitro Cold Brew",
    category: "coffee",
    caffeine: 280,
    servingSize: "16 oz cup",
    servingSizeOz: 16,
  },
  {
    id: "bottled-coffee-1",
    name: "Starbucks Frappuccino",
    category: "coffee",
    caffeine: 110,
    servingSize: "13.7 oz bottle",
    servingSizeOz: 13.7,
  },
  {
    id: "bottled-coffee-2",
    name: "SToK Cold Brew",
    category: "coffee",
    caffeine: 185,
    servingSize: "13.7 oz bottle",
    servingSizeOz: 13.7,
  },
  {
    id: "tea-1",
    name: "Black Tea",
    category: "tea",
    caffeine: 47,
    servingSize: "8 oz cup",
    servingSizeOz: 8,
  },
  {
    id: "tea-2",
    name: "Green Tea",
    category: "tea",
    caffeine: 28,
    servingSize: "8 oz cup",
    servingSizeOz: 8,
  },
  {
    id: "tea-3",
    name: "Snapple Tea",
    category: "tea",
    caffeine: 42,
    servingSize: "16 oz bottle",
    servingSizeOz: 16,
  },
  {
    id: "tea-4",
    name: "Lipton Brisk Iced Tea",
    category: "tea",
    caffeine: 9,
    servingSize: "12 oz can",
    servingSizeOz: 12,
  },
  {
    id: "energy-1",
    name: "Red Bull",
    category: "energy",
    caffeine: 80,
    servingSize: "8.4 oz can",
    servingSizeOz: 8.4,
  },
  {
    id: "energy-2",
    name: "Monster Energy",
    category: "energy",
    caffeine: 160,
    servingSize: "16 oz can",
    servingSizeOz: 16,
  },
  {
    id: "energy-3",
    name: "5-Hour Energy",
    category: "energy",
    caffeine: 200,
    servingSize: "1.93 oz shot",
    servingSizeOz: 1.93,
  },
  {
    id: "energy-4",
    name: "Reign Total Body Fuel",
    category: "energy",
    caffeine: 300,
    servingSize: "16 oz can",
    servingSizeOz: 16,
  },
  {
    id: "energy-5",
    name: "Bang Energy",
    category: "energy",
    caffeine: 300,
    servingSize: "16 oz can",
    servingSizeOz: 16,
  },
  {
    id: "soda-1",
    name: "Coca-Cola",
    category: "soda",
    caffeine: 34,
    servingSize: "12 oz can",
    servingSizeOz: 12,
  },
  {
    id: "soda-2",
    name: "Diet Coke",
    category: "soda",
    caffeine: 46,
    servingSize: "12 oz can",
    servingSizeOz: 12,
  },
  {
    id: "soda-3",
    name: "Mountain Dew",
    category: "soda",
    caffeine: 55,
    servingSize: "12 oz can",
    servingSizeOz: 12,
  },
  {
    id: "soda-4",
    name: "Pepsi",
    category: "soda",
    caffeine: 38,
    servingSize: "12 oz can",
    servingSizeOz: 12,
  },
  {
    id: "soda-5",
    name: "Dr Pepper",
    category: "soda",
    caffeine: 41,
    servingSize: "12 oz can",
    servingSizeOz: 12,
  },
];

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

// User preferences
export const getUserPreferences = (): {unitPreference: UnitPreference} => {
  const prefsString = localStorage.getItem("caffinity-preferences");
  const defaultPrefs = { unitPreference: "oz" as UnitPreference };
  return prefsString ? JSON.parse(prefsString) : defaultPrefs;
};

export const saveUserPreferences = (prefs: {unitPreference: UnitPreference}): void => {
  localStorage.setItem("caffinity-preferences", JSON.stringify(prefs));
  console.log("User preferences saved:", prefs);
};

// Get user's caffeine entries from local storage
export const getCaffeineEntries = (): CaffeineEntry[] => {
  const entries = localStorage.getItem("caffinity-entries");
  console.log("Raw entries from localStorage:", entries);
  return entries ? JSON.parse(entries) : [];
};

// Save caffeine entry
export const saveCaffeineEntry = (entry: CaffeineEntry): void => {
  const entries = getCaffeineEntries();
  console.log("Saving caffeine entry:", entry);
  entries.push(entry);
  localStorage.setItem("caffinity-entries", JSON.stringify(entries));
  console.log("Caffeine entry saved successfully:", entry);
  console.log("Total entries now:", entries.length);
  console.log("All entries:", entries);
};

// Delete caffeine entry
export const deleteCaffeineEntry = (entryId: string): void => {
  const entries = getCaffeineEntries();
  console.log("Deleting caffeine entry with ID:", entryId);
  const updatedEntries = entries.filter(entry => entry.id !== entryId);
  localStorage.setItem("caffinity-entries", JSON.stringify(updatedEntries));
  console.log("Entry deleted successfully");
  console.log("Total entries now:", updatedEntries.length);
};

// Helper function to normalize dates for comparison (removing time part)
const normalizeDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// Get daily caffeine total
export const getDailyCaffeineTotal = (date: string): number => {
  const normalizedTargetDate = normalizeDate(date);
  console.log("Using normalized date for filtering:", normalizedTargetDate);
  
  const entries = getCaffeineEntries();
  const dailyEntries = entries.filter(entry => {
    const entryDate = normalizeDate(entry.date);
    const isMatch = entryDate === normalizedTargetDate;
    console.log("Entry date:", entryDate, "Target:", normalizedTargetDate, "Match:", isMatch);
    return isMatch;
  });
  
  console.log("Found", dailyEntries.length, "entries for", normalizedTargetDate);
  return dailyEntries.reduce((total, entry) => total + entry.caffeineAmount, 0);
};

// Get caffeine entries for a specific date
export const getCaffeineEntriesForDate = (date: string): CaffeineEntry[] => {
  const normalizedTargetDate = normalizeDate(date);
  console.log("Looking for entries on date:", normalizedTargetDate);
  
  const entries = getCaffeineEntries();
  const filteredEntries = entries.filter(entry => {
    const entryDate = normalizeDate(entry.date);
    const isMatch = entryDate === normalizedTargetDate;
    console.log("Entry date:", entryDate, "Target:", normalizedTargetDate, "Match:", isMatch);
    return isMatch;
  });
  
  console.log("Found", filteredEntries.length, "entries for", normalizedTargetDate);
  return filteredEntries;
};

// Get recommended caffeine limit (general guideline is 400mg for adults)
export const getRecommendedCaffeineLimit = (): number => {
  return 400; // mg per day
};

// Get unique dates with caffeine entries
export const getCaffeineHistoryDates = (limit: number = 30): string[] => {
  const entries = getCaffeineEntries();
  const uniqueDates = [...new Set(entries.map(entry => normalizeDate(entry.date)))];
  
  // Sort dates in descending order (newest first)
  return uniqueDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).slice(0, limit);
};

// Get caffeine history for charting (last X days)
export const getCaffeineHistory = (days: number = 7): { date: string; total: number }[] => {
  const dates = getCaffeineHistoryDates(days);
  
  return dates.map(date => ({
    date,
    total: getDailyCaffeineTotal(date)
  })).reverse(); // Reverse to have oldest first for charting
};

// Get daily max caffeine day in history
export const getMaxCaffeineDay = (): { date: string; total: number } | null => {
  const history = getCaffeineHistory(30);
  
  if (history.length === 0) {
    return null;
  }
  
  return history.reduce((max, current) => 
    current.total > max.total ? current : max, 
    history[0]
  );
};
