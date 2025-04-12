
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { format, subDays, addDays, parseISO, isToday } from "date-fns";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { formatDateForDisplay, getCurrentDateYMD } from "@/utils/dateUtils";

interface DateNavigationProps {
  currentDate: string;
  onDateChange: (date: string) => void;
}

const DateNavigation = ({ currentDate, onDateChange }: DateNavigationProps) => {
  // Determine if current displayed date is today
  const isCurrentDateToday = isToday(parseISO(currentDate));

  const handlePreviousDay = () => {
    const prevDate = format(subDays(parseISO(currentDate), 1), "yyyy-MM-dd");
    onDateChange(prevDate);
  };

  const handleNextDay = () => {
    const nextDate = format(addDays(parseISO(currentDate), 1), "yyyy-MM-dd");
    const today = getCurrentDateYMD();
    
    // Don't allow going past today
    if (nextDate <= today) {
      onDateChange(nextDate);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const selectedDate = format(date, "yyyy-MM-dd");
    const today = getCurrentDateYMD();
    
    // Don't allow selecting future dates
    if (selectedDate <= today) {
      onDateChange(selectedDate);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" size="icon" onClick={handlePreviousDay}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex gap-2 items-center">
            <CalendarIcon className="h-4 w-4" />
            <span>{format(parseISO(currentDate), "MMM dd, yyyy")}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={parseISO(currentDate)}
            onSelect={handleDateSelect}
            disabled={(date) => {
              // Disable future dates
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date > today;
            }}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleNextDay}
        disabled={isCurrentDateToday}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DateNavigation;
