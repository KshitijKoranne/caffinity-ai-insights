
import { useEffect, useState } from "react";
import { CaffeineEntry, getDailyCaffeineTotal, getCaffeineEntriesForDate, getRecommendedCaffeineLimit } from "@/utils/caffeineData";
import { formatDateForDisplay, getCurrentDateYMD } from "@/utils/dateUtils";
import { Coffee, TrendingUp } from "lucide-react";
import CaffeineInsights from "../insights/CaffeineInsights";
import { motion, AnimatePresence } from "framer-motion";
import CaffeineProgressCard from "./CaffeineProgressCard";
import EntriesList from "./EntriesList";

const Dashboard = () => {
  const [caffeineTotal, setCaffeineTotal] = useState(0);
  const [recommendedLimit, setRecommendedLimit] = useState(400);
  const [entries, setEntries] = useState<CaffeineEntry[]>([]);
  const [currentDate, setCurrentDate] = useState(getCurrentDateYMD());
  const [loading, setLoading] = useState(true);

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

  // Calculate percentage of recommended limit
  const percentage = Math.min(Math.round((caffeineTotal / recommendedLimit) * 100), 100);
  console.log("Calculated caffeine total:", caffeineTotal, "mg");

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
                Today's Drinks
              </h2>
              
              <EntriesList entries={entries} />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Dashboard;
