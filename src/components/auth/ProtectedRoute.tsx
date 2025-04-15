
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Add a small delay to ensure authentication state is properly loaded
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [user, loading]);
  
  // Show loading state until we're sure about authentication
  if (loading || !isReady) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-coffee animate-spin mb-4" />
        <p className="text-coffee">Loading...</p>
      </div>
    );
  }
  
  // If not authenticated, redirect to landing page
  if (!user) {
    console.log("ProtectedRoute: No user found, redirecting to landing page");
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }
  
  // User is authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;
