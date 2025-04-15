
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Show loading spinner during authentication check
  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-coffee animate-spin mb-4" />
        <p className="text-coffee">Loading...</p>
      </div>
    );
  }
  
  // Redirect to landing page if not authenticated
  if (!user) {
    // Save the attempted URL for redirection after login if needed
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }
  
  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
