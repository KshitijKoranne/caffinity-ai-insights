
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AIInsights {
  insights: string;
  recommendations: string[];
  concerns: string[];
}

const CaffeineInsights = () => {
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchInsights = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('caffeine-analysis', {
        body: { user_id: user.id },
      });
      
      if (error) throw error;
      
      setInsights(data);
      toast({
        title: "Insights updated",
        description: "Your personalized caffeine insights have been refreshed.",
      });
    } catch (error: any) {
      console.error('Error fetching insights:', error);
      toast({
        title: "Error",
        description: "Failed to load insights. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchInsights();
  }, [user]);

  return (
    <Card className="border-coffee/20 overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between bg-coffee/5">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-coffee" />
          <CardTitle className="text-lg">AI Caffeine Insights</CardTitle>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={fetchInsights}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          {loading ? "Analyzing..." : "Refresh"}
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="h-8 w-8 text-coffee/60" />
            </motion.div>
            <p className="text-sm text-muted-foreground">Analyzing your caffeine data...</p>
          </div>
        ) : insights ? (
          <AnimatePresence mode="wait">
            <motion.div 
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <div>
                <h3 className="font-medium text-coffee-dark mb-2">Analysis</h3>
                <p className="text-sm">{insights.insights}</p>
              </div>
              
              {insights.recommendations && insights.recommendations.length > 0 && (
                <div>
                  <h3 className="font-medium text-coffee-dark mb-2">Recommendations</h3>
                  <ul className="space-y-2">
                    {insights.recommendations.map((rec, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-alert-low mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
              
              {insights.concerns && insights.concerns.length > 0 && (
                <div>
                  <h3 className="font-medium text-coffee-dark mb-2">Potential Concerns</h3>
                  <ul className="space-y-2">
                    {insights.concerns.map((concern, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2 text-sm"
                      >
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>{concern}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No insights available. Start tracking your caffeine to get personalized recommendations.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CaffeineInsights;
