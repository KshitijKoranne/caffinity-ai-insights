
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthPage from "../components/auth/AuthPage";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Check if user is already logged in
    if (user && !loading) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) return null;

  return <AuthPage />;
};

export default Index;
