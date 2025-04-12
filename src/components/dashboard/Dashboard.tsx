import { useEffect, useState } from "react";
import { CaffeineEntry, getDailyCaffeineTotal, getCaffeineEntriesForDate, getRecommendedCaffeineLimit, deleteCaffeineEntry } from "@/utils/caffeineData";
import { getCurrentDateYMD } from "@/utils/dateUtils";
import { Coffee } from "lucide-react";
import { motion } from "framer-motion";
import DateNavigation from "./DateNavigation";
import DashboardTabs from "./DashboardTabs";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const [caffeineTotal, setCaffeineTotal] = useState(0);
  const [recommendedLimit, setRecommendedLimit] = useState(400);
  const [entries, setEntries] = useState<CaffeineEntry[]>([]);
  const [currentDate, setCurrentDate] = useState(getCurrentDateYMD());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"today" | "history">("today");
  const { user } = useAuth();

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  
  // Get user's name from auth context
  const userName = user?.user_metadata?.name || "User";

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

  const handleDateChange = (date: string) => {
    setCurrentDate(date);
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

  return (
    <div className="p-4 space-y-6 pb-20">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{getGreeting()}, {userName}</h1>
          <p className="text-muted-foreground">
            {currentDate === getCurrentDateYMD() ? "Today" : ""}
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
      <DateNavigation 
        currentDate={currentDate}
        onDateChange={handleDateChange}
      />

      {/* Dashboard Content */}
      <DashboardTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        caffeineTotal={caffeineTotal}
        recommendedLimit={recommendedLimit}
        percentage={percentage}
        entries={entries}
        currentDate={currentDate}
        handleDeleteEntry={handleDeleteEntry}
        isLoading={loading}
      />
    </div>
  );
};

export default Dashboard;
