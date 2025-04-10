
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar as CalendarIcon, Coffee } from "lucide-react";
import { formatDateForDisplay, formatDateYMD } from "@/utils/dateUtils";
import { getCaffeineEntriesForDate, getDailyCaffeineTotal } from "@/utils/caffeineData";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();
  
  // Get entries and total for the selected date
  const formattedDate = selectedDate ? formatDateYMD(selectedDate) : formatDateYMD(new Date());
  const dailyTotal = getDailyCaffeineTotal(formattedDate);
  const entries = getCaffeineEntriesForDate(formattedDate);
  
  // Render the day contents for the calendar
  const renderDayContents = (date: Date) => {
    const dateString = formatDateYMD(date);
    const total = getDailyCaffeineTotal(dateString);
    
    if (total > 0) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${total > 300 ? 'bg-alert-high' : total > 150 ? 'bg-yellow-500' : 'bg-alert-low'}`}></div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="p-4 space-y-6 pb-20">
      <header className="flex items-center gap-2 mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/dashboard")}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-coffee-dark">Calendar View</h1>
      </header>
      
      <Card className="border-coffee/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            <span>Caffeine History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border p-3 pointer-events-auto"
            components={{
              DayContent: ({ date }) => renderDayContents(date),
            }}
          />
        </CardContent>
      </Card>
      
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-coffee/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {formatDateForDisplay(selectedDate)}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {dailyTotal > 0 
                  ? `Total caffeine: ${dailyTotal} mg` 
                  : 'No caffeine tracked on this day'}
              </p>
            </CardHeader>
            <CardContent>
              {entries.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No entries for this day
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
                          <p className="text-xs text-muted-foreground">
                            {entry.servingSize} - {entry.caffeineAmount} mg
                          </p>
                          {entry.notes && (
                            <p className="text-xs mt-1 bg-muted/30 p-2 rounded">
                              {entry.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default CalendarView;
