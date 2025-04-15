
import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Coffee, Package, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type NavItemProps = {
  icon: ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  onClick: () => void;
};

const NavItem = ({ icon, label, isActive, onClick }: NavItemProps) => (
  <Button
    variant={isActive ? "secondary" : "ghost"}
    className={`flex items-center gap-2 w-full justify-center ${
      isActive ? "bg-coffee/10 hover:bg-coffee/20" : ""
    }`}
    onClick={onClick}
  >
    {icon}
    <span className="text-xs sm:text-sm">{label}</span>
  </Button>
);

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  // Make sure these hooks are used directly in the component function
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main content */}
      <main className="flex-grow pb-16 overflow-x-hidden">{children}</main>

      {/* Floating Add Button */}
      <motion.div 
        className="fixed bottom-20 right-4 z-20"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="lg"
          onClick={() => navigateTo("/add")}
          className="bg-coffee hover:bg-coffee-dark text-white rounded-full h-14 w-14 flex items-center justify-center shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2 z-10 safe-area-bottom">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 sm:px-6">
          <NavItem
            icon={<Coffee className="h-5 w-5" />}
            label="Today"
            path="/dashboard"
            isActive={currentPath === "/dashboard"}
            onClick={() => navigateTo("/dashboard")}
          />
          
          <NavItem
            icon={<Package className="h-5 w-5" />}
            label="Catalog"
            path="/catalog"
            isActive={currentPath === "/catalog"}
            onClick={() => navigateTo("/catalog")}
          />

          <NavItem
            icon={<User className="h-5 w-5" />}
            label="Profile"
            path="/profile"
            isActive={currentPath === "/profile"}
            onClick={() => navigateTo("/profile")}
          />
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
