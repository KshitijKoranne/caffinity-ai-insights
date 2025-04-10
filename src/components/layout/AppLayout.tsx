
import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Coffee, Book, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
};

const AppLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  // Check authentication
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [navigate, user, loading]);

  // Don't render anything while checking auth
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Coffee className="h-10 w-10 text-coffee" />
      </motion.div>
    </div>
  );
  
  // Don't render if not authenticated
  if (!user) return null;

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-6 w-6" />,
      active: location.pathname === "/dashboard",
    },
    {
      label: "Add",
      href: "/add",
      icon: <Plus className="h-6 w-6" />,
      active: location.pathname === "/add",
    },
    {
      label: "Catalog",
      href: "/catalog",
      icon: <Book className="h-6 w-6" />,
      active: location.pathname === "/catalog",
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <User className="h-6 w-6" />,
      active: location.pathname === "/profile",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header with theme switcher */}
      <header className="sticky top-0 border-b border-border bg-background/80 backdrop-blur-sm z-10 py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Coffee className="h-6 w-6 text-coffee mr-2" />
            <span className={`font-caffeinated ${theme === 'dark' ? 'text-[#FAFAFA]' : 'text-coffee-dark'}`}>Caffinity</span>
          </div>
          <ThemeSwitcher />
        </div>
      </header>
      
      {/* Main content */}
      <AnimatePresence mode="wait">
        <motion.main 
          key={location.pathname}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="flex-1 pb-16"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* Mobile navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border h-16 flex items-center justify-around px-4 z-10">
        {navItems.map((item) => (
          <button
            key={item.href}
            onClick={() => navigate(item.href)}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 w-16 h-full relative",
              item.active
                ? `${theme === 'dark' ? 'text-[#FAFAFA]' : 'text-coffee-dark'} font-medium`
                : "text-muted-foreground hover:text-coffee-dark"
            )}
          >
            {item.active && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-coffee/10 rounded-md"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
            <div className="relative z-10 p-1.5">
              {item.icon}
            </div>
            <span className="text-xs relative z-10">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AppLayout;
