
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { Coffee, Home } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-coffee-light/10 to-cream/30">
      <motion.div 
        className="w-full max-w-md space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center space-y-2 relative">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/")}
            className="absolute left-0 top-0 h-8 w-8 rounded-full bg-card/50 backdrop-blur-sm border border-border"
            aria-label="Go to home"
          >
            <Home className="h-4 w-4" />
          </Button>
          
          <motion.div 
            className="flex items-center justify-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Coffee className="h-12 w-12 text-coffee" />
          </motion.div>
          <motion.h1 
            className={`text-3xl font-caffeinated ${theme === 'dark' ? 'text-[#FAFAFA]' : 'text-coffee-dark'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Caffinity
          </motion.h1>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Track your caffeine. Get personalized insights.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border-coffee/20 shadow-lg">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex border-b">
                  <button
                    className={`pb-2 px-4 text-sm font-medium flex-1 ${
                      activeTab === "login"
                        ? "border-b-2 border-coffee text-foreground"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => setActiveTab("login")}
                  >
                    Login
                  </button>
                  <button
                    className={`pb-2 px-4 text-sm font-medium flex-1 ${
                      activeTab === "signup"
                        ? "border-b-2 border-coffee text-foreground"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => setActiveTab("signup")}
                  >
                    Sign Up
                  </button>
                </div>
                
                <div className="pt-2">
                  {activeTab === "login" ? <LoginForm /> : <SignupForm />}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.p 
          className="text-xs text-center text-muted-foreground mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          Your caffeine journey starts here.
          <br />
          All your data is stored securely.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Auth;
