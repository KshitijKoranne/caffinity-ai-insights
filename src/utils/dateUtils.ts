
import { format, parseISO, isToday, isYesterday, startOfDay } from "date-fns";
import { getCaffeineEntriesForDate as getEntries, getCurrentDateYMD as getCurrentDate } from "@/utils/caffeineData";

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
  return getCurrentDate();
};

// Get start of day for a date string (YYYY-MM-DD)
export const getStartOfDay = (dateStr: string): Date => {
  return startOfDay(parseISO(`${dateStr}T00:00:00`));
};

// Export the function from caffeineData to make it available through dateUtils
export const getCaffeineEntriesForDate = (date: string) => {
  return getEntries(date);
};
