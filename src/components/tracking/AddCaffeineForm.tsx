
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveCaffeineEntry, BEVERAGE_CATALOG } from "@/utils/caffeineData";
import { getCurrentDateYMD } from "@/utils/dateUtils";
import { Coffee, ArrowLeft } from "lucide-react";

const AddCaffeineForm = () => {
  const [selectedBeverage, setSelectedBeverage] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBeverage) return;

    setIsSubmitting(true);
    console.log("Form submitted with beverage:", selectedBeverage);
    
    // Find the selected beverage from catalog
    const beverage = BEVERAGE_CATALOG.find(b => b.id === selectedBeverage);
    if (!beverage) {
      console.error("Selected beverage not found in catalog");
      toast({
        title: "Error",
        description: "Selected beverage not found. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    // Create new caffeine entry
    const entry = {
      id: `entry-${Date.now()}`,
      beverageId: beverage.id,
      beverageName: beverage.name,
      caffeineAmount: beverage.caffeine,
      servingSize: beverage.servingSize,
      date: new Date().toISOString(),
      notes: notes.trim() || undefined,
    };
    
    try {
      // Save the entry
      console.log("Saving caffeine entry:", entry);
      saveCaffeineEntry(entry);
      
      // Show success message
      let description = `Added ${beverage.caffeine}mg from ${beverage.name}`;
      if (notes.trim()) {
        description += ` with note: "${notes.trim()}"`;
      }
      
      toast({
        title: "Caffeine logged",
        description: description,
      });
      
      // Navigate back to dashboard after a slight delay
      setTimeout(() => {
        setIsSubmitting(false);
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      console.error("Error saving caffeine entry:", error);
      toast({
        title: "Error",
        description: "Failed to save caffeine entry. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
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
        <h1 className="text-2xl font-bold text-coffee-dark">Add Caffeine</h1>
      </header>

      <Card className="border-coffee/20">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="beverage">Select Beverage</Label>
              <Select
                value={selectedBeverage}
                onValueChange={setSelectedBeverage}
                required
              >
                <SelectTrigger id="beverage" className="w-full">
                  <SelectValue placeholder="Choose a beverage" />
                </SelectTrigger>
                <SelectContent>
                  {BEVERAGE_CATALOG.map((beverage) => (
                    <SelectItem key={beverage.id} value={beverage.id}>
                      <div className="flex items-center">
                        <span>{beverage.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({beverage.caffeine}mg)
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedBeverage && (
              <div className="bg-coffee/5 p-3 rounded-md">
                <div className="flex justify-between">
                  <span className="text-sm">Serving size:</span>
                  <span className="text-sm font-medium">
                    {BEVERAGE_CATALOG.find(b => b.id === selectedBeverage)?.servingSize}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm">Caffeine:</span>
                  <span className="text-sm font-medium">
                    {BEVERAGE_CATALOG.find(b => b.id === selectedBeverage)?.caffeine} mg
                  </span>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this drink..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-coffee hover:bg-coffee-dark"
              disabled={!selectedBeverage || isSubmitting}
            >
              <Coffee className="mr-2 h-4 w-4" />
              {isSubmitting ? "Logging caffeine..." : "Log Caffeine"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCaffeineForm;
