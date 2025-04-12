
import { UnitPreference } from './types';

// User preferences
export const getUserPreferences = (): {unitPreference: UnitPreference} => {
  const userId = localStorage.getItem("caffinity-current-user") || "anonymous";
  const prefsString = localStorage.getItem(`caffinity-preferences-${userId}`);
  const defaultPrefs = { unitPreference: "oz" as UnitPreference };
  return prefsString ? JSON.parse(prefsString) : defaultPrefs;
};

export const saveUserPreferences = (prefs: {unitPreference: UnitPreference}): void => {
  const userId = localStorage.getItem("caffinity-current-user") || "anonymous";
  localStorage.setItem(`caffinity-preferences-${userId}`, JSON.stringify(prefs));
  console.log(`User preferences saved for user ${userId}:`, prefs);
};
