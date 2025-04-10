
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Coffee } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Coffee className="h-12 w-12 text-coffee mb-4" />
      </motion.div>
      <h1 className={`text-3xl font-caffeinated ${theme === 'dark' ? 'text-[#FAFAFA]' : 'text-coffee-dark'} mb-2`}>Caffinity</h1>
      <div className="animate-pulse text-coffee">Loading...</div>
    </div>
  );
};

export default Index;
