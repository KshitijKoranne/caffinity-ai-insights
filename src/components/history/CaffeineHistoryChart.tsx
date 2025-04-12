
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  getCaffeineHistory, 
  getRecommendedCaffeineLimit
} from "@/utils/caffeineData";
import { formatDateForChart } from "@/utils/dateUtils";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
  Dot,
} from "recharts";
import { CalendarDays } from "lucide-react";

export const CaffeineHistoryChart = () => {
  const [days, setDays] = useState(7);
  const history = getCaffeineHistory(days);
  const recommendedLimit = getRecommendedCaffeineLimit();
  
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
              <LineChart 
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="display" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={true}
                  height={30}
                />
                <YAxis 
                  unit=" mg" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={true}
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
                <Line 
                  type="monotone"
                  dataKey="caffeine" 
                  stroke="hsl(25, 70%, 45%)"
                  strokeWidth={2}
                  dot={(props) => (
                    <Dot
                      {...props}
                      r={4}
                      fill="hsl(25, 70%, 45%)"
                      stroke="white"
                      strokeWidth={1}
                    />
                  )}
                  activeDot={{ r: 6, fill: "hsl(25, 70%, 45%)", stroke: "white", strokeWidth: 2 }}
                />
                <ChartTooltip 
                  cursor={{ stroke: 'rgba(0, 0, 0, 0.15)', strokeDasharray: '5 5' }}
                  content={<ChartTooltipContent />}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      )}
    </Card>
  );
};
