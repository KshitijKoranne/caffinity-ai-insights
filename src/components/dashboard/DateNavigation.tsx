
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { format, subDays, addDays, parseISO, isToday } from "date-fns";
import { formatDateForDisplay, getCurrentDateYMD } from "@/utils/dateUtils";
import { Calendar } from "@/components/ui/calendar";
import * as PopoverPrimitive from "@radix-ui/react-popover";

interface DateNavigationProps {
  currentDate: string;
  onDateChange: (date: string) => void;
}

const DateNavigation = ({ currentDate, onDateChange }: DateNavigationProps) => {
  // Determine if current displayed date is today
  const isCurrentDateToday = isToday(parseISO(currentDate));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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
      setIsCalendarOpen(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" size="icon" onClick={handlePreviousDay}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <PopoverPrimitive.Root open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverPrimitive.Trigger asChild>
          <Button variant="outline" className="flex gap-2 items-center">
            <CalendarIcon className="h-4 w-4" />
            <span>{format(parseISO(currentDate), "MMM dd, yyyy")}</span>
          </Button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content 
            className="z-50 w-auto rounded-md border bg-popover p-0 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            align="center"
            sideOffset={4}
          >
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
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
      
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
