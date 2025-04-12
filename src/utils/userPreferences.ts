
import { UnitPreference } from './types';
import { supabase } from '@/integrations/supabase/client';

// Get user preferences from Supabase
export const getUserPreferences = async (): Promise<{unitPreference: UnitPreference}> => {
  try {
    // Get the current user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No user logged in, returning default preferences');
      return { unitPreference: "oz" as UnitPreference };
    }
    
    const { data, error } = await supabase
      .from('user_preferences')
      .select('unit_preference')
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      console.error('Error getting user preferences:', error);
      // Return default preferences if none found
      return { unitPreference: "oz" as UnitPreference };
    }
    
    return { unitPreference: data.unit_preference as UnitPreference };
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return { unitPreference: "oz" as UnitPreference };
  }
};

// Save user preferences to Supabase
export const saveUserPreferences = async (prefs: {unitPreference: UnitPreference}): Promise<void> => {
  try {
    // Get the current user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No user logged in');
      return;
    }
    
    // First try to update existing preferences
    const { data, error: selectError } = await supabase
      .from('user_preferences')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    if (selectError && selectError.code !== 'PGRST116') {
      // If error is not "no rows returned", log it
      console.error('Error checking user preferences:', selectError);
    }
    
    if (data) {
      // Update existing preferences
      const { error } = await supabase
        .from('user_preferences')
        .update({ 
          unit_preference: prefs.unitPreference, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', data.id);
        
      if (error) {
        console.error('Error updating user preferences:', error);
      } else {
        console.log('User preferences updated successfully:', prefs);
      }
    } else {
      // Insert new preferences
      const { error } = await supabase
        .from('user_preferences')
        .insert({ 
          unit_preference: prefs.unitPreference,
          user_id: user.id
        });
        
      if (error) {
        console.error('Error saving user preferences:', error);
      } else {
        console.log('User preferences saved successfully:', prefs);
      }
    }
  } catch (error) {
    console.error('Error saving user preferences:', error);
  }
};
