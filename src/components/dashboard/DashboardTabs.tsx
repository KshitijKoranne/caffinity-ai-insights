
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { Coffee, LineChart } from "lucide-react";
import { CaffeineHistoryChart } from "../history/CaffeineHistoryChart";
import { motion, AnimatePresence } from "framer-motion";
import CaffeineProgressCard from "./CaffeineProgressCard";
import CaffeineInsights from "../insights/CaffeineInsights";
import EntriesList from "./EntriesList";
import { TrendingUp } from "lucide-react";
import { CaffeineEntry } from "@/utils/caffeineData";
import { isToday } from "date-fns";
import { parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface DashboardTabsProps {
  activeTab: "today" | "history";
  setActiveTab: (tab: "today" | "history") => void;
  caffeineTotal: number;
  recommendedLimit: number;
  percentage: number;
  entries: CaffeineEntry[];
  currentDate: string;
  handleDeleteEntry: (entryId: string) => void;
  isLoading: boolean;
}

const DashboardTabs = ({ 
  activeTab,
  setActiveTab,
  caffeineTotal,
  recommendedLimit,
  percentage,
  entries,
  currentDate,
  handleDeleteEntry,
  isLoading
}: DashboardTabsProps) => {
  const [safeEntries, setSafeEntries] = useState<CaffeineEntry[]>([]);
  const isCurrentDateToday = isToday(parseISO(currentDate));
  
  // Use an effect to safely update entries
  useEffect(() => {
    // Ensure entries is always an array before setting state
    if (Array.isArray(entries)) {
      setSafeEntries(entries);
    } else {
      console.warn("Received non-array entries:", entries);
      setSafeEntries([]);
    }
  }, [entries]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <motion.div 
          className="animate-pulse"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >Loading...</motion.div>
      </div>
    );
  }

  // Safety check for invalid data during rendering
  if (!Array.isArray(safeEntries)) {
    console.error("safeEntries is not an array in render");
    return (
      <div className="p-4 text-center text-red-500">
        Error displaying data. Please refresh the page.
      </div>
    );
  }

  return (
    <TabsPrimitive.Root value={activeTab} onValueChange={(value) => setActiveTab(value as "today" | "history")}>
      <TabsPrimitive.List className="grid w-full grid-cols-2 inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
        <TabsPrimitive.Trigger 
          value="today" 
          className={cn(
            "flex items-center gap-2 inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            activeTab === "today" ? "bg-background text-foreground shadow-sm" : ""
          )}
        >
          <Coffee className="h-4 w-4" />
          Daily Log
        </TabsPrimitive.Trigger>
        <TabsPrimitive.Trigger 
          value="history" 
          className={cn(
            "flex items-center gap-2 inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            activeTab === "history" ? "bg-background text-foreground shadow-sm" : ""
          )}
        >
          <LineChart className="h-4 w-4" />
          History
        </TabsPrimitive.Trigger>
      </TabsPrimitive.List>
      
      <TabsPrimitive.Content value="today" className="space-y-6 mt-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <CaffeineProgressCard 
            caffeineTotal={caffeineTotal}
            recommendedLimit={recommendedLimit}
            percentage={percentage}
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <CaffeineInsights />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {isCurrentDateToday ? "Today's Drinks" : "Drinks on this day"}
          </h2>
          
          <EntriesList 
            entries={safeEntries}
            onEntryDelete={handleDeleteEntry}
            allowDelete={isCurrentDateToday}
          />
        </motion.div>
      </TabsPrimitive.Content>
      
      <TabsPrimitive.Content value="history" className="mt-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <CaffeineHistoryChart />
        </motion.div>
      </TabsPrimitive.Content>
    </TabsPrimitive.Root>
  );
};

export default DashboardTabs;
