
import { useEffect, useState } from "react";
import { CaffeineEntry, getDailyCaffeineTotal, getCaffeineEntriesForDate, getRecommendedCaffeineLimit, deleteCaffeineEntry } from "@/utils/caffeineData";
import { formatDateForDisplay, getCurrentDateYMD, formatDateYMD } from "@/utils/dateUtils";
import { Coffee, TrendingUp, Calendar as CalendarIcon, ChevronLeft, ChevronRight, LineChart } from "lucide-react";
import CaffeineInsights from "../insights/CaffeineInsights";
import { motion, AnimatePresence } from "framer-motion";
import CaffeineProgressCard from "./CaffeineProgressCard";
import EntriesList from "./EntriesList";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, subDays, addDays, parseISO, isToday } from "date-fns";
import { CaffeineHistoryChart } from "../history/CaffeineHistoryChart";

const Dashboard = () => {
  const [caffeineTotal, setCaffeineTotal] = useState(0);
  const [recommendedLimit, setRecommendedLimit] = useState(400);
  const [entries, setEntries] = useState<CaffeineEntry[]>([]);
  const [currentDate, setCurrentDate] = useState(getCurrentDateYMD());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"today" | "history">("today");

  const loadCaffeineData = () => {
    console.log("Dashboard - Loading latest caffeine data for date:", currentDate);
    // Load caffeine data
    const total = getDailyCaffeineTotal(currentDate);
    const limit = getRecommendedCaffeineLimit();
    const todayEntries = getCaffeineEntriesForDate(currentDate);
    
    console.log("Caffeine total:", total, "mg");
    console.log("Entries found:", todayEntries.length);
    
    setCaffeineTotal(total);
    setRecommendedLimit(limit);
    setEntries(todayEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    console.log("Today's entries loaded:", todayEntries);
    setLoading(false);
  };

  useEffect(() => {
    console.log("Dashboard component mounted, loading initial data");
    loadCaffeineData();
    
    // Set up an event listener for storage changes
    const handleStorageChange = () => {
      loadCaffeineData();
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    // If we're using the same window, we need a custom event
    window.addEventListener("caffeineDataUpdated", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("caffeineDataUpdated", handleStorageChange);
    };
  }, [currentDate]);

  const handlePreviousDay = () => {
    const prevDate = formatDateYMD(subDays(parseISO(currentDate), 1));
    setCurrentDate(prevDate);
  };

  const handleNextDay = () => {
    const nextDate = formatDateYMD(addDays(parseISO(currentDate), 1));
    const today = getCurrentDateYMD();
    
    // Don't allow going past today
    if (nextDate <= today) {
      setCurrentDate(nextDate);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const selectedDate = formatDateYMD(date);
    const today = getCurrentDateYMD();
    
    // Don't allow selecting future dates
    if (selectedDate <= today) {
      setCurrentDate(selectedDate);
    }
  };

  // Handle entry deletion
  const handleDeleteEntry = (entryId: string) => {
    deleteCaffeineEntry(entryId);
    loadCaffeineData();
    
    // Dispatch event to update other components
    window.dispatchEvent(new Event("caffeineDataUpdated"));
  };

  // Calculate percentage of recommended limit
  const percentage = Math.min(Math.round((caffeineTotal / recommendedLimit) * 100), 100);
  console.log("Calculated caffeine total:", caffeineTotal, "mg");
  
  // Determine if current displayed date is today
  const isCurrentDateToday = isToday(parseISO(currentDate));

  return (
    <div className="p-4 space-y-6 pb-20">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-coffee-dark">Dashboard</h1>
          <p className="text-muted-foreground">
            {formatDateForDisplay(new Date(currentDate))}
          </p>
        </div>
        <motion.div 
          className="h-10 w-10 rounded-full bg-coffee flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Coffee className="h-5 w-5 text-white" />
        </motion.div>
      </header>

      {/* Date Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={handlePreviousDay}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex gap-2 items-center">
              <CalendarIcon className="h-4 w-4" />
              <span>{format(parseISO(currentDate), "MMM dd, yyyy")}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={parseISO(currentDate)}
              onSelect={handleDateSelect}
              disabled={(date) => {
                // Disable future dates
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date > today;
              }}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleNextDay}
          disabled={isCurrentDateToday}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <motion.div 
            className="animate-pulse"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >Loading...</motion.div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key="dashboard-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
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
                    entries={entries} 
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
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Dashboard;
