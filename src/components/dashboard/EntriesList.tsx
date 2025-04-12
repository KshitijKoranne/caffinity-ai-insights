
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, FileText, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { CaffeineEntry } from "@/utils/caffeineData";
import { formatTimeForDisplay, isToday } from "@/utils/dateUtils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

interface EntriesListProps {
  entries: CaffeineEntry[];
  onEntryDelete?: (entryId: string) => void;
  allowDelete?: boolean;
}

const EntriesList = ({ entries, onEntryDelete, allowDelete = false }: EntriesListProps) => {
  const [showNoteForEntry, setShowNoteForEntry] = useState<string | null>(null);

  const toggleNote = (entryId: string) => {
    if (showNoteForEntry === entryId) {
      setShowNoteForEntry(null);
    } else {
      setShowNoteForEntry(entryId);
    }
  };

  const handleDelete = (entryId: string) => {
    if (onEntryDelete) {
      onEntryDelete(entryId);
    }
  };

  return (
    <>
      {entries.length === 0 ? (
        <motion.div 
          className="text-center py-8 bg-muted/30 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-muted-foreground">No caffeine entries found.</p>
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
                    <div className="flex items-center mt-1">
                      {entry.notes && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6" 
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
                      
                      {allowDelete && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-destructive hover:text-destructive" 
                              onClick={() => handleDelete(entry.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete entry</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  );
};

export default EntriesList;
