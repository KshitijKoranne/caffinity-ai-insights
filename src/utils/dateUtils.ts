
import { format, parseISO, isToday, isYesterday, startOfDay, subDays } from "date-fns";
import { getCaffeineEntriesForDate as getEntries } from "@/utils/caffeineData";

// Format a date to YYYY-MM-DD
export const formatDateYMD = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

// Format a date for display
export const formatDateForDisplay = (date: Date): string => {
  if (isToday(date)) {
    return "Today";
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else {
    return format(date, "EEEE, MMM d");
  }
};

// Format time for display
export const formatTimeForDisplay = (dateStr: string): string => {
  const date = parseISO(dateStr);
  return format(date, "h:mm a");
};

// Get current date in YYYY-MM-DD format
export const getCurrentDateYMD = (): string => {
  return formatDateYMD(new Date());
};

// Get start of day for a date string (YYYY-MM-DD)
export const getStartOfDay = (dateStr: string): Date => {
  return startOfDay(parseISO(`${dateStr}T00:00:00`));
};

// Get dates for the last n days (including today)
export const getLastNDays = (days: number): Date[] => {
  const result: Date[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    result.push(subDays(today, i));
  }
  
  return result;
};

// Format date for chart display
export const formatDateForChart = (dateStr: string): string => {
  const date = parseISO(dateStr);
  if (isToday(date)) {
    return "Today";
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else {
    return format(date, "MMM d");
  }
};

// Export the function from caffeineData to make it available through dateUtils
export const getCaffeineEntriesForDate = (date: string) => {
  return getEntries(date);
};
