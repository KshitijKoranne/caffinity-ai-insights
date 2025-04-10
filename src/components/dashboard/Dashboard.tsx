
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CaffeineEntry, getDailyCaffeineTotal, getCaffeineEntriesForDate, getRecommendedCaffeineLimit } from "@/utils/caffeineData";
import { formatDateForDisplay, formatTimeForDisplay, getCurrentDateYMD } from "@/utils/dateUtils";
import { Coffee, TrendingUp, AlertTriangle, FileText } from "lucide-react";
import CaffeineInsights from "../insights/CaffeineInsights";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Entry Item Component to display individual caffeine entries
const EntryItem = ({ entry, toggleNote, showNote }: { 
  entry: CaffeineEntry, 
  toggleNote: (id: string) => void,
  showNote: boolean
}) => (
  <motion.div
    variants={{
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 }
    }}
  >
    <Card className="overflow-hidden border-coffee/10">
      <div className="flex items-center p-3">
        <div className="h-10 w-10 rounded-full bg-coffee/10 flex items-center justify-center mr-3">
          <Coffee className="h-5 w-5 text-coffee" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{entry.beverageName}</h3>
          <p className="text-xs text-muted-foreground">{entry.servingSize}</p>
          {showNote && entry.notes && (
            <p className="text-xs mt-2 bg-muted/30 p-2 rounded">
              {entry.notes}
            </p>
          )}
        </div>
        <div className="text-right flex flex-col items-end">
          <p className="font-medium">{entry.caffeineAmount} mg</p>
          <p className="text-xs text-muted-foreground">
            {formatTimeForDisplay(entry.date)}
          </p>
          {entry.notes && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 mt-1" 
                  onClick={() => toggleNote(entry.id)}
                >
                  <FileText className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View notes</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </Card>
  </motion.div>
);

// Progress Status Component
const CaffeineProgress = ({ caffeineTotal, recommendedLimit }: { 
  caffeineTotal: number, 
  recommendedLimit: number 
}) => {
  const percentage = Math.min(Math.round((caffeineTotal / recommendedLimit) * 100), 100);
  
  const getStatusColor = () => {
    if (percentage < 50) return "bg-green-500";
    if (percentage < 85) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-coffee/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Daily Caffeine Intake</span>
            <span className={`text-xl font-bold ${percentage > 85 ? "text-red-500" : ""}`}>
              {caffeineTotal} mg
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress 
              value={percentage} 
              className="h-2" 
              indicatorClassName={getStatusColor()} 
            />
            <div className="flex justify-end text-xs text-muted-foreground">
              <span>Maximum: {recommendedLimit} mg</span>
            </div>
            
            {percentage > 85 && (
              <motion.div 
                className="flex items-center gap-2 text-xs text-red-500 mt-2 bg-red-500/10 p-2 rounded"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <AlertTriangle className="h-4 w-4" />
                <span>You're approaching your daily maximum limit</span>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Dashboard = () => {
  const [caffeineTotal, setCaffeineTotal] = useState(0);
  const [recommendedLimit, setRecommendedLimit] = useState(400);
  const [entries, setEntries] = useState<CaffeineEntry[]>([]);
  const [currentDate, setCurrentDate] = useState(getCurrentDateYMD());
  const [loading, setLoading] = useState(true);
  const [showNoteForEntry, setShowNoteForEntry] = useState<string | null>(null);

  // Function to load the latest data
  const loadLatestData = useCallback(() => {
    console.log("Dashboard - Loading latest caffeine data for date:", currentDate);
    try {
      // Get today's entries (we adjust the date format for consistent comparison)
      const todayDateOnly = new Date(currentDate).toISOString().split('T')[0];
      console.log("Using normalized date for filtering:", todayDateOnly);
      
      // Get entries for today
      const todayEntries = getCaffeineEntriesForDate(todayDateOnly);
      console.log("Today's entries loaded:", todayEntries);
      
      // Calculate the total from the entries
      let calculatedTotal = 0;
      todayEntries.forEach(entry => {
        calculatedTotal += entry.caffeineAmount;
      });
      
      console.log("Calculated caffeine total:", calculatedTotal, "mg");
      
      // Sort entries by date (newest first)
      const sortedEntries = [...todayEntries].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      setCaffeineTotal(calculatedTotal);
      setEntries(sortedEntries);
      setRecommendedLimit(getRecommendedCaffeineLimit());
      setLoading(false);
    } catch (error) {
      console.error("Error loading caffeine data:", error);
      setLoading(false);
    }
  }, [currentDate]);

  // Initial data load
  useEffect(() => {
    console.log("Dashboard component mounted, loading initial data");
    loadLatestData();
  }, [loadLatestData]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      console.log("Storage event detected:", e);
      if (e.key === "caffinity-entries") {
        console.log("Caffeine entries updated in another tab, reloading data");
        loadLatestData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadLatestData]);

  // Listen for caffeine-updated custom event (within the same window)
  useEffect(() => {
    const handleCaffeineUpdated = () => {
      console.log("Caffeine updated event received in Dashboard, reloading data");
      // Force reload from localStorage
      loadLatestData();
    };

    window.addEventListener('caffeine-updated', handleCaffeineUpdated);
    return () => {
      window.removeEventListener('caffeine-updated', handleCaffeineUpdated);
    };
  }, [loadLatestData]);

  const toggleNote = (entryId: string) => {
    if (showNoteForEntry === entryId) {
      setShowNoteForEntry(null);
    } else {
      setShowNoteForEntry(entryId);
    }
  };

  // Added this to debug in the UI
  const forceRefresh = () => {
    console.log("Force refreshing data...");
    loadLatestData();
  };

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
          className="h-10 w-10 rounded-full bg-coffee flex items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={forceRefresh}
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
            {/* Caffeine Progress Bar */}
            <CaffeineProgress 
              caffeineTotal={caffeineTotal} 
              recommendedLimit={recommendedLimit}
            />

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
                Today's Drinks ({entries.length})
              </h2>
              
              {entries.length === 0 ? (
                <motion.div 
                  className="text-center py-8 bg-muted/30 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <p className="text-muted-foreground">No caffeine logged today.</p>
                  <p className="text-sm mt-1">Track your first drink!</p>
                </motion.div>
              ) : (
                <motion.div 
                  className="space-y-3"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { 
                      opacity: 1,
                      transition: { staggerChildren: 0.07 } 
                    }
                  }}
                >
                  {entries.map(entry => (
                    <EntryItem 
                      key={entry.id}
                      entry={entry}
                      toggleNote={toggleNote}
                      showNote={showNoteForEntry === entry.id}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Dashboard;
