
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Coffee, Clock, TrendingUp, Brain, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

const Landing = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const features = [
    {
      icon: <Coffee className="h-6 w-6" />,
      title: "Track Intake",
      description: "Log your daily caffeine consumption with ease"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "View Trends",
      description: "Visualize your consumption patterns over time"
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI Insights",
      description: "Get personalized recommendations based on your habits"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Sleep Impact",
      description: "Understand how caffeine affects your sleep cycle"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header with theme switcher */}
      <header className="absolute top-0 right-0 p-4 z-10">
        <ThemeSwitcher />
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="bg-gradient-to-b from-coffee-light/30 to-background pt-20 pb-40 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="text-center space-y-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
              }}
            >
              <motion.div variants={fadeIn} className="flex justify-center">
                <div className="bg-coffee rounded-full p-4 shadow-lg">
                  <Coffee className="h-10 w-10 text-white" />
                </div>
              </motion.div>
              
              <motion.h1 
                variants={fadeIn}
                className="text-4xl md:text-5xl lg:text-6xl font-caffeinated text-coffee-dark font-bold"
              >
                Caffinity
              </motion.h1>
              
              <motion.p 
                variants={fadeIn}
                className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
              >
                Track your caffeine. Get personalized AI insights. Optimize your day.
              </motion.p>
              
              <motion.div variants={fadeIn} className="pt-6 flex justify-center gap-4 flex-wrap">
                <Button 
                  size="lg"
                  className="bg-coffee hover:bg-coffee-dark text-white z-10"
                  onClick={() => navigate("/auth")}
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="z-10"
                  onClick={() => navigate("/auth")}
                >
                  Sign In
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Wave separator - fixed to be below the buttons */}
        <div className="absolute bottom-0 left-0 right-0 z-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path
              fill={theme === 'dark' ? '#1a1a1a' : '#ffffff'}
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,218.7C672,203,768,149,864,138.7C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-coffee-dark mb-4 font-caffeinated">Why Caffinity?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your personal caffeine assistant that helps you maintain the perfect balance between energy and wellness.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-card rounded-xl p-6 shadow-sm border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="h-12 w-12 rounded-full bg-coffee/10 flex items-center justify-center text-coffee mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-coffee-light/20 py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-coffee-dark mb-4 font-caffeinated">Ready to optimize your caffeine?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of users who have improved their energy levels and sleep quality with Caffinity.
            </p>
            <Button 
              size="lg"
              className="bg-coffee hover:bg-coffee-dark text-white"
              onClick={() => navigate("/auth")}
            >
              Start Tracking Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Coffee className="h-6 w-6 text-coffee mr-2" />
            <span className="font-bold text-coffee-dark font-caffeinated">Caffinity</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Caffinity. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
