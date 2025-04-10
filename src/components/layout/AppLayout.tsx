
import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Coffee, Book, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

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

  // Check authentication
  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [navigate, user, loading]);

  // Don't render anything while checking auth
  if (loading) return null;
  
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
      {/* Main content */}
      <main className="flex-1 pb-16">{children}</main>

      {/* Mobile navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border h-16 flex items-center justify-around px-4 z-10">
        {navItems.map((item) => (
          <button
            key={item.href}
            onClick={() => navigate(item.href)}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 w-16 h-full",
              item.active
                ? "text-coffee font-medium"
                : "text-muted-foreground hover:text-coffee-dark"
            )}
          >
            <div
              className={cn(
                "p-1.5 rounded-full transition-all duration-200",
                item.active && "bg-coffee/10"
              )}
            >
              {item.icon}
            </div>
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AppLayout;
