
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CaffeineEntry, getDailyCaffeineTotal, getCaffeineEntriesForDate, getRecommendedCaffeineLimit } from "@/utils/caffeineData";
import { formatDateForDisplay, formatTimeForDisplay, getCurrentDateYMD } from "@/utils/dateUtils";
import { Coffee, TrendingUp, AlertTriangle } from "lucide-react";

const Dashboard = () => {
  const [caffeineTotal, setCaffeineTotal] = useState(0);
  const [recommendedLimit, setRecommendedLimit] = useState(400);
  const [entries, setEntries] = useState<CaffeineEntry[]>([]);
  const [currentDate, setCurrentDate] = useState(getCurrentDateYMD());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load caffeine data
    const total = getDailyCaffeineTotal(currentDate);
    const limit = getRecommendedCaffeineLimit();
    const todayEntries = getCaffeineEntriesForDate(currentDate);
    
    setCaffeineTotal(total);
    setRecommendedLimit(limit);
    setEntries(todayEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setLoading(false);
  }, [currentDate]);

  // Calculate percentage of recommended limit
  const percentage = Math.min(Math.round((caffeineTotal / recommendedLimit) * 100), 100);
  
  // Determine status color based on caffeine intake
  const getStatusColor = () => {
    if (percentage < 50) return "bg-alert-low";
    if (percentage < 85) return "bg-yellow-500";
    return "bg-alert-high";
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
        <div className="h-10 w-10 rounded-full bg-coffee flex items-center justify-center">
          <Coffee className="h-5 w-5 text-white" />
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      ) : (
        <>
          <Card className="border-coffee/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Daily Caffeine Intake</span>
                <span className={`text-xl font-bold ${percentage > 85 ? "text-alert-high" : ""}`}>
                  {caffeineTotal} mg
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className={getStatusColor()}>
                  <Progress value={percentage} className="h-2" />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 mg</span>
                  <span>Recommended: {recommendedLimit} mg</span>
                </div>
                
                {percentage > 85 && (
                  <div className="flex items-center gap-2 text-xs text-alert-high mt-2 bg-alert-high/10 p-2 rounded">
                    <AlertTriangle className="h-4 w-4" />
                    <span>You're approaching your daily recommended limit</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Today's Drinks
            </h2>
            
            {entries.length === 0 ? (
              <div className="text-center py-8 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">No caffeine logged today.</p>
                <p className="text-sm mt-1">Track your first drink!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map(entry => (
                  <Card key={entry.id} className="overflow-hidden border-coffee/10">
                    <div className="flex items-center p-3">
                      <div className="h-10 w-10 rounded-full bg-coffee/10 flex items-center justify-center mr-3">
                        <Coffee className="h-5 w-5 text-coffee" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{entry.beverageName}</h3>
                        <p className="text-xs text-muted-foreground">{entry.servingSize}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{entry.caffeineAmount} mg</p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimeForDisplay(entry.date)}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
