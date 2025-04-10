
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [user, loading, navigate]);

  // Return a loading indicator while checking auth state
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="animate-pulse text-coffee">Loading...</div>
    </div>
  );
};

export default Index;
