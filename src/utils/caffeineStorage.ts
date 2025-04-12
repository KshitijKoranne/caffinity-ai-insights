
import { CaffeineEntry } from './types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Get user's caffeine entries from Supabase
export const getCaffeineEntries = async (): Promise<CaffeineEntry[]> {
  try {
    const { data: entries, error } = await supabase
      .from('caffeine_entries')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error getting caffeine entries:', error);
      return [];
    }
    
    // Transform from Supabase format to application format
    return entries.map(entry => ({
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
    console.error('Error getting caffeine entries:', error);
    return [];
  }
};

// Save caffeine entry to Supabase
export const saveCaffeineEntry = async (entry: CaffeineEntry): Promise<void> => {
  try {
    const { error } = await supabase
      .from('caffeine_entries')
      .insert({
        id: entry.id,
        beverage_id: entry.beverageId,
        beverage_name: entry.beverageName,
        caffeine_amount: entry.caffeineAmount,
        serving_size: entry.servingSize,
        date: entry.date,
        notes: entry.notes || null
      });
    
    if (error) {
      console.error('Error saving caffeine entry:', error);
    } else {
      console.log("Caffeine entry saved successfully:", entry);
    }
  } catch (error) {
    console.error('Error saving caffeine entry:', error);
  }
};

// Delete caffeine entry from Supabase
export const deleteCaffeineEntry = async (entryId: string): Promise<void> => {
  try {
    console.log(`Deleting caffeine entry with ID: ${entryId}`);
    
    const { error } = await supabase
      .from('caffeine_entries')
      .delete()
      .eq('id', entryId);
    
    if (error) {
      console.error('Error deleting caffeine entry:', error);
    } else {
      console.log("Entry deleted successfully");
    }
  } catch (error) {
    console.error('Error deleting caffeine entry:', error);
  }
};
