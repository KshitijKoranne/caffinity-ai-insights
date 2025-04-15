
import { useEffect, useState } from "react";
import { CaffeineEntry, getDailyCaffeineTotal, getCaffeineEntriesForDate, getRecommendedCaffeineLimit } from "@/utils/caffeineData";
import { getCurrentDateYMD } from "@/utils/dateUtils";
import { Coffee } from "lucide-react";
import { motion } from "framer-motion";
import DateNavigation from "./DateNavigation";
import DashboardTabs from "./DashboardTabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [caffeineTotal, setCaffeineTotal] = useState(0);
  const [recommendedLimit, setRecommendedLimit] = useState(400);
  const [entries, setEntries] = useState<CaffeineEntry[]>([]);
  const [currentDate, setCurrentDate] = useState(getCurrentDateYMD());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"today" | "history">("today");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  
  // Get user's name from auth context or default to "there"
  const userName = user?.user_metadata?.name || "there";

  const loadCaffeineData = async () => {
    if (!user) {
      return; // Don't load data if user isn't authenticated
    }
    
    try {
      console.log("Dashboard - Loading latest caffeine data for date:", currentDate);
      setLoading(true);
      setError(null);
      
      // Load caffeine data
      const total = await getDailyCaffeineTotal(currentDate);
      const limit = getRecommendedCaffeineLimit();
      const todayEntries = await getCaffeineEntriesForDate(currentDate);
      
      console.log("Caffeine total:", total, "mg");
      console.log("Entries found:", todayEntries.length);
      
      setCaffeineTotal(total);
      setRecommendedLimit(limit);
      
      // Make sure we have valid entries before setting state
      if (Array.isArray(todayEntries)) {
        setEntries(todayEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        console.log("Today's entries loaded:", todayEntries);
      } else {
        console.error("Invalid entries returned:", todayEntries);
        setEntries([]);
      }
    } catch (error) {
      console.error("Error loading caffeine data:", error);
      setError("Failed to load data. Please try refreshing the page.");
      toast({
        title: "Error loading data",
        description: "Failed to load caffeine data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Ensure we have a user before loading data
    if (user) {
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
    }
  }, [currentDate, user]);

  // Handle case where user is not authenticated
  useEffect(() => {
    if (!user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleDateChange = (date: string) => {
    setCurrentDate(date);
  };

  // Handle entry deletion
  const handleDeleteEntry = async (entryId: string) => {
    try {
      // Import the deleteCaffeineEntry function only when needed
      const { deleteCaffeineEntry } = await import("@/utils/caffeineStorage");
      await deleteCaffeineEntry(entryId);
      
      toast({
        title: "Entry deleted",
        description: "Your caffeine entry was successfully deleted.",
      });
      
      // Reload data
      await loadCaffeineData();
      
      // Dispatch event to update other components
      window.dispatchEvent(new Event("caffeineDataUpdated"));
    } catch (error) {
      console.error("Error deleting entry:", error);
      setError("Failed to delete entry. Please try again.");
      toast({
        title: "Delete failed",
        description: "Failed to delete entry. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Calculate percentage of recommended limit
  const percentage = Math.min(Math.round((caffeineTotal / recommendedLimit) * 100), 100);
  console.log("Calculated caffeine total:", caffeineTotal, "mg");

  // If there's an error, show error message
  if (error) {
    return (
      <div className="p-4 space-y-6">
        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-800">
          <h3 className="font-medium">Something went wrong</h3>
          <p className="text-sm">{error}</p>
          <button 
            className="mt-2 px-4 py-2 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
            onClick={() => loadCaffeineData()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
