
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full bg-card/50 backdrop-blur-sm border border-border"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={{ scale: 0.5, rotate: 0 }}
        animate={{ scale: 1, rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        className="h-full w-full flex items-center justify-center"
      >
        {theme === 'dark' ? (
          <Moon className="h-[1.2rem] w-[1.2rem] text-amber-200" />
        ) : (
          <Sun className="h-[1.2rem] w-[1.2rem] text-coffee" />
        )}
      </motion.div>
    </Button>
  );
}
