
import { CaffeineEntry } from './types';
import { getCaffeineEntries } from './caffeineStorage';

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
