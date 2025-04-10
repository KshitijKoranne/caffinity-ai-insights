
import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Coffee, Package, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

type NavItemProps = {
  icon: ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  onClick: () => void;
};

const NavItem = ({ icon, label, isActive, onClick }: NavItemProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={`flex items-center gap-2 ${isMobile ? "w-10 h-10 p-0" : "w-full"} justify-center ${
        isActive ? "bg-coffee/10 hover:bg-coffee/20" : ""
      }`}
      onClick={onClick}
    >
      {icon}
      {!isMobile && <span>{label}</span>}
    </Button>
  );
};

const AppLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = useIsMobile();

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main content */}
      <main className="flex-grow pb-16">{children}</main>

      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2 z-10">
        <div className="max-w-lg mx-auto flex justify-between items-center px-2">
          <NavItem
            icon={<Coffee className="h-5 w-5" />}
            label="Today"
            path="/dashboard"
            isActive={currentPath === "/dashboard"}
            onClick={() => navigateTo("/dashboard")}
          />
          
          <div className="flex justify-center">
            <Button
              size={isMobile ? "icon" : "default"}
              onClick={() => navigateTo("/add")}
              className="bg-coffee hover:bg-coffee-dark text-white rounded-full h-12 w-12 flex items-center justify-center shadow-lg -mt-6"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex space-x-2">
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
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
