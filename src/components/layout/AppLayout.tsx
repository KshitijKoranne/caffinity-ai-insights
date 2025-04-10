import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Coffee, CalendarDays, Package, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

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
    className={`flex items-center gap-3 w-full justify-start ${
      isActive ? "bg-coffee/10 hover:bg-coffee/20" : ""
    }`}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </Button>
);

const AppLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main content */}
      <main className="flex-grow pb-16">{children}</main>

      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <NavItem
            icon={<Coffee className="h-5 w-5" />}
            label="Today"
            path="/dashboard"
            isActive={currentPath === "/dashboard"}
            onClick={() => navigateTo("/dashboard")}
          />
          
          <NavItem
            icon={<CalendarDays className="h-5 w-5" />}
            label="Calendar"
            path="/calendar"
            isActive={currentPath === "/calendar"}
            onClick={() => navigateTo("/calendar")}
          />

          <div className="relative -mt-8">
            <Button
              size="lg"
              onClick={() => navigateTo("/add")}
              className="bg-coffee hover:bg-coffee-dark text-white rounded-full h-14 w-14 flex items-center justify-center shadow-lg"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>

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
        
        {/* Theme switcher */}
        <div className="absolute top-3 right-3">
          <ThemeSwitcher />
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
