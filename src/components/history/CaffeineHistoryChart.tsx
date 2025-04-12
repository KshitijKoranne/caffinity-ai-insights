
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  getCaffeineHistory, 
  getRecommendedCaffeineLimit,
  getMaxCaffeineDay
} from "@/utils/caffeineData";
import { formatDateForChart } from "@/utils/dateUtils";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { CalendarDays, Coffee, MoveUp } from "lucide-react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";

export const CaffeineHistoryChart = () => {
  const [days, setDays] = useState(7);
  const history = getCaffeineHistory(days);
  const recommendedLimit = getRecommendedCaffeineLimit();
  const maxDay = getMaxCaffeineDay();
  
  // Format data for the chart
  const chartData = history.map(item => ({
    date: item.date,
    caffeine: item.total,
    display: formatDateForChart(item.date)
  }));
  
  const handleChangeDays = (newDays: number) => {
    setDays(newDays);
  };
  
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Caffeine History</h3>
            <p className="text-muted-foreground text-sm">
              Your caffeine intake over time
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={days === 7 ? "default" : "outline"}
              size="sm"
              onClick={() => handleChangeDays(7)}
            >
              7 Days
            </Button>
            <Button
              variant={days === 14 ? "default" : "outline"}
              size="sm"
              onClick={() => handleChangeDays(14)}
            >
              14 Days
            </Button>
            <Button
              variant={days === 30 ? "default" : "outline"}
              size="sm"
              onClick={() => handleChangeDays(30)}
            >
              30 Days
            </Button>
          </div>
        </div>
        
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <CalendarDays className="h-10 w-10 mb-2 opacity-20" />
            <p>No history data available</p>
            <p className="text-sm">Start tracking your caffeine intake</p>
          </div>
        ) : (
          <div className="h-64">
            <ChartContainer
              config={{
                caffeine: {
                  label: "Caffeine",
                  color: "hsl(25, 70%, 45%)"
                },
                limit: {
                  label: "Recommended Limit",
                  color: "rgba(220, 38, 38, 0.5)"
                }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="display" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis 
                    unit=" mg" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    width={50}
                  />
                  <ReferenceLine 
                    y={recommendedLimit} 
                    stroke="rgba(220, 38, 38, 0.5)" 
                    strokeDasharray="3 3" 
                    label={{ 
                      value: "Limit", 
                      position: "insideTopRight",
                      fill: "rgba(220, 38, 38, 0.8)",
                      fontSize: 12
                    }} 
                  />
                  <Bar 
                    dataKey="caffeine" 
                    fill="hsl(25, 70%, 45%)" 
                    radius={[4, 4, 0, 0]}
                  />
                  <ChartTooltip 
                    cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                    content={<ChartTooltipContent />}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </Card>
      
      {maxDay && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 border-coffee/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-coffee/10 flex items-center justify-center">
                <MoveUp className="h-5 w-5 text-coffee" />
              </div>
              <div>
                <h3 className="font-medium">Highest Caffeine Day</h3>
                <p className="text-sm text-muted-foreground">
                  {format(parseISO(maxDay.date), "MMMM d, yyyy")} - {maxDay.total} mg
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
