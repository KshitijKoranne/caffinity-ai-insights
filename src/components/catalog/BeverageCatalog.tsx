import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BEVERAGE_CATALOG, 
  CaffeineBeverage, 
  formatServingSizeWithUnit, 
  getUserPreferences 
} from "@/utils/caffeineData";
import { Coffee, Search, Beer, CupSoda, GlassWater } from "lucide-react";

const BeverageCatalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const { unitPreference } = getUserPreferences();
  
  // Get unique categories
  const categories = ["all", ...new Set(BEVERAGE_CATALOG.map(b => b.category))];
  
  // Filter beverages based on search and category
  const filteredBeverages = BEVERAGE_CATALOG.filter(beverage => {
    const matchesSearch = beverage.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || beverage.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "coffee":
        return <Coffee className="h-4 w-4" />;
      case "tea":
        return <CupSoda className="h-4 w-4" />;
      case "energy":
        return <GlassWater className="h-4 w-4" />;
      case "soda":
        return <Beer className="h-4 w-4" />;
      default:
        return <Coffee className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-4 space-y-6 pb-20">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-coffee-dark">Beverage Catalog</h1>
          <p className="text-muted-foreground">
            Browse caffeine content in common drinks
          </p>
        </div>
        <div className="h-10 w-10 rounded-full bg-coffee flex items-center justify-center">
          <Coffee className="h-5 w-5 text-white" />
        </div>
      </header>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search beverages..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Tabs */}
      <Tabs 
        defaultValue="all" 
        value={activeCategory} 
        onValueChange={setActiveCategory}
      >
        <TabsList className="w-full h-auto flex overflow-x-auto py-1 gap-1">
          {categories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="capitalize flex items-center gap-1"
            >
              {category !== "all" && getCategoryIcon(category)}
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Beverage List */}
      <div className="space-y-3">
        {filteredBeverages.length === 0 ? (
          <div className="text-center py-8 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">No beverages found.</p>
            <p className="text-sm mt-1">Try a different search term or category.</p>
          </div>
        ) : (
          filteredBeverages.map((beverage) => (
            <BeverageCard key={beverage.id} beverage={beverage} unitPreference={unitPreference} />
          ))
        )}
      </div>
    </div>
  );
};

const BeverageCard = ({ 
  beverage, 
  unitPreference 
}: { 
  beverage: CaffeineBeverage;
  unitPreference: "oz" | "ml" | "cup";
}) => {
  // Get icon based on category
  const getCategoryIcon = () => {
    switch (beverage.category) {
      case "coffee":
        return <Coffee className="h-5 w-5 text-coffee" />;
      case "tea":
        return <CupSoda className="h-5 w-5 text-coffee" />;
      case "energy":
        return <GlassWater className="h-5 w-5 text-coffee" />;
      case "soda":
        return <Beer className="h-5 w-5 text-coffee" />;
      default:
        return <Coffee className="h-5 w-5 text-coffee" />;
    }
  };
  
  return (
    <Card className="overflow-hidden border-coffee/10">
      <CardContent className="p-3">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-coffee/10 flex items-center justify-center mr-3">
            {getCategoryIcon()}
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{beverage.name}</h3>
            <p className="text-xs text-muted-foreground capitalize">{beverage.category}</p>
          </div>
          <div className="text-right">
            <p className="font-medium">{beverage.caffeine} mg</p>
            <p className="text-xs text-muted-foreground">
              {beverage.servingSizeOz 
                ? formatServingSizeWithUnit(beverage, unitPreference)
                : beverage.servingSize}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BeverageCatalog;
