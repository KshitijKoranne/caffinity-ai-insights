
export interface CaffeineBeverage {
  id: string;
  name: string;
  category: "coffee" | "tea" | "energy" | "soda" | "other";
  caffeine: number; // mg per serving
  servingSize: string;
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

// Sample catalog of caffeine beverages
export const BEVERAGE_CATALOG: CaffeineBeverage[] = [
  {
    id: "coffee-1",
    name: "Espresso",
    category: "coffee",
    caffeine: 63,
    servingSize: "1 oz shot",
  },
  {
    id: "coffee-2",
    name: "Brewed Coffee",
    category: "coffee",
    caffeine: 95,
    servingSize: "8 oz cup",
  },
  {
    id: "coffee-3",
    name: "Cold Brew",
    category: "coffee",
    caffeine: 120,
    servingSize: "12 oz cup",
  },
  {
    id: "tea-1",
    name: "Black Tea",
    category: "tea",
    caffeine: 47,
    servingSize: "8 oz cup",
  },
  {
    id: "tea-2",
    name: "Green Tea",
    category: "tea",
    caffeine: 28,
    servingSize: "8 oz cup",
  },
  {
    id: "energy-1",
    name: "Red Bull",
    category: "energy",
    caffeine: 80,
    servingSize: "8.4 oz can",
  },
  {
    id: "energy-2",
    name: "Monster Energy",
    category: "energy",
    caffeine: 160,
    servingSize: "16 oz can",
  },
  {
    id: "soda-1",
    name: "Coca-Cola",
    category: "soda",
    caffeine: 34,
    servingSize: "12 oz can",
  },
  {
    id: "soda-2",
    name: "Diet Coke",
    category: "soda",
    caffeine: 46,
    servingSize: "12 oz can",
  },
];

// Get user's caffeine entries from local storage
export const getCaffeineEntries = (): CaffeineEntry[] => {
  try {
    const entries = localStorage.getItem("caffinity-entries");
    console.log("Raw entries from localStorage:", entries);
    if (!entries) return [];
    return JSON.parse(entries);
  } catch (error) {
    console.error("Error parsing caffeine entries:", error);
    return [];
  }
};

// Save caffeine entry
export const saveCaffeineEntry = (entry: CaffeineEntry): void => {
  try {
    const entries = getCaffeineEntries();
    entries.push(entry);
    localStorage.setItem("caffinity-entries", JSON.stringify(entries));
    console.log("Caffeine entry saved successfully:", entry);
    console.log("Total entries now:", entries.length);
    console.log("All entries:", entries);
    
    // Dispatch an event to notify the dashboard of the update
    window.dispatchEvent(new CustomEvent('caffeine-updated'));
  } catch (error) {
    console.error("Error saving caffeine entry:", error);
    throw new Error("Failed to save caffeine entry");
  }
};

// Get daily caffeine total
export const getDailyCaffeineTotal = (date: string): number => {
  try {
    const entries = getCaffeineEntries();
    console.log(`Looking for entries on date: ${date}`);
    console.log("All entries:", entries);
    
    // Filter entries by date (only looking at the date part, not time)
    const dailyEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date).toISOString().split('T')[0];
      const targetDate = date.split('T')[0];
      const matches = entryDate === targetDate;
      console.log(`Entry date: ${entryDate}, Target: ${targetDate}, Match: ${matches}`);
      return matches;
    });
    
    console.log(`Filtered entries for ${date}:`, dailyEntries);
    const total = dailyEntries.reduce((total, entry) => total + entry.caffeineAmount, 0);
    console.log(`Total caffeine for ${date}:`, total, "mg from", dailyEntries.length, "entries");
    return total;
  } catch (error) {
    console.error("Error calculating daily caffeine total:", error);
    return 0;
  }
};

// Get caffeine entries for a specific date
export const getCaffeineEntriesForDate = (date: string): CaffeineEntry[] => {
  try {
    const entries = getCaffeineEntries();
    console.log(`Looking for entries on date: ${date}`);
    
    // Filter entries by date (only looking at the date part, not time)
    const dailyEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date).toISOString().split('T')[0];
      const targetDate = date.split('T')[0];
      const matches = entryDate === targetDate;
      console.log(`Entry date: ${entryDate}, Target: ${targetDate}, Match: ${matches}`);
      return matches;
    });
    
    console.log(`Found ${dailyEntries.length} entries for ${date}`);
    return dailyEntries;
  } catch (error) {
    console.error("Error getting caffeine entries for date:", error);
    return [];
  }
};

// Get recommended caffeine limit (general guideline is 400mg for adults)
export const getRecommendedCaffeineLimit = (): number => {
  return 400; // mg per day
};
