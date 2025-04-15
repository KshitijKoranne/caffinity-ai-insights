
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { UnitPreference, getUserPreferences, saveUserPreferences } from "@/utils/caffeineData";
import { useToast } from "@/components/ui/use-toast";

const SettingsCard = () => {
  const [unitPreference, setUnitPreference] = useState<UnitPreference>("oz");
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
  const { toast } = useToast();

  useState(() => {
    const loadPreferences = async () => {
      try {
        setIsLoadingPreferences(true);
        const { unitPreference: savedUnit } = await getUserPreferences();
        setUnitPreference(savedUnit);
      } catch (error) {
        console.error('Error loading user preferences:', error);
      } finally {
        setIsLoadingPreferences(false);
      }
    };
    
    loadPreferences();
  });

  const handleUnitPreferenceChange = async (value: UnitPreference) => {
    try {
      setUnitPreference(value);
      await saveUserPreferences({ unitPreference: value });
      
      toast({
        title: "Preference updated",
        description: `Serving size unit changed to ${value}`,
      });
    } catch (error) {
      console.error('Error saving unit preference:', error);
      toast({
        title: "Error",
        description: "Failed to save unit preference",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-coffee/20">
      <CardHeader>
        <CardTitle className="text-lg">App Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Theme</h3>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Switch between light and dark mode</p>
              <ThemeSwitcher />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Serving Size Units</h3>
            <p className="text-xs text-muted-foreground mb-2">Choose your preferred unit for beverage serving sizes</p>
            
            {isLoadingPreferences ? (
              <div className="text-sm text-muted-foreground">Loading preferences...</div>
            ) : (
              <RadioGroup 
                value={unitPreference} 
                onValueChange={(value) => handleUnitPreferenceChange(value as UnitPreference)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="oz" id="oz" />
                  <Label htmlFor="oz">Ounces (oz)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ml" id="ml" />
                  <Label htmlFor="ml">Milliliters (ml)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cup" id="cup" />
                  <Label htmlFor="cup">Cups</Label>
                </div>
              </RadioGroup>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsCard;
