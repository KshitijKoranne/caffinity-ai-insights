
import { CaffeineEntry } from './types';
import { supabase } from '@/integrations/supabase/client';

// Helper function to normalize dates for comparison (removing time part)
const normalizeDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// Get current user ID helper function
const getCurrentUserId = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getUser();
  return data?.user?.id || null;
};

// Get daily caffeine total from Supabase
export const getDailyCaffeineTotal = async (date: string): Promise<number> => {
  const normalizedTargetDate = normalizeDate(date);
  console.log("Using normalized date for filtering:", normalizedTargetDate);
  
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.log('No user logged in, returning 0 for daily total');
      return 0;
    }
    
    console.log(`Fetching daily caffeine total for user ${userId} on date ${normalizedTargetDate}`);
    
    // Use PostgreSQL date functions to compare only the date part
    const { data, error } = await supabase
      .from('caffeine_entries')
      .select('caffeine_amount')
      .eq('user_id', userId)
      .gte('date', `${normalizedTargetDate}T00:00:00`)
      .lt('date', `${normalizedTargetDate}T23:59:59`);
    
    if (error) {
      console.error('Error getting daily caffeine total:', error);
      return 0;
    }
    
    console.log("Found", data.length, "entries for", normalizedTargetDate);
    const total = data.reduce((total, entry) => total + entry.caffeine_amount, 0);
    console.log("Calculated total:", total);
    return total;
  } catch (error) {
    console.error('Error getting daily caffeine total:', error);
    return 0;
  }
};

// Get caffeine entries for a specific date from Supabase
export const getCaffeineEntriesForDate = async (date: string): Promise<CaffeineEntry[]> => {
  const normalizedTargetDate = normalizeDate(date);
  console.log("Looking for entries on date:", normalizedTargetDate);
  
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.log('No user logged in, returning empty entries list');
      return [];
    }
    
    console.log(`Fetching caffeine entries for user ${userId} on date ${normalizedTargetDate}`);
    
    const { data, error } = await supabase
      .from('caffeine_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('date', `${normalizedTargetDate}T00:00:00`)
      .lt('date', `${normalizedTargetDate}T23:59:59`)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error getting caffeine entries for date:', error);
      return [];
    }
    
    console.log("Found", data.length, "entries for", normalizedTargetDate);
    
    // Transform from Supabase format to application format
    return data.map(entry => ({
      id: entry.id,
      beverageId: entry.beverage_id,
      beverageName: entry.beverage_name,
      caffeineAmount: entry.caffeine_amount,
      servingSize: entry.serving_size,
      date: entry.date,
      notes: entry.notes || undefined,
      userId: entry.user_id
    }));
  } catch (error) {
    console.error('Error getting caffeine entries for date:', error);
    return [];
  }
};

// Get recommended caffeine limit (general guideline is 400mg for adults)
export const getRecommendedCaffeineLimit = (): number => {
  return 400; // mg per day
};

// Get unique dates with caffeine entries from Supabase
export const getCaffeineHistoryDates = async (limit: number = 30): Promise<string[]> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.log('No user logged in, returning empty history dates');
      return [];
    }
    
    const { data, error } = await supabase
      .from('caffeine_entries')
      .select('date')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error getting caffeine history dates:', error);
      return [];
    }
    
    // Extract unique dates by normalizing and using Set
    const uniqueDates = [...new Set(data.map(entry => normalizeDate(entry.date)))];
    return uniqueDates.slice(0, limit);
  } catch (error) {
    console.error('Error getting caffeine history dates:', error);
    return [];
  }
};

// Get caffeine history for charting (last X days) from Supabase
export const getCaffeineHistory = async (days: number = 7): Promise<{ date: string; total: number }[]> => {
  try {
    const dates = await getCaffeineHistoryDates(days);
    console.log("Retrieved dates for history:", dates);
    
    const result = await Promise.all(dates.map(async (date) => ({
      date,
      total: await getDailyCaffeineTotal(date)
    })));
    
    console.log("Compiled caffeine history:", result);
    return result.reverse(); // Reverse to have oldest first for charting
  } catch (error) {
    console.error('Error getting caffeine history:', error);
    return [];
  }
};

// Get daily max caffeine day in history from Supabase
export const getMaxCaffeineDay = async (): Promise<{ date: string; total: number } | null> => {
  try {
    const history = await getCaffeineHistory(30);
    
    if (history.length === 0) {
      return null;
    }
    
    return history.reduce((max, current) => 
      current.total > max.total ? current : max, 
      history[0]
    );
  } catch (error) {
    console.error('Error getting max caffeine day:', error);
    return null;
  }
};
