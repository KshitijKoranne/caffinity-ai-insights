
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

  const loadCaffeineData = async () => {
    try {
      console.log("Dashboard - Loading latest caffeine data for date:", currentDate);
      setLoading(true);
      
      // Load caffeine data
      const total = await getDailyCaffeineTotal(currentDate);
      const limit = getRecommendedCaffeineLimit();
      const todayEntries = await getCaffeineEntriesForDate(currentDate);
      
      console.log("Caffeine total:", total, "mg");
      console.log("Entries found:", todayEntries.length);
      
      setCaffeineTotal(total);
      setRecommendedLimit(limit);
      setEntries(todayEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      console.log("Today's entries loaded:", todayEntries);
    } catch (error) {
      console.error("Error loading caffeine data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      console.log("Dashboard: No user logged in, redirecting or showing login prompt");
      return;
    }
    
    console.log("Dashboard component mounted, loading initial data");
    loadCaffeineData();
    
    // Set up an event listener for storage changes
    const handleDataUpdated = () => {
      console.log("Dashboard received caffeineDataUpdated event, reloading data");
      loadCaffeineData();
    };
    
    window.addEventListener("caffeineDataUpdated", handleDataUpdated);
    
    return () => {
      window.removeEventListener("caffeineDataUpdated", handleDataUpdated);
    };
  }, [currentDate, user]);

  const handleDateChange = (date: string) => {
    setCurrentDate(date);
  };

  // Handle entry deletion
  const handleDeleteEntry = async (entryId: string) => {
    try {
      await deleteCaffeineEntry(entryId);
      await loadCaffeineData();
      
      // Dispatch event to update other components
      window.dispatchEvent(new Event("caffeineDataUpdated"));
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  // Calculate percentage of recommended limit
  const percentage = Math.min(Math.round((caffeineTotal / recommendedLimit) * 100), 100);
  console.log("Calculated caffeine total:", caffeineTotal, "mg");

  return (
    <div className="p-4 space-y-6 pb-20">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-foreground">{getGreeting()}, {userName}</h1>
          <p className="text-muted-foreground text-sm">
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
