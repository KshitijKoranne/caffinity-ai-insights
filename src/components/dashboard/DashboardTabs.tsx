
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const isCurrentDateToday = isToday(parseISO(currentDate));
  
  // Ensure entries is always an array
  const safeEntries = Array.isArray(entries) ? entries : [];

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

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "today" | "history")}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="today" className="flex items-center gap-2">
          <Coffee className="h-4 w-4" />
          Daily Log
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-2">
          <LineChart className="h-4 w-4" />
          History
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="today" className="space-y-6 mt-4">
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
      </TabsContent>
      
      <TabsContent value="history" className="mt-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <CaffeineHistoryChart />
        </motion.div>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
