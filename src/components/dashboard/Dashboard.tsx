
import { useEffect, useState } from "react";
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

const Dashboard = () => {
  const [caffeineTotal, setCaffeineTotal] = useState(0);
  const [recommendedLimit, setRecommendedLimit] = useState(400);
  const [entries, setEntries] = useState<CaffeineEntry[]>([]);
  const [currentDate, setCurrentDate] = useState(getCurrentDateYMD());
  const [loading, setLoading] = useState(true);
  const [showNoteForEntry, setShowNoteForEntry] = useState<string | null>(null);

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
  
  // Determine status color based on caffeine intake
  const getStatusColor = () => {
    if (percentage < 50) return "bg-green-500";
    if (percentage < 85) return "bg-yellow-500";
    return "bg-red-500";
  };

  const toggleNote = (entryId: string) => {
    if (showNoteForEntry === entryId) {
      setShowNoteForEntry(null);
    } else {
      setShowNoteForEntry(entryId);
    }
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
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-2 ${getStatusColor()}`} 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0 mg</span>
                      <span>Maximum: {recommendedLimit} mg/day</span>
                    </div>
                    
                    {percentage > 85 && (
                      <motion.div 
                        className="flex items-center gap-2 text-xs text-red-500 mt-2 bg-red-50 p-2 rounded"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                      >
                        <AlertTriangle className="h-4 w-4" />
                        <span>You're approaching your daily recommended limit</span>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
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
                    <motion.div
                      key={entry.id}
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
                            {showNoteForEntry === entry.id && entry.notes && (
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
