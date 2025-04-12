
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { getRecommendedCaffeineLimit } from "@/utils/caffeineData";

interface CaffeineProgressCardProps {
  caffeineTotal: number;
  recommendedLimit: number;
  percentage: number;
}

const CaffeineProgressCard = ({ caffeineTotal, recommendedLimit, percentage }: CaffeineProgressCardProps) => {
  // Determine status color based on caffeine intake
  const getStatusColor = () => {
    if (percentage < 50) return "bg-green-500";
    if (percentage < 85) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="border-coffee/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Daily Caffeine Intake</span>
          <span className={`text-xl font-bold ${caffeineTotal > recommendedLimit ? "text-red-500" : ""}`}>
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
          
          {caffeineTotal > recommendedLimit ? (
            <motion.div 
              className="flex items-center gap-2 text-xs text-red-500 mt-2 bg-red-50 p-2 rounded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <AlertTriangle className="h-4 w-4" />
              <span>You've exceeded your daily recommended caffeine limit</span>
            </motion.div>
          ) : percentage > 85 ? (
            <motion.div 
              className="flex items-center gap-2 text-xs text-amber-500 mt-2 bg-amber-50 p-2 rounded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <AlertTriangle className="h-4 w-4" />
              <span>You're approaching your daily recommended limit</span>
            </motion.div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default CaffeineProgressCard;
