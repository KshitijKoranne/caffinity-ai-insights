
import { CaffeineEntry } from './types';
import { supabase } from '@/integrations/supabase/client';

// Get user's caffeine entries from Supabase
export const getCaffeineEntries = async (): Promise<CaffeineEntry[]> => {
  try {
    console.log("Attempting to get caffeine entries from Supabase");
    
    // Get the current user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No user logged in');
      return [];
    }
    
    const { data: entries, error } = await supabase
      .from('caffeine_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error getting caffeine entries:', error);
      return [];
    }
    
    if (!Array.isArray(entries)) {
      console.error('Expected array of entries but got:', entries);
      return [];
    }
    
    console.log('Retrieved caffeine entries from Supabase:', entries.length);
    
    // Transform from Supabase format to application format
    return entries.map(entry => ({
      id: entry.id || '',
      beverageId: entry.beverage_id || '',
      beverageName: entry.beverage_name || '',
      caffeineAmount: entry.caffeine_amount || 0,
      servingSize: entry.serving_size || '',
      date: entry.date || new Date().toISOString(),
      notes: entry.notes || undefined,
      userId: entry.user_id
    }));
  } catch (error) {
    console.error('Error getting caffeine entries:', error);
    throw error; // Throw error so it can be handled by the caller
  }
};

// Save caffeine entry to Supabase
export const saveCaffeineEntry = async (entry: CaffeineEntry): Promise<boolean> => {
  try {
    // Get the current user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No user logged in');
      throw new Error('User not authenticated');
    }

    console.log(`Saving new caffeine entry for user ${user.id}`);
    
    // Remove the id field to let Supabase generate a UUID
    // We'll create an object without the custom string ID
    const { id, ...entryWithoutId } = entry;
    
    const { error, data } = await supabase
      .from('caffeine_entries')
      .insert({
        beverage_id: entryWithoutId.beverageId,
        beverage_name: entryWithoutId.beverageName,
        caffeine_amount: entryWithoutId.caffeineAmount,
        serving_size: entryWithoutId.servingSize,
        date: entryWithoutId.date,
        notes: entryWithoutId.notes || null,
        user_id: user.id
      })
      .select();
    
    if (error) {
      console.error('Error saving caffeine entry:', error);
      throw new Error('Failed to save caffeine entry');
    } else {
      console.log("Caffeine entry saved successfully:", data);
      return true;
    }
  } catch (error) {
    console.error('Error saving caffeine entry:', error);
    throw error;
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
      throw new Error('Failed to delete caffeine entry');
    } else {
      console.log("Entry deleted successfully");
    }
  } catch (error) {
    console.error('Error deleting caffeine entry:', error);
    throw error;
  }
};
