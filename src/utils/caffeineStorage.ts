
import { CaffeineEntry } from './types';

// Get user's caffeine entries from local storage
export const getCaffeineEntries = (): CaffeineEntry[] => {
  const userId = localStorage.getItem("caffinity-current-user") || "anonymous";
  const entries = localStorage.getItem(`caffinity-entries-${userId}`);
  console.log(`Raw entries from localStorage for user ${userId}:`, entries);
  return entries ? JSON.parse(entries) : [];
};

// Save caffeine entry
export const saveCaffeineEntry = (entry: CaffeineEntry): void => {
  const userId = localStorage.getItem("caffinity-current-user") || "anonymous";
  const entries = getCaffeineEntries();
  const entryWithUser = { ...entry, userId };
  console.log(`Saving caffeine entry for user ${userId}:`, entryWithUser);
  entries.push(entryWithUser);
  localStorage.setItem(`caffinity-entries-${userId}`, JSON.stringify(entries));
  console.log("Caffeine entry saved successfully:", entryWithUser);
  console.log("Total entries now:", entries.length);
};

// Delete caffeine entry
export const deleteCaffeineEntry = (entryId: string): void => {
  const userId = localStorage.getItem("caffinity-current-user") || "anonymous";
  const entries = getCaffeineEntries();
  console.log(`Deleting caffeine entry with ID: ${entryId} for user ${userId}`);
  const updatedEntries = entries.filter(entry => entry.id !== entryId);
  localStorage.setItem(`caffinity-entries-${userId}`, JSON.stringify(updatedEntries));
  console.log("Entry deleted successfully");
  console.log("Total entries now:", updatedEntries.length);
};
